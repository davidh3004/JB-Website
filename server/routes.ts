import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  contactFormSchema, loginSchema, insertProjectSchema,
  createLeadCrmSchema, updateLeadCrmSchema, logCallSchema, createUserSchema,
} from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import session from "express-session";
import ConnectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const multerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = crypto.randomBytes(16).toString("hex");
    cb(null, `${name}${ext}`);
  },
});

const upload = multer({
  storage: multerStorage,
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

declare module "express-session" {
  interface SessionData {
    userId?: number;
    userRole?: string;
  }
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!roles.includes(req.session.userRole || "")) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  return requireRole("admin")(req, res, next);
}

function requireCallerOrAdmin(req: Request, res: Response, next: NextFunction) {
  return requireRole("admin", "caller")(req, res, next);
}

async function logAudit(actorUserId: number, action: string, entityType: string, entityId: string, before?: any, after?: any) {
  try {
    await storage.createAuditEvent({
      actorUserId,
      action,
      entityType,
      entityId,
      beforeJson: before || null,
      afterJson: after || null,
    });
  } catch (e) {
    console.error("Audit log error:", e);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const PgSession = ConnectPgSimple(session);

  app.use(
    session({
      store: new PgSession({ pool, createTableIfMissing: true }),
      secret: process.env.SESSION_SECRET || "jb-websites-secret-key-change-me",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      },
    })
  );

  app.use("/uploads", (req, res, next) => {
    const filePath = path.join(uploadDir, path.basename(req.path));
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: "File not found" });
    }
  });

  // ─── Auth ───────────────────────────────────────────

  app.post("/api/auth/login", async (req, res) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid credentials" });

      const user = await storage.getUserByEmail(parsed.data.email);
      if (!user) return res.status(401).json({ message: "Invalid email or password" });
      if (!user.active) return res.status(403).json({ message: "Account disabled" });

      const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
      if (!valid) return res.status(401).json({ message: "Invalid email or password" });

      req.session.userId = user.id;
      req.session.userRole = user.role;
      res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (err) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ ok: true });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const user = await storage.getUser(userId);
    if (!user) return res.status(401).json({ message: "User not found" });

    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
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
      res.status(201).json({ ok: true, id: lead.id });
    } catch (err) {
      res.status(500).json({ message: "Failed to submit form" });
    }
  });

  // ─── Admin routes (existing) ────────────────────────

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

    const url = `/uploads/${req.file.filename}`;
    await storage.updateProject(id, { coverImageUrl: url });
    res.json({ url });
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

  // ─── CRM API routes ────────────────────────────────

  app.get("/api/crm/leads", requireCallerOrAdmin, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const role = req.session.userRole;
      const allLeads = role === "admin"
        ? await storage.getLeads()
        : await storage.getLeadsByOwner(userId);
      res.json(allLeads);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  app.get("/api/crm/leads/:id", requireCallerOrAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const lead = await storage.getLeadById(id);
      if (!lead) return res.status(404).json({ message: "Lead not found" });

      const userId = req.session.userId!;
      const role = req.session.userRole;
      if (role !== "admin" && lead.ownerUserId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const callsList = await storage.getCallsForLead(id);
      res.json({ ...lead, calls: callsList });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch lead" });
    }
  });

  app.post("/api/crm/leads", requireCallerOrAdmin, async (req, res) => {
    try {
      const parsed = createLeadCrmSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });

      const userId = req.session.userId!;
      const role = req.session.userRole;

      const leadData: any = {
        ...parsed.data,
        message: parsed.data.message || "",
        ownerUserId: role === "admin" ? (req.body.ownerUserId || userId) : userId,
      };

      if (parsed.data.nextFollowUpAt) {
        leadData.nextFollowUpAt = new Date(parsed.data.nextFollowUpAt);
      }

      const lead = await storage.createLead(leadData);
      await logAudit(userId, "create", "lead", String(lead.id), null, lead);
      res.status(201).json(lead);
    } catch (err) {
      res.status(500).json({ message: "Failed to create lead" });
    }
  });

  app.patch("/api/crm/leads/:id", requireCallerOrAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const existing = await storage.getLeadById(id);
      if (!existing) return res.status(404).json({ message: "Lead not found" });

      const userId = req.session.userId!;
      const role = req.session.userRole;
      if (role !== "admin" && existing.ownerUserId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const parsed = updateLeadCrmSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });

      if (role !== "admin") {
        delete (parsed.data as any).ownerUserId;
      }

      const updateData: any = { ...parsed.data };
      if (parsed.data.nextFollowUpAt) {
        updateData.nextFollowUpAt = new Date(parsed.data.nextFollowUpAt);
      }

      const updated = await storage.updateLead(id, updateData);
      await logAudit(userId, "update", "lead", String(id), existing, updated);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Failed to update lead" });
    }
  });

  app.post("/api/crm/calls", requireCallerOrAdmin, async (req, res) => {
    try {
      const parsed = logCallSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });

      const userId = req.session.userId!;
      const role = req.session.userRole;

      const lead = await storage.getLeadById(parsed.data.leadId);
      if (!lead) return res.status(404).json({ message: "Lead not found" });
      if (role !== "admin" && lead.ownerUserId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const call = await storage.createCall({
        ownerUserId: userId,
        leadId: parsed.data.leadId,
        outcome: parsed.data.outcome,
        durationSec: parsed.data.durationSec || 0,
        notes: parsed.data.notes || "",
      });

      await storage.updateLead(parsed.data.leadId, { lastContactedAt: new Date() } as any);
      await logAudit(userId, "log_call", "call", String(call.id), null, call);
      res.status(201).json(call);
    } catch (err) {
      res.status(500).json({ message: "Failed to log call" });
    }
  });

  app.get("/api/crm/calls", requireCallerOrAdmin, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const role = req.session.userRole;
      const leadId = req.query.leadId ? parseInt(req.query.leadId as string) : undefined;

      if (leadId) {
        const lead = await storage.getLeadById(leadId);
        if (!lead) return res.status(404).json({ message: "Lead not found" });
        if (role !== "admin" && lead.ownerUserId !== userId) {
          return res.status(403).json({ message: "Forbidden" });
        }
        const callsList = await storage.getCallsForLead(leadId);
        return res.json(callsList);
      }

      const callsList = role === "admin"
        ? await storage.getCalls()
        : await storage.getCallsByOwner(userId);
      res.json(callsList);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch calls" });
    }
  });

  app.post("/api/crm/searches", requireCallerOrAdmin, async (req, res) => {
    try {
      const searchSchema = z.object({
        query: z.string().default(""),
        filtersJson: z.any().optional(),
      });
      const parsed = searchSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });

      const userId = req.session.userId!;
      const search = await storage.createSearch({
        ownerUserId: userId,
        query: parsed.data.query,
        filtersJson: parsed.data.filtersJson || {},
      });
      res.status(201).json(search);
    } catch (err) {
      res.status(500).json({ message: "Failed to log search" });
    }
  });

  app.get("/api/crm/searches", requireCallerOrAdmin, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const role = req.session.userRole;
      const searchesList = role === "admin"
        ? await storage.getSearches()
        : await storage.getSearches(userId);
      res.json(searchesList);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch searches" });
    }
  });

  // ─── Admin CRM routes ──────────────────────────────

  app.get("/api/crm/admin/users", requireAdmin, async (_req, res) => {
    try {
      const allUsers = await storage.getUsers();
      res.json(allUsers.map(u => ({
        id: u.id, name: u.name, email: u.email, role: u.role, active: u.active, createdAt: u.createdAt,
      })));
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/crm/admin/users", requireAdmin, async (req, res) => {
    try {
      const parsed = createUserSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });

      const existing = await storage.getUserByEmail(parsed.data.email);
      if (existing) return res.status(409).json({ message: "Email already in use" });

      const passwordHash = await bcrypt.hash(parsed.data.password, 10);
      const user = await storage.createUser({
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        role: parsed.data.role,
      });

      await logAudit(req.session.userId!, "create_user", "user", String(user.id), null, { name: user.name, email: user.email, role: user.role });
      res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role, active: user.active });
    } catch (err) {
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.patch("/api/crm/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id as string);
      const updateSchema = z.object({
        active: z.boolean().optional(),
        role: z.enum(["admin", "caller", "editor"]).optional(),
        name: z.string().optional(),
      });
      const parsed = updateSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid data" });

      const before = await storage.getUser(id);
      const updated = await storage.updateUser(id, parsed.data);
      if (!updated) return res.status(404).json({ message: "User not found" });

      await logAudit(req.session.userId!, "update_user", "user", String(id), before, updated);
      res.json({ id: updated.id, name: updated.name, email: updated.email, role: updated.role, active: updated.active });
    } catch (err) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.post("/api/crm/admin/reassign", requireAdmin, async (req, res) => {
    try {
      const schema = z.object({ leadId: z.number(), newOwnerUserId: z.number() });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid data" });

      const before = await storage.getLeadById(parsed.data.leadId);
      if (!before) return res.status(404).json({ message: "Lead not found" });

      const updated = await storage.reassignLead(parsed.data.leadId, parsed.data.newOwnerUserId);
      await logAudit(req.session.userId!, "reassign", "lead", String(parsed.data.leadId), before, updated);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Failed to reassign lead" });
    }
  });

  app.get("/api/crm/admin/audit", requireAdmin, async (_req, res) => {
    try {
      const events = await storage.getAuditEvents();
      res.json(events);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch audit events" });
    }
  });

  return httpServer;
}
