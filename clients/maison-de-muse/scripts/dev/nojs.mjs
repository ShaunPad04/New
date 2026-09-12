import { chromium } from "@playwright/test";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
function findChromium(){const root=process.env.PLAYWRIGHT_BROWSERS_PATH??"/opt/pw-browsers";for(const e of readdirSync(root)){if(!e.startsWith("chromium-"))continue;const c=join(root,e,"chrome-linux","chrome");if(existsSync(c))return c;}}
const b = await chromium.launch({ executablePath: findChromium() });
const ctx = await b.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
for (const route of ["/", "/menu", "/visit"]) {
  const p = await ctx.newPage();
  await p.goto(`http://127.0.0.1:3000${route}`, { waitUntil: "domcontentloaded" });
  await p.waitForTimeout(2500);
  const info = await p.evaluate(() => {
    const hidden = [];
    document.querySelectorAll("h1,h2,h3,p,li,a").forEach((el) => {
      const cs = getComputedStyle(el);
      if (Number(cs.opacity) < 0.9 || cs.visibility === "hidden") {
        hidden.push(el.tagName + ": " + (el.textContent || "").trim().slice(0, 40));
      }
    });
    return {
      textLength: document.body.innerText.replace(/\s+/g, " ").trim().length,
      h1: document.querySelector("h1")?.textContent?.trim(),
      hiddenCount: hidden.length,
      hidden: hidden.slice(0, 5),
      links: document.querySelectorAll("a").length,
    };
  });
  console.log(route, JSON.stringify(info));
  await p.screenshot({ path: `/tmp/claude-0/-home-user-New/7c2f0a29-9764-5a21-abd3-cc3998b90358/scratchpad/shots/nojs-${route === "/" ? "home" : route.slice(1)}.png`, fullPage: true });
  await p.close();
}
await b.close();
