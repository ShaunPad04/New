#!/usr/bin/env node
/**
 * The hero's poster, rendered by the model itself (9 Oct 2026). The still in the first HTML has
 * to be the model's first frame, or the hand-over shows: the old poster was a render from the
 * previous site with other lights, and Brad saw the swap as the 3D "taking so long to load".
 *
 * Opens the home page of a running production build, lets HeroMark mount the model with its real
 * options (hardware WebGL is simulated so the gate in lib/webgl.ts lets it through), stops the
 * loop on the first frame (the idle turn eases in from a standstill and the haze rises only after
 * it, `fogIn`), and cuts the canvas at the poster's own box (.hmark-poster in globals.css), so the
 * cut and the CSS cannot disagree. Two cuts:
 *   wide  2000x1250 frame: the reflection, a 6:7 box from 16% down to the bottom of the hero
 *   tall   900x1800 frame: no reflection, the square box, fitted by width
 * Each is written as AVIF and WebP at the widths HeroMark.tsx lists, with alpha (the hero's black
 * shows through), to public/images/hero-mark.<stamp>-<cut>-<width>.<ext>; the full-size cuts go to
 * assets/hero-mark/ as masters.
 *
 *   pnpm build && pnpm start -p 3200 &
 *   node scripts/hero-poster.mjs http://localhost:3200 [stamp]
 *   ENCODE_ONLY=1 node scripts/hero-poster.mjs - [stamp]     re-encode from the masters only
 *
 * Needs Playwright with a Chromium (PLAYWRIGHT=<path to the playwright package>, CHROMIUM=<binary>)
 * and the sharp that ships with Next. Rerun it whenever the mark, its lights or HeroMark's options
 * change, and bump the stamp.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const sharpDir = fs.readdirSync(path.join(root, "node_modules/.pnpm")).find((d) => d.startsWith("sharp@"));
const sharp = require(path.join(root, "node_modules/.pnpm", sharpDir, "node_modules/sharp"));

const [, , base = "http://localhost:3200", stamp = "2026-10-09"] = process.argv;
// ENCODE_ONLY=1: re-encode the sizes from the masters in assets/hero-mark/ without rendering
const ENCODE_ONLY = !!process.env.ENCODE_ONLY;
/* Visually lossless, measured on the 1320 px wide cut against its master (9 Oct 2026): AVIF q50
   with full-resolution colour is 41.8 dB PSNR and no difference at 100% (q64 was 45 dB at 93 KB,
   q50 is 64 KB); WebP, the fallback for browsers without AVIF, at q80. */
const AVIF = { quality: 50, effort: 7, chromaSubsampling: "4:4:4" };
const WEBP = { quality: 80, alphaQuality: 85, effort: 6, smartSubsample: true };
const out = path.join(root, "public/images");
const CUTS = [
  { cut: "wide", viewport: { width: 2000, height: 1250 }, widths: [480, 720, 960, 1320, 1800] },
  { cut: "tall", viewport: { width: 900, height: 1800 }, widths: [480, 720, 1000, 1400] },
];

// hardware WebGL as far as lib/webgl.ts can tell, and a drawing buffer that can be read back
const INIT = `(() => {
  const g = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (t, o) {
    if (/webgl/.test(t)) { o = { ...(o || {}), preserveDrawingBuffer: true }; delete o.failIfMajorPerformanceCaveat; }
    return g.call(this, t, o);
  };
  for (const C of [WebGLRenderingContext, WebGL2RenderingContext]) {
    const gp = C.prototype.getParameter;
    C.prototype.getParameter = function (k) { return k === 0x9246 ? "Hardware GPU" : gp.call(this, k); };
  }
  // the first frame and nothing after it: once the stage goes live, no more frames are drawn
  new MutationObserver((_, mo) => {
    if (document.querySelector(".hmark-stage.is-live")) { window.requestAnimationFrame = () => 0; mo.disconnect(); }
  }).observe(document, { subtree: true, attributes: true, attributeFilter: ["class"] });
})();`;

const master = (cut) => path.join(root, "assets/hero-mark", `hero-mark.${stamp}-${cut}.png`);
const { chromium } = ENCODE_ONLY ? {} : require(process.env.PLAYWRIGHT || "playwright");
const browser = ENCODE_ONLY ? null : await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
for (const { cut, viewport, widths } of CUTS) {
  let cutBuf;
  if (ENCODE_ONLY) cutBuf = fs.readFileSync(master(cut));
  else {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2 });
    await ctx.addInitScript(INIT);
    const page = await ctx.newPage();
    await page.goto(base + "/", { waitUntil: "load" });
    await page.waitForSelector(".hmark-stage.is-live", { timeout: 120000 });
    await page.waitForTimeout(500);
    const shot = await page.evaluate(() => {
      const canvas = document.querySelector(".hmark-stage canvas");
      const img = document.querySelector(".hmark-poster");
      const c = canvas.getBoundingClientRect(), b = img.getBoundingClientRect();
      const k = canvas.width / c.width;
      return { png: canvas.toDataURL("image/png"), box: { x: (b.left - c.left) * k, y: (b.top - c.top) * k, w: b.width * k, h: b.height * k }, size: [canvas.width, canvas.height] };
    });
    await ctx.close();
    const png = Buffer.from(shot.png.split(",")[1], "base64");
    const { x, y, w, h } = shot.box;
    const [cw, ch] = shot.size;
    // the part of the box inside the canvas; anything outside it is transparent
    const left = Math.round(x), top = Math.round(y), W = Math.round(w), H = Math.round(h);
    const ex = { left: Math.max(0, left), top: Math.max(0, top) };
    ex.width = Math.min(cw, left + W) - ex.left;
    ex.height = Math.min(ch, top + H) - ex.top;
    cutBuf = await sharp(png).extract(ex)
      .extend({ left: ex.left - left, top: ex.top - top, right: left + W - (ex.left + ex.width), bottom: top + H - (ex.top + ex.height), background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png().toBuffer();
    // the full-size cut, kept out of public/ as the master for any future size
    fs.mkdirSync(path.dirname(master(cut)), { recursive: true });
    fs.writeFileSync(master(cut), cutBuf);
    console.log(cut, `canvas ${cw}x${ch}`, `cut ${W}x${H} at ${left},${top}`);
  }
  const { width: W, height: H } = await sharp(cutBuf).metadata();
  for (const wd of widths) {
    const ht = Math.round((wd * H) / W);
    const img = sharp(cutBuf).resize(wd, ht, { kernel: "lanczos3" });
    const a = await img.clone().avif(AVIF).toFile(path.join(out, `hero-mark.${stamp}-${cut}-${wd}.avif`));
    const b = await img.clone().webp(WEBP).toFile(path.join(out, `hero-mark.${stamp}-${cut}-${wd}.webp`));
    console.log(`  ${cut} ${wd}x${ht}  avif ${Math.round(a.size / 1024)} KB  webp ${Math.round(b.size / 1024)} KB`);
  }
}
await browser?.close();
