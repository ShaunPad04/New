import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

/**
 * Every nav category is a real route, so each one belongs in the sitemap.
 * Priorities reflect commercial intent rather than being uniform: the
 * homepage first, then the two pages a prospect reads before enquiring.
 */
const routes: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/portfolio", priority: 0.9 },
  { path: "/services", priority: 0.9 },
  { path: "/pricing", priority: 0.8 },
  { path: "/faq", priority: 0.6 },
  { path: "/studio", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map(({ path, priority }) => ({
    url: path === "/" ? site.url : `${site.url}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
