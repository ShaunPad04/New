/**
 * Client assets — permitted public assets from www.newhomeagents.co.uk and
 * its listing media host, plus the Switzer webfont from Fontshare.
 *
 * Reads ../../src/data/scrape/{index,details}.json and writes:
 *   ../../public/images/properties/<id>/<n>.jpg   listing photography (resized)
 *   ../../public/images/properties/<id>/floorplan-<n>.jpg
 *   ../../public/images/brand/*                     logo + affiliation marks
 *   ../../public/documents/*.pdf                    privacy policy, complaints procedure
 *   ../../public/fonts/switzer/*.woff2              Switzer (ITF Free Font Licence)
 *   ../../src/data/scrape/assets.json               manifest of what landed locally
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve("../..");
const DATA = path.join(ROOT, "src/data/scrape");
const PUB = path.join(ROOT, "public");
const BASE = "https://www.newhomeagents.co.uk";
const UA = { "User-Agent": "Mozilla/5.0 (compatible; NHA-preview-capture)" };

async function fetchBuf(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: UA });
      if (!r.ok) throw new Error("HTTP " + r.status);
      return Buffer.from(await r.arrayBuffer());
    } catch (e) {
      if (i === tries - 1) throw e;
      await new Promise((r) => setTimeout(r, 800 * (i + 1)));
    }
  }
}

async function saveJpg(url, out, width, quality) {
  if (fs.existsSync(out)) return { out, skipped: true };
  const buf = await fetchBuf(url);
  const meta = await sharp(buf).metadata();
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const info = await sharp(buf).rotate().resize({ width, withoutEnlargement: true }).jpeg({ quality, mozjpeg: true }).toFile(out);
  return { out: path.relative(PUB, out), width: info.width, height: info.height, sourceWidth: meta.width, sourceHeight: meta.height, bytes: info.size };
}

const index = JSON.parse(fs.readFileSync(path.join(DATA, "index.json"), "utf8"));
const details = JSON.parse(fs.readFileSync(path.join(DATA, "details.json"), "utf8"));
const manifest = { properties: {}, brand: {}, documents: {}, fonts: {}, errors: [] };

// Unique listings in first-seen order (latest first, then new homes).
const order = [];
const seen = new Set();
for (const it of index) if (it.link && !seen.has(it.link)) { seen.add(it.link); order.push(it); }

const GALLERY_COUNT = 48;   // listings that get a gallery + floorplan
const MAIN_W = 1280, MAIN_Q = 66, GAL_W = 960, GAL_Q = 60, FP_W = 1200, FP_Q = 66;

let n = 0;
for (const it of order) {
  const d = details[it.link] || {};
  const id = it.id;
  const dir = path.join(PUB, "images/properties", id);
  const rec = { id, link: it.link, images: [], floorplans: [] };
  const imgs = (d.images || []).map((x) => (Array.isArray(x) ? x[1] : x));
  const urls = imgs.length ? imgs : it.thumb ? [it.thumb.replace("/thumb/", "/main/")] : [];
  const wantGallery = n < GALLERY_COUNT;
  const take = wantGallery ? urls.slice(0, 5) : urls.slice(0, 1);
  for (let i = 0; i < take.length; i++) {
    try {
      const r = await saveJpg(take[i], path.join(dir, `${i}.jpg`), i === 0 ? MAIN_W : GAL_W, i === 0 ? MAIN_Q : GAL_Q);
      rec.images.push({ ...r, source: take[i], caption: Array.isArray(d.images?.[i]) ? d.images[i][0] : "" });
    } catch (e) { manifest.errors.push({ id, url: take[i], error: e.message }); }
  }
  if (wantGallery) {
    for (let i = 0; i < Math.min(2, (d.floorplans || []).length); i++) {
      try {
        const r = await saveJpg(d.floorplans[i], path.join(dir, `floorplan-${i}.jpg`), FP_W, FP_Q);
        rec.floorplans.push({ ...r, source: d.floorplans[i] });
      } catch (e) { manifest.errors.push({ id, url: d.floorplans[i], error: e.message }); }
    }
  }
  manifest.properties[id] = rec;
  n++;
  if (n % 10 === 0) { console.log("properties", n, "/", order.length); fs.writeFileSync(path.join(DATA, "assets.json"), JSON.stringify(manifest, null, 1)); }
}

// Brand + affiliation marks (as published on the client site).
const brand = {
  "logo.png": `${BASE}/templates/responsive-theme-one/images/logo.png`,
  "favicon.ico": `${BASE}/templates/responsive-theme-one/favicon.ico`,
  "banner_new.png": `${BASE}/templates/responsive-theme-one/images/banner_new.png`,
  "affiliations/rightmove.png": `${BASE}/modules/mod_eapow_affiliations/images/rightmove.png`,
  "affiliations/zoopla.png": `${BASE}/modules/mod_eapow_affiliations/images/zoopla.png`,
  "affiliations/tpo.png": `${BASE}/modules/mod_eapow_affiliations/images/tpo.png`,
  "affiliations/TSI-AC.png": `${BASE}/modules/mod_eapow_affiliations/images/TSI-AC.png`,
};
for (const [name, url] of Object.entries(brand)) {
  try {
    const out = path.join(PUB, "images/brand", name);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const buf = await fetchBuf(url);
    fs.writeFileSync(out, buf);
    let meta = {};
    try { meta = await sharp(buf).metadata(); } catch {}
    manifest.brand[name] = { source: url, bytes: buf.length, width: meta.width, height: meta.height, format: meta.format };
  } catch (e) { manifest.errors.push({ url, error: e.message }); }
}

// Policy documents (kept verbatim — never rewritten).
for (const [name, url] of Object.entries({ "privacy-policy.pdf": `${BASE}/images/pdfs/privacy-policy.pdf`, "complaints-procedure.pdf": `${BASE}/images/pdfs/complaints-procedure.pdf` })) {
  try {
    const out = path.join(PUB, "documents", name);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const buf = await fetchBuf(url);
    fs.writeFileSync(out, buf);
    manifest.documents[name] = { source: url, bytes: buf.length };
  } catch (e) { manifest.errors.push({ url, error: e.message }); }
}

// Switzer (Indian Type Foundry, distributed by Fontshare under the ITF Free Font Licence).
try {
  const css = await (await fetch("https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&display=swap", { headers: UA })).text();
  fs.mkdirSync(path.join(PUB, "fonts/switzer"), { recursive: true });
  fs.writeFileSync(path.join(PUB, "fonts/switzer/fontshare.css"), css);
  const faces = [...css.matchAll(/@font-face\s*{([^}]+)}/g)].map((m) => m[1]);
  for (const face of faces) {
    const weight = /font-weight:\s*(\d+)/.exec(face)?.[1];
    const style = /font-style:\s*(\w+)/.exec(face)?.[1] || "normal";
    const url = /url\(([^)]+\.woff2)\)/.exec(face)?.[1]?.replace(/["']/g, "");
    if (!url || !weight) continue;
    const name = `switzer-${weight}-${style}.woff2`;
    const buf = await fetchBuf(url);
    fs.writeFileSync(path.join(PUB, "fonts/switzer", name), buf);
    manifest.fonts[name] = { source: url, bytes: buf.length, weight, style };
  }
} catch (e) { manifest.errors.push({ url: "fontshare switzer", error: e.message }); }

fs.writeFileSync(path.join(DATA, "assets.json"), JSON.stringify(manifest, null, 1));
console.log("done. errors:", manifest.errors.length);
