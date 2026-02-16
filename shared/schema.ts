import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, integer, jsonb, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("editor"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull().default("website"),
  description: text("description").notNull().default(""),
  tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
  coverImageUrl: text("cover_image_url"),
  liveUrl: text("live_url"),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export const projectImages = pgTable("project_images", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  url: text("url").notNull(),
  altText: text("alt_text").default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertProjectImageSchema = createInsertSchema(projectImages).omit({ id: true });
export type InsertProjectImage = z.infer<typeof insertProjectImageSchema>;
export type ProjectImage = typeof projectImages.$inferSelect;

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  heroHeadline: text("hero_headline").notNull().default("We Build Websites That Work"),
  heroSubheadline: text("hero_subheadline").notNull().default("Custom-coded websites designed to grow your business"),
  servicesBlocks: jsonb("services_blocks").default(sql`'[]'::jsonb`),
  aboutText: text("about_text").default(""),
  socialLinks: jsonb("social_links").default(sql`'{}'::jsonb`),
  ctaLinks: jsonb("cta_links").default(sql`'{}'::jsonb`),
  contactInfo: jsonb("contact_info").default(sql`'{}'::jsonb`),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({ id: true });
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSettings = typeof siteSettings.$inferSelect;

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").default(""),
  businessName: text("business_name").default(""),
  industry: text("industry").default(""),
  timeline: text("timeline").default(""),
  budgetRange: text("budget_range").default(""),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({ id: true, createdAt: true, status: true });
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

export const squareSettings = pgTable("square_settings", {
  id: serial("id").primaryKey(),
  mode: text("mode").notNull().default("sandbox"),
  locationId: text("location_id").default(""),
  defaultCheckoutUrl: text("default_checkout_url").default(""),
  extraCheckoutUrls: jsonb("extra_checkout_urls").default(sql`'[]'::jsonb`),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSquareSettingsSchema = createInsertSchema(squareSettings).omit({ id: true, updatedAt: true });
export type InsertSquareSettings = z.infer<typeof insertSquareSettingsSchema>;
export type SquareSettings = typeof squareSettings.$inferSelect;

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  businessName: z.string().optional(),
  industry: z.string().optional(),
  timeline: z.string().optional(),
  budgetRange: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});
