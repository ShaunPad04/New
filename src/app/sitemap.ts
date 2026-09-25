import type { MetadataRoute } from "next";
import { caseStudies, publishedServicePages, site } from "@/lib/content";

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
  /* The one local page: the searches a Humberston studio can actually win.
     Ranked with /pricing, since it is a landing page for a whole area. */
  { path: "/web-design-grimsby", priority: 0.8 },
  /* Case studies are read from the same array that generates their pages,
     so a new study is in the sitemap the moment it exists. Until 2026-09-25
     they were missing, and the one piece of proof on the site was left for
     Google to find by following links. Ranked just under the category
     pages: a prospect reaches a study from /portfolio, but it is the page
     that actually answers "have they done this before?". */
  ...caseStudies.map((c) => ({ path: `/portfolio/${c.slug}`, priority: 0.7 })),
  /* One page per service (2026-09-25), from the same list that generates
     them. Ranked with the category pages: each is the landing page for its
     own searches. */
  ...publishedServicePages.map((p) => ({ path: `/services/${p.slug}`, priority: 0.8 })),
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
