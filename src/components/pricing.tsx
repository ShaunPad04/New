"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  projectTiersShared,
  site,
  type Tier,
} from "@/lib/content";
import { Cta } from "@/components/cta";
import { cn } from "@/lib/utils";

/**
 * PRICING — the tier deck, and the homepage's pricing section.
 *
 * The deck is shared by every priced band on the site: the build tiers on
 * the homepage, /web-design-grimsby and /services/web-design, and on
 * /pricing the builds, the monthly plans and the creative plans. One card
 * anatomy for all of them is the point (restructure, 2026-09-25): the page
 * used to render a price four different ways, and a reader had to relearn
 * how to find the number in every band.
 *
 * THE CARD ANATOMY, top to bottom, is fixed: name and audience, price and
 * delivery, summary, the call to action, then what is included. From `lg`
 * every card is a CSS subgrid over five shared row tracks, so the names, the
 * prices, the summaries, the buttons and the lists each sit on ONE line
 * across the row whatever the copy length. Before this the summaries ran
 * three to five lines and pushed £1,399, £2,500, £4,450 and £6,000 to four
 * different heights, which is most of what read as untidy.
 *
 * The button sits ABOVE the list, as premium pricing pages set it, so the
 * four calls to action line up too and nobody reads twelve bullets to find
 * the button.
 *
 * Prices are GBP with NO VAT CHARGED — the studio is not VAT registered and
 * is below the £90,000 threshold. The label read "excluding VAT" until
 * 2026-09-24, which is a different and misleading statement: it tells a buyer
 * VAT is coming on top when none ever will, a misleading price indication
 * under the CPUTR 2008. `legal.ts` carries the same wording. The figures stay
 * flagged `PRICING_CONFIRMED = false` until the client signs them off.
 */

const formatter = new Intl.NumberFormat("en-GB");

/** Rows each card occupies on the shared subgrid. Keep in step with TierCard. */
const CARD_ROWS = "lg:row-span-5";

/* The homepage / service-page pricing section is now the Nocta "flexible
   plans" layout (Brad, 2026-09-26) — see pricing-plans.tsx. SharedIncludes
   and TierDeck below are still used by the /pricing rate card. */
export { PricingPlans as Pricing } from "@/components/pricing-plans";

/**
 * What every build includes, said once above the cards instead of on each
 * one. Carries the currency line too, so the deck has a single header row.
 */
export function SharedIncludes({
  label = "Every build includes",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 border-y border-ink-300 py-5 lg:flex-row lg:items-center lg:gap-10",
        className,
      )}
    >
      <p className="field-label shrink-0 text-ink-600">{label}</p>
      {/* Three equal columns from `lg`, not a wrapping row: wrapped, the
          third item fell onto a line of its own and read as an afterthought. */}
      <ul className="flex flex-col gap-3 lg:grid lg:flex-1 lg:grid-cols-3 lg:gap-x-8">
        {projectTiersShared.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-sm leading-snug text-ink-900"
          >
            <Check className="mt-px bg-white/[0.08] text-ink-1000" />
            {item}
          </li>
        ))}
      </ul>
      <p className="field-label shrink-0 text-ink-600 lg:ml-auto">
        {site.currencySymbol} GBP — no VAT charged
      </p>
    </div>
  );
}

/**
 * The deck.
 *
 * From `lg` a grid — two by two at `lg` when there are four cards, one row
 * from `xl`; three across from `lg` when there are three. Each card spans
 * five row tracks as a subgrid, so the rows align across the whole deck.
 *
 * Below `lg` a native scroll-snap carousel: one card at a time with the next
 * peeking, which is shorter than a stack and the right shape for comparing
 * options. No drag handler and no library — the browser already throws a
 * scroll container with the right physics. It opens on the featured card,
 * the one the desktop row draws the eye to.
 */
export function TierDeck({
  tiers,
  cta = "Enquire",
}: {
  tiers: readonly Tier[];
  cta?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    let best = 0;
    let bestDelta = Infinity;
    cards.forEach((card, i) => {
      const delta = Math.abs(card.offsetLeft - track.scrollLeft);
      if (delta < bestDelta) {
        bestDelta = delta;
        best = i;
      }
    });
    setActive(best);
  }, []);

  /* `scrollWidth > clientWidth` is the test for "the carousel is live". At
     `lg` the track is a grid and does not scroll, so this is a no-op there
     without duplicating the breakpoint in JavaScript. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const featured = Math.max(0, tiers.findIndex((t) => t.featured));
    const card = track.children[featured] as HTMLElement | undefined;
    const scrollable = track.scrollWidth > track.clientWidth;
    track.scrollTo({ left: scrollable && card ? card.offsetLeft : 0, behavior: "auto" });
    setActive(scrollable ? featured : 0);
  }, [tiers]);

  const go = (i: number) => {
    const track = trackRef.current;
    const card = track?.children[i] as HTMLElement | undefined;
    if (!track || !card) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({ left: card.offsetLeft, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <>
      <div
        ref={trackRef}
        onScroll={sync}
        className={cn(
          "no-scrollbar -mx-6 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-6 px-6 sm:-mx-10 sm:scroll-px-10 sm:px-10",
          /* Row gap is ZERO on purpose and each card carries `lg:mb-6`
             instead: a row gap would also open between the five tracks
             inside every card. */
          "lg:mx-0 lg:grid lg:gap-x-6 lg:gap-y-0 lg:overflow-visible lg:px-0",
          tiers.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2 xl:grid-cols-4",
        )}
      >
        {tiers.map((tier) => (
          <div
            key={tier.id}
            // 82% leaves a deliberate sliver of the next card in frame.
            className={cn(
              "w-[82%] shrink-0 snap-start sm:w-[60%] lg:mb-6 lg:grid lg:w-auto lg:shrink lg:grid-rows-subgrid",
              CARD_ROWS,
            )}
          >
            <TierCard tier={tier} cta={cta} />
          </div>
        ))}
      </div>

      {/* Position indicator: buttons, so tapping one works and there is a
          keyboard route through the track. Desktop has no carousel. */}
      <div className="mt-6 flex items-center justify-center gap-2.5 lg:hidden">
        {tiers.map((tier, i) => (
          <button
            key={tier.id}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show ${tier.name}`}
            aria-current={i === active}
            className="group flex h-11 w-8 items-center justify-center"
          >
            <span
              aria-hidden="true"
              className={cn(
                "block h-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                i === active
                  ? "w-7 bg-ink-1000"
                  : "w-1.5 bg-white/25 group-hover:bg-white/50",
              )}
            />
          </button>
        ))}
      </div>
    </>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
        className,
      )}
    >
      <svg viewBox="0 0 16 16" width="10" height="10" fill="none">
        <path
          d="M3 8.4 6.2 11.6 13 4.8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function TierCard({ tier, cta }: { tier: Tier; cta: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const featured = Boolean(tier.featured);
  /* Top-of-range treatment: a lighter tray, a foil name and a lit top edge.
     Mutually exclusive with `featured`, which owns the inverted plate. */
  const elevated = Boolean(tier.elevated) && !featured;

  /* "Everything in Signature" is not a feature, it is where the list starts.
     Set as the list's lead-in rather than as a tick among the rest. */
  const [first, ...rest] = tier.includes;
  const inherits = first?.startsWith("Everything in ") ? first : null;
  const items = inherits ? rest : tier.includes;

  const muted = featured ? "text-ink-0/75" : "text-ink-600";

  /* Pointer position written straight onto the element: a pointer stream
     re-rendering React on every move would cost far more than the sheen. */
  const track = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", `${e.clientX - r.left}px`);
    el.style.setProperty("--py", `${e.clientY - r.top}px`);
    el.style.setProperty("--po", "1");
  };
  const clear = () => ref.current?.style.setProperty("--po", "0");

  const row = "relative";

  return (
    <div
      ref={ref}
      onPointerMove={track}
      onPointerLeave={clear}
      className={cn(
        "bezel group relative h-full transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 motion-reduce:hover:translate-y-0",
        "lg:grid lg:grid-rows-subgrid",
        CARD_ROWS,
        featured && "bg-white/[0.07]",
        elevated && "bg-white/[0.05]",
      )}
    >
      <article
        aria-label={tier.name}
        className={cn(
          "relative flex h-full flex-col overflow-hidden p-7 lg:grid lg:grid-rows-subgrid lg:gap-0 lg:p-9",
          CARD_ROWS,
          featured ? "bezel-core-invert" : "bezel-core",
          elevated &&
            "bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0)_42%)]",
        )}
      >
        {elevated ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)]"
          />
        ) : null}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[var(--po,0)] transition-opacity duration-500 motion-reduce:hidden"
          style={{
            background: featured
              ? "radial-gradient(320px circle at var(--px,50%) var(--py,50%), rgba(0,0,0,0.16), transparent 70%)"
              : "radial-gradient(320px circle at var(--px,50%) var(--py,50%), rgba(255,255,255,0.07), transparent 70%)",
          }}
        />

        {/* 1 — name and audience */}
        <header className={row}>
          <h3 className={cn("display text-2xl leading-none", elevated && "foil")}>
            {tier.name}
          </h3>
          {tier.meta ? (
            <p className={cn("field-label mt-3", featured ? "!text-ink-0/75" : "text-ink-600")}>
              {tier.meta}
            </p>
          ) : null}
        </header>

        {/* 2 — the figure, and the window it buys */}
        <div className={cn(row, "mt-8")}>
          <p className="flex items-baseline gap-1.5">
            {tier.cadence === "project" ? (
              <span className={cn("text-sm", muted)}>from</span>
            ) : null}
            <span className="display text-4xl tabular-nums lg:text-[2.75rem]">
              {site.currencySymbol}
              {formatter.format(tier.price)}
            </span>
            {tier.cadence === "month" ? (
              <span className={cn("text-sm", muted)}>/month</span>
            ) : null}
          </p>
          {/* "Live in … once we have your content" — the conditional is
              load-bearing and travels with the figure. */}
          {tier.delivery ? (
            <p className={cn("mt-3 max-w-[30ch] text-[0.8125rem] leading-relaxed", muted)}>
              {tier.delivery}
            </p>
          ) : null}
        </div>

        {/* 3 — what it is. Always rendered, even empty, so the row count
            holds and the tracks below stay aligned with the other cards. */}
        <p
          className={cn(
            row,
            "max-w-[36ch] text-sm leading-relaxed",
            tier.summary ? "mt-6" : "hidden lg:block",
            featured ? "text-ink-0/80" : "text-ink-700",
          )}
        >
          {tier.summary}
        </p>

        {/* 4 — the action, level across the row */}
        <div className={cn(row, "mt-7 lg:mt-8")}>
          <Cta href="/#contact" variant={featured ? "invert" : "ghost"}>
            <span>
              {cta}
              <span className="sr-only"> about {tier.name}</span>
            </span>
          </Cta>
        </div>

        {/* 5 — what is included */}
        <div className={cn(row, "mt-8")}>
          {/* Hairline fading out rather than terminating hard. */}
          <span
            aria-hidden="true"
            className={cn(
              "mb-7 block h-px bg-gradient-to-r to-transparent",
              featured ? "from-ink-0/25" : "from-white/15",
            )}
          />
          {inherits ? (
            <p className={cn("field-label mb-4", featured ? "!text-ink-0/75" : "text-ink-600")}>
              {inherits}, plus
            </p>
          ) : null}
          <ul className="flex flex-col gap-3 lg:gap-3.5">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <Check
                  className={cn(
                    "mt-px",
                    featured ? "bg-ink-0/10 text-ink-0" : "bg-white/[0.08] text-ink-1000",
                  )}
                />
                <span className={cn("leading-relaxed", featured ? "text-ink-0/85" : "text-ink-800")}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  );
}
