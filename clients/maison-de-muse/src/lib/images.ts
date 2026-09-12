import { existsSync } from "node:fs";
import { join } from "node:path";
import { SITE_INDEXABLE } from "@/lib/site";

/**
 * IMAGE MANIFEST
 *
 * Photography is resolved at build time from `public/images/`. Each role
 * lists the file it expects; if the file is present the component renders
 * it with next/image, and if it is absent the component falls back to a
 * designed plate rather than a broken image. Dropping a correctly named
 * file into the folder upgrades the page with no code change.
 *
 * Every named file here is the café's own photography from
 * maisondemuse.co.uk, which the client owns and has authorised for reuse.
 * Nothing is hotlinked from Instagram or Facebook.
 *
 * A role may additionally name a PLACEHOLDER under
 * `public/images/template-placeholder/`. Those are drink cutouts carried
 * over from the Beanro template and recoloured — artwork so the layout can
 * be reviewed, not photographs of this café. They resolve only on a
 * non-indexable build, always render with alt="" so they assert nothing,
 * and `npm run verify` fails if a build is marked indexable while one is
 * still standing in. The café's own file always wins when it is present.
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
  /** True when this is stand-in artwork, not the café's own photography. */
  placeholder?: boolean;
};

type Entry = {
  file: string;
  width: number;
  height: number;
  alt: string;
  /** Stand-in artwork, relative to `public/images/`. Never a claim. */
  placeholder?: { file: string; width: number; height: number };
};

/** Placeholder artwork stands in only while the build is not indexable. */
const PLACEHOLDERS_ALLOWED = !SITE_INDEXABLE;

const ICED_COFFEE_01 = {
  file: "template-placeholder/iced-coffee-01.webp",
  width: 560,
  height: 560,
};
const ICED_COFFEE_02 = {
  file: "template-placeholder/iced-coffee-02.webp",
  width: 560,
  height: 560,
};

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
    // Left plate of the closing CTA — decorative in the design already.
    placeholder: ICED_COFFEE_01,
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
    // Right plate of the same CTA. The stand-in is an iced coffee rather
    // than anything suggesting the wine list, which is not ours to depict.
    placeholder: ICED_COFFEE_02,
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
  if (existsSync(publicPath(entry.file))) {
    return {
      src: `/images/${entry.file}`,
      width: entry.width,
      height: entry.height,
      alt: entry.alt,
    };
  }

  const stand = entry.placeholder;
  if (!stand || !PLACEHOLDERS_ALLOWED || !existsSync(publicPath(stand.file))) {
    return null;
  }
  return {
    src: `/images/${stand.file}`,
    width: stand.width,
    height: stand.height,
    // Deliberately empty: this is not a photograph of this business, so it
    // describes nothing and is announced to nobody.
    alt: "",
    placeholder: true,
  };
}

/**
 * Roles currently being filled by stand-in artwork rather than the café's
 * own photography. `npm run verify` treats a non-empty list on an indexable
 * build as a blocker.
 */
export function placeholderRolesInUse(): ImageRole[] {
  return (Object.keys(ROLES) as ImageRole[]).filter((role) => {
    const entry = ROLES[role];
    if (existsSync(publicPath(entry.file))) return false;
    return Boolean(entry.placeholder && existsSync(publicPath(entry.placeholder.file)));
  });
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
