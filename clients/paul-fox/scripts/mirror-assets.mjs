/**
 * Copy every remote asset into public/assets/ so the site can be served
 * without depending on paul-fox.com. Run from a machine that can reach it:
 *
 *   npm run mirror-assets
 *   NEXT_PUBLIC_ASSET_BASE=/assets/ npm run build
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));

// assets.ts is TypeScript; read it as text so this script needs no compiler.
const text = await readFile(path.join(here, "../src/lib/assets.ts"), "utf8");
const REMOTE = "https://www.paul-fox.com/wp-content/";
const BASES = {
  UPLOADS: `${REMOTE}uploads/`,
  THEME: `${REMOTE}themes/paulfoxestateagents/img/`,
};
const entries = [...text.matchAll(/"([^"]+)":\s*`\$\{(UPLOADS|THEME)\}([^`]+)`/g)].map(
  ([, name, base, rest]) => [name, BASES[base] + rest],
);

const outDir = path.join(here, "../public/assets");
await mkdir(outDir, { recursive: true });

let failed = 0;
for (const [name, url] of entries) {
  try {
    const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await writeFile(path.join(outDir, name), Buffer.from(await res.arrayBuffer()));
    console.log(`ok   ${name}`);
  } catch (err) {
    failed++;
    console.error(`FAIL ${name} <- ${url}: ${err.message}`);
  }
}
console.log(`\n${entries.length - failed}/${entries.length} mirrored to public/assets/`);
process.exit(failed ? 1 : 0);
