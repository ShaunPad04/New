import type { Metadata, ResolvingMetadata } from "next";
import { site } from "@/lib/content";

/**
 * A page's metadata, its share card included (2026-10-06).
 *
 * Until then every inner page set only a title, description and canonical,
 * so it inherited the root layout's `openGraph` and `twitter` whole: a link
 * to /pricing shared on WhatsApp or LinkedIn showed the HOMEPAGE's title and
 * description, and its og:url named the homepage. Each page now gives its own.
 *
 * Setting `openGraph` on a page replaces the parent's, image and all, and the
 * image comes from the root `opengraph-image.jpg` file convention, so it is
 * read from the resolved parent and carried over rather than named twice.
 * `title` goes through the root template ("Pricing — Black Line Agency"); the
 * share title is built the same way, since a template does not apply there.
 */
export async function pageMetadata(
  parent: ResolvingMetadata,
  { title, description, path }: { title: string; description: string; path: string },
): Promise<Metadata> {
  const resolved = await parent;
  const shareTitle = `${title} — ${site.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.name,
      url: path,
      title: shareTitle,
      description,
      images: resolved.openGraph?.images,
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: resolved.twitter?.images,
    },
  };
}
