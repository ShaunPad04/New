import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
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
 * No copy on this site is invented. What CAN still be outstanding is
 * client confirmation of items the printed menu left ambiguous (each
 * carries a `review:` note in src/lib/menu.ts), the live Google rating
 * (GOOGLE_RATING_VERIFIED in src/lib/reviews.ts), and the café's own
 * photography. None of those renders an unverified claim, so on a preview
 * build they are listed rather than enforced.
 *
 * On an INDEXABLE build the photography is different in kind. The two
 * drink cutouts under public/images/template-placeholder/ are artwork
 * carried over from the Beanro template — not photographs of this café —
 * and they stand in only while the real files are missing. Shipping them
 * to a public, indexed build would show visitors imagery of a business
 * that is not this one, so that combination is a hard blocker.
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

  const standingIn = placeholderImagesStandingIn();

  console.log(`  Menu items awaiting client confirmation: ${reviewNotes}`);
  console.log(`  Google rating verified: ${googleVerified ? "yes" : "no (not displayed)"}`);
  console.log(
    standingIn.length === 0
      ? "  Photography: no template placeholders standing in."
      : `  Photography: ${standingIn.length} template placeholder(s) standing in — ${standingIn.join(", ")}`
  );

  if (indexable && standingIn.length > 0) {
    console.error(
      "  BLOCKER — this build is marked indexable while template placeholder"
    );
    console.error(
      "  imagery is still standing in. Those cutouts are not photographs of"
    );
    console.error(
      "  Maison de Muse. Add the café's own files to public/images/ (see its"
    );
    console.error("  README) or unset NEXT_PUBLIC_SITE_INDEXABLE.");
    return false;
  }

  if (indexable) console.log("  Indexable build — confirm the items above with the client.");
  return true;
}

/**
 * Placeholder files that would actually render — present on disk, and with
 * no real photograph named in src/lib/images.ts already covering the role.
 */
function placeholderImagesStandingIn() {
  const dir = join(process.cwd(), "public", "images", "template-placeholder");
  if (!existsSync(dir)) return [];

  const images = readFileSync(join(process.cwd(), "src", "lib", "images.ts"), "utf8");
  const present = readdirSync(dir).filter((f) => !f.endsWith(".md"));

  return present.filter((file) => {
    // The role's own photograph, if it exists, always wins — then the
    // placeholder is inert whatever the flags say.
    const ref = `template-placeholder/${file}`;
    if (!images.includes(ref)) return false;
    const role = roleFileFor(images, ref);
    return !(role && existsSync(join(process.cwd(), "public", "images", role)));
  });
}

/** The real filename of the role a given placeholder backs, if any. */
function roleFileFor(images, ref) {
  // `const ICED_COFFEE_01 = { file: "template-placeholder/…" }` gives the
  // constant; the role that uses it names its own photograph immediately
  // above the `placeholder:` line, so the last `file:` before that wins.
  const constant = images.match(new RegExp(`const (\\w+) = \\{\\s*file: "${ref}"`))?.[1];
  if (!constant) return null;

  const before = images.split(`placeholder: ${constant},`)[0];
  const files = before.match(/file: "([^"]+)"/g);
  if (!files) return null;

  return files[files.length - 1].slice('file: "'.length, -1);
}


async function main() {
  console.log("\n══ MAISON DE MUSE — VERIFICATION GATE ══");

  step("Content integrity", checkContentIntegrity);
  step("Typecheck", () => run("npm", ["run", "typecheck"]));
  step("Lint", () => run("npm", ["run", "lint"]));

  if (!step("Production build", () => run("npm", ["run", "build"]))) {
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
      return run("npm", ["exec", "--", "playwright", "test"]);
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
