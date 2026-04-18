import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

// Only enforce SSL if it's explicitly an external cloud database.
// Render's internal database URLs do NOT use SSL (they are internally secure).
const isExternal = process.env.DATABASE_URL.includes("neon.tech") || process.env.DATABASE_URL.includes("render.com") || process.env.DATABASE_URL.includes("supabase");

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: isExternal ? { rejectUnauthorized: false } : undefined
});
export const db = drizzle(pool, { schema });
