import { db } from "./db";
import { projects, siteSettings } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function seed() {
  // Check if settings already exist (skip if already seeded)
  const existingSettings = await db.select().from(siteSettings);
  if (existingSettings.length > 0) return;

  // Seed site settings
  await db.insert(siteSettings).values({
    heroHeadline: "Websites That Actually Work for Your Business",
    heroSubheadline: "Custom-coded, SEO-ready websites built to convert visitors into customers. No templates. No shortcuts.",
    aboutText: "JB Websites was founded with a clear mission: give small and medium businesses access to the same quality web development that enterprise companies get.",
    contactInfo: { email: "hello@jbwebsites.com", phone: "(555) 123-4567" },
    socialLinks: { instagram: "#", tiktok: "#", youtube: "#", linkedin: "#" },
    ctaLinks: { booking: "/contact", quote: "/contact" },
  });

  // Seed sample projects
  const sampleProjects = [
    {
      slug: "bella-salon-website",
      title: "Bella Salon & Spa",
      category: "website",
      description: "A modern, elegant website for a luxury hair salon featuring online booking integration, gallery showcase, and a clean mobile experience that converts visitors into appointments.",
      tags: ["Salon", "Booking", "Responsive"],
      published: true,
      coverImageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80&auto=format&fit=crop",
    },
    {
      slug: "peak-fitness-studio",
      title: "Peak Fitness Studio",
      category: "website",
      description: "High-energy fitness studio website with class schedules, trainer profiles, membership info, and Calendly integration for free trial sessions.",
      tags: ["Fitness", "Scheduling", "SEO"],
      published: true,
      coverImageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop",
    },
    {
      slug: "craft-coffee-roasters",
      title: "Craft Coffee Roasters",
      category: "e-commerce",
      description: "E-commerce site for a local coffee roaster featuring product catalog, subscription management, and Square payment integration for seamless checkout.",
      tags: ["E-commerce", "Square", "Coffee"],
      published: true,
      coverImageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&auto=format&fit=crop",
    },
    {
      slug: "summit-construction",
      title: "Summit Construction Co.",
      category: "website",
      description: "Professional construction company site with project portfolio, service areas, quote request system, and local SEO optimization for city-specific searches.",
      tags: ["Construction", "Local SEO", "Portfolio"],
      published: true,
      coverImageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80&auto=format&fit=crop",
    },
    {
      slug: "greenleaf-restaurant",
      title: "Greenleaf Farm-to-Table",
      category: "website",
      description: "Farm-to-table restaurant website with dynamic menu management, reservation system, events calendar, and Instagram feed integration.",
      tags: ["Restaurant", "Reservations", "Menu"],
      published: true,
      coverImageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop",
    },
    {
      slug: "nova-real-estate",
      title: "Nova Real Estate Group",
      category: "website",
      description: "Real estate agency website with property listings, neighborhood guides, agent profiles, mortgage calculator, and lead capture forms optimized for conversions.",
      tags: ["Real Estate", "Lead Gen", "SEO"],
      published: true,
      coverImageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80&auto=format&fit=crop",
    },
  ];

  for (const project of sampleProjects) {
    await db.insert(projects).values(project);
  }

  console.log("Database seeded successfully");
}
