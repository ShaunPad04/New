import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  ORIGIN,
  PORT,
  startServer,
  waitForServer,
  assertPortFree,
} from "./server.mjs";
import { audit, summarise, report } from "./lighthouse.mjs";

/**
 * THE GATE
 *
 * One command that answers: is this shippable?
 *
 *   content integrity → typecheck → lint → build
 *     → start ONE production server → poll for a real response
 *     → axe/responsive tests → Lighthouse (3 samples)
 *     → teardown in `finally` → confirm the port is free
 *
 * The server is started once and owned here. Playwright is told to reuse it
 * via VERIFY_OWNS_SERVER so it cannot tear the server down before the
 * Lighthouse pass runs against it.
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

function run(cmd, args) {
  const res = spawnSync(cmd, args, { stdio: "inherit", env: process.env });
  return res.status === 0;
}

/**
 * Content integrity gate.
 *
 * Nothing on this site is invented, so there are no placeholder flags to
 * flip. What CAN still be outstanding is client confirmation of items the
 * printed menu left ambiguous (each carries a `review:` note in
 * src/lib/menu.ts) and the live Google rating (GOOGLE_RATING_VERIFIED in
 * src/lib/reviews.ts). Neither renders anything unverified, so neither
 * blocks a build; they are listed so nobody forgets them before launch.
 */
function checkContentIntegrity() {
  const menu = readFileSync(join(process.cwd(), "src", "lib", "menu.ts"), "utf8");
  const reviews = readFileSync(join(process.cwd(), "src", "lib", "reviews.ts"), "utf8");
  const lib = ["site.ts", "content.ts", "menu.ts", "reviews.ts"].map((f) =>
    readFileSync(join(process.cwd(), "src", "lib", f), "utf8")
  );

  const indexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";
  const reviewNotes = (menu.match(/review:\s*$/gm) ?? []).length + (menu.match(/review:\s*"/g) ?? []).length;
  const googleVerified = /export const GOOGLE_RATING_VERIFIED = true/.test(reviews);
  const placeholders = lib.filter((src) => /\b(lorem ipsum|PLACEHOLDER_|\[Project name\]|Sample Client)\b/.test(src)).length;

  if (placeholders > 0) {
    console.error("  BLOCKER — placeholder content found in src/lib.");
    return false;
  }

  console.log(`  Menu items awaiting client confirmation: ${reviewNotes}`);
  console.log(`  Google rating verified: ${googleVerified ? "yes" : "no (not displayed)"}`);
  if (indexable) console.log("  Indexable build — confirm the items above with the client.");
  return true;
}

async function main() {
  console.log("\n══ MAISON DE MUSE — VERIFICATION GATE ══");

  step("Content integrity", checkContentIntegrity);
  step("Typecheck", () => run("pnpm", ["typecheck"]));
  step("Lint", () => run("pnpm", ["lint"]));

  if (!step("Production build", () => run("pnpm", ["build"]))) {
    console.error("\nBuild failed — nothing downstream can be measured.\n");
    process.exit(1);
  }

  const server = startServer();

  try {
    process.stdout.write(`\n▸ Server readiness (${ORIGIN})\n`);
    const status = await waitForServer(ORIGIN);
    console.log(`  Responding with HTTP ${status}.`);
    results.push(["Server readiness", "pass"]);

    step("Accessibility & responsive tests", () => {
      // Tell Playwright the server is already owned here, so it reuses it and
      // does not kill it before the Lighthouse pass below.
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
    // Teardown must happen even when an audit above threw, or the port stays
    // held and the next run fails for an unrelated-looking reason.
    server.stop("SIGTERM");
    let free = await assertPortFree(ORIGIN, { timeoutMs: 5000 });

    if (!free) {
      // A server that ignored SIGTERM would silently poison the next run,
      // which then fails for a reason that looks nothing like the cause.
      server.stop("SIGKILL");
      free = await assertPortFree(ORIGIN, { timeoutMs: 5000 });
    }

    console.log(
      free
        ? `\n▸ Port ${PORT} released.`
        : `\n▸ WARNING: port ${PORT} still responding after SIGKILL — another process owns it.`
    );
  }

  console.log("\n══ SUMMARY ══");
  for (const [name, state] of results) {
    console.log(`  ${state === "pass" ? "PASS" : "FAIL"}  ${name}`);
  }
  console.log("");

  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
