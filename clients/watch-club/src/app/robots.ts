import type { MetadataRoute } from "next";
import { site, SITE_INDEXABLE } from "@/lib/content";

/**
 * Indexing is opt-in and production-only.
 *
 * This is a pitch preview carrying demo inventory under a real business's
 * name. It must not be crawlable. A Lighthouse SEO score around 66 on a
 * preview URL is the CORRECT result of this guard, not a regression — do not
 * remove it to turn the number green.
 */
export default function robots(): MetadataRoute.Robots {
  if (!SITE_INDEXABLE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
