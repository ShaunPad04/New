import type { MetadataRoute } from "next";
import { site, SITE_INDEXABLE } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  // Nothing is listed while the build is not indexable.
  if (!SITE_INDEXABLE) return [];

  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
