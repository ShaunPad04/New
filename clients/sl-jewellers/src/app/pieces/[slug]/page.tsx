import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BUSINESS, COLLECTIONS, SITE_URL, collectionBySlug } from "@/lib/content";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";

/**
 * A page per category. It is written to stand on its own with no stock listed,
 * because there is no one retained to keep it fed: an empty `pieces` array is
 * the normal state, and the page reads as finished either way. If S&L do add
 * pieces to that category in content/collections.json, a grid appears above the
 * copy. Never a catalogue that quietly goes stale.
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
  const enquiry = (item?: string) => `/enquiry?type=buying&item=${encodeURIComponent(item ?? c.title)}`;

  return (
    <section className="on-black section" aria-labelledby="cat-title">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">
            <Link href="/pieces" className="tap text-wall no-underline hover:text-paper">
              Shop all
            </Link>
          </p>
          <SplitHeading as="h1" id="cat-title" text={`${c.title}.`} className="display-l mt-3" />
          <p className="mt-6 max-w-[46ch] text-wall">{c.blurb}</p>
          {pieces.length > 0 && (
            <p className="mt-3 max-w-[52ch] text-sm text-wall">
              {pieces.length} listed. Stock moves daily, so ask about a piece to check it is still in; there is no price online, every one is priced on the counter.
            </p>
          )}
        </Reveal>

        {pieces.length > 0 ? (
          <Reveal group as="ul" className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
            {pieces.map((pc) => (
              <li key={pc.id} className="card piece-card relative bg-graphite">
                <Link href={enquiry(pc.title)} className="block no-underline">
                  <div className="piece-media relative aspect-[4/5]">
                    <Image src={pc.image} alt={pc.alt} fill sizes="(min-width: 768px) 33vw, 50vw" className="object-cover" loading="lazy" />
                  </div>
                  <div className="caption p-4">
                    <h2 className="display-s">{pc.title}</h2>
                    {pc.note && <p className="mt-1 text-sm text-wall">{pc.note}</p>}
                    <p className="mt-2 text-sm font-semibold text-paper">Ask for a price →</p>
                  </div>
                </Link>
              </li>
            ))}
          </Reveal>
        ) : (
          <Reveal className="tray mt-10 max-w-[52ch] p-6">
            <p className="text-paper">The case changes daily.</p>
            <p className="mt-3 text-wall">
              Stock moves faster than a page does, so the surest way to know what is in today is to ask. Tell us what
              you are after and we will say what we have, or call the shop and we will look while you wait.
            </p>
          </Reveal>
        )}

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
