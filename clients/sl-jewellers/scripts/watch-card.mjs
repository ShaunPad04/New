#!/usr/bin/env node
/**
 * Watch cards from transparent cut-outs (7 Oct 2026). For each <inDir>/<name>.png writes
 *   <outDir>/<name>.2026-10-07.jpg   1200x1500 card: the piece on plain near-black, a soft shadow
 *                                    under it and nothing else (Shaun: "why do the images have
 *                                    so much blur behind them" — the old grey lift and beam are gone)
 *   <outDir>/<name>.cut.2026-10-07.webp   the cut-out alone, transparent, for the product stage
 *
 *   node scripts/watch-card.mjs <inDir> <outDir>   every piece whole, inside the frame with a margin
 *   CARD_MODE=catalogue   a watch framed exactly like the GMT-Master II card (watches-05), the house
 *                         look for every watch since Shaun's "make it look exactly like the GMT
 *                         Master 2, with how much is shown" (7 Oct 2026): the case 618px wide with its
 *                         centre 714px down, the bracelet cut clean and straight 135px from the top and
 *                         1365px down, so it never reaches the edges
 * (CARD_MODE=watch matches case sizes and lets the bracelet run off the edges; Shaun turned that
 * down: "dont let them extend off the top and bottom").
 * Uses the sharp that ships with Next (node_modules/.pnpm/sharp@* /node_modules/sharp).
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const sharpDir = fs.readdirSync(path.join(root, "node_modules/.pnpm")).find((d) => d.startsWith("sharp@"));
const sharp = require(path.join(root, "node_modules/.pnpm", sharpDir, "node_modules/sharp"));

const [, , inDir, outDir, stamp = "2026-10-07"] = process.argv;
if (!inDir || !outDir) { console.error("usage: watch-card.mjs <inDir> <outDir> [stamp]"); process.exit(1); }
fs.mkdirSync(outDir, { recursive: true });
const W = 1200, H = 1500, BOX_W = Math.round(W * 0.72), BOX_H = Math.round(H * 0.82);

/** Rows where the piece is at least 85% of its widest: for a watch, the case. Its middle is
 *  where the card centres, so every head sits at the same height and size. */
async function headCentre(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true });
  const widths = new Array(info.height).fill(0), lefts = new Array(info.height).fill(0);
  for (let y = 0; y < info.height; y++) {
    let a = -1, b = -1;
    for (let x = 0; x < info.width; x++) if (data[y * info.width + x] > 40) { if (a < 0) a = x; b = x; }
    widths[y] = a < 0 ? 0 : b - a;
    lefts[y] = a;
  }
  const max = Math.max(...widths);
  const rows = widths.map((w, y) => (w >= max * 0.85 ? y : -1)).filter((y) => y >= 0);
  const x0 = Math.min(...rows.map((y) => lefts[y])), x1 = Math.max(...rows.map((y) => lefts[y] + widths[y]));
  return { y: rows.reduce((s, y) => s + y, 0) / rows.length, width: max, cx: (x0 + x1) / 2, height: info.height };
}

/** The stage cut-out: the whole window between the card's two cut lines, padded where a bracelet
 *  stops short so its case isn't scaled up to fill the stage, and centred left to right on the
 *  bracelet (the case's middle) rather than on its outline. A front and a back, whose crowns stick
 *  out on opposite sides, then line up when the product page turns one into the other. */
async function centredOnBracelet(buf, padTop = 0, padBottom = 0) {
  if (padTop || padBottom) buf = await sharp(buf).extend({ top: padTop, bottom: padBottom, left: 0, right: 0, background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const { data, info } = await sharp(buf).ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  let top = -1, bottom = -1, minX = W, maxX = -1;
  const mids = [];
  for (let y = 0; y < H; y++) {
    let a = -1, b = -1;
    for (let x = 0; x < W; x++) if (data[y * W + x] > 40) { if (a < 0) a = x; b = x; }
    if (a < 0) continue;
    if (top < 0) top = y;
    bottom = y; minX = Math.min(minX, a); maxX = Math.max(maxX, b);
    mids.push([y, (a + b) / 2]);
  }
  // the bracelet: the first tenth of the rows, above the case
  const band = mids.filter(([y]) => y < top + (bottom - top) * 0.1);
  const cx = Math.round(band.reduce((s, [, m]) => s + m, 0) / band.length);
  const half = Math.max(cx - minX, maxX - cx) + 2;
  // the full height of the window, not just the rows the piece reaches
  const canvas = await sharp({ create: { width: half * 2, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: await sharp(buf).extract({ left: Math.max(0, cx - half), top: 0, width: Math.min(W, cx + half) - Math.max(0, cx - half), height: H }).toBuffer(), left: Math.max(0, half - cx), top: 0 }])
    .png().toBuffer();
  return canvas;
}

// The GMT-Master II card's own measurements (1200x1500): every catalogue card copies them.
const CAT = { caseW: 618, caseCY: 714, top: 135, bottom: 1365 };

/** Fade the alpha over `px` rows at a straight cut, so the edge is clean but not jagged. */
async function featherCut(buf, cutTop, cutBottom, px = 3) {
  const m = await sharp(buf).metadata();
  const a = cutTop ? (px / m.height) * 100 : 0, b = cutBottom ? 100 - (px / m.height) * 100 : 100;
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${m.width}" height="${m.height}"><defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="${cutTop ? 0 : 1}"/><stop offset="${a}%" stop-color="#fff"/><stop offset="${b}%" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="${cutBottom ? 0 : 1}"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#f)"/></svg>`);
  return sharp(buf).ensureAlpha().composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
}

const mode = process.env.CARD_MODE || "piece"; // piece: the whole piece inside the frame (Shaun: nothing runs off the edges); watch: heads matched, bracelet bleeding off
for (const f of fs.readdirSync(inDir).filter((x) => x.endsWith(".png")).sort()) {
  const name = f.replace(/\.png$/, "");
  const cut = await sharp(path.join(inDir, f)).trim({ threshold: 4 }).toBuffer();
  let fit, left, top, stageCut = cut;
  if (mode === "catalogue") {
    // the case to the GMT's width and height on the card; the bracelet cut where the GMT's stops
    const h = await headCentre(cut);
    const cm = await sharp(cut).metadata();
    const scale = CAT.caseW / h.width;
    const ox = W / 2 - h.cx * scale, oy = CAT.caseCY - h.y * scale; // where the cut-out's 0,0 lands
    // the window, in the cut-out's own pixels, that falls between the two cut lines
    const sy = Math.max(0, Math.round((CAT.top - oy) / scale)), ey = Math.min(cm.height, Math.round((CAT.bottom - oy) / scale));
    const kept = await featherCut(await sharp(cut).extract({ left: 0, top: sy, width: cm.width, height: ey - sy }).toBuffer(), sy > 0, ey < cm.height, Math.max(2, Math.round(3 / scale)));
    // where the cut lines fall in the cut-out's own pixels, past its ends when the bracelet is short
    const wy0 = (CAT.top - oy) / scale, wy1 = (CAT.bottom - oy) / scale;
    stageCut = await centredOnBracelet(kept, Math.max(0, Math.round(sy - wy0)), Math.max(0, Math.round(wy1 - ey)));
    fit = await sharp(kept).resize({ width: Math.round(cm.width * scale) }).toBuffer();
    left = Math.round(ox);
    top = Math.round(oy + sy * scale);
    if (left < 0 || left + (await sharp(fit).metadata()).width > W) {
      const fm = await sharp(fit).metadata(), l = Math.max(0, -left);
      fit = await sharp(fit).extract({ left: l, top: 0, width: Math.min(fm.width - l, W - Math.max(0, left)), height: fm.height }).toBuffer();
      left = Math.max(0, left);
    }
  } else if (mode === "watch") {
    // the case is 62% of the card's width, centred; the bracelet runs off the top and bottom
    const h = await headCentre(cut);
    const scale = (W * 0.62) / h.width;
    const full = await sharp(cut).resize({ width: Math.round((await sharp(cut).metadata()).width * scale) }).toBuffer();
    const fm = await sharp(full).metadata();
    const cy = h.y * scale;
    const y0 = Math.round(cy - H / 2), y1 = y0 + H;
    const cropTop = Math.max(0, y0), cropBottom = Math.min(fm.height, y1);
    fit = await sharp(full).extract({ left: 0, top: cropTop, width: fm.width, height: cropBottom - cropTop }).toBuffer();
    left = Math.round((W - fm.width) / 2);
    top = cropTop - y0;
  } else {
    // a landscape piece (an assay card, a pair of cards) takes more of the width, or it sits small
    const cm = await sharp(cut).metadata();
    const boxW = cm.width > cm.height ? Math.round(W * 0.86) : BOX_W;
    fit = await sharp(cut).resize(boxW, BOX_H, { fit: "inside" }).toBuffer();
    const m0 = await sharp(fit).metadata();
    left = Math.round((W - m0.width) / 2);
    top = Math.round((H - m0.height) / 2);
  }
  const m = await sharp(fit).metadata();
  // a soft shadow: the cut-out's own alpha, darkened, blurred and dropped a little
  const shadow = await sharp(fit).ensureAlpha().extractChannel(3).linear(0.55, 0).blur(26).toBuffer();
  const shadowRGBA = await sharp({ create: { width: m.width, height: m.height, channels: 3, background: "#000" } })
    .joinChannel(shadow).png().toBuffer();
  // background: near-black with only the faintest rise of light in the middle
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><radialGradient id="g" cx="50%" cy="46%" r="70%"><stop offset="0" stop-color="#141416"/><stop offset="1" stop-color="#0a0a0b"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`);
  await sharp(bg).composite([{ input: shadowRGBA, left, top: Math.min(H - m.height, top + 18) }, { input: fit, left, top }])
    .jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(outDir, `${name}.${stamp}.jpg`));
  // the stage's cut-out: for a watch, the head and some bracelet (2.3x the case width tall)
  if (mode === "watch") {
    const h = await headCentre(cut);
    const span = Math.round(h.width * 2.3);
    const t = Math.max(0, Math.round(h.y - span / 2));
    stageCut = await sharp(cut).extract({ left: 0, top: t, width: (await sharp(cut).metadata()).width, height: Math.min(span, h.height - t) }).toBuffer();
  }
  await sharp(stageCut).resize({ height: 1500, withoutEnlargement: true }).webp({ quality: 88, alphaQuality: 90 })
    .toFile(path.join(outDir, `${name}.cut.${stamp}.webp`));
  console.log("card", name);
}
