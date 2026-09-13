"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  aiSystems,
  projectTiers,
  retainerTiers,
  site,
  type Tier,
} from "@/lib/content";
import { Cta } from "@/components/cta";
import { cn } from "@/lib/utils";

/**
 * PRICING
 *
 * The commercial section is the most scrutinised block on an agency site: it
 * is where a prospect decides whether we are the kind of studio they can hand
 * a brand to. So it is built to the same bar as the rest of the page rather
 * than as a utility table.
 *
 *  - Every card is a double-bezel object (outer tray, inner plate, concentric
 *    radii). Nothing sits flat on the background.
 *  - A pointer-tracked radial sheen follows the cursor across each card. It is
 *    written straight onto the element as custom properties, so a continuous
 *    pointer stream never re-renders React.
 *  - The two commercial models sit behind a segmented control with a sliding
 *    indicator — a transform, not a colour swap — kept as a real ARIA tablist
 *    so it is operable by keyboard and announced correctly.
 *  - Figures are set in tabular numerals so the three columns align optically.
 *  - A bespoke band sits under the grid for work that is above the published
 *    tiers. It quotes no number, because that work is scoped, not priced.
 *  - Below `lg` the three cards become a swipeable snap carousel rather than
 *    a stack. Stacked, this one section ran ~3,300px on a phone — six screens
 *    of thumb between the hero and the enquiry form, for three cards a visitor
 *    wants to compare side by side anyway. Comparison is exactly what a
 *    carousel is for and stacking is exactly what defeats it.
 *
 * Prices come from `content.ts` and are GBP excluding VAT. They remain flagged
 * `PRICING_CONFIRMED = false` there until the client signs them off.
 */

const formatter = new Intl.NumberFormat("en-GB");

const MODES = [
  { value: "project", label: "Website builds" },
  { value: "retainer", label: "Monthly plans" },
] as const;

type Mode = (typeof MODES)[number]["value"];

/**
 * COMPACT VARIANT — the homepage (redesign, 2026-09-11).
 *
 * Three build tiers only, no mode switch: retainers, the AI systems and the
 * bespoke band live on /pricing. Two tier bullets say "Includes AI Text
 * Chatbot setup" (the client's wording, verbatim) — on /pricing the add-on
 * band beneath them states the ongoing £79pm that "setup" excludes, so the
 * compact deck carries a footnote making the same fact explicit here. Do not
 * remove it: "includes setup" standing alone reads as included forever,
 * which is a misleading commercial practice (CPUTR 2008 / DMCCA 2024).
 */
function PricingCompact() {
  const panelId = useId();

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="scroll-mt-24 border-t border-ink-300"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[24ch]">
            <p className="eyebrow mb-6">Investment</p>
            <h2
              id="pricing-heading"
              className="display text-display-md text-ink-1000"
            >
              Priced openly.
            </h2>
          </div>

          <p className="lede max-w-[46ch] lg:pb-2">
            Fixed-price builds, agreed in writing before anything starts.
            Monthly plans and AI systems are on the pricing page.
          </p>
        </div>

        <p className="field-label mt-14 text-ink-600">
          {site.currencySymbol} GBP — excluding VAT
        </p>

        <TierDeck tiers={projectTiers} mode="project" panelId={panelId} />

        <p className="mt-10 max-w-[64ch] text-sm leading-relaxed text-ink-600">
          50% on commissioning, 50% on launch. Where a tier includes AI Text
          Chatbot setup, the chatbot&rsquo;s monthly fee still applies — it is
          listed with the monthly plans on the pricing page.
        </p>

        <div className="mt-10">
          <Cta href="/pricing" variant="invert">
            Monthly plans &amp; AI systems
          </Cta>
        </div>
      </div>
    </section>
  );
}

export function Pricing({ compact = false }: { compact?: boolean }) {
  const [mode, setMode] = useState<Mode>("project");
  const panelId = useId();
  const tiers = mode === "project" ? projectTiers : retainerTiers;

  if (compact) return <PricingCompact />;

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="scroll-mt-24 border-t border-ink-300"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[24ch]">
            <p className="eyebrow mb-6">Investment</p>
            <h2
              id="pricing-heading"
              className="display text-display-md text-ink-1000"
            >
              Priced openly.
            </h2>
          </div>

          <p className="lede max-w-[46ch] lg:pb-2">
            Fixed-price builds with no hourly billing, and monthly plans you can
            leave on 30 days&rsquo; notice. Every figure is a starting point —
            scope is confirmed in writing before anything begins.
          </p>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-5">
          <ModeSwitch mode={mode} setMode={setMode} panelId={panelId} />
          <p className="field-label text-ink-600">
            {site.currencySymbol} GBP — excluding VAT
          </p>
        </div>

        <TierDeck tiers={tiers} mode={mode} panelId={panelId} />

        <AiSystems />

        <BespokeBand />

        <p className="mt-10 max-w-[64ch] text-sm leading-relaxed text-ink-600">
          Website builds are payable 50% on commissioning and 50% on launch.
          Monthly plans are billed in advance with no minimum term beyond the
          first month. Nothing recurs without your written agreement.
        </p>
      </div>
    </section>
  );
}

/**
 * Segmented control. The indicator is one absolutely-positioned pane that
 * translates between the two halves, so switching reads as a single object
 * moving rather than two buttons changing colour.
 */
function ModeSwitch({
  mode,
  setMode,
  panelId,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
  panelId: string;
}) {
  return (
    <div className="bezel !rounded-full !p-1.5">
      <div
        role="tablist"
        aria-label="Pricing type"
        className="relative grid grid-cols-2"
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-1/2 rounded-full bg-ink-1000",
            "transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
            mode === "retainer" && "translate-x-full"
          )}
        />
        {MODES.map(({ value, label }) => (
          <button
            key={value}
            role="tab"
            type="button"
            id={`${panelId}-tab-${value}`}
            aria-selected={mode === value}
            aria-controls={`${panelId}-panel`}
            onClick={() => setMode(value)}
            className={cn(
              "relative z-10 whitespace-nowrap rounded-full px-6 py-3 text-sm font-medium tracking-tight",
              "transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
              mode === value ? "text-ink-0" : "text-ink-700 hover:text-ink-1000"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * The three tiers.
 *
 * At `lg` and above this is the same three-column grid it always was. Below
 * `lg` it becomes a horizontal snap carousel: one card at a time with the next
 * one peeking, which is both far shorter and the correct shape for comparing
 * options — a stack forces the visitor to hold Signature in their head while
 * they scroll past it to reach Flagship.
 *
 * Native CSS scroll-snap does the work. There is no drag handler and no
 * carousel library: the browser already knows how to throw a scroll container
 * with the right physics on every platform, and a hand-rolled pointer drag
 * would be worse on all of them.
 *
 * The track bleeds to the viewport edge with a negative margin and pays the
 * padding back inside, so a card sits flush with the section's text above it
 * while the next card still runs off the edge — which is what tells a visitor
 * there is more without a "swipe" instruction.
 */
function TierDeck({
  tiers,
  mode,
  panelId,
}: {
  tiers: readonly Tier[];
  mode: Mode;
  panelId: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Derived from the card nearest the scroll origin rather than from a card
  // width, so it stays correct whatever the gap and padding resolve to.
  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.children) as HTMLElement[];
    if (cards.length === 0) return;
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

  /**
   * Open on the featured tier, not on the first one.
   *
   * On desktop the recommended tier is the middle column — white, badged, and
   * the thing the eye lands on. A carousel that opens on card one throws that
   * away and shows a phone visitor the cheapest option first, which is neither
   * what the design says nor what we want asked about. Opening on the featured
   * card restores the desktop reading order on a screen that can only show one
   * card at a time.
   *
   * Also runs on a mode switch, because the two sets are different cards: left
   * alone the track keeps its old offset and opens mid-card.
   *
   * `scrollWidth > clientWidth` is the test for "the carousel is actually
   * live". At `lg` the track is a grid and does not scroll, so this is a no-op
   * there without having to duplicate the breakpoint in JavaScript.
   */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const featured = Math.max(
      0,
      tiers.findIndex((t) => t.featured),
    );
    const card = track.children[featured] as HTMLElement | undefined;
    const scrollable = track.scrollWidth > track.clientWidth;

    track.scrollTo({
      left: scrollable && card ? card.offsetLeft : 0,
      behavior: "auto",
    });
    setActive(scrollable ? featured : 0);
  }, [mode, tiers]);

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
        id={`${panelId}-panel`}
        role="tabpanel"
        aria-labelledby={`${panelId}-tab-${mode}`}
        ref={trackRef}
        onScroll={sync}
        className={cn(
          // Phone and tablet: an edge-to-edge snap track.
          "no-scrollbar -mx-6 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-6 px-6 sm:-mx-10 sm:scroll-px-10 sm:px-10",
          // Desktop: the original grid, with every scroll property undone.
          "lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0",
        )}
      >
        {tiers.map((tier) => (
          <div
            key={tier.id}
            // 82% leaves a deliberate sliver of the next card in frame. A full
            // 100% reads as a stack that has stopped working.
            className="w-[82%] shrink-0 snap-start sm:w-[60%] lg:w-auto lg:shrink"
          >
            <TierCard tier={tier} />
          </div>
        ))}
      </div>

      {/* Position indicator. Buttons, not dots painted on — tapping one is the
          obvious thing to try, and it is the keyboard route through the track
          for anyone not swiping. Desktop has no carousel, so it is not there. */}
      <div className="mt-6 flex items-center justify-center gap-2.5 lg:hidden">
        {tiers.map((tier, i) => (
          <button
            key={tier.id}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show the ${tier.name} tier`}
            aria-current={i === active}
            // 44px of tappable height around a 6px mark: the target clears the
            // touch minimum without a dot the size of a button.
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

function TierCard({ tier }: { tier: Tier }) {
  const ref = useRef<HTMLDivElement>(null);
  const featured = Boolean(tier.featured);

  /**
   * Pointer position is written imperatively as custom properties. A cursor
   * move fires continuously; re-rendering React on each one would cost far
   * more than the effect is worth.
   */
  const track = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", `${e.clientX - r.left}px`);
    el.style.setProperty("--py", `${e.clientY - r.top}px`);
    el.style.setProperty("--po", "1");
  };
  const clear = () => ref.current?.style.setProperty("--po", "0");

  return (
    <div
      ref={ref}
      onPointerMove={track}
      onPointerLeave={clear}
      className={cn(
        "bezel group relative h-full transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 motion-reduce:hover:translate-y-0",
        featured && "bg-white/[0.07]"
      )}
    >
      <article
        className={cn(
          "relative flex h-full flex-col overflow-hidden p-8 lg:p-10",
          featured ? "bezel-core-invert" : "bezel-core"
        )}
      >
        {/* Decorative sheen, beneath the content and inert under reduced motion. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[var(--po,0)] transition-opacity duration-500 motion-reduce:hidden"
          style={{
            background: featured
              ? "radial-gradient(320px circle at var(--px,50%) var(--py,50%), rgba(0,0,0,0.16), transparent 70%)"
              : "radial-gradient(320px circle at var(--px,50%) var(--py,50%), rgba(255,255,255,0.07), transparent 70%)",
          }}
        />

        <div className="relative flex flex-1 flex-col">
          {/* Wraps deliberately. On the mobile carousel the card is ~280px
              wide, and "SIGNATURE" plus the badge overrun that by a hair — the
              badge was being clipped by the card's own overflow. Allowed to
              wrap it sits under the title on a narrow card and stays top-right
              wherever there is room. */}
          <header className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
            <div>
              <h3 className="display text-2xl leading-none">{tier.name}</h3>
              {/* Conditional: `meta` is optional since the page counts came
                  off the build tiers, and an empty <p> here would leave a
                  12px gap that reads as a missing line rather than as space. */}
              {tier.meta ? (
                <p
                  className={cn(
                    "field-label mt-3",
                    featured ? "!text-ink-0/75" : "text-ink-600"
                  )}
                >
                  {tier.meta}
                </p>
              ) : null}
            </div>

            {/* The "Most chosen" badge was removed on 2026-09-13: every
                tier now carries an audience eyebrow, which answers the same
                question ("is this one me?") without ranking the tiers for
                the reader. Signature stays visually featured — the inverted
                card, the invert CTA — so the centre of the row still reads
                as the recommendation. */}
          </header>

          <p
            className={cn(
              "mt-6 min-h-[3.25rem] max-w-[34ch] text-sm leading-relaxed",
              featured ? "text-ink-0/80" : "text-ink-700"
            )}
          >
            {tier.summary}
          </p>

          <p className="mt-8 flex items-baseline gap-1.5">
            <span
              className={cn(
                "text-sm",
                featured ? "text-ink-0/75" : "text-ink-600"
              )}
            >
              from
            </span>
            <span className="display text-4xl tabular-nums lg:text-5xl">
              {site.currencySymbol}
              {formatter.format(tier.price)}
            </span>
            {tier.cadence === "month" ? (
              <span
                className={cn(
                  "text-sm",
                  featured ? "text-ink-0/75" : "text-ink-600"
                )}
              >
                /month
              </span>
            ) : null}
          </p>

          {/* Delivery promise, directly under the price — the two numbers a
              buyer weighs against each other. Conditional because the
              retainers have no delivery date; `retainerTiers` leave it
              unset and this collapses rather than leaving a gap. */}
          {tier.delivery ? (
            <p
              className={cn(
                "mt-3 max-w-[30ch] text-[0.8125rem] leading-relaxed",
                featured ? "text-ink-0/75" : "text-ink-600"
              )}
            >
              {tier.delivery}
            </p>
          ) : null}

          {/* Hairline separator, fading out rather than terminating hard. */}
          <span
            aria-hidden="true"
            className={cn(
              "mt-8 block h-px",
              featured
                ? "bg-gradient-to-r from-ink-0/25 to-transparent"
                : "bg-gradient-to-r from-white/15 to-transparent"
            )}
          />

          <ul className="mt-8 flex flex-1 flex-col gap-3.5">
            {tier.includes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                    featured
                      ? "bg-ink-0/10 text-ink-0"
                      : "bg-white/[0.08] text-ink-1000"
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
                <span
                  className={cn(
                    "leading-relaxed",
                    featured ? "text-ink-0/85" : "text-ink-800"
                  )}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <Cta
            href="/#contact"
            variant={featured ? "invert" : "ghost"}
            className="mt-10 self-start"
          >
            <span>
              Enquire
              <span className="sr-only"> about the {tier.name} tier</span>
            </span>
          </Cta>
        </div>
      </article>
    </div>
  );
}

/**
 * Above the published tiers. Larger brands rarely buy from a card — they want
 * to know the studio will scope properly. Quoting no figure here is the
 * honest position and the more confident one.
 */
/**
 * AI SYSTEMS — the two standalone add-ons, added 2026-09-11 on the client's
 * instruction.
 *
 * They get their own band rather than more bullets in the tiers because they
 * are priced in TWO parts: a setup fee that changes depending on what is
 * bought alongside it, and a monthly fee that keeps running afterwards. A tier
 * bullet can carry one of those honestly; it cannot carry both. "Includes AI
 * Text Chatbot setup" on Signature is true and complete precisely BECAUSE this
 * band states the £79/month that the word "setup" excludes.
 *
 * A definition list, not a table: there are two or three rows per system, the
 * labels repeat between them, and a table would promise a comparison across
 * columns that these two do not share. The caveat sits with its figure rather
 * than in a footnote, because the caveat is the part a buyer needs.
 */
function AiSystems() {
  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      {aiSystems.map((system) => (
        <div key={system.id} className="bezel">
          <div className="bezel-core flex h-full flex-col gap-8 p-8 lg:p-10">
            <div>
              <p className="field-label text-ink-600">AI systems</p>
              <h3 className="display mt-4 text-display-sm text-ink-1000">
                {system.title}
              </h3>
              <p className="mt-5 max-w-[46ch] text-sm leading-relaxed text-ink-700">
                {system.summary}
              </p>
            </div>

            <dl className="mt-auto flex flex-col gap-5 border-t border-ink-300 pt-7">
              {system.lines.map((line) => (
                <div
                  key={line.label}
                  className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <dt className="field-label shrink-0 text-ink-600">
                    {line.label}
                  </dt>
                  <dd className="m-0 sm:text-right">
                    {/* `normal-case!` — `.display` is uppercase and is declared
                        after the Tailwind layer, so a plain `normal-case`
                        loses on source order and "£79/month" renders as
                        "£79/MONTH". Same fix as the results figures. */}
                    <span className="display normal-case! block text-[1.0625rem] tracking-tight text-ink-1000">
                      {line.value}
                    </span>
                    {line.detail ? (
                      <span className="mt-1.5 block max-w-[38ch] text-[0.8125rem] leading-relaxed text-ink-600 sm:ml-auto">
                        {line.detail}
                      </span>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      ))}
    </div>
  );
}

function BespokeBand() {
  return (
    <div className="bezel mt-6">
      <div className="bezel-core flex flex-col gap-10 p-8 lg:flex-row lg:items-center lg:justify-between lg:p-12">
        <div>
          <p className="field-label text-ink-600">Above these tiers</p>
          <h3 className="display mt-4 max-w-[20ch] text-display-sm text-ink-1000">
            Bespoke engagements.
          </h3>
          <p className="mt-5 max-w-[58ch] text-sm leading-relaxed text-ink-700">
            Multi-market rollouts, product configurators, boutique and
            appointment-led retail, and brands where the site carries the whole
            reputation. Scoped and quoted on the work, never on a template.
          </p>
        </div>

        <Cta href="/#contact" className="shrink-0">
          Discuss a brief
        </Cta>
      </div>
    </div>
  );
}
