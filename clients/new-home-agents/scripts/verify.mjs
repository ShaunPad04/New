import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { ORIGIN, PORT, startServer, waitForServer, assertPortFree } from "./server.mjs";
import { audit, summarise, report } from "./lighthouse.mjs";

/**
 * THE GATE — is this preview shippable?
 *
 *   data integrity → typecheck → lint → production build
 *     → start ONE production server → poll for a real response
 *     → Playwright (axe, keyboard, responsive, journeys) at 390/768/1440
 *     → Lighthouse (3 samples) → teardown → confirm the port is free
 */
const results = [];
let failed = false;

function step(name, fn) {
  process.stdout.write(`\n▸ ${name}\n`);
  try {
    const ok = fn();
    results.push([name, ok ? "pass" : "fail"]);
    if (!ok) failed = true;
    return ok;
  } catch (err) {
    console.error(`  ${err.message}`);
    results.push([name, "fail"]);
    failed = true;
    return false;
  }
}
const run = (cmd, args) => spawnSync(cmd, args, { stdio: "inherit", env: process.env }).status === 0;

function checkData() {
  const p = join(process.cwd(), "src", "data", "properties.json");
  if (!existsSync(p)) { console.error("  src/data/properties.json is missing — run pnpm data:build"); return false; }
  const fonts = ["400", "500", "600", "700"].map((w) => join(process.cwd(), "public", "fonts", "switzer", `switzer-${w}-normal.woff2`));
  const missing = fonts.filter((f) => !existsSync(f));
  if (missing.length) { console.error(`  Missing font files: ${missing.join(", ")}`); return false; }
  if (process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true" && !process.env.ENQUIRY_WEBHOOK_URL) {
    console.error("  BLOCKER — indexable build without ENQUIRY_WEBHOOK_URL: forms would be dead on production.");
    return false;
  }
  console.log("  Dataset and fonts present.");
  return true;
}

async function main() {
  console.log("\n══ NEW HOME AGENTS — VERIFICATION GATE ══");
  step("Data & assets", checkData);
  if (!step("Production build", () => run("pnpm", ["build"]))) { console.error("\nBuild failed."); process.exit(1); }
  step("Typecheck", () => run("pnpm", ["typecheck"]));
  step("Lint", () => run("pnpm", ["lint"]));

  const server = startServer();
  try {
    process.stdout.write(`\n▸ Server readiness (${ORIGIN})\n`);
    const status = await waitForServer(ORIGIN);
    console.log(`  Responding with HTTP ${status}.`);
    results.push(["Server readiness", "pass"]);
    step("Playwright (axe, keyboard, responsive, journeys)", () => {
      process.env.VERIFY_OWNS_SERVER = "1";
      return run("pnpm", ["exec", "playwright", "test"]);
    });
    process.stdout.write("\n▸ Lighthouse (3 samples)\n");
    try {
      const runs = await audit(ORIGIN, 3);
      console.log(report(summarise(runs)));
      results.push(["Lighthouse", "pass"]);
    } catch (err) {
      console.error(`  ${err.message}`);
      results.push(["Lighthouse", "fail"]);
      failed = true;
    }
  } catch (err) {
    console.error(`\n  ${err.message}`);
    console.error(server.getLog().slice(-2000));
    results.push(["Server readiness", "fail"]);
    failed = true;
  } finally {
    server.stop("SIGTERM");
    let free = await assertPortFree(ORIGIN, { timeoutMs: 5000 });
    if (!free) { server.stop("SIGKILL"); free = await assertPortFree(ORIGIN, { timeoutMs: 5000 }); }
    console.log(free ? `\n▸ Port ${PORT} released.` : `\n▸ WARNING: port ${PORT} still responding after SIGKILL.`);
  }
  console.log("\n══ SUMMARY ══");
  for (const [name, state] of results) console.log(`  ${state === "pass" ? "PASS" : "FAIL"}  ${name}`);
  process.exit(failed ? 1 : 0);
}
main().catch((err) => { console.error(err); process.exit(1); });
