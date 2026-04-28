import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { supabaseAdmin } from "./supabase";
import {
  contactFormSchema, loginSchema, insertProjectSchema,
} from "../shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import { Resend } from "resend";

// ─── Multer (memory storage for Supabase upload) ─────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only jpg, png, and webp images are allowed"));
    }
  },
});

// ─── Auth middleware (Supabase JWT) ───────────────────
async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  (req as any).supabaseUser = user;
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ─── Auth ───────────────────────────────────────────

  app.post("/api/auth/login", async (req, res) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid credentials" });

      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });

      if (error) return res.status(401).json({ message: error.message });

      res.json({
        id: data.user.id,
        name: data.user.user_metadata?.name || data.user.email?.split("@")[0] || "Admin",
        email: data.user.email,
        role: data.user.user_metadata?.role || "admin",
        token: data.session.access_token,
      });
    } catch (err) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    const user = (req as any).supabaseUser;
    res.json({
      id: user.id,
      name: user.user_metadata?.name || user.email?.split("@")[0] || "Admin",
      email: user.email,
      role: user.user_metadata?.role || "admin",
    });
  });

  // ─── Public routes ─────────────────────────────────

  app.get("/api/projects", async (_req, res) => {
    const projects = await storage.getProjects(true);
    res.json(projects);
  });

  app.get("/api/projects/featured", async (_req, res) => {
    const projects = await storage.getProjects(true);
    res.json(projects.slice(0, 6));
  });

  app.get("/api/projects/:slug", async (req, res) => {
    const project = await storage.getProjectBySlug(req.params.slug);
    if (!project || !project.published) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  });

  app.get("/api/settings", async (_req, res) => {
    const settings = await storage.getSiteSettings();
    res.json(settings);
  });

  app.post("/api/leads", async (req, res) => {
    try {
      const parsed = contactFormSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid form data", errors: parsed.error.flatten() });

      const lead = await storage.createLead(parsed.data as any);

      // Send email via Resend if configured
      if (process.env.RESEND_API_KEY) {
        try {
          const resend = new Resend(process.env.RESEND_API_KEY);
          const settings = await storage.getSiteSettings();
          const toEmail = process.env.RESEND_TO_EMAIL || (settings.contactInfo as any)?.email || "contact@example.com";
          
          await resend.emails.send({
            from: "Acme <onboarding@resend.dev>", // default testing email from Resend
            to: toEmail,
            subject: `New Lead Request: ${lead.name}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${lead.name}</p>
              <p><strong>Email:</strong> ${lead.email}</p>
              <p><strong>Phone:</strong> ${lead.phone || "N/A"}</p>
              <p><strong>Message:</strong><br/>${(lead.message || "").replace(/\\n/g, '<br/>')}</p>
            `,
          });
        } catch (emailErr) {
          console.error("Resend Email Error:", emailErr);
          // Do not fail the lead creation if email sending fails
        }
      }

      res.status(201).json({ ok: true, id: lead.id });
    } catch (err) {
      res.status(500).json({ message: "Failed to submit form" });
    }
  });

  // ─── Admin routes ────────────────────────

  app.get("/api/admin/projects", requireAuth, async (_req, res) => {
    const projects = await storage.getProjects(false);
    res.json(projects);
  });

  app.post("/api/admin/projects", requireAuth, async (req, res) => {
    try {
      const parsed = insertProjectSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid project data", errors: parsed.error.flatten() });
      const project = await storage.createProject(parsed.data);
      res.status(201).json(project);
    } catch (err: any) {
      res.status(400).json({ message: err.message || "Failed to create project" });
    }
  });

  app.patch("/api/admin/projects/reorder", requireAuth, async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids)) return res.status(400).json({ message: "Expected array of ids" });
      await storage.reorderProjects(ids);
      res.json({ ok: true });
    } catch (err: any) {
      res.status(400).json({ message: err.message || "Failed to reorder projects" });
    }
  });

  app.patch("/api/admin/projects/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id as string);
    const partialSchema = insertProjectSchema.partial();
    const parsed = partialSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });
    const project = await storage.updateProject(id, parsed.data);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  });

  app.delete("/api/admin/projects/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id as string);
    await storage.deleteProject(id);
    res.json({ ok: true });
  });

  app.post("/api/admin/projects/:id/cover", requireAuth, upload.single("image"), async (req, res) => {
    const id = parseInt(req.params.id as string);
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const ext = path.extname(req.file.originalname).toLowerCase();
    const filename = `covers/${crypto.randomBytes(16).toString("hex")}${ext}`;

    const { error } = await supabaseAdmin.storage
      .from("uploads")
      .upload(filename, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (error) return res.status(500).json({ message: "Upload failed: " + error.message });

    const { data: urlData } = supabaseAdmin.storage.from("uploads").getPublicUrl(filename);

    await storage.updateProject(id, { coverImageUrl: urlData.publicUrl });
    res.json({ url: urlData.publicUrl });
  });

  app.get("/api/admin/settings", requireAuth, async (_req, res) => {
    const settings = await storage.getSiteSettings();
    res.json(settings);
  });

  app.patch("/api/admin/settings", requireAuth, async (req, res) => {
    const settings = await storage.updateSiteSettings(req.body);
    res.json(settings);
  });

  app.get("/api/admin/leads", requireAuth, async (_req, res) => {
    const allLeads = await storage.getLeads();
    res.json(allLeads);
  });

  app.patch("/api/admin/leads/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id as string);
    const statusSchema = z.object({ status: z.enum(["new", "contacted", "qualified", "proposal", "won", "lost", "archived"]) });
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid status" });
    const lead = await storage.updateLeadStatus(id, parsed.data.status);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  });

  app.get("/api/admin/square-settings", requireAuth, async (_req, res) => {
    const settings = await storage.getSquareSettings();
    res.json(settings);
  });

  app.patch("/api/admin/square-settings", requireAuth, async (req, res) => {
    const settings = await storage.updateSquareSettings(req.body);
    res.json(settings);
  });

  return httpServer;
}
