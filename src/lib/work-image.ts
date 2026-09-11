import { existsSync, openSync, readSync, closeSync, statSync } from "node:fs";
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
 *
 * It also refuses a file that arrived incomplete. The first B Boutique
 * screenshot was a 26,866-byte progressive JPEG with no EOI marker anywhere in
 * it — the upload had been cut off. A browser renders a truncated progressive
 * JPEG perfectly happily, as whichever low-frequency scans made it through, so
 * the failure looks exactly like a soft, badly compressed picture rather than
 * like a broken file. That cost an afternoon of hunting for a compression
 * setting that did not exist, so the check is now in the build: a half-arrived
 * upload renders the designed plate, which is honest, instead of a smear,
 * which is not.
 */
const EXTENSIONS = ["avif", "webp", "jpg", "jpeg", "png"] as const;

/** Cheapest possible completeness check: does the container's tail marker exist? */
function looksComplete(abs: string, ext: string): boolean {
  // Only JPEG and PNG carry a trailing marker we can check without decoding.
  // AVIF and WebP are box formats — a length-prefixed truncation is not
  // detectable this cheaply, so they are taken on trust.
  const tail = ext === "png" ? Buffer.from("IEND\xae\x42\x60\x82", "binary") : null;
  const isJpeg = ext === "jpg" || ext === "jpeg";
  if (!tail && !isJpeg) return true;

  const want = tail ? tail.length : 2;
  const size = statSync(abs).size;
  if (size < want) return false;

  const buf = Buffer.alloc(want);
  const fd = openSync(abs, "r");
  try {
    readSync(fd, buf, 0, want, size - want);
  } finally {
    closeSync(fd);
  }

  // JPEG ends FF D9 (EOI); PNG ends with the IEND chunk.
  return tail ? buf.equals(tail) : buf[0] === 0xff && buf[1] === 0xd9;
}

export function resolveWorkImage(id: string): string | null {
  return resolvePublicImage(`/images/work/${id}`);
}

/**
 * Founder portraits (redesign, 2026-09-11): drop
 * `public/images/founders/<slug>.{avif,webp,jpg,png}` in — slug is the name
 * lowercased and hyphenated (bradley-hoxha, shaun-padley) — and the studio
 * section picks it up on the next build with no code change. Until then a
 * designed placeholder slot renders, clearly labelled.
 */
export function resolveFounderImage(name: string): string | null {
  const slug = name.toLowerCase().replace(/[^a-z]+/g, "-");
  return resolvePublicImage(`/images/founders/${slug}`);
}

/**
 * Service preview images (redesign, 2026-09-11): the monochrome editorial
 * stills behind the homepage's hover reveal, at
 * `public/images/services/<id>.{avif,webp,jpg,png}`. Missing files simply
 * mean no preview for that row — nothing breaks.
 */
export function resolveServiceImage(id: string): string | null {
  return resolvePublicImage(`/images/services/${id}`);
}

/**
 * Work preview videos (redesign, 2026-09-11): drop
 * `public/videos/work/<id>.webm` and/or `.mp4` in and the card gains a
 * muted looping hover/in-view preview with no code change. Both formats are
 * returned when both exist (webm first — smaller where supported). Keep them
 * short and under ~5MB, per the studio media rules.
 */
export function resolveWorkVideo(id: string): string[] {
  const sources: string[] = [];
  for (const ext of ["webm", "mp4"] as const) {
    const rel = `/videos/work/${id}.${ext}`;
    if (existsSync(join(process.cwd(), "public", rel))) sources.push(rel);
  }
  return sources;
}

function resolvePublicImage(relBase: string): string | null {
  for (const ext of EXTENSIONS) {
    const rel = `${relBase}.${ext}`;
    const abs = join(process.cwd(), "public", rel);
    if (!existsSync(abs)) continue;

    if (!looksComplete(abs, ext)) {
      // Loud, because a silent fallback here looks like "the screenshot was
      // never added" and sends someone looking in the wrong place.
      console.warn(
        `[work-image] ${rel} is truncated — the file is incomplete, not merely low quality. Re-export and re-upload it. Falling back to the designed plate.`,
      );
      return null;
    }
    return rel;
  }
  return null;
}
