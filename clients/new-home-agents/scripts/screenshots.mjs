/**
 * Screenshot the running production server for visual review.
 *
 *   node scripts/screenshots.mjs <outDir> '[["name","/path",width,height,"scroll"|"full"], ...]'
 *
 * "scroll" mode takes viewport-sized frames every 0.8 viewport of scroll and
 * stacks them — the only honest way to review pages built on sticky
 * sections, which a single full-page capture cannot render.
 */
import { chromium } from "@playwright/test";
import { existsSync, readdirSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const root = process.env.PLAYWRIGHT_BROWSERS_PATH ?? "/opt/pw-browsers";
let executablePath;
for (const e of readdirSync(root)) { if (e.startsWith("chromium-")) { const c = join(root, e, "chrome-linux", "chrome"); if (existsSync(c)) executablePath = c; } }
const OUT = process.argv[2] ?? "screenshots";
mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const jobs = JSON.parse(process.argv[3] ?? '[["home-d","/",1440,900,"scroll"],["home-m","/",390,844,"scroll"]]');
const browser = await chromium.launch({ executablePath });

for (const [name, path, w, h, mode = "full"] of jobs) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: process.env.REDUCED ? "reduce" : "no-preference" });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push("pageerror " + e.message));
  page.on("response", (r) => { if (r.status() >= 400 && !r.url().includes("_rsc")) errors.push(`${r.status()} ${r.url()}`); });
  await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(800);
  if (mode === "scroll") {
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    const frames = [];
    const step = Math.round(h * 0.8);
    for (let y = 0; y < height; y += step) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
      await page.waitForTimeout(650);
      frames.push(await page.screenshot({ animations: "allow" }));
    }
    const perTile = 2;
    let t = 0;
    for (let i = 0; i < frames.length; i += perTile) {
      const group = frames.slice(i, i + perTile);
      const composite = group.map((buf, k) => ({ input: buf, top: k * h, left: 0 }));
      await sharp({ create: { width: w, height: h * group.length, channels: 3, background: "#fff" } }).composite(composite).jpeg({ quality: 60 }).toFile(`${OUT}/${name}.t${t++}.jpg`);
    }
    console.log(name, `scroll ${height}px → ${frames.length} frames / ${t} tiles`, errors.length ? "ERRORS: " + [...new Set(errors)].slice(0, 6).join(" | ") : "no console errors");
  } else {
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height + 800; y += 500) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(80); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1200);
    const png = `${OUT}/${name}.png`;
    await page.screenshot({ path: png, fullPage: true, animations: "disabled", timeout: 120000 });
    const meta = await sharp(png).metadata();
    const tileH = w >= 768 ? 1600 : 2000;
    let i = 0;
    for (let y = 0; y < meta.height; y += tileH) {
      await sharp(png).extract({ left: 0, top: y, width: meta.width, height: Math.min(tileH, meta.height - y) }).jpeg({ quality: 60 }).toFile(`${OUT}/${name}.t${i}.jpg`);
      i++;
    }
    console.log(name, meta.width, meta.height, i, "tiles", errors.length ? "ERRORS: " + [...new Set(errors)].slice(0, 6).join(" | ") : "no console errors");
  }
  await ctx.close();
}
await browser.close();
