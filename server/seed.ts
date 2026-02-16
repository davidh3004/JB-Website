import { db } from "./db";
import { users, projects, siteSettings, leads } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function seed() {
  const existingAdmin = await db.select().from(users).where(eq(users.email, "admin@jbwebsites.com"));
  if (existingAdmin.length > 0) return;

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10);

  await db.insert(users).values({
    name: process.env.ADMIN_NAME || "JB Admin",
    email: process.env.ADMIN_EMAIL || "admin@jbwebsites.com",
    passwordHash,
    role: "admin",
  });

  await db.insert(siteSettings).values({
    heroHeadline: "Websites That Actually Work for Your Business",
    heroSubheadline: "Custom-coded, SEO-ready websites built to convert visitors into customers. No templates. No shortcuts.",
    aboutText: "JB Websites was founded with a clear mission: give small and medium businesses access to the same quality web development that enterprise companies get.",
    contactInfo: { email: "hello@jbwebsites.com", phone: "(555) 123-4567" },
    socialLinks: { instagram: "#", tiktok: "#", youtube: "#", linkedin: "#" },
    ctaLinks: { booking: "/contact", quote: "/contact" },
  });

  const sampleProjects = [
    {
      slug: "bella-salon-website",
      title: "Bella Salon & Spa",
      category: "website",
      description: "A modern, elegant website for a luxury hair salon featuring online booking integration with Vagaro, gallery showcase, and a clean mobile experience.",
      tags: ["Salon", "Booking", "Responsive"],
      published: true,
      coverImageUrl: "/images/project-salon.svg",
    },
    {
      slug: "peak-fitness-studio",
      title: "Peak Fitness Studio",
      category: "website",
      description: "High-energy fitness studio website with class schedules, trainer profiles, membership info, and seamless Calendly integration for trial sessions.",
      tags: ["Fitness", "Scheduling", "SEO"],
      published: true,
      coverImageUrl: "/images/project-fitness.svg",
    },
    {
      slug: "craft-coffee-roasters",
      title: "Craft Coffee Roasters",
      category: "e-commerce",
      description: "E-commerce site for a local coffee roaster featuring product catalog, subscription management, and Square payment integration for seamless checkout.",
      tags: ["E-commerce", "Square", "Coffee"],
      published: true,
      coverImageUrl: "/images/project-coffee.svg",
    },
    {
      slug: "summit-construction",
      title: "Summit Construction Co.",
      category: "website",
      description: "Professional construction company site with project portfolio, service areas, quote request system, and local SEO optimization for city-specific searches.",
      tags: ["Construction", "Local SEO", "Portfolio"],
      published: true,
      coverImageUrl: "/images/project-construction.svg",
    },
    {
      slug: "greenleaf-restaurant",
      title: "Greenleaf Farm-to-Table",
      category: "website",
      description: "Farm-to-table restaurant website with dynamic menu management, reservation system, events calendar, and Instagram feed integration.",
      tags: ["Restaurant", "Reservations", "Menu"],
      published: true,
      coverImageUrl: "/images/project-restaurant.svg",
    },
  ];

  for (const project of sampleProjects) {
    await db.insert(projects).values(project);
  }

  console.log("Database seeded successfully");
}
