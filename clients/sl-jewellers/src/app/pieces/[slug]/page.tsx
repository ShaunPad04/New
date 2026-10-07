import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BUSINESS, COLLECTIONS, SITE_URL, collectionBySlug } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";
import CategoryHeroGrid from "@/components/pages/CategoryHeroGrid";
import CategoryRows from "@/components/pages/CategoryRows";
import CategoryIndex from "@/components/pages/CategoryIndex";
import CategoryEmpty from "@/components/pages/CategoryEmpty";
import { splitTitle } from "@/components/shop/watch-data";
import { pieceHref } from "@/lib/piece-url";

/**
 * A page per category. It is written to stand on its own with no stock listed,
 * because there is no one retained to keep it fed: an empty `pieces` array is
 * the normal state, and the page reads as finished either way (the illustrated
 * cover and a note that the case changes daily). Listed pieces each go through to
 * their own product page (app/pieces/[slug]/[piece]). Three layouts on the
 * walk-through's switch until Shaun picks.
 */
export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = collectionBySlug(slug);
  if (!c) return {};
  const title = `${c.title} in Cleethorpes`;
  return {
    title,
    description: `${c.blurb} At S&L Jewellers, ${BUSINESS.address.street}, ${BUSINESS.address.town}.`,
    alternates: { canonical: `/pieces/${c.slug}` },
    openGraph: { title, description: c.blurb, url: `${SITE_URL}/pieces/${c.slug}`, ...(c.image ? { images: [{ url: c.image }] } : {}) },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = collectionBySlug(slug);
  if (!c) notFound();
  const pieces = c.pieces ?? [];
  const index = pieces.map((p) => ({ id: p.id, title: p.title, image: p.image, alt: p.alt, href: pieceHref(p), ...splitTitle(p.title) }));

  return (
    <section className="on-black section">
      {/* Round 7 of the walk-through (7 Oct 2026): three layouts on the preview switch, ?v=cat:b.
          Each sets its own h1; only the one showing is in the page's reading order. */}
      <div data-x="cat" data-x-dir="a">
        <CategoryHeroGrid c={c} />
      </div>
      <div data-x="cat" data-x-dir="b">
        <CategoryRows c={c} />
      </div>
      <div data-x="cat" data-x-dir="c">
        <div className="wrap">
          <Reveal className="cxc-head">
            <div>
              <p className="eyebrow">
                <Link href="/pieces" className="tap text-wall no-underline hover:text-paper">Shop all</Link>
              </p>
              <SplitHeading as="h1" text={`${c.title}.`} className="display-l mt-3" />
            </div>
            <p className="max-w-[42ch] text-wall">
              {c.blurb} {pieces.length > 0 && <span className="tnum">{pieces.length} in the case, every one priced on the counter.</span>}
            </p>
          </Reveal>
          {pieces.length > 0 ? <CategoryIndex pieces={index} /> : <CategoryEmpty c={c} />}
        </div>
      </div>

      <div className="wrap">
        <Link href="/pieces" className="backlink mt-14">
          <span className="backlink-disc" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="14" height="14">
              <path d="M12 8H4M7.5 4.5L4 8l3.5 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="backlink-word">All categories</span>
        </Link>
      </div>
    </section>
  );
}
