import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import * as schema from "../shared/schema";
import { config } from "dotenv";

// Load the local .env file (which contains the Supabase URL)
config();

// 1. Connect to your OLD local database
const oldPool = new Pool({ 
  connectionString: "postgresql://postgres:ardcor423@127.0.0.1:5432/JB" 
});
const oldDb = drizzle(oldPool, { schema });

// 2. Connect to your NEW Supabase database
const supabasePool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } 
});
const supabaseDb = drizzle(supabasePool, { schema });

async function migrate() {
  console.log("🚀 Starting data migration from Local to Supabase...");

  try {
    // Read all data from the old database
    console.log("📖 Reading old data...");
    const oldSettings = await oldDb.select().from(schema.siteSettings);
    const oldProjects = await oldDb.select().from(schema.projects);
    const oldImages = await oldDb.select().from(schema.projectImages);
    const oldLeads = await oldDb.select().from(schema.leads);
    const oldSquare = await oldDb.select().from(schema.squareSettings);

    console.log(`Found: ${oldSettings.length} settings, ${oldProjects.length} projects, ${oldImages.length} images, ${oldLeads.length} leads.`);

    // Clear the new database (wipe the seed data)
    console.log("🧹 Clearing default seed data from Supabase...");
    await supabaseDb.delete(schema.projectImages);
    await supabaseDb.delete(schema.projects);
    await supabaseDb.delete(schema.siteSettings);
    await supabaseDb.delete(schema.leads);
    await supabaseDb.delete(schema.squareSettings);

    // Insert data into Supabase (preserving exact IDs so relationships don't break)
    console.log("☁️  Uploading data to Supabase...");
    
    if (oldSettings.length > 0) await supabaseDb.insert(schema.siteSettings).values(oldSettings);
    if (oldProjects.length > 0) await supabaseDb.insert(schema.projects).values(oldProjects);
    if (oldImages.length > 0) await supabaseDb.insert(schema.projectImages).values(oldImages);
    if (oldLeads.length > 0) await supabaseDb.insert(schema.leads).values(oldLeads);
    if (oldSquare.length > 0) await supabaseDb.insert(schema.squareSettings).values(oldSquare);

    // Reset the internal ID counters in Supabase so new items don't collide with migrated IDs
    console.log("⚙️  Syncing internal database counters...");
    await supabaseDb.execute(sql`SELECT setval('site_settings_id_seq', COALESCE((SELECT MAX(id) FROM site_settings), 1));`);
    await supabaseDb.execute(sql`SELECT setval('projects_id_seq', COALESCE((SELECT MAX(id) FROM projects), 1));`);
    await supabaseDb.execute(sql`SELECT setval('project_images_id_seq', COALESCE((SELECT MAX(id) FROM project_images), 1));`);
    await supabaseDb.execute(sql`SELECT setval('leads_id_seq', COALESCE((SELECT MAX(id) FROM leads), 1));`);
    await supabaseDb.execute(sql`SELECT setval('square_settings_id_seq', COALESCE((SELECT MAX(id) FROM square_settings), 1));`);

    console.log("✅ Custom Migration Complete! All your local data is safely in Supabase.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
