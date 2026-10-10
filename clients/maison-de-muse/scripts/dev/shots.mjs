import { chromium } from "@playwright/test";
import { existsSync, readdirSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = "/tmp/claude-0/-home-user-New/7c2f0a29-9764-5a21-abd3-cc3998b90358/scratchpad/shots";
mkdirSync(OUT, { recursive: true });

function findChromium() {
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH ?? "/opt/pw-browsers";
  for (const entry of readdirSync(root)) {
    if (!entry.startsWith("chromium-")) continue;
    const candidate = join(root, entry, "chrome-linux", "chrome");
    if (existsSync(candidate)) return candidate;
  }
  return undefined;
}

const routes = (process.argv[2] ?? "/,/menu,/visit,/our-story,/reviews,/gallery").split(",");
const widths = (process.argv[3] ?? "390,1440").split(",").map(Number);
const full = process.argv[4] !== "viewport";
const reduced = process.argv[5] === "reduced";

const browser = await chromium.launch({
  executablePath: findChromium(),
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const errors = [];
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: width < 700 ? 844 : 900 } });
  if (reduced) await page.emulateMedia({ reducedMotion: "reduce" });
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") errors.push(`[${width}] ${m.type()}: ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`[${width}] pageerror: ${e.message}`));
  for (const route of routes) {
    await page.goto(`http://127.0.0.1:3000${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2500);
    // scroll through to trigger reveals
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);
    const name = `${route === "/" ? "home" : route.slice(1)}-${width}.png`;
    await page.screenshot({ path: join(OUT, name), fullPage: full });
    const info = await page.evaluate(() => ({
      canvas: document.querySelectorAll("canvas").length,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1: document.querySelector("h1")?.textContent?.trim(),
      height: document.body.scrollHeight,
    }));
    console.log(name, JSON.stringify(info));
  }
  await page.close();
}
await browser.close();
console.log("ERRORS", errors.length);
for (const e of errors) console.log(" ", e);
