import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

/**
 * Preview and staging deployments must not be indexed.
 *
 * Indexing is opt-in via NEXT_PUBLIC_SITE_INDEXABLE=true, set only on the
 * production environment. A red Lighthouse SEO score on a preview URL is the
 * correct result here, not a bug to be fixed by deleting this guard.
 */
export default function robots(): MetadataRoute.Robots {
  const indexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";

  if (!indexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
