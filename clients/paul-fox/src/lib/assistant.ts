/**
 * Everything the site assistant is allowed to know, assembled from the same
 * content files that render the pages so the two can never disagree. The
 * prompt is a plain string so it can be cached by the API between turns.
 */
import { about, faq, features, offices, services, site } from "./content";
import { feesPage, lettingsPage, surveysPage, finestPage, epcPage, mortgagePage, careersPage, guildPage } from "./pages";
import { officeLocations } from "./offices-map";
import { allProperties, priceNumber, DEPARTMENT_LABEL } from "./properties";

function section(title: string, body: string): string {
  return `## ${title}\n${body.trim()}\n`;
}

function officeBlock(): string {
  return officeLocations
    .map((o) => {
      const hours = o.hours.map((h) => `${h.days}: ${h.time}`).join("; ");
      return `- ${o.name}: ${o.address.join(", ")}. Tel ${o.phone}. Hours — ${hours}. Google rating ${o.rating} (${o.reviews} reviews). Page: ${o.href}`;
    })
    .concat(offices.filter((o) => o.name === "Lettings").map((o) => `- Lettings: ${o.address}. Tel ${o.phone}. Page: ${o.href}`))
    .join("\n");
}

function propertyBlock(): string {
  const rows = [...allProperties]
    .sort((a, b) => priceNumber(b) - priceNumber(a))
    .map(
      (p) =>
        `- ${p.title} — ${DEPARTMENT_LABEL[p.department]}, ${p.qualifier ? `${p.qualifier} ` : ""}${p.price}, ${p.type}, ${p.beds} bed / ${p.baths} bath. ${p.summary} Link: /property/${p.slug}`,
    );
  return rows.join("\n");
}

function feesBlock(): string {
  const packages = feesPage.packages.map((p) => `- ${p.title}: ${p.price}${p.note ? ` (${p.note})` : ""}`).join("\n");
  const extras = feesPage.additional.items.map((i) => `- ${i.label}: ${i.price}`).join("\n");
  return `Landlord fees (all shown ex. and inc. VAT at 20%):\n${packages}\nAdditional services:\n${extras}\nFull list: /letting-agents/lettings-fees`;
}

export function buildSystemPrompt(): string {
  const lines = [
    `You are the website assistant for ${site.name}, a family-run, independent estate agent in North Lincolnshire, established ${site.established}. You help visitors with buying, selling, renting, letting, surveys, valuations and finding an office. Today's date is ${new Date().toISOString().slice(0, 10)}.`,
    "",
    "Rules:",
    "- Answer only from the information below. If it is not here, say so plainly and point the visitor to the right office phone number or the contact page (/contact). Never invent prices, availability, fees, opening hours or people.",
    "- Property details are a snapshot and may have changed; suggest the visitor confirms with the branch before travelling.",
    "- Do not give legal, tax or mortgage advice; suggest speaking to the team or an adviser instead.",
    "- Keep replies short and warm — two to four sentences, or a short list. Use British English. Use plain text: no markdown headings, no tables, no bold.",
    "- When a page on this site answers the question, include its path (for example /valuation-request) so the visitor can click through.",
    "- To book a valuation, viewing or survey, collect nothing yourself — direct them to /valuation-request, the property page's enquiry form, or the branch phone number.",
    "",
    section("About", `${about.copy}\n${features.items.map((f) => `- ${f.title}: ${f.description}`).join("\n")}`),
    section("Services", services.items.map((s) => `- ${s.title}: ${s.description} (${s.href})`).join("\n")),
    section("Offices", officeBlock()),
    section("Lettings", `${lettingsPage.copy.join(" ")} ${lettingsPage.cmp}\n${feesBlock()}`),
    section("Surveys", `${surveysPage.copy.join(" ")} Contact ${surveysPage.contact.phone} or ${surveysPage.contact.email}. Page: /rics-chartered-property-surveyors`),
    section("Paul Fox Finest", `${finestPage.copy.join(" ")} Page: /finest`),
    section("EPCs", `${epcPage.sections.map((x) => `${x.title}: ${x.text}`).join(" ")} ${epcPage.fee} Page: /epcs`),
    section("Mortgages", `${mortgagePage.copy.join(" ")} Page: /mortgage-advice`),
    section("Careers", `${careersPage.status} ${careersPage.copy} Email ${careersPage.email}. Page: /careers`),
    section("The Guild", `${guildPage.intro} ${guildPage.benefits.map((b) => `${b.title}: ${b.text}`).join(" ")} Page: /guild-of-property-professionals`),
    section("Frequently asked", faq.items.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n")),
    section("Current listings (search at /search-results)", propertyBlock()),
  ];
  return lines.join("\n");
}

export const assistant = {
  name: "Paul Fox assistant",
  greeting: "Hello — I can help with buying, selling, renting, surveys or finding your nearest office. What can I do for you?",
  suggestions: ["Book a free valuation", "Which office is nearest to Brigg?", "What are your lettings fees?", "Show me homes for sale in Epworth"],
  offline: "The assistant isn't available right now. Call us on",
  placeholder: "Ask about a property, a valuation, or an office…",
  disclaimer: "Answers are generated from the information on this site and may be imperfect — please confirm details with your local branch.",
};
