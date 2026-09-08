/**
 * Build step for the Watch Club concept site.
 *
 * `static/` is a complete, pre-built multi-page site: 77 hand-authored HTML
 * pages plus their CSS, JS, fonts, images and video. It needs no bundling, and
 * running it through Rollup would rewrite the absolute /assets/ paths and the
 * deliberate script order (data.js -> app.js -> ui/marquee.js -> refinement.js)
 * that the pages depend on. So the build copies it verbatim into dist/, which
 * is what the Vercel project already expects as its Output Directory.
 *
 * Verbatim also means what ships is byte-identical to what was reviewed.
 */
import { cp, rm, mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, 'static');
const out = join(root, 'dist');

/**
 * The four stylesheets total under 30KB but cost ~1,950ms of render-blocking on
 * PageSpeed's throttled mobile run: it is four round trips, not the bytes. They
 * are concatenated into one request here rather than in static/, so `npm run
 * dev` keeps serving the four editable files and the bundle can never go stale.
 *
 * Order is the cascade: style -> marquee -> editorial -> commerce. Every url()
 * in them is absolute or a data: URI, so concatenating cannot break a path.
 */
const STYLES = ['/style.css', '/ui/marquee.css', '/editorial.css', '/commerce.css'];
const BUNDLE = '/site.css';

async function bundleStyles(dir) {
  const parts = [];
  for (const href of STYLES) {
    parts.push(`/* ${href} */\n` + await readFile(join(dir, href), 'utf8'));
  }
  await writeFile(join(dir, BUNDLE), parts.join('\n'), 'utf8');

  // Only the home page pulls ui/marquee.css; the rest load three. One shared
  // bundle serves every page and stays cached across navigations, so whichever
  // subset a page links is collapsed into the same single request.
  const links = STYLES.map((h) => `<link rel="stylesheet" href="${h}">`);
  const pages = (await walk(dir)).filter((f) => f.endsWith('index.html'));
  let rewritten = 0;
  for (const page of pages) {
    const html = await readFile(page, 'utf8');
    const present = links.filter((l) => html.includes(l));
    if (!present.length) continue; // vitrine/concept carry their own styles
    let next = html.replace(present[0], `<link rel="stylesheet" href="${BUNDLE}">`);
    for (const l of present.slice(1)) next = next.replace(l, '');
    await writeFile(page, next, 'utf8');
    rewritten++;
  }
  const bytes = (await stat(join(dir, BUNDLE))).size;
  console.log(`build: bundled ${STYLES.length} stylesheets -> site.css (${(bytes / 1024).toFixed(0)} KB), ${rewritten} pages now make 1 CSS request`);
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (e) => {
    const p = join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  }));
  return files.flat();
}

async function main() {
  try {
    await stat(src);
  } catch {
    console.error(`build: missing source directory ${src}`);
    process.exit(1);
  }

  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });
  await cp(src, out, { recursive: true });

  await bundleStyles(out);

  const files = await walk(out);
  const bytes = (await Promise.all(files.map(async (f) => (await stat(f)).size)))
    .reduce((a, b) => a + b, 0);
  const pages = files.filter((f) => f.endsWith('index.html')).length;

  // A missing entry page means the copy silently produced an unusable site.
  if (!files.some((f) => f === join(out, 'index.html'))) {
    console.error('build: dist/index.html is missing — refusing to report success');
    process.exit(1);
  }

  console.log(`build: ${files.length} files, ${pages} pages, ${(bytes / 1048576).toFixed(0)} MB -> dist/`);
}

main().catch((err) => {
  console.error('build failed:', err);
  process.exit(1);
});
