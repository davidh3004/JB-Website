import { db } from "./db";
import { eq, desc, asc, sql } from "drizzle-orm";
import {
  users, projects, projectImages, siteSettings, leads, squareSettings,
  type User, type InsertUser, type Project, type InsertProject,
  type ProjectImage, type InsertProjectImage, type SiteSettings,
  type Lead, type InsertLead, type SquareSettings,
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getProjects(publishedOnly?: boolean): Promise<Project[]>;
  getProjectBySlug(slug: string): Promise<(Project & { images: ProjectImage[] }) | undefined>;
  getProjectById(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, data: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<void>;
  reorderProjects(ids: number[]): Promise<void>;

  getProjectImages(projectId: number): Promise<ProjectImage[]>;
  createProjectImage(image: InsertProjectImage): Promise<ProjectImage>;
  deleteProjectImage(id: number): Promise<void>;

  getSiteSettings(): Promise<SiteSettings>;
  updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings>;

  getLeads(): Promise<Lead[]>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLeadStatus(id: number, status: string): Promise<Lead | undefined>;

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

  async getProjects(publishedOnly = false): Promise<Project[]> {
    if (publishedOnly) {
      return db.select().from(projects).where(eq(projects.published, true)).orderBy(asc(projects.sortOrder), desc(projects.createdAt));
    }
    return db.select().from(projects).orderBy(asc(projects.sortOrder), desc(projects.createdAt));
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

  async reorderProjects(ids: number[]): Promise<void> {
    for (let i = 0; i < ids.length; i++) {
      await db.update(projects).set({ sortOrder: i }).where(eq(projects.id, ids[i]));
    }
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

  async createLead(lead: InsertLead): Promise<Lead> {
    const [created] = await db.insert(leads).values(lead).returning();
    return created;
  }

  async updateLeadStatus(id: number, status: string): Promise<Lead | undefined> {
    const [updated] = await db.update(leads).set({ status, updatedAt: new Date() }).where(eq(leads.id, id)).returning();
    return updated;
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
