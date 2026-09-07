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
import { cp, rm, mkdir, readdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, 'static');
const out = join(root, 'dist');

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
