import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BUSINESS, COLLECTIONS, SITE_URL, collectionBySlug } from "@/lib/content";
import CategoryHeroGrid from "@/components/pages/CategoryHeroGrid";

/**
 * A page per category. It is written to stand on its own with no stock listed,
 * because there is no one retained to keep it fed: an empty `pieces` array is
 * the normal state, and the page reads as finished either way (the illustrated
 * cover and a note that the case changes daily). Listed pieces each go through to
 * their own product page (app/pieces/[slug]/[piece]). The layout is "Hero and case" (Shaun's
 * pick A of three, 8 Oct 2026; CategoryHeroGrid.tsx): the name, its line and count, then the
 * pieces as product cards.
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

  return (
    <section className="on-black section">
      <CategoryHeroGrid c={c} />
      <div className="wrap">
        <Link href="/pieces" className="backlink mt-10">
          <span className="backlink-disc" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="14" height="14">
              <path d="M12 8H4M7.5 4.5L4 8l3.5 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="backlink-word">Shop all</span>
        </Link>
      </div>
    </section>
  );
}
