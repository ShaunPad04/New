import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.VERIFY_PORT ?? 3000);
const ORIGIN = `http://127.0.0.1:${PORT}`;

/**
 * Resolve the preinstalled Chromium.
 *
 * This environment ships a pinned Playwright browser bundle, which may not be
 * the revision this @playwright/test version would fetch on its own. The
 * directory is versioned (chromium-1194/...), so it is discovered rather than
 * hard-coded. Returning undefined lets Playwright fall back to its default.
 */
function findChromium(): string | undefined {
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH ?? "/opt/pw-browsers";
  if (!existsSync(root)) return undefined;

  for (const entry of readdirSync(root)) {
    if (!entry.startsWith("chromium-")) continue;
    const candidate = join(root, entry, "chrome-linux", "chrome");
    if (existsSync(candidate)) return candidate;
  }
  return undefined;
}

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_PATH ?? findChromium();

/**
 * Server ownership is explicit.
 *
 * When scripts/verify.mjs runs the gate it starts and owns ONE production
 * server and sets VERIFY_OWNS_SERVER=1. Playwright must then reuse it and
 * must not tear it down, or the Lighthouse pass that runs next would audit a
 * dead port. Run standalone, Playwright starts its own server instead.
 */
const parentOwnsServer = process.env.VERIFY_OWNS_SERVER === "1";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"]],

  use: {
    baseURL: ORIGIN,
    trace: "retain-on-failure",
    // This environment preinstalls Chromium at a pinned revision that may not
    // match what this @playwright/test version would download. Point at the
    // existing binary rather than fetching another copy.
    launchOptions: executablePath ? { executablePath } : {},
  },

  projects: [
    {
      name: "mobile-390",
      use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } },
    },
    {
      name: "tablet-768",
      use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } },
    },
    {
      name: "desktop-1440",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],

  webServer: parentOwnsServer
    ? undefined
    : {
        command: `pnpm start --port ${PORT}`,
        url: ORIGIN,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
