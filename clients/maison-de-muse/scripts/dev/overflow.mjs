import { chromium } from "@playwright/test";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
function findChromium(){const root=process.env.PLAYWRIGHT_BROWSERS_PATH??"/opt/pw-browsers";for(const e of readdirSync(root)){if(!e.startsWith("chromium-"))continue;const c=join(root,e,"chrome-linux","chrome");if(existsSync(c))return c;}}
const browser = await chromium.launch({ executablePath: findChromium() });
for (const [route, width] of [["/",1440],["/",390],["/menu",390]]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(`http://127.0.0.1:3000${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const out = await page.evaluate(() => {
    const cw = document.documentElement.clientWidth;
    const bad = [];
    document.querySelectorAll("body *").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > cw + 1 || r.left < -1)) {
        const cs = getComputedStyle(el);
        if (cs.position === "fixed") return;
        let a = el.parentElement, clipped = false;
        while (a && a !== document.body) { const o = getComputedStyle(a); if (/(hidden|clip|auto|scroll)/.test(o.overflowX + o.overflow)) { clipped = true; break; } a = a.parentElement; }
        if (clipped) return;
        bad.push(`${el.tagName.toLowerCase()}.${[...el.classList].slice(0,4).join(".")} left=${Math.round(r.left)} right=${Math.round(r.right)}`);
      }
    });
    return { cw, sw: document.documentElement.scrollWidth, bad: bad.slice(0, 12) };
  });
  console.log(route, width, JSON.stringify(out, null, 1));
  await page.close();
}
await browser.close();
