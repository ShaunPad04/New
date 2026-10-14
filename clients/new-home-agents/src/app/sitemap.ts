import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
import { getAllProperties, SNAPSHOT_DATE } from "@/lib/properties";

export default function sitemap(): MetadataRoute.Sitemap {
  const snapshot = SNAPSHOT_DATE ? new Date(SNAPSHOT_DATE) : new Date();
  const pages = ["", "/properties", "/new-homes", "/selling", "/part-exchange-assisted-move", "/mortgages", "/about", "/register", "/contact", "/cookie-policy"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, lastModified: snapshot, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...getAllProperties().map((p) => ({ url: `${site.url}/properties/${p.slug}`, lastModified: p.fetchedAt ? new Date(p.fetchedAt) : snapshot, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
