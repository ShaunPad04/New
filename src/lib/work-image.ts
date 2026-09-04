import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Resolve a project's cover image at build time.
 *
 * The file may not exist yet — B Boutique's site is on another Vercel team and
 * behind a preview URL, so its screenshot has to be supplied by hand. Rather
 * than point <Image> at a path that 404s and render a broken tile, this
 * returns null and the card falls back to a designed plate.
 *
 * Drop `public/images/work/<id>.{avif,webp,jpg,png}` in and it is picked up on
 * the next build with no code change.
 */
const EXTENSIONS = ["avif", "webp", "jpg", "jpeg", "png"] as const;

export function resolveWorkImage(id: string): string | null {
  for (const ext of EXTENSIONS) {
    const rel = `/images/work/${id}.${ext}`;
    if (existsSync(join(process.cwd(), "public", rel))) return rel;
  }
  return null;
}
