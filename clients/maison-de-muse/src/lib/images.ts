import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * IMAGE MANIFEST
 *
 * Photography is resolved at build time from `public/images/`. Each role
 * lists the file it expects; if the file is present the component renders
 * it with next/image, and if it is absent the component falls back to a
 * designed plate rather than a broken image. Dropping a correctly named
 * file into the folder upgrades the page with no code change.
 *
 * Every file here is the café's own photography from maisondemuse.co.uk,
 * which the client owns and has authorised for reuse. Nothing is hotlinked
 * from Instagram or Facebook, and no third-party stock is used.
 *
 * Alt text describes what is in the frame. Decorative uses pass alt="".
 */

export type ImageRole =
  | "hero"
  | "intro"
  | "story"
  | "coffee"
  | "brunch"
  | "evening"
  | "visit"
  | "og";

export type SiteImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

type Entry = { file: string; width: number; height: number; alt: string };

const ROLES: Record<ImageRole, Entry> = {
  hero: {
    file: "maison-de-muse-counter.jpg",
    width: 1920,
    height: 1080,
    alt: "The counter at Maison de Muse, Cleethorpes",
  },
  intro: {
    file: "maison-de-muse-interior.jpg",
    width: 1080,
    height: 1080,
    alt: "Inside Maison de Muse — tables, soft light and the coffee bar",
  },
  story: {
    file: "maison-de-muse-about.jpg",
    width: 1080,
    height: 1080,
    alt: "Maison de Muse on Sea View Street, Cleethorpes",
  },
  coffee: {
    file: "maison-de-muse-coffee.jpg",
    width: 1080,
    height: 1080,
    alt: "A coffee served at Maison de Muse",
  },
  brunch: {
    file: "maison-de-muse-brunch.jpg",
    width: 1080,
    height: 1080,
    alt: "A brunch plate at Maison de Muse",
  },
  evening: {
    file: "maison-de-muse-evening.jpg",
    width: 1080,
    height: 1080,
    alt: "Wine and boards at Maison de Muse in the evening",
  },
  visit: {
    file: "maison-de-muse-frontage.jpg",
    width: 1500,
    height: 1920,
    alt: "The frontage of Maison de Muse on Sea View Street",
  },
  og: {
    file: "maison-de-muse-about.jpg",
    width: 1080,
    height: 1080,
    alt: "Maison de Muse, Cleethorpes",
  },
};

/** Gallery images, in display order. Missing files are skipped. */
export const GALLERY: Entry[] = Array.from({ length: 16 }, (_, i) => ({
  file: `maison-de-muse-gallery-${String(i + 1).padStart(2, "0")}.jpg`,
  width: 1080,
  height: 1080,
  alt: "",
}));

/** Gallery alt text, by index. Blank entries are decorative. */
export const GALLERY_ALT: string[] = [];

function publicPath(file: string) {
  return join(process.cwd(), "public", "images", file);
}

export function resolveImage(role: ImageRole): SiteImage | null {
  const entry = ROLES[role];
  if (!existsSync(publicPath(entry.file))) return null;
  return {
    src: `/images/${entry.file}`,
    width: entry.width,
    height: entry.height,
    alt: entry.alt,
  };
}

export function resolveGallery(): SiteImage[] {
  const out: SiteImage[] = [];
  GALLERY.forEach((entry, i) => {
    if (!existsSync(publicPath(entry.file))) return;
    out.push({
      src: `/images/${entry.file}`,
      width: entry.width,
      height: entry.height,
      alt: GALLERY_ALT[i] ?? entry.alt,
    });
  });
  return out;
}
