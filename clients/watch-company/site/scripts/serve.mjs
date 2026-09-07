/**
 * Local static server for `npm run dev` (serves static/) and
 * `npm run preview` (serves dist/). Node only — no dependencies.
 *
 * Directory URLs resolve to index.html so the multi-page routes behave the way
 * they do on Vercel.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dir = join(root, process.argv[2] === 'dist' ? 'dist' : 'static');
const port = Number(process.env.PORT) || 8000;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.png': 'image/png', '.webp': 'image/webp', '.mp4': 'video/mp4',
  '.ttf': 'font/ttf', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json',
};

createServer(async (req, res) => {
  try {
    const url = decodeURIComponent((req.url || '/').split('?')[0]);
    // normalize() collapses any ../ before it can escape the served directory
    let file = join(dir, normalize(url));
    if (!file.startsWith(dir)) { res.writeHead(403).end('Forbidden'); return; }
    const info = await stat(file).catch(() => null);
    if (info?.isDirectory() || url.endsWith('/')) file = join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
  }
}).listen(port, () => {
  console.log(`serving ${dir} on http://localhost:${port}`);
});
