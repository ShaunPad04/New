import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import SplitHeading from "@/components/motion/SplitHeading";

/**
 * Buying and selling, sourcing and made to order, repairs and soldering, as three tiles
 * (Shaun, 6 Oct 2026: after the Framer component "ServiceTiles", rebuilt here in S&L's
 * theme: no Framer runtime, hover in CSS). Each tile: a photo with its number, a dot and
 * category, the line, a sentence, tags, then a bar that fills with the tile's metal on
 * hover while the arrow turns. The accents are the three metals: yellow gold, white
 * silver, rose gold.
 *
 * The photos are AI-generated illustrations (Higgsfield, GPT Image 2.5), recorded in
 * assets/SOURCES.md. Since 6 Oct 2026 they are modern product shots modelled on the kinds
 * of piece S&L actually sells (Shaun: the first set "looked ancient"), but they are still
 * illustrations: no S&L stock, no customer, no logos. The words come from
 * content/offers.json and content/services.json, shortened, with nothing added.
 */
const TILES = [
  {
    href: "/enquiry?type=selling-gold",
    image: "/images/services/exchange.2026-10-06-2.webp",
    alt: "A heavy gold Cuban link chain with a gold diver's watch with a blue bezel lying across it, on black stone",
    category: "Buying and selling",
    title: "Buy it, sell it, swap it.",
    description: "Everything in the case is solid gold or solid silver. Sell to us, or swap what you own for something in the case, on the same counter.",
    tags: ["Gold", "Silver", "Watches", "Part-exchange"],
    detail: "Weighed and priced in front of you",
    cta: "Get a price",
    accent: "#c9ad74",
  },
  {
    href: "/enquiry?type=bespoke",
    image: "/images/services/sourcing.2026-10-06-2.webp",
    alt: "A steel sports watch with a black bezel on the cushion of an open black presentation box",
    category: "Sourcing and made to order",
    title: "Not in the case? We will find it.",
    description: "Tell us the piece, the metal and the size. If it does not exist yet, we can make it. We come back with what is possible and a price.",
    tags: ["Sourcing", "Made to order"],
    detail: "Bring a photo if you have one",
    cta: "Ask about a piece",
    accent: "#cfd2d8",
  },
  {
    href: "/enquiry?type=repair",
    image: "/images/services/repairs.2026-10-06-2.webp",
    alt: "A fine laser welder joining a link of an engraved gold belcher bracelet, sparks at the joint",
    category: "Repairs and soldering",
    title: "Broken? Bring it in.",
    description: "Repairs and soldering are done in the shop. Bring the piece in, or send a photo first, for a straight answer on what it needs and what it costs.",
    tags: ["Repairs", "Soldering"],
    detail: "Send a photo for a quote",
    cta: "Ask about a repair",
    accent: "#d4a189",
  },
];

const Arrow = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path d="M5 12H19M13 6L19 12L13 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ServiceTiles() {
  return (
    <section id="what-we-do" className="on-black section" aria-labelledby="tiles-title">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">What we do</p>
          <SplitHeading id="tiles-title" text={"Exchange, source,\n*repair.*"} className="display-l" />
        </Reveal>
        <ul className="st-grid">
          {TILES.map((t, i) => (
            <li key={t.href}>
              <Link href={t.href} className="st-card" style={{ "--st-accent": t.accent } as CSSProperties} aria-labelledby={`tile-${i}`}>
                <div className="st-media">
                  <Image src={t.image} alt={t.alt} fill sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw" className="st-image" />
                  <span className="st-number" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="st-body">
                  <p className="st-eyebrow">
                    <span className="st-dot" aria-hidden="true" />
                    {t.category}
                  </p>
                  <h3 id={`tile-${i}`} className="st-title">
                    {t.title}
                  </h3>
                  <p className="st-description">{t.description}</p>
                  <ul className="st-tags" aria-label="Covers">
                    {t.tags.map((g) => (
                      <li key={g} className="st-tag">
                        {g}
                      </li>
                    ))}
                  </ul>
                  <div className="st-footer">
                    <p className="st-detail">{t.detail}</p>
                    <span className="st-cta">
                      <span>{t.cta}</span>
                      <span className="st-arrow">
                        <Arrow />
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
