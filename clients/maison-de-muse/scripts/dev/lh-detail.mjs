import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";
function findChromium(){const root=process.env.PLAYWRIGHT_BROWSERS_PATH??"/opt/pw-browsers";for(const e of readdirSync(root)){if(!e.startsWith("chromium-"))continue;const c=join(root,e,"chrome-linux","chrome");if(existsSync(c))return c;}}
const chrome = await chromeLauncher.launch({ chromePath: findChromium(), chromeFlags: ["--headless=new","--no-sandbox"] });
const r = await lighthouse("http://127.0.0.1:3000", { port: chrome.port, output: "json", logLevel: "error" });
const a = r.lhr.audits;
const show = (id) => {
  const x = a[id]; if (!x) return;
  console.log(`\n### ${id}: ${x.displayValue ?? x.score}`);
  const items = x.details?.items ?? [];
  for (const it of items.slice(0, 6)) console.log("  ", JSON.stringify(it).slice(0, 260));
};
console.log("LCP", a["largest-contentful-paint"].displayValue, "FCP", a["first-contentful-paint"].displayValue);
console.log("AUDIT KEYS:", Object.keys(a).filter(k => /lcp|largest|font|render.block|critical/i.test(k)).join(", "));
show("lcp-breakdown-insight");
show("lcp-discovery-insight");
show("render-blocking-insight");
show("font-display-insight");
await chrome.kill();
