import type { LucideIcon } from "lucide-react";
import { Share2, Code2, Sparkles, Search, Target, UsersRound } from "lucide-react";

export interface ServiceOffering {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const SERVICE_OFFERINGS: ServiceOffering[] = [
  {
    title: "Social Media Management & Growth",
    description:
      "We manage and grow your social media presence with a strategy focused on consistency, engagement, and results. This includes content planning, high-quality posting, caption writing, and audience interaction to position your brand professionally and turn followers into customers.",
    icon: Share2,
  },
  {
    title: "Custom Websites",
    description:
      "We design and develop fully custom-coded websites built for performance, speed, and conversions. Every site is tailored to your business, optimized for mobile devices, and structured to turn visitors into leads through clean design, strong messaging, and seamless user experience.",
    icon: Code2,
  },
  {
    title: "AI Automation",
    description:
      "We implement intelligent automation systems that handle customer interactions, lead qualification, and follow-ups in real time. From AI chatbots to automated messaging flows, these systems help your business operate more efficiently while capturing and converting more opportunities without manual effort.",
    icon: Sparkles,
  },
  {
    title: "SEO",
    description:
      "We optimize your online presence to rank higher on search engines and attract customers actively searching for your services. This includes keyword targeting, on-page optimization, Google Business Profile enhancements, and ongoing improvements to increase visibility and drive consistent organic traffic.",
    icon: Search,
  },
  {
    title: "Meta Ads and Google Ads",
    description:
      "We create and manage high-converting advertising campaigns across platforms like Meta Platforms and Google. Our approach focuses on targeting the right audience, optimizing performance, and maximizing return on ad spend through data-driven strategies and continuous testing.",
    icon: Target,
  },
  {
    title: "CRM",
    description:
      "We build and implement custom CRM systems designed to organize, track, and manage your leads and customers. From pipeline tracking to team access control and automated workflows, your business gains full visibility and control over every opportunity from first contact to closed deal.",
    icon: UsersRound,
  },
];
