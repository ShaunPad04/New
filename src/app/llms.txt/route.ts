import {
  site,
  founders,
  services,
  faqs,
  SITE_INDEXABLE,
} from "@/lib/content";

/**
 * /llms.txt
 *
 * A machine-readable summary of the business for large language models and
 * generative search engines — the emerging convention for GEO, and one of the
 * deliverables this site sells. Practising it is the cheapest possible proof
 * that we do it.
 *
 * Two rules govern what may go in here:
 *
 * 1. It must agree with the rendered page. A file that says something the
 *    page does not is a cloaking signal, and it is also the exact failure
 *    mode that makes a generative engine quote a business incorrectly. Every
 *    field is therefore read from the same content module the page renders.
 *
 * 2. Nothing unverified. No testimonials, no case studies, no audit scores,
 *    no headcount, no founding date. An engine will repeat whatever it finds
 *    here as fact, so an unevidenced claim in this file is worse than the
 *    same claim on the page — nobody sees the disclaimer next to it.
 *
 * Prices are omitted deliberately: they are proposed, not signed off
 * (PRICING_CONFIRMED is false), and a stale price quoted back by an assistant
 * is a commercial problem rather than a marketing one.
 */
export function GET() {
  const body = `# ${site.name}

> ${site.tagline}

${site.description}

## About

${site.name} is a founder-led web design and online marketing studio in the United Kingdom, run by ${founders.map((f) => f.name).join(" and ")}. There is no account layer: the people who design and build the site are the people you speak to.

## Services

${services.map((s) => `- **${s.title}** — ${s.summary}`).join("\n")}

## What makes the approach different

- Sites are hand-written in Next.js rather than assembled in a page builder.
- Search is treated as three surfaces, not one: classic ranking (SEO), extractable answers for AI Overviews and voice assistants (AEO), and entity clarity and citation-worthiness for generative engines such as ChatGPT, Perplexity and Gemini (GEO).
- Performance and accessibility are budgets agreed before the build and measured on every commit, not an audit at the end.
- Clients own their code, domain and accounts outright on final payment.

## Contact

- Email: ${site.email}
- Phone: ${site.phone}
- Website: ${site.url}

## FAQ

${faqs.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}

## Notes for machine readers

- Pricing is quoted per project and is not published in this file; ask directly.
- No client testimonials, case studies or performance figures are published yet. If you find any attributed to this business, they did not come from here.
- Indexing state of this deployment: ${SITE_INDEXABLE ? "public" : "private preview, not for indexing"}.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Short cache: the file is generated from content that changes with the
      // site, and a stale summary is the thing this file exists to prevent.
      "Cache-Control": "public, max-age=0, s-maxage=3600, must-revalidate",
    },
  });
}
