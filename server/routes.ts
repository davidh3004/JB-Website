// import type { Express, Request, Response, NextFunction } from "express";
// import { createServer, type Server } from "http";
// import { storage } from "./storage";
// import {
//   contactFormSchema, loginSchema, insertProjectSchema,
// } from "@shared/schema";
// import { z } from "zod";
// import bcrypt from "bcryptjs";
// import session from "express-session";
// import ConnectPgSimple from "connect-pg-simple";
// import { pool } from "./db";
// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import crypto from "crypto";

// const uploadDir = path.resolve("uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const multerStorage = multer.diskStorage({
//   destination: (_req, _file, cb) => cb(null, uploadDir),
//   filename: (_req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase();
//     const name = crypto.randomBytes(16).toString("hex");
//     cb(null, `${name}${ext}`);
//   },
// });

// const upload = multer({
//   storage: multerStorage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: (_req, file, cb) => {
//     const allowed = [".jpg", ".jpeg", ".png", ".webp"];
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (allowed.includes(ext)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only jpg, png, and webp images are allowed"));
//     }
//   },
// });

// declare module "express-session" {
//   interface SessionData {
//     userId?: number;
//     userRole?: string;
//   }
// }

// function requireAuth(req: Request, res: Response, next: NextFunction) {
//   if (!req.session?.userId) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   next();
// }

// export async function registerRoutes(
//   httpServer: Server,
//   app: Express
// ): Promise<Server> {
//   const PgSession = ConnectPgSimple(session);

//   app.use(
//     session({
//       store: new PgSession({ pool, createTableIfMissing: true }),
//       secret: process.env.SESSION_SECRET || "jb-websites-secret-key-change-me",
//       resave: false,
//       saveUninitialized: false,
//       cookie: {
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//         httpOnly: true,
//         secure: app.get("env") === "production",
//         sameSite: "lax",
//       },
//     })
//   );

//   app.use("/uploads", (req, res, next) => {
//     const filePath = path.join(uploadDir, path.basename(req.path));
//     if (fs.existsSync(filePath)) {
//       res.sendFile(filePath);
//     } else {
//       res.status(404).json({ message: "File not found" });
//     }
//   });

//   // ─── Auth ───────────────────────────────────────────

//   app.post("/api/auth/login", async (req, res) => {
//     try {
//       const parsed = loginSchema.safeParse(req.body);
//       if (!parsed.success) return res.status(400).json({ message: "Invalid credentials" });

//       const user = await storage.getUserByEmail(parsed.data.email);
//       if (!user) return res.status(401).json({ message: "Invalid email or password" });

//       const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
//       if (!valid) return res.status(401).json({ message: "Invalid email or password" });

//       req.session.userId = user.id;
//       req.session.userRole = user.role;
//       res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
//     } catch (err) {
//       res.status(500).json({ message: "Login failed" });
//     }
//   });

//   app.post("/api/auth/logout", (req, res) => {
//     req.session.destroy(() => {
//       res.json({ ok: true });
//     });
//   });

//   app.get("/api/auth/me", async (req, res) => {
//     const userId = req.session?.userId;
//     if (!userId) return res.status(401).json({ message: "Not authenticated" });

//     const user = await storage.getUser(userId);
//     if (!user) return res.status(401).json({ message: "User not found" });

//     res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
//   });

//   // ─── Public routes ─────────────────────────────────

//   app.get("/api/projects", async (_req, res) => {
//     const projects = await storage.getProjects(true);
//     res.json(projects);
//   });

//   app.get("/api/projects/featured", async (_req, res) => {
//     const projects = await storage.getProjects(true);
//     res.json(projects.slice(0, 6));
//   });

//   app.get("/api/projects/:slug", async (req, res) => {
//     const project = await storage.getProjectBySlug(req.params.slug);
//     if (!project || !project.published) return res.status(404).json({ message: "Project not found" });
//     res.json(project);
//   });

//   app.get("/api/settings", async (_req, res) => {
//     const settings = await storage.getSiteSettings();
//     res.json(settings);
//   });

//   app.post("/api/leads", async (req, res) => {
//     try {
//       const parsed = contactFormSchema.safeParse(req.body);
//       if (!parsed.success) return res.status(400).json({ message: "Invalid form data", errors: parsed.error.flatten() });

//       const lead = await storage.createLead(parsed.data as any);
//       res.status(201).json({ ok: true, id: lead.id });
//     } catch (err) {
//       res.status(500).json({ message: "Failed to submit form" });
//     }
//   });

//   // ─── Admin routes ────────────────────────

//   app.get("/api/admin/projects", requireAuth, async (_req, res) => {
//     const projects = await storage.getProjects(false);
//     res.json(projects);
//   });

//   app.post("/api/admin/projects", requireAuth, async (req, res) => {
//     try {
//       const parsed = insertProjectSchema.safeParse(req.body);
//       if (!parsed.success) return res.status(400).json({ message: "Invalid project data", errors: parsed.error.flatten() });
//       const project = await storage.createProject(parsed.data);
//       res.status(201).json(project);
//     } catch (err: any) {
//       res.status(400).json({ message: err.message || "Failed to create project" });
//     }
//   });

//   app.patch("/api/admin/projects/:id", requireAuth, async (req, res) => {
//     const id = parseInt(req.params.id as string);
//     const partialSchema = insertProjectSchema.partial();
//     const parsed = partialSchema.safeParse(req.body);
//     if (!parsed.success) return res.status(400).json({ message: "Invalid data", errors: parsed.error.flatten() });
//     const project = await storage.updateProject(id, parsed.data);
//     if (!project) return res.status(404).json({ message: "Project not found" });
//     res.json(project);
//   });

//   app.delete("/api/admin/projects/:id", requireAuth, async (req, res) => {
//     const id = parseInt(req.params.id as string);
//     await storage.deleteProject(id);
//     res.json({ ok: true });
//   });

//   app.post("/api/admin/projects/:id/cover", requireAuth, upload.single("image"), async (req, res) => {
//     const id = parseInt(req.params.id as string);
//     if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//     const url = `/uploads/${req.file.filename}`;
//     await storage.updateProject(id, { coverImageUrl: url });
//     res.json({ url });
//   });

//   app.get("/api/admin/settings", requireAuth, async (_req, res) => {
//     const settings = await storage.getSiteSettings();
//     res.json(settings);
//   });

//   app.patch("/api/admin/settings", requireAuth, async (req, res) => {
//     const settings = await storage.updateSiteSettings(req.body);
//     res.json(settings);
//   });

//   app.get("/api/admin/leads", requireAuth, async (_req, res) => {
//     const allLeads = await storage.getLeads();
//     res.json(allLeads);
//   });

//   app.patch("/api/admin/leads/:id", requireAuth, async (req, res) => {
//     const id = parseInt(req.params.id as string);
//     const statusSchema = z.object({ status: z.enum(["new", "contacted", "qualified", "proposal", "won", "lost", "archived"]) });
//     const parsed = statusSchema.safeParse(req.body);
//     if (!parsed.success) return res.status(400).json({ message: "Invalid status" });
//     const lead = await storage.updateLeadStatus(id, parsed.data.status);
//     if (!lead) return res.status(404).json({ message: "Lead not found" });
//     res.json(lead);
//   });

//   app.get("/api/admin/square-settings", requireAuth, async (_req, res) => {
//     const settings = await storage.getSquareSettings();
//     res.json(settings);
//   });

//   app.patch("/api/admin/square-settings", requireAuth, async (req, res) => {
//     const settings = await storage.updateSquareSettings(req.body);
//     res.json(settings);
//   });

//   return httpServer;
// }
