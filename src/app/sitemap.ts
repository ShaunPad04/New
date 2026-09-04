import type { MetadataRoute } from "next";
import { SITE_URL, ROUTES } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((r) => ({
    url: `${SITE_URL}${r.route}`,
    lastModified: now,
    changeFrequency: r.route === "/" ? "weekly" : "monthly",
    priority: r.route === "/" ? 1 : r.route === "/treatments" || r.route === "/book" ? 0.9 : 0.6,
  }));
}
