/**
 * Reference capture — homy.framer.media
 *
 * Runs on a GitHub runner (see .github/workflows/nha-capture.yml). Produces,
 * under ../../reference/homy/:
 *   <page>-<viewport>.tN.jpg     full-page screenshots, tiled
 *   <page>-<viewport>.styles.txt computed styles per element
 *   <page>-<viewport>.text.txt   innerText
 *   motion.txt                   Web Animations API + sampled scroll/hover timings
 *   hover-*.jpg, anim-*.jpg, menu-m.jpg
 *
 * Reference material only — never shipped by the app.
 */
import { chromium } from "playwright";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const BASE = "https://homy.framer.media";
const OUT = path.resolve("../../reference/homy");
fs.mkdirSync(OUT, { recursive: true });

const log = (...a) => console.log(...a);

async function settle(page) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(1500);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h + 800; y += 400) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);
}

async function dumpStyles(page, name) {
  const lines = await page.evaluate(() => {
    const out = [];
    const seen = new Set();
    const els = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,a,button,input,select,textarea,[data-framer-name],img,video,li,span,svg")];
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.display === "none") continue;
      const t = el.tagName.toLowerCase();
      const n = el.getAttribute("data-framer-name") || "";
      if ((t === "span" || t === "div") && !n) continue;
      const txt = (t === "img" ? el.alt || "" : el.innerText || "").trim().replace(/\s+/g, " ").slice(0, 50);
      const rec = [t, n, txt, Math.round(r.x), Math.round(r.y + scrollY), Math.round(r.width), Math.round(r.height),
        cs.fontFamily.split(",")[0].replace(/"/g, ""), cs.fontSize, cs.fontWeight, cs.lineHeight, cs.letterSpacing,
        cs.color, cs.backgroundColor, cs.borderRadius, cs.padding, cs.borderTopWidth + " " + cs.borderTopStyle + " " + cs.borderTopColor,
        cs.textTransform, cs.opacity, cs.gap, cs.display, cs.boxShadow.slice(0, 80), cs.backgroundImage.slice(0, 60), cs.objectFit, cs.overflow, cs.position];
      if (t === "img") rec.push((el.currentSrc || el.src).slice(0, 120), el.naturalWidth + "x" + el.naturalHeight);
      const key = rec.slice(0, 7).join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(rec.join(" | "));
    }
    return out;
  });
  fs.writeFileSync(`${OUT}/${name}.styles.txt`, lines.join("\n"));
  const text = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync(`${OUT}/${name}.text.txt`, text);
  const doc = await page.evaluate(() => {
    const s = getComputedStyle(document.body);
    const vars = [...document.styleSheets].flatMap((ss) => { try { return [...ss.cssRules]; } catch { return []; } })
      .filter((r) => r.selectorText === ":root" || r.selectorText === "html" || r.selectorText === "body")
      .map((r) => r.cssText.slice(0, 2000)).join("\n");
    const fonts = [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.style} ${f.status}`);
    return { bg: s.backgroundColor, ff: s.fontFamily, c: s.color, h: document.documentElement.scrollHeight, vars, fonts: [...new Set(fonts)] };
  });
  fs.writeFileSync(`${OUT}/${name}.doc.txt`, JSON.stringify(doc, null, 1));
}

async function tile(pngPath, name, maxW, tileH, quality) {
  const img = sharp(pngPath);
  const meta = await img.metadata();
  const scale = Math.min(1, maxW / meta.width);
  const w = Math.round(meta.width * scale);
  const h = Math.round(meta.height * scale);
  const buf = await sharp(pngPath).resize(w, h).png().toBuffer();
  let i = 0;
  for (let y = 0; y < h; y += tileH) {
    const hh = Math.min(tileH, h - y);
    await sharp(buf).extract({ left: 0, top: y, width: w, height: hh }).jpeg({ quality, mozjpeg: true }).toFile(`${OUT}/${name}.t${i}.jpg`);
    i++;
  }
  fs.unlinkSync(pngPath);
  log(`${name}: ${w}x${h} -> ${i} tiles`);
}

async function jpg(pngPath, out, maxW = 1440, quality = 60) {
  await sharp(pngPath).resize({ width: maxW, withoutEnlargement: true }).jpeg({ quality, mozjpeg: true }).toFile(out);
  fs.unlinkSync(pngPath);
}

const probe = `(()=>{
  const seen=window.__seen||(window.__seen=new Set());const res=[];
  for(const a of document.getAnimations()){
    try{
      const el=a.effect&&a.effect.target; if(!el) continue;
      const t=a.effect.getTiming(); const kf=a.effect.getKeyframes().map(k=>{const o={};for(const p in k){if(['offset','computedOffset','easing','composite'].includes(p)){if(p==='offset'&&k[p]!=null)o.o=+(+k[p]).toFixed(2);if(p==='easing'&&k[p]!=='linear')o.e=k[p];}else o[p]=String(k[p]).slice(0,70)}return o});
      const name=el.getAttribute&&(el.getAttribute('data-framer-name')||'');const txt=(el.innerText||'').trim().replace(/\\s+/g,' ').slice(0,28);
      const key=el.tagName+'|'+name+'|'+txt+'|'+JSON.stringify(kf)+'|'+t.duration+'|'+t.delay;
      if(seen.has(key)) continue; seen.add(key);
      const r=el.getBoundingClientRect();
      res.push({tag:el.tagName.toLowerCase(),name,txt,y:Math.round(r.top+scrollY),w:Math.round(r.width),h:Math.round(r.height),dur:t.duration,delay:t.delay,ease:t.easing,iter:t.iterations,dir:t.direction,fill:t.fill,kf,ps:a.playState});
    }catch(e){}
  }
  return res;
})()`;

async function motion(browser) {
  const out = [];
  const mlog = (...a) => out.push(a.join(" "));
  const collect = async (page, label, ms, step = 80) => {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) {
      const r = await page.evaluate(probe);
      for (const x of r) mlog(`[${label} +${Date.now() - t0}ms]`, JSON.stringify(x));
      await page.waitForTimeout(step);
    }
  };
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "commit" });
  await collect(page, "LOAD", 5000, 60);
  await page.waitForLoadState("networkidle").catch(() => {});
  const css = await page.evaluate(() => {
    const ks = [], tr = [];
    for (const ss of document.styleSheets) {
      let rules; try { rules = [...ss.cssRules]; } catch { continue; }
      for (const r of rules) {
        if (r.type === 7) ks.push(r.cssText.slice(0, 500));
        else if (r.cssText && /transition|animation|will-change|scroll-snap|position:\s*sticky/.test(r.cssText) && r.cssText.length < 700) tr.push(r.cssText.slice(0, 500));
      }
    }
    return { ks, tr: tr.slice(0, 200) };
  });
  mlog("=== CSS KEYFRAMES"); css.ks.forEach((k) => mlog(k));
  mlog("=== CSS RULES w/ transition/animation/sticky"); css.tr.forEach((k) => mlog(k));
  const sticky = await page.evaluate(() => [...document.querySelectorAll("*")].filter((e) => { const cs = getComputedStyle(e); return cs.position === "sticky" || cs.position === "fixed"; }).map((e) => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return [e.tagName, e.getAttribute("data-framer-name") || "", cs.position, "top:" + cs.top, "z:" + cs.zIndex, Math.round(r.top + scrollY), Math.round(r.width) + "x" + Math.round(r.height)].join("|"); }));
  mlog("=== STICKY/FIXED"); sticky.forEach((s) => mlog(s));
  const trans = await page.evaluate(() => { const seen = new Set(); const o = []; for (const e of document.querySelectorAll("a,button,[data-framer-name],img")) { const cs = getComputedStyle(e); if (cs.transitionDuration === "0s" && cs.animationName === "none") continue; const k = [e.tagName, e.getAttribute("data-framer-name") || "", cs.transitionProperty, cs.transitionDuration, cs.transitionTimingFunction, cs.animationName, cs.animationDuration, cs.animationTimingFunction, cs.animationIterationCount].join("|"); if (seen.has(k)) continue; seen.add(k); o.push(k + "|" + (e.innerText || "").trim().slice(0, 25)); } return o; });
  mlog("=== ELEMENT TRANSITIONS (tag|name|prop|dur|ease|anim|animdur|animease|iter|text)"); trans.forEach((s) => mlog(s));
  const sections = await page.evaluate(() => [...document.querySelectorAll('section,[data-framer-name*="Section"]')].map((s) => ({ n: s.getAttribute("data-framer-name") || s.tagName, y: Math.round(s.getBoundingClientRect().top + scrollY), h: Math.round(s.getBoundingClientRect().height) })).filter((v, i, a) => a.findIndex((b) => b.y === v.y) === i));
  mlog("=== SECTIONS"); sections.forEach((s) => mlog(JSON.stringify(s)));
  for (const s of sections) {
    if (s.y < 300) continue;
    await page.evaluate((y) => window.scrollTo({ top: y - 500, behavior: "instant" }), s.y);
    await page.waitForTimeout(100);
    await page.evaluate((y) => window.scrollTo({ top: y - 200, behavior: "instant" }), s.y);
    await collect(page, "SCROLL:" + s.n, 2200, 100);
  }
  const sample = async (label, ys, sel) => { for (const y of ys) { await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y); await page.waitForTimeout(250); const r = await page.evaluate((sel) => [...document.querySelectorAll(sel)].slice(0, 10).map((e) => { const cs = getComputedStyle(e); const b = e.getBoundingClientRect(); return { n: e.getAttribute("data-framer-name") || e.tagName, t: (e.innerText || "").trim().slice(0, 12), op: cs.opacity, tf: cs.transform, f: cs.filter, cp: cs.clipPath, w: Math.round(b.width), h: Math.round(b.height), x: Math.round(b.left), top: Math.round(b.top), br: cs.borderRadius, c: cs.color }; }), sel); mlog(`[${label} y=${y}]`, JSON.stringify(r)); } };
  const find = (re, dflt) => sections.find((s) => re.test(s.n)) || { y: dflt };
  const about = find(/About/, 2180);
  await sample("ABOUT-CHARS", [about.y - 800, about.y - 400, about.y - 100, about.y + 200, about.y + 500, about.y + 800], '[data-framer-name="About Text Reveal"] span, [data-framer-name="Text Reveal ID"] span, [data-framer-name="About Text Reveal"] h2, [data-framer-name="About Text Reveal"] h3');
  const hl = find(/Highlighted/, 8459);
  await sample("STICKY-MASK", [hl.y, hl.y + 300, hl.y + 700, hl.y + 1100, hl.y + 1500, hl.y + 1900, hl.y + 2300], '[data-framer-name="Mask Layer"], [data-framer-name="Center Container"], [data-framer-name="Sticky Wrap"], [data-framer-name="Video Player"], [data-framer-name="Video Player"] video, [data-framer-name="Ticker Container"]');
  await sample("TICKER-WORDS", [hl.y + 500, hl.y + 900, hl.y + 1300, hl.y + 1700], '[data-framer-name="Scroll Line Word 1"], [data-framer-name="Scroll Line Word 2"]');
  const sig = find(/Featured Properties/, 3557);
  await sample("FEATURED-STACK", [sig.y - 300, sig.y + 300, sig.y + 900, sig.y + 1500, sig.y + 2100], '[data-framer-name="Property Card"], [data-framer-name="Property Card"] [data-framer-name="Featured"], [data-framer-name="Property Card"] img, [data-framer-name="Property Card"] [data-framer-name="Content Wrapper"]');
  const imp = find(/Impact/, 1445);
  await sample("IMPACT-CLOUDS", [imp.y - 600, imp.y - 300, imp.y, imp.y + 300], '[data-framer-name="Cloud Image"], [data-framer-name="Hero Smoke Image"], [data-framer-name="Home Image"], [data-framer-name="Home Image"] img');
  await page.evaluate((y) => window.scrollTo({ top: y - 300, behavior: "instant" }), imp.y);
  for (let i = 0; i < 8; i++) { await page.waitForTimeout(250); const t = await page.evaluate(() => [...document.querySelectorAll('[data-framer-name^="Stats Card"]')].map((e) => e.innerText.replace(/\s+/g, " ").slice(0, 30))); mlog("[COUNTER +" + (i * 250) + "ms]", JSON.stringify(t)); }
  const rev = find(/Review/, 11302);
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), rev.y); await page.waitForTimeout(500);
  const tick = async (sel) => { const a = await page.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; return new DOMMatrix(getComputedStyle(e).transform).m41; }, sel); await page.waitForTimeout(1000); const b = await page.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; return new DOMMatrix(getComputedStyle(e).transform).m41; }, sel); return [a, b]; };
  mlog("=== REVIEW TICKER px/s", JSON.stringify(await tick('[data-framer-name="Ticker Desktop"] > *')), JSON.stringify(await tick('[data-framer-name="Ticker"] > * > *')), JSON.stringify(await tick('[data-framer-name="Ticker Container"] > *')));
  const hover = async (label, sel) => { const el = page.locator(sel).first(); try { await el.scrollIntoViewIfNeeded(); const snap = () => el.evaluate((e) => { const cs = getComputedStyle(e); const kids = [...e.querySelectorAll("*")].slice(0, 8).map((k) => { const c = getComputedStyle(k); return [k.tagName, k.getAttribute("data-framer-name") || "", c.transform, c.opacity, c.backgroundColor, c.color, c.width].join("|"); }); return { tf: cs.transform, bg: cs.backgroundColor, c: cs.color, br: cs.borderRadius, bs: cs.boxShadow, op: cs.opacity, w: cs.width, kids }; }); const before = await snap(); await el.hover(); await page.waitForTimeout(60); await collect(page, "HOVER:" + label, 900, 150); const after = await snap(); mlog(`[HOVER ${label}] before=${JSON.stringify(before)}`); mlog(`[HOVER ${label}] after=${JSON.stringify(after)}`); await page.mouse.move(0, 0); await page.waitForTimeout(500); } catch (e) { mlog("hover fail", label, String(e).slice(0, 100)); } };
  await hover("nav-link", 'nav a[href*="properties"]');
  await hover("btn-black", 'a[data-framer-name="Main/Black"]');
  await hover("btn-outline", 'a[data-framer-name="Outline"]');
  await hover("btn-secondary", 'a[data-framer-name="Secondary"]');
  await hover("property-card", 'a[data-framer-name="Property card"]');
  await hover("featured-card", '[data-framer-name="Property Card"] [data-framer-name="Featured"]');
  await hover("service-2", '[data-framer-name="1-Desktop"] > div:nth-child(2)');
  await hover("testimonial", '[data-framer-name="Testimonial Card 1"]');
  await hover("footer-link", 'footer a, [data-framer-name="Footer"] a');
  try { const q = page.locator("text=Can I filter homes by budget & location?").first(); await q.scrollIntoViewIfNeeded(); await q.click(); await collect(page, "FAQ-CLICK", 1200, 100); const after = await page.evaluate(() => [...document.querySelectorAll('[data-framer-name="Answer"], [data-framer-name="Question"]')].slice(0, 6).map((e) => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return [e.getAttribute("data-framer-name"), Math.round(r.height), cs.opacity, cs.transform, cs.backgroundColor, cs.borderRadius, cs.borderTopColor].join("|"); })); mlog("[FAQ after]", JSON.stringify(after)); } catch (e) { mlog("faq fail", String(e).slice(0, 100)); }
  try { const s2 = page.locator("text=Rent a Home").first(); await s2.scrollIntoViewIfNeeded(); await s2.hover(); await collect(page, "SERVICE-HOVER", 1200, 100); await s2.click(); await collect(page, "SERVICE-CLICK", 1200, 100); } catch (e) { mlog("service fail", String(e).slice(0, 100)); }
  await ctx.close();
  // Mobile menu
  const m = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mp = await m.newPage();
  await mp.goto(BASE + "/", { waitUntil: "load" });
  await mp.waitForTimeout(1500);
  const names = await mp.evaluate(() => [...document.querySelectorAll("[data-framer-name]")].filter((e) => e.getBoundingClientRect().top < 100).map((e) => e.getAttribute("data-framer-name") + "@" + Math.round(e.getBoundingClientRect().left) + "," + Math.round(e.getBoundingClientRect().width)).filter((v, i, a) => a.indexOf(v) === i));
  mlog("=== MOBILE TOP NAMES", names.join(", "));
  try {
    const sels = ['[data-framer-name="Open"]', '[data-framer-name="Mobileclosed"] [data-framer-name="Open"]', '[data-framer-name="Mobileclosed"]', '[data-framer-name="Menu"]', '[data-framer-name="Hamburger"]', '[data-framer-name="Menu Icon"]', '[data-framer-name*="Burger"]', '[data-framer-name*="Toggle"]', '[data-framer-name*="Menu"]', 'nav [role="button"]', "nav svg", "header svg"];
    let clicked = false;
    for (const s of sels) { const b = mp.locator(s).first(); if (await b.count()) { try { await b.click({ timeout: 3000 }); clicked = s; break; } catch {} } }
    mlog("menu clicked via", clicked);
    const t0 = Date.now();
    while (Date.now() - t0 < 1500) { const r = await mp.evaluate(probe); for (const x of r) mlog(`[MENU +${Date.now() - t0}ms]`, JSON.stringify(x)); await mp.waitForTimeout(100); }
    await mp.screenshot({ path: `${OUT}/menu-m.png` });
    await jpg(`${OUT}/menu-m.png`, `${OUT}/menu-m.jpg`, 390, 60);
    const open = await mp.evaluate(() => [...document.querySelectorAll("[data-framer-name]")].filter((e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.height > 200 && (cs.position === "fixed" || cs.position === "absolute"); }).map((e) => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return [e.getAttribute("data-framer-name"), cs.position, cs.backgroundColor, cs.backdropFilter, Math.round(r.width) + "x" + Math.round(r.height)].join("|"); }));
    mlog("=== MENU OPEN LAYERS", open.join("\n"));
    const links = await mp.evaluate(() => [...document.querySelectorAll("a")].filter((a) => a.getBoundingClientRect().height > 20).map((a) => { const cs = getComputedStyle(a.querySelector("p,span,h1,h2,h3,h4") || a); const r = a.getBoundingClientRect(); return [a.innerText.trim().slice(0, 20), cs.fontFamily.split(",")[0], cs.fontSize, cs.fontWeight, cs.color, Math.round(r.left), Math.round(r.top), Math.round(r.height)].join("|"); }));
    mlog("=== MENU OPEN LINKS", links.join("\n"));
  } catch (e) { mlog("menu fail " + String(e).slice(0, 200)); }
  await m.close();
  fs.writeFileSync(`${OUT}/motion.txt`, out.join("\n"));
  log("motion.txt written", out.length, "lines");
}

const browser = await chromium.launch();
const jobs = [
  ["home-d", "/", 1440, 900], ["home-m", "/", 390, 844], ["home-t", "/", 768, 1024],
  ["props-d", "/properties", 1440, 900], ["props-m", "/properties", 390, 844],
  ["prop-d", "/properties/sky-high-condo", 1440, 900], ["prop-m", "/properties/sky-high-condo", 390, 844],
  ["about-d", "/about-us", 1440, 900], ["about-m", "/about-us", 390, 844],
  ["contact-d", "/contact-us", 1440, 900], ["contact-m", "/contact-us", 390, 844],
  ["privacy-d", "/privacy-policy", 1440, 900],
];
for (const [name, p, w, h] of jobs) {
  try {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(BASE + p, { waitUntil: "load", timeout: 60000 });
    await settle(page);
    await dumpStyles(page, name);
    await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
    if (name === "home-d") {
      try { await page.hover("text=Explore Homes"); await page.waitForTimeout(700); await page.screenshot({ path: `${OUT}/hover-btn.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } }); await jpg(`${OUT}/hover-btn.png`, `${OUT}/hover-btn.jpg`); } catch (e) { log("hover1", e.message); }
      try { const card = page.locator('a[data-framer-name="Property card"]').first(); await card.scrollIntoViewIfNeeded(); await card.hover(); await page.waitForTimeout(800); const b = await card.boundingBox(); await page.screenshot({ path: `${OUT}/hover-card.png`, clip: { x: Math.max(0, b.x - 40), y: Math.max(0, b.y - 40), width: Math.min(1440, b.width + 80), height: b.height + 80 } }); await jpg(`${OUT}/hover-card.png`, `${OUT}/hover-card.jpg`); } catch (e) { log("hover2", e.message); }
      try { const s = page.locator("text=Rent a Home").first(); await s.scrollIntoViewIfNeeded(); await s.hover(); await page.waitForTimeout(900); await page.screenshot({ path: `${OUT}/hover-service.png` }); await jpg(`${OUT}/hover-service.png`, `${OUT}/hover-service.jpg`); } catch (e) { log("hover3", e.message); }
      await page.evaluate(() => window.scrollTo(0, 1500)); await page.waitForTimeout(800);
      await page.screenshot({ path: `${OUT}/scrolled-nav.png`, clip: { x: 0, y: 0, width: 1440, height: 300 } }); await jpg(`${OUT}/scrolled-nav.png`, `${OUT}/scrolled-nav.jpg`);
      const p2 = await ctx.newPage(); await p2.goto(BASE + "/", { waitUntil: "commit" });
      for (const [i, wait] of [[0, 0], [1, 300], [2, 600], [3, 1200], [4, 2500]]) { await p2.waitForTimeout(wait); await p2.screenshot({ path: `${OUT}/anim-${i}.png` }); await jpg(`${OUT}/anim-${i}.png`, `${OUT}/anim-${i}.jpg`, 1100, 50); }
      await p2.evaluate(() => window.scrollTo(0, 2200));
      for (const [i, wait] of [[0, 0], [1, 200], [2, 600], [3, 1400]]) { await p2.waitForTimeout(wait); await p2.screenshot({ path: `${OUT}/scroll-${i}.png` }); await jpg(`${OUT}/scroll-${i}.png`, `${OUT}/scroll-${i}.jpg`, 1100, 50); }
      await p2.close();
    }
    await ctx.close();
    await tile(`${OUT}/${name}.png`, name, w >= 1440 ? 1440 : w, w >= 768 ? 1600 : 2000, 62);
  } catch (e) { log("FAILED", name, e.message); }
}
try { await motion(browser); } catch (e) { log("motion failed", e.stack); }
await browser.close();
