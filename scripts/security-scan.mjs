/**
 * Security scan — dependency vulnerabilities and committed secrets.
 *
 * This exists because a claim on /pricing depends on it. The client wrote
 * copy saying every build is "scanned before launch, anything found is
 * fixed", and it was WITHHELD (see CLAUDE.md) on the grounds that no such
 * scan ran. A scan someone remembers to run by hand is not a scan; it is an
 * intention. This is the thing that makes the sentence true, and `pnpm
 * verify` runs it on every build.
 *
 * Two checks, both of which fail the build:
 *
 *   1. `pnpm audit` over production dependencies. Dev-only advisories are
 *      reported but do not fail: they cannot reach a visitor, and failing on
 *      them trains everybody to ignore the scan, which is worse than not
 *      having one.
 *
 *   2. A secret sweep over TRACKED files only. `git ls-files` rather than a
 *      directory walk, so node_modules, .next and anything gitignored are
 *      excluded by construction rather than by a list of exclusions someone
 *      has to maintain.
 *
 * The patterns are deliberately high-signal. A scanner that cries wolf gets
 * switched off, so this looks for provider-shaped keys with their real
 * prefixes and lengths, not for the word "password".
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const RED = "\x1b[31m", GREEN = "\x1b[32m", DIM = "\x1b[2m", OFF = "\x1b[0m";
let failed = false;

const SECRET_PATTERNS = [
  [/\bre_[A-Za-z0-9_-]{20,}/, "Resend API key"],
  [/\bsk-[A-Za-z0-9_-]{20,}/, "OpenAI-style secret key"],
  [/\bsk-ant-[A-Za-z0-9_-]{20,}/, "Anthropic API key"],
  [/\bAKIA[0-9A-Z]{16}\b/, "AWS access key id"],
  [/\bghp_[A-Za-z0-9]{36}\b/, "GitHub personal access token"],
  [/\bgithub_pat_[A-Za-z0-9_]{20,}/, "GitHub fine-grained token"],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}/, "Slack token"],
  [/-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/, "private key"],
  [/\bAIza[0-9A-Za-z_-]{35}\b/, "Google API key"],
  [/\bprj_live_[A-Za-z0-9]{20,}/, "live project key"],
];

/* The example file exists to SHOW the variable names, so a line like
   RESEND_API_KEY="" is the point of it. Only files that should never hold a
   real credential are skipped, and only where the value is empty. */
const ALLOW_EMPTY_ASSIGNMENT = /=\s*""\s*$/;

function scanSecrets() {
  const files = execFileSync("git", ["ls-files"], { encoding: "utf8" })
    .split("\n")
    .filter(Boolean)
    .filter((f) => !/\.(png|jpe?g|webp|gif|ico|woff2?|mp4|webm|pdf)$/i.test(f));

  const hits = [];
  for (const file of files) {
    let text;
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    text.split("\n").forEach((line, i) => {
      if (ALLOW_EMPTY_ASSIGNMENT.test(line)) return;
      for (const [pattern, label] of SECRET_PATTERNS) {
        if (pattern.test(line)) hits.push(`${file}:${i + 1}  ${label}`);
      }
    });
  }
  return hits;
}

console.log(`${DIM}Secret sweep over tracked files${OFF}`);
const hits = scanSecrets();
if (hits.length) {
  failed = true;
  console.log(`${RED}  FAIL — ${hits.length} possible secret(s):${OFF}`);
  for (const h of hits) console.log(`    ${h}`);
} else {
  console.log(`${GREEN}  PASS — no credential-shaped strings committed${OFF}`);
}

console.log(`${DIM}Dependency audit (production)${OFF}`);
try {
  execFileSync("pnpm", ["audit", "--prod"], { encoding: "utf8", stdio: "pipe" });
  console.log(`${GREEN}  PASS — no known vulnerabilities in production deps${OFF}`);
} catch (error) {
  failed = true;
  console.log(`${RED}  FAIL — production dependencies have known advisories:${OFF}`);
  console.log(String(error.stdout || error.message).split("\n").slice(0, 40).join("\n"));
}

console.log(`${DIM}Dependency audit (dev — reported, does not fail)${OFF}`);
try {
  execFileSync("pnpm", ["audit", "--dev"], { encoding: "utf8", stdio: "pipe" });
  console.log(`${GREEN}  PASS — no known vulnerabilities in dev deps${OFF}`);
} catch (error) {
  console.log(`  NOTE — dev-only advisories present, not shipped to visitors:`);
  console.log(String(error.stdout || error.message).split("\n").slice(0, 20).join("\n"));
}

process.exit(failed ? 1 : 0);
