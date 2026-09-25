/**
 * IndexNow — tell Bing (and through it ChatGPT search and Copilot) that the
 * site changed, on every PRODUCTION deploy.
 *
 * Why this exists: Google finds pages through the sitemap and its own crawl
 * schedule, and there is no way to push to it. Bing, Yandex, Seznam and
 * Naver accept IndexNow, a direct "these URLs changed" notice, and Bing's
 * index is what ChatGPT search and Copilot answer from. For a studio selling
 * GEO, that is the one search engine we can notify directly.
 *
 * It runs after `next build` (see the build script in package.json) and
 * does nothing unless VERCEL_ENV is "production", so local builds, previews
 * and `pnpm verify` never send anything. It can never fail a build: every
 * path exits 0, and the request has a ten-second timeout. A notice that
 * does not go out costs a day of Bing's crawl schedule; a failed deploy
 * costs the site.
 *
 * The URL list is read from the sitemap the build just produced, so the two
 * cannot disagree: add a page to sitemap.ts and it is notified here too.
 *
 * THE KEY IS PUBLIC BY DESIGN. IndexNow proves ownership by fetching
 * https://<host>/<key>.txt and checking it holds the key, so the file lives
 * in public/ and anyone can read it. It is not a secret and grants nothing
 * beyond submitting URLs on this host. To rotate it, replace both the file
 * and the constant below.
 */
import { existsSync, readFileSync } from "node:fs";

const HOST = "blacklineagency.co.uk";
const KEY = "de3e62284f91cbb1dcfe2ae5ca29a365";
const SITEMAP = ".next/server/app/sitemap.xml.body";
const ENDPOINT = "https://api.indexnow.org/indexnow";

function done(message) {
  console.log(`[indexnow] ${message}`);
  process.exit(0);
}

if (process.env.VERCEL_ENV !== "production") {
  done("skipped: not a Vercel production build");
}

const keyFile = `public/${KEY}.txt`;
if (!existsSync(keyFile) || readFileSync(keyFile, "utf8").trim() !== KEY) {
  done(`skipped: ${keyFile} is missing or does not hold the key`);
}

if (!existsSync(SITEMAP)) done(`skipped: no built sitemap at ${SITEMAP}`);

const urlList = [...readFileSync(SITEMAP, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].trim())
  .filter((url) => new URL(url).hostname === HOST);

if (urlList.length === 0) done("skipped: the sitemap lists no URLs on the host");

try {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  /* 200 = accepted; 202 = accepted, key check pending (normal on the first
     deploy, before the key file is live). Anything else is logged, never
     thrown. */
  done(`${res.status} for ${urlList.length} URLs`);
} catch (error) {
  done(`not sent: ${error instanceof Error ? error.message : String(error)}`);
}
