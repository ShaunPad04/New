#!/usr/bin/env node
/**
 * Product card renderer. Takes transparent PNG cut-outs and places each one on the
 * house background: near-black, a grey lift behind the piece, a soft beam from the top
 * left and twelve small gold stars. Deterministic per file name, so re-running gives
 * the same card.
 *
 *   node scripts/product-card.mjs <inDir of .png> <outDir>
 *
 * Needs Playwright with Chrome (the toolkit in ~/.local/webdev-toolkit has it):
 *   NODE_PATH=~/.local/webdev-toolkit/node_modules node scripts/product-card.mjs assets/source/cutouts /tmp/cards
 * Output is 1200x1500 JPEG. Change the CSS block to change the look for every piece.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
const [, , inDir, outDir] = process.argv;
if (!inDir || !outDir) { console.error("usage: product-card.mjs <inDir> <outDir>"); process.exit(1); }
fs.mkdirSync(outDir, { recursive: true });
const files = fs.readdirSync(inDir).filter((f) => f.endsWith(".png")).sort();
function starsFor(seedIn) {
  let seed = seedIn * 7919 + 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const stars = []; let guard = 0;
  while (stars.length < 12 && guard++ < 500) {
    const x = 6 + rnd() * 88, y = 5 + rnd() * 90;
    const dx = x - 50, dy = (y - 50) * 0.8;
    if (Math.sqrt(dx * dx + dy * dy) < 30) continue;
    if (stars.some((s) => Math.hypot(s.x - x, s.y - y) < 14)) continue;
    stars.push({ x, y, s: 10 + rnd() * 22, a: 0.45 + rnd() * 0.45, r: rnd() * 30 - 15 });
  }
  return stars.map((st) => `<div class="star" style="left:${st.x.toFixed(1)}%;top:${st.y.toFixed(1)}%;--s:${st.s.toFixed(0)}px;--a:${st.a.toFixed(2)};--r:${st.r.toFixed(0)}deg"><i></i></div>`).join("");
}
const css = `<style>body{margin:0;background:#000}
.card{position:relative;width:1200px;height:1500px;overflow:hidden;background:#0a0a0b}
.lift{position:absolute;inset:0;background:radial-gradient(ellipse 52% 44% at 50% 50%,rgba(255,255,255,.20) 0%,rgba(255,255,255,.09) 40%,rgba(255,255,255,.03) 65%,rgba(0,0,0,0) 82%)}
.beam{position:absolute;inset:-20%;background:linear-gradient(118deg,rgba(255,255,255,0) 28%,rgba(255,252,240,.05) 38%,rgba(255,250,230,.12) 46%,rgba(255,252,240,.05) 54%,rgba(255,255,255,0) 64%);filter:blur(28px)}
.source{position:absolute;inset:0;background:radial-gradient(ellipse 55% 28% at 22% -4%,rgba(255,255,255,.16) 0%,rgba(255,255,255,0) 70%)}
.star{position:absolute;width:var(--s);height:var(--s);transform:translate(-50%,-50%) rotate(var(--r));opacity:var(--a)}
.star::before,.star::after{content:"";position:absolute;left:50%;top:50%;background:linear-gradient(90deg,rgba(201,166,72,0),#f4e3a1 50%,rgba(201,166,72,0))}
.star::before{width:100%;height:1.5px;transform:translate(-50%,-50%)}
.star::after{width:1.5px;height:100%;transform:translate(-50%,-50%)}
.star i{position:absolute;left:50%;top:50%;width:28%;height:28%;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,#fff8dc 0%,#f4e3a1 30%,rgba(201,166,72,0) 70%)}
.floor{position:absolute;left:50%;top:50%;width:76%;height:60%;transform:translate(-50%,-28%);background:radial-gradient(ellipse at center,rgba(255,255,255,.07) 0%,rgba(0,0,0,0) 70%)}
.subject{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);max-width:78%;max-height:78%;filter:drop-shadow(0 30px 50px rgba(0,0,0,.75))}
.vignette{position:absolute;inset:0;background:radial-gradient(ellipse 90% 80% at 50% 50%,rgba(0,0,0,0) 62%,rgba(0,0,0,.55) 100%)}</style>`;
const b = await chromium.launch({ channel: "chrome" });
const page = await b.newPage({ viewport: { width: 1200, height: 1500 } });
let n = 0;
for (const f of files) {
  const seed = [...f].reduce((a, c) => a + c.charCodeAt(0), 0);
  const png = fs.readFileSync(path.join(inDir, f)).toString("base64");
  await page.setContent(`${css}<div class="card"><div class="beam"></div><div class="source"></div>${starsFor(seed)}<div class="lift"></div><div class="floor"></div><img class="subject" src="data:image/png;base64,${png}"><div class="vignette"></div></div>`);
  await page.waitForTimeout(120);
  await page.screenshot({ path: path.join(outDir, f.replace(/\.png$/, ".jpg")), type: "jpeg", quality: 90 });
  n++;
}
await b.close();
console.log("rendered", n, "cards to", outDir);
