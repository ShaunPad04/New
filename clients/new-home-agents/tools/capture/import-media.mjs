/**
 * Pulls media the build environment cannot reach (generation CDNs, uploads)
 * into public/. Entries live in imports.json next to this file:
 *   [{ "url": "https://…", "out": "images/brand/consultant.jpg", "width": 1200, "quality": 84 }]
 * Runs only when the workflow is dispatched with `imports` in `what`.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const PUB = path.resolve(HERE, "../../public");
const list = JSON.parse(fs.readFileSync(path.join(HERE, "imports.json"), "utf8"));
for (const it of list) {
  const out = path.join(PUB, it.out);
  const r = await fetch(it.url, { redirect: "follow" });
  if (!r.ok) { console.log(`FAIL ${r.status} ${it.url}`); continue; }
  const buf = Buffer.from(await r.arrayBuffer());
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const info = await sharp(buf).rotate().resize({ width: it.width || 1600, withoutEnlargement: true }).jpeg({ quality: it.quality || 84, mozjpeg: true }).toFile(out);
  console.log(`ok ${it.out} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}kB`);
}
