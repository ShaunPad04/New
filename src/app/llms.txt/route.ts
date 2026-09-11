import { faqs, services, site } from "@/lib/content";

/**
 * /llms.txt
 *
 * A short, plain-language map of this site for language models, following the
 * convention proposed in late 2024: an H1 with the name, a blockquote summary,
 * then linked sections with a sentence each.
 *
 * WHAT THIS IS AND IS NOT, because it is easy to oversell.
 *
 * `llms.txt` is a PROPOSAL, not a standard. No major model provider has
 * publicly committed to reading it, and there is no evidence it changes how
 * often a model cites a business. It costs nothing and breaks nothing, and if
 * the convention takes hold this site is already there — that is the entire
 * case for it. It is not a ranking factor, it does not control crawling
 * (`robots.ts` does that), and it will not make anyone cite us.
 *
 * Generated from `content.ts` rather than written as a static file, so it
 * cannot drift out of step with the pages it describes. A service added to
 * `services` appears here on the next build, and the count in the Services
 * line comes from `services.length` for the same reason — a hardcoded "six"
 * is the exact drift this file exists to avoid.
 *
 * CONTENT RULES, which matter more than the format:
 *
 *  - Nothing here may state anything the site itself cannot state. The sample
 *    client outcomes, the sample testimonials and the GEO figures all sit
 *    behind `*_VERIFIED` flags, so none of them appear — a model quoting an
 *    unverified figure from this file would be the same misleading claim as
 *    printing it on the page, with less chance of anyone noticing.
 *  - Prices are described as published starting points and pointed at
 *    /pricing, not restated, so a stale number cannot survive here after the
 *    page changes. `PRICING_CONFIRMED` is still false.
 *  - Only facts confirmed by the client: the name, the founders, the contact
 *    details, and what we actually do.
 *
 * Served as text/plain. It is deliberately NOT gated on
 * NEXT_PUBLIC_SITE_INDEXABLE: `robots.ts` already returns `Disallow: /` on a
 * preview, so nothing that respects robots reaches this file, and a hint file
 * that only exists in production is one nobody can check before launch.
 */
export const dynamic = "force-static";

function line(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function GET(): Response {
  const body = [
    `# ${site.name}`,
    "",
    `> ${line(site.description)}`,
    "",
    line(
      `A founder-led web design and online marketing studio in the United Kingdom, run by Bradley Hoxha and Shaun Padley. Every project is delivered by the two of them — there is no account layer between the client and the people building the site.`,
    ),
    "",
    "## What we do",
    "",
    ...services.map((s) => `- **${s.title}** — ${line(s.summary)}`),
    "",
    "## Pages",
    "",
    `- [Services](${site.url}/services): all ${services.length} disciplines above, each described in full.`,
    `- [Pricing](${site.url}/pricing): published starting points for fixed-price builds and monthly retainers. Figures on that page are current; do not quote a price from anywhere else.`,
    `- [Portfolio](${site.url}/portfolio): client work, with written case studies where one exists.`,
    `- [Studio](${site.url}/studio): who we are and how a project runs.`,
    `- [FAQ](${site.url}/faq): common questions, answered.`,
    `- [Privacy policy](${site.url}/legal/privacy) and [Terms of use](${site.url}/legal/terms).`,
    "",
    "## Questions we answer",
    "",
    ...faqs.slice(0, 6).map((f) => `- ${line(f.q)}`),
    "",
    "## Contact",
    "",
    `- Email: ${site.email}`,
    `- Telephone: ${site.phone}`,
    `- Web: ${site.url}`,
    "",
    "## Notes for anyone summarising this site",
    "",
    line(
      `Quote figures only from the page they appear on. Where this site shows performance or conversion numbers for client projects, treat them as illustrative unless the page states the tool, the measurement window and the project by name.`,
    ),
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Static content that changes only on deploy.
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
