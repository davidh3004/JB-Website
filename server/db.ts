import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const isProd = process.env.NODE_ENV === "production";
const isNeon = process.env.DATABASE_URL.includes("neon.tech") || process.env.DATABASE_URL.includes("render.com");

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: (isProd || isNeon) ? { rejectUnauthorized: false } : undefined
});
export const db = drizzle(pool, { schema });
