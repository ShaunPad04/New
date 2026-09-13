/**
 * Diagnostic: does the listing media host serve anything larger than the
 * 800–1024px files linked from newhomeagents.co.uk? File names such as
 * "…HiRes-2000x1125.jpg" suggest the uploads were larger. Tries a handful
 * of sibling folders for the first few hero-pick images and logs status +
 * dimensions. Log only — nothing is written to the repo.
 */
import fs from "node:fs";
import sharp from "sharp";

const manifest = JSON.parse(fs.readFileSync(new URL("../../src/data/scrape/assets.json", import.meta.url), "utf8"));
const props = manifest.properties || manifest;
const ids = ["12719927", "12750504", "12728779", "12724715", "12907453", "12728769"];
const folders = ["main", "large", "xlarge", "original", "full", "hires", "big", "photos", "images", ""];

for (const id of ids) {
  const im = props[id]?.images?.[0];
  if (!im?.source) continue;
  console.log(`\n${id}  linked: ${im.sourceWidth}x${im.sourceHeight}  ${im.source}`);
  for (const f of folders) {
    const url = f ? im.source.replace("/main/", `/${f}/`) : im.source.replace("/main/", "/");
    if (url === im.source && f !== "main") continue;
    try {
      const r = await fetch(url, { redirect: "follow" });
      if (!r.ok) { console.log(`  ${f.padEnd(9)} ${r.status}`); continue; }
      const buf = Buffer.from(await r.arrayBuffer());
      const meta = await sharp(buf).metadata();
      console.log(`  ${f.padEnd(9)} 200  ${meta.width}x${meta.height}  ${(buf.length / 1024).toFixed(0)}kB`);
    } catch (e) {
      console.log(`  ${f.padEnd(9)} error ${e.message}`);
    }
  }
}
