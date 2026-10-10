import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const ROUTES: Array<{ path: string; priority: number; changeFrequency: "weekly" | "monthly" }> = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/menu", priority: 0.9, changeFrequency: "weekly" },
  { path: "/our-story", priority: 0.6, changeFrequency: "monthly" },
  { path: "/gallery", priority: 0.5, changeFrequency: "monthly" },
  { path: "/reviews", priority: 0.5, changeFrequency: "monthly" },
  { path: "/visit", priority: 0.8, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((r) => ({
    url: `${site.url}${r.path}`,
    lastModified,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
