import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

/**
 * Preview builds must not be indexed. Indexing is opt-in through
 * NEXT_PUBLIC_SITE_INDEXABLE=true on the production deployment only.
 */
export default function robots(): MetadataRoute.Robots {
  const indexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";
  if (!indexable) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
