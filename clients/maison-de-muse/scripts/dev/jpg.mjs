import { chromium } from "@playwright/test";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
function findChromium(){const root=process.env.PLAYWRIGHT_BROWSERS_PATH??"/opt/pw-browsers";for(const e of readdirSync(root)){if(!e.startsWith("chromium-"))continue;const c=join(root,e,"chrome-linux","chrome");if(existsSync(c))return c;}}
const OUT = "/tmp/claude-0/-home-user-New/7c2f0a29-9764-5a21-abd3-cc3998b90358/scratchpad/shots";
const b = await chromium.launch({ executablePath: findChromium() });
for (const [route, W] of [["/",1440],["/",390],["/menu",1440],["/menu",390],["/our-story",1440],["/reviews",1440],["/gallery",1440]]) {
  const ctx = await b.newContext({ viewport: { width: W, height: W < 700 ? 844 : 900 }, reducedMotion: "reduce", deviceScaleFactor: W < 700 ? 1 : 0.75 });
  const p = await ctx.newPage();
  await p.goto(`http://127.0.0.1:3000${route}`, { waitUntil: "networkidle" });
  await p.waitForTimeout(2000);
  const name = `${route === "/" ? "home" : route.slice(1).replace(/\//g,"-")}-${W}.jpg`;
  await p.screenshot({ path: join(OUT, name), fullPage: true, type: "jpeg", quality: 62 });
  console.log(name);
  await ctx.close();
}
await b.close();
