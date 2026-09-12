import { chromium } from "@playwright/test";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
function findChromium(){const root=process.env.PLAYWRIGHT_BROWSERS_PATH??"/opt/pw-browsers";for(const e of readdirSync(root)){if(!e.startsWith("chromium-"))continue;const c=join(root,e,"chrome-linux","chrome");if(existsSync(c))return c;}}
const throttle = process.argv[2] === "throttle";
const b = await chromium.launch({ executablePath: findChromium() });
const ctx = await b.newContext({ viewport: { width: 412, height: 823 } });
const p = await ctx.newPage();
if (throttle) {
  const cdp = await ctx.newCDPSession(p);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
}
await p.addInitScript(() => {
  window.__lcp = [];
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) window.__lcp.push({ t: Math.round(e.startTime), size: e.size, tag: e.element?.tagName, id: e.element?.id, text: (e.element?.textContent || "").trim().slice(0, 40) });
  }).observe({ type: "largest-contentful-paint", buffered: true });
});
await p.goto("http://127.0.0.1:3000/", { waitUntil: "load" });
await p.waitForTimeout(6000);
const r = await p.evaluate(() => ({
  lcp: window.__lcp,
  fcp: Math.round(performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? -1),
  transfer: performance.getEntriesByType("resource").filter(e => e.name.endsWith(".js") || e.name.includes("/_next/static/chunks")).reduce((a, e) => a + (e.transferSize || 0), 0),
  jsCount: performance.getEntriesByType("resource").filter(e => e.name.includes("/_next/static/chunks")).length,
  biggest: performance.getEntriesByType("resource").filter(e => e.transferSize > 20000).map(e => [e.name.split("/").pop().slice(0,40), Math.round(e.transferSize/1024)+"kB", Math.round(e.responseEnd)+"ms"]).sort((a,b)=>parseInt(b[1])-parseInt(a[1])).slice(0,10),
}));
console.log(throttle ? "4x CPU THROTTLE" : "UNTHROTTLED");
console.log(JSON.stringify(r, null, 1));
await b.close();
