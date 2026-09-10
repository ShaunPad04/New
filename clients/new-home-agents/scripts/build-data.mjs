/**
 * Build src/data/properties.json from the dated snapshot in src/data/scrape/.
 *
 * The snapshot is what the agency's public site listed on the capture date —
 * it is NOT a live feed. Re-run the nha-capture workflow (or scrape.py and
 * download-assets.mjs from a machine that can reach the site) and then this
 * script to refresh it. To move to a live feed, replace the loader in
 * src/lib/properties.ts; every page reads through that module.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCRAPE = path.join(ROOT, "src/data/scrape");
const read = (f) => JSON.parse(fs.readFileSync(path.join(SCRAPE, f), "utf8"));

const index = read("index.json");
const details = read("details.json");
const assets = fs.existsSync(path.join(SCRAPE, "assets.json")) ? read("assets.json") : { properties: {} };
const meta = fs.existsSync(path.join(SCRAPE, "meta.json")) ? read("meta.json") : {};

const clean = (s) => (s || "").replace(/\s+/g, " ").trim();

function parsePrice(raw) {
  const text = clean(raw);
  const m = /£\s*([\d,]+)/.exec(text);
  const amount = m ? Number(m[1].replace(/,/g, "")) : null;
  let qualifier = text.replace(/£\s*[\d,]+/, "").replace(/\s+/g, " ").trim();
  qualifier = qualifier.replace(/^[-–:]+|[-–:]+$/g, "").trim();
  return { raw: text, amount, qualifier: qualifier || null };
}

function tidyDescription(text) {
  // The agency's CMS pastes descriptions with inline styling artefacts; keep
  // the words, normalise whitespace, drop the "Read more" tails.
  return (text || "")
    .replace(/^[^>]*>\s*/, "")
    .replace(/\r/g, "")
    .replace(/\*{2,}/g, "")
    .replace(/[ \t\xa0]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\(\.\.\.\)\s*Read more\.{0,3}/gi, "")
    .split(/\n{2,}/)
    .map((para) => sentenceCase(para.replace(/\n/g, " ").trim()))
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

function sentenceCase(s) {
  const t = clean(s);
  if (!t) return t;
  // Headlines in the feed are often SHOUTED. Only soften all-caps strings.
  if (t === t.toUpperCase() && /[A-Z]/.test(t)) {
    return t.toLowerCase().replace(/(^|[.!?]\s+)([a-z])/g, (m, p, c) => p + c.toUpperCase()).replace(/\bepc\b/g, "EPC").replace(/\bwc\b/g, "WC").replace(/\btv\b/g, "TV");
  }
  return t;
}

const byLink = new Map();
for (const it of index) {
  if (!it.link) continue;
  const existing = byLink.get(it.link);
  if (!existing) byLink.set(it.link, { ...it, sources: [it.source] });
  else if (!existing.sources.includes(it.source)) existing.sources.push(it.source);
}

const properties = [];
for (const it of byLink.values()) {
  const d = details[it.link] || {};
  if (d.error) continue;
  const id = it.id;
  const slug = it.link.split("/").pop();
  const title = clean(d.title || it.title);
  const parts = title.split(",").map((s) => s.trim()).filter(Boolean);
  const town = parts[parts.length - 1] || "";
  const area = parts.length > 1 ? parts.slice(1).join(", ") : "";
  const bedsFromAlt = /^(\d+)\s+bed/i.exec(it.alt || "");
  const beds = Number(d.icons?.bedrooms ?? it.icons?.bedrooms ?? (bedsFromAlt ? bedsFromAlt[1] : NaN));
  const baths = Number(d.icons?.bathrooms ?? it.icons?.bathrooms ?? NaN);
  const receptions = Number(d.icons?.receptions ?? it.icons?.receptions ?? NaN);
  const local = assets.properties?.[id] || { images: [], floorplans: [] };
  const remoteImages = (d.images || []).map((x) => (Array.isArray(x) ? { caption: x[0], src: x[1] } : { caption: "", src: x }));
  const images = local.images?.length
    ? local.images.map((im, i) => ({ src: "/" + im.out.replace(/\\/g, "/"), width: im.width, height: im.height, alt: `${title} — ${im.caption || remoteImages[i]?.caption || `photo ${i + 1}`}`, local: true }))
    : remoteImages.slice(0, 1).map((im, i) => ({ src: im.src, width: 1280, height: 853, alt: `${title} — ${im.caption || `photo ${i + 1}`}`, local: false }));
  const floorplans = local.floorplans?.length
    ? local.floorplans.map((fp, i) => ({ src: "/" + fp.out.replace(/\\/g, "/"), width: fp.width, height: fp.height, alt: `${title} — floorplan ${i + 1}`, local: true }))
    : (d.floorplans || []).map((src, i) => ({ src, width: 1200, height: 900, alt: `${title} — floorplan ${i + 1}`, local: false }));
  const isNewHome = (it.sources || []).includes("new-homes");
  const price = parsePrice(d.price || it.price);
  const description = tidyDescription(d.description);
  const epcMatch = /EPC\s*(?:RATING|Rating|rating)?\s*[:\-]?\s*([A-G])\b/.exec(`${(d.features || []).join(" ")} ${description}`);
  properties.push({
    id,
    slug,
    sourceUrl: `https://www.newhomeagents.co.uk${it.link}`,
    title,
    town,
    area,
    price,
    beds: Number.isFinite(beds) ? beds : null,
    baths: Number.isFinite(baths) ? baths : null,
    receptions: Number.isFinite(receptions) ? receptions : null,
    status: "For sale",
    isNewHome,
    isNewListing: (it.banners || []).includes("new"),
    features: (d.features || []).map(sentenceCase).filter(Boolean),
    summary: sentenceCase(clean(it.short).replace(/\(\.\.\.\)$/, "").replace(/\*{2,}/g, "").replace(/\s{2,}/g, " ").trim()),
    description,
    images,
    floorplans,
    epcRating: d.epc_rating || (epcMatch ? epcMatch[1] : null),
    virtualTours: d.virtual || [],
    brochures: d.brochure || [],
    metaTitle: d.meta_title || null,
    metaDescription: d.meta_desc || null,
    fetchedAt: d.fetched_at || null,
    order: properties.length,
  });
}

const out = {
  capturedAt: meta.captured_at || null,
  source: meta.source || "https://www.newhomeagents.co.uk",
  count: properties.length,
  properties,
};
fs.writeFileSync(path.join(ROOT, "src/data/properties.json"), JSON.stringify(out, null, 1));
console.log(`properties.json: ${properties.length} listings (${properties.filter((p) => p.isNewHome).length} new homes, ${properties.filter((p) => p.images[0]?.local).length} with local photos)`);
