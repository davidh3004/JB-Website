import { db } from "./db";
import { eq, desc, sql, and } from "drizzle-orm";
import {
  users, projects, projectImages, siteSettings, leads, squareSettings,
  calls, searches, auditEvents,
  type User, type InsertUser, type Project, type InsertProject,
  type ProjectImage, type InsertProjectImage, type SiteSettings,
  type Lead, type InsertLead, type SquareSettings,
  type Call, type InsertCall, type Search, type InsertSearch,
  type AuditEvent, type InsertAuditEvent,
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsers(): Promise<User[]>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined>;

  getProjects(publishedOnly?: boolean): Promise<Project[]>;
  getProjectBySlug(slug: string): Promise<(Project & { images: ProjectImage[] }) | undefined>;
  getProjectById(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, data: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<void>;

  getProjectImages(projectId: number): Promise<ProjectImage[]>;
  createProjectImage(image: InsertProjectImage): Promise<ProjectImage>;
  deleteProjectImage(id: number): Promise<void>;

  getSiteSettings(): Promise<SiteSettings>;
  updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings>;

  getLeads(): Promise<Lead[]>;
  getLeadsByOwner(ownerUserId: number): Promise<Lead[]>;
  getLeadById(id: number): Promise<Lead | undefined>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, data: Partial<InsertLead>): Promise<Lead | undefined>;
  updateLeadStatus(id: number, status: string): Promise<Lead | undefined>;
  reassignLead(id: number, newOwnerUserId: number): Promise<Lead | undefined>;

  getCalls(leadId?: number): Promise<Call[]>;
  getCallsByOwner(ownerUserId: number): Promise<Call[]>;
  getCallsForLead(leadId: number): Promise<Call[]>;
  createCall(call: InsertCall): Promise<Call>;

  getSearches(ownerUserId?: number): Promise<Search[]>;
  createSearch(search: InsertSearch): Promise<Search>;

  getAuditEvents(): Promise<AuditEvent[]>;
  createAuditEvent(event: InsertAuditEvent): Promise<AuditEvent>;

  getSquareSettings(): Promise<SquareSettings>;
  updateSquareSettings(data: Partial<SquareSettings>): Promise<SquareSettings>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async getUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const [updated] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return updated;
  }

  async getProjects(publishedOnly = false): Promise<Project[]> {
    if (publishedOnly) {
      return db.select().from(projects).where(eq(projects.published, true)).orderBy(desc(projects.createdAt));
    }
    return db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProjectBySlug(slug: string): Promise<(Project & { images: ProjectImage[] }) | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.slug, slug));
    if (!project) return undefined;
    const images = await db.select().from(projectImages).where(eq(projectImages.projectId, project.id)).orderBy(projectImages.sortOrder);
    return { ...project, images };
  }

  async getProjectById(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [created] = await db.insert(projects).values(project).returning();
    return created;
  }

  async updateProject(id: number, data: Partial<InsertProject>): Promise<Project | undefined> {
    const [updated] = await db.update(projects).set({ ...data, updatedAt: new Date() }).where(eq(projects.id, id)).returning();
    return updated;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projectImages).where(eq(projectImages.projectId, id));
    await db.delete(projects).where(eq(projects.id, id));
  }

  async getProjectImages(projectId: number): Promise<ProjectImage[]> {
    return db.select().from(projectImages).where(eq(projectImages.projectId, projectId)).orderBy(projectImages.sortOrder);
  }

  async createProjectImage(image: InsertProjectImage): Promise<ProjectImage> {
    const [created] = await db.insert(projectImages).values(image).returning();
    return created;
  }

  async deleteProjectImage(id: number): Promise<void> {
    await db.delete(projectImages).where(eq(projectImages.id, id));
  }

  async getSiteSettings(): Promise<SiteSettings> {
    const [existing] = await db.select().from(siteSettings);
    if (existing) return existing;
    const [created] = await db.insert(siteSettings).values({}).returning();
    return created;
  }

  async updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    const existing = await this.getSiteSettings();
    const [updated] = await db.update(siteSettings).set(data).where(eq(siteSettings.id, existing.id)).returning();
    return updated;
  }

  async getLeads(): Promise<Lead[]> {
    return db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLeadsByOwner(ownerUserId: number): Promise<Lead[]> {
    return db.select().from(leads).where(eq(leads.ownerUserId, ownerUserId)).orderBy(desc(leads.createdAt));
  }

  async getLeadById(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const [created] = await db.insert(leads).values(lead).returning();
    return created;
  }

  async updateLead(id: number, data: Partial<InsertLead>): Promise<Lead | undefined> {
    const [updated] = await db.update(leads).set({ ...data, updatedAt: new Date() }).where(eq(leads.id, id)).returning();
    return updated;
  }

  async updateLeadStatus(id: number, status: string): Promise<Lead | undefined> {
    const [updated] = await db.update(leads).set({ status, updatedAt: new Date() }).where(eq(leads.id, id)).returning();
    return updated;
  }

  async reassignLead(id: number, newOwnerUserId: number): Promise<Lead | undefined> {
    const [updated] = await db.update(leads).set({ ownerUserId: newOwnerUserId, updatedAt: new Date() }).where(eq(leads.id, id)).returning();
    return updated;
  }

  async getCalls(leadId?: number): Promise<Call[]> {
    if (leadId) {
      return db.select().from(calls).where(eq(calls.leadId, leadId)).orderBy(desc(calls.createdAt));
    }
    return db.select().from(calls).orderBy(desc(calls.createdAt));
  }

  async getCallsByOwner(ownerUserId: number): Promise<Call[]> {
    return db.select().from(calls).where(eq(calls.ownerUserId, ownerUserId)).orderBy(desc(calls.createdAt));
  }

  async getCallsForLead(leadId: number): Promise<Call[]> {
    return db.select().from(calls).where(eq(calls.leadId, leadId)).orderBy(desc(calls.createdAt));
  }

  async createCall(call: InsertCall): Promise<Call> {
    const [created] = await db.insert(calls).values(call).returning();
    return created;
  }

  async getSearches(ownerUserId?: number): Promise<Search[]> {
    if (ownerUserId) {
      return db.select().from(searches).where(eq(searches.ownerUserId, ownerUserId)).orderBy(desc(searches.createdAt));
    }
    return db.select().from(searches).orderBy(desc(searches.createdAt));
  }

  async createSearch(search: InsertSearch): Promise<Search> {
    const [created] = await db.insert(searches).values(search).returning();
    return created;
  }

  async getAuditEvents(): Promise<AuditEvent[]> {
    return db.select().from(auditEvents).orderBy(desc(auditEvents.createdAt));
  }

  async createAuditEvent(event: InsertAuditEvent): Promise<AuditEvent> {
    const [created] = await db.insert(auditEvents).values(event).returning();
    return created;
  }

  async getSquareSettings(): Promise<SquareSettings> {
    const [existing] = await db.select().from(squareSettings);
    if (existing) return existing;
    const [created] = await db.insert(squareSettings).values({}).returning();
    return created;
  }

  async updateSquareSettings(data: Partial<SquareSettings>): Promise<SquareSettings> {
    const existing = await this.getSquareSettings();
    const [updated] = await db.update(squareSettings).set({ ...data, updatedAt: new Date() }).where(eq(squareSettings.id, existing.id)).returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
