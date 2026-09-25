import type { MetadataRoute } from "next";
import { site, SITE_INDEXABLE } from "@/lib/content";

/**
 * Preview and staging deployments must not be indexed.
 *
 * `SITE_INDEXABLE` (content.ts): true on a Vercel production build unless
 * NEXT_PUBLIC_SITE_INDEXABLE=false, otherwise only when it is "true". A red Lighthouse SEO score on a preview URL is the
 * correct result here, not a bug to be fixed by deleting this guard.
 */
export default function robots(): MetadataRoute.Robots {
  if (!SITE_INDEXABLE) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
