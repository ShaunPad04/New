import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
function findChromium(){const root=process.env.PLAYWRIGHT_BROWSERS_PATH??"/opt/pw-browsers";for(const e of readdirSync(root)){if(!e.startsWith("chromium-"))continue;const c=join(root,e,"chrome-linux","chrome");if(existsSync(c))return c;}}
const b = await chromium.launch({ executablePath: findChromium() });
for (const route of (process.argv[2] ?? "/").split(",")) {
  const W = Number(process.argv[3] ?? 1440);
  const ctx = await b.newContext({ viewport: { width: W, height: W < 700 ? 844 : 900 } });
  const p = await ctx.newPage();
  await p.goto(`http://127.0.0.1:3000${route}`, { waitUntil: "networkidle" });
  await p.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((n) => n.setAttribute("data-revealed", "")));
  await p.waitForTimeout(1300);
  const r = await new AxeBuilder({ page: p }).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]).analyze();
  for (const v of r.violations) {
    console.log(`\n${route} [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nodes)`);
    for (const n of v.nodes.slice(0, 4)) {
      console.log("  target:", n.target.join(" "));
      console.log("  html:", n.html.slice(0, 160));
      for (const c of [...n.any, ...n.all]) console.log("   ·", c.message.slice(0, 220));
    }
  }
  await ctx.close();
}
await b.close();
