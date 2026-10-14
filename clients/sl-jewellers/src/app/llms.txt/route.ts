import { BUSINESS, COLLECTIONS, FAQ, SERVICES, SITE_URL, hasTimes } from "@/lib/content";
import { DAYS, DAY_LABEL } from "@/lib/hours";
import { pieceHref } from "@/lib/piece-url";

/**
 * /llms.txt: a plain summary of the shop for AI search and assistants (llmstxt.org). Built from
 * the same content files as the pages (business.json, collections.json, services.json,
 * faq.json), so it can never say something the site does not. No prices: the shop prices on
 * the counter.
 */
export const dynamic = "force-static";

export function GET() {
  const b = BUSINESS;
  const a = b.address;
  const hours = DAYS.map((d) => {
    const h = b.hours.week[d];
    return `- ${DAY_LABEL[d]}: ${hasTimes(h) ? `${h.open} to ${h.close}` : h ? "by appointment" : "closed"}`;
  }).join("\n");
  const cats = COLLECTIONS.map((c) => {
    const n = c.pieces?.length ?? 0;
    return `- [${c.title}](${SITE_URL}/pieces/${c.slug}): ${c.blurb} ${n ? `${n} listed.` : "Ask what is in."}`;
  }).join("\n");
  const pieces = COLLECTIONS.flatMap((c) => (c.pieces ?? []).map((p) => `- [${p.title}](${SITE_URL}${pieceHref(p)}) (${c.title})`)).join("\n");
  const services = SERVICES.map((s) => `- ${s.title}: ${s.lead}`).join("\n");
  const faq = FAQ.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n");

  const body = `# ${b.name}

> ${b.name} is an independent jeweller at ${a.street}, ${a.town} ${a.postcode}, England. It buys and sells gold and silver jewellery, pre-owned luxury watches, coins and bullion over the counter, buys gold, silver and watches, takes part-exchanges, sources and makes pieces to order, and does repairs and soldering. Prices are given on request, in the shop or by message. The shop is not an authorised dealer of, or affiliated with, any watch brand it sells.

## Contact

- Address: ${a.street}, ${a.town}, ${a.county} ${a.postcode}
- Phone: ${b.phone.display} (${b.phone.e164}), also on WhatsApp
- Email: ${b.email}
- Map: ${b.social.google.mapsUrl}
- Enquiries: ${SITE_URL}/enquiry
- Instagram: ${b.social.instagram.url}
- Facebook: ${b.social.facebook.url}
- TikTok: ${b.social.tiktok.url}
- Company: ${b.legalName}, company number ${b.companyNumber}, registered office ${b.registeredOffice}

## Opening hours

${hours}

${b.hours.enquiriesNote ?? ""}

## Services

${services}

## Categories

${cats}

## Pieces in the case

${pieces}

## Questions

${faq}

## Pages

- [Home](${SITE_URL}/)
- [Shop all](${SITE_URL}/pieces)
- [Services](${SITE_URL}/services)
- [Gold and silver prices](${SITE_URL}/gold-prices)
- [About](${SITE_URL}/about)
- [FAQ](${SITE_URL}/faq)
- [Privacy policy](${SITE_URL}/privacy)
`;
  return new Response(body.replace(/\n{3,}/g, "\n\n"), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
