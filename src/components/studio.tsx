import Image from "next/image";
import { founders } from "@/lib/content";
import { resolveFounderImage } from "@/lib/work-image";
import { TextReveal } from "@/components/ui/text-reveal";
import { Reveal, RevealWords } from "@/components/reveal";

/**
 * Founder portrait slot (redesign, 2026-09-11). Resolved from
 * `public/images/founders/<slug>.*` at build time — no photo yet, so a
 * designed, clearly-labelled placeholder renders instead of a broken image.
 * `grayscale` on the <Image> keeps the section monochrome even if a colour
 * photograph is supplied.
 */
function FounderCard({
  name,
  role,
  delay,
}: {
  name: string;
  role: string;
  delay: number;
}) {
  const image = resolveFounderImage(name);

  return (
    <Reveal delay={delay} variant="settle">
      <figure className="bezel">
        <div className="bezel-core p-2.5">
          <div className="relative aspect-[4/5] overflow-hidden bg-ink-100">
            {image ? (
              <Image
                src={image}
                alt={`${name} — black and white portrait`}
                fill
                sizes="(min-width: 1024px) 20vw, 45vw"
                className="object-cover grayscale"
              />
            ) : (
              /*
                A MONOGRAM PLATE, not an apology.

                This slot used to centre small initials above the words
                "Portrait to come", which is honest and also tells every
                visitor the studio has not finished its own website. The
                client asked for a finished typographic treatment until real
                photographs exist (2026-09-14).

                A monogram is a legitimate design, not a placeholder: the
                initials are set in the house display face at plate scale and
                hung bottom-left, which is where this site anchors its type
                everywhere else — the hero mark, the scrub line, the
                wordmark. Nothing is invented and no face is generated; the
                name and role beneath are still the only claims made.

                `aria-hidden`, because the figcaption below already gives the
                name to a screen reader and initials read as noise.

                Drop `public/images/founders/<slug>.{jpg,webp}` in and the
                branch above takes over with no code change.
              */
              <span className="absolute inset-0 flex items-end bg-[radial-gradient(120%_100%_at_50%_0%,rgba(255,255,255,0.07),transparent_65%)] p-5">
                <span
                  aria-hidden="true"
                  className="display text-[3.25rem] leading-[0.8] tracking-[-0.04em] text-ink-500 lg:text-[4rem]"
                >
                  {name
                    .split(" ")
                    .map((part) => (
                      <span key={part} className="block">
                        {part[0]}
                      </span>
                    ))}
                </span>
              </span>
            )}
          </div>
          <figcaption className="px-2 pb-1.5 pt-4">
            <span className="block text-[0.9375rem] tracking-tight text-ink-1000">
              {name}
            </span>
            <span className="text-xs text-ink-700">{role}</span>
          </figcaption>
        </div>
      </figure>
    </Reveal>
  );
}

export function Studio() {
  return (
    <section
      id="studio"
      aria-labelledby="studio-heading"
      className="relative isolate scroll-mt-24 border-t border-ink-300 bg-ink-50"
    >
      {/*
        DESKTOP BACKDROP. The studio band is the longest stretch of unbroken
        prose on the homepage and it sat on flat ink-50.

        The picture is the studio's OWN OBJECT rather than a mood: two blank
        matte-black cards, one overlapping the other, their cut edges catching
        foil under a raking light. That is the business card this brand is
        built from — silver foil on matte black — and two cards is two
        founders, which is the section's whole argument. Blank by instruction:
        no mark, no type, nothing that could read as a logo we do not have.

        Generated 2026-09-14 on the client's instruction (Higgsfield Seedream
        4.5, `quality: basic`, ONE job, 3:2, `use_unlim: false` so it spent
        credit); grayscale WebP at 1400w, 42KB. NOT a founder portrait — the
        client's standing instruction is that no portrait is invented, and the
        labelled slots stay empty until real photographs arrive.

        `lg` only: below that the founder cards and the prose already fill the
        column, and an image behind them would be clutter rather than depth.

        The scrim is load-bearing. Held at 40% — higher than the pricing
        backdrop because this one is nearly black already — under a gradient
        that returns the left column, where every word lives, to the section
        ground. Anchored BOTTOM-right, not top-right: the prose occupies the
        top of that column and the brightest foil highlight was landing behind
        the first paragraph. The empty quarter is below it.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden lg:block"
      >
        <div className="absolute right-0 bottom-0 h-[34rem] w-[56%]">
          <Image
            src="/images/studio/card.webp"
            alt=""
            fill
            sizes="54vw"
            className="object-cover opacity-40"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, var(--color-ink-50) 0%, rgba(5,5,5,0.88) 28%, rgba(5,5,5,0.15) 100%), linear-gradient(to bottom, var(--color-ink-50) 0%, rgba(5,5,5,0.75) 22%, rgba(5,5,5,0.1) 60%, rgba(5,5,5,0.7) 100%)",
            }}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1600px] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="eyebrow eyebrow-plain mb-6">The studio</p>
            <h2
              id="studio-heading"
              className="display text-display-md text-ink-1000"
            >
              <RevealWords text="Two founders. No account managers." />
            </h2>

            {/* Two black-and-white portrait slots (redesign, 2026-09-11) —
                the people ARE the studio argument, so they get imagery, not
                a two-line list. */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:max-w-md">
              {founders.map((f, i) => (
                <FounderCard
                  key={f.name}
                  name={f.name}
                  role={f.role}
                  delay={i * 0.08}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            {/*
              The opening paragraph arrives a word at a time as it scrolls
              into view, at the client's request, using the `TextReveal`
              component he supplied.

              THIS PARAGRAPH AND NOT A HEADING. The component splits its text
              into per-word motion elements and marks every one of them
              `aria-hidden`, restoring the real string in an `sr-only` span.
              That is sound for supporting copy and wrong for a heading — a
              section title that depends on an observer firing is the failure
              `reveal.tsx` documents, and it is why `RevealWords` no longer
              animates. Worst case here is a paragraph that fades in late;
              worst case on an `<h2>` is a page with no visible headings.

              A template literal rather than JSX children, because the
              component takes a string to split and the founders' names are
              interpolated. Reading them from `founders` keeps the one source
              of truth — the names are not typed out twice.

              `speedReveal` 2.2 shortens the per-word stagger. At the default
              this paragraph's 46 words take about 2.6s to finish, which is
              long enough for a reader to reach a line that is still arriving;
              at 2.2 the stagger is 23ms and the whole paragraph resolves in
              a little over a second.
            */}
            <TextReveal
              as="p"
              className="lede"
              per="word"
              preset="fade-in-blur"
              speedReveal={2.2}
            >
              {`Black Line is a two-person studio — ${founders[0].name} and ${founders[1].name} — and that is the entire point. The people who design and build your site are the people you speak to. There is no account layer relaying messages between you and whoever is actually doing the work.`}
            </TextReveal>

            {/*
              The two paragraphs below arrive the SAME way as the lede above
              them, per word, rather than as one block fading up.

              They used to share a single `Reveal variant="unblur"`. That is
              not nothing — but against a lede that unfolds a word at a time
              directly above it, a whole block resolving at once reads as the
              part nobody styled, which is exactly how the client described
              it (2026-09-14). Motion that stops halfway down a column draws
              attention to where it stopped.

              Each paragraph keeps its OWN trigger rather than being staggered
              off the lede's: on a phone this column is taller than the
              viewport, so a shared delay would play the third paragraph's
              motion while it was still below the fold and the reader would
              scroll down to find it already finished.

              `speedReveal={2.2}` is the lede's value, deliberately — the same
              23ms stagger keeps the three paragraphs reading as one voice
              rather than three separately-tuned effects. The word counts are
              52 and 38, so they resolve in about 1.2s and 0.9s.

              Same `aria-hidden` words plus `sr-only` string as the lede, and
              the same reason it is acceptable here: this is supporting copy,
              not a heading. `TextReveal` returns the plain tag with the plain
              text under `prefers-reduced-motion`.
            */}
            <TextReveal
              as="p"
              className="mt-6 leading-relaxed text-ink-800"
              per="word"
              preset="fade-in-blur"
              speedReveal={2.2}
            >
              It means we take on fewer projects than a larger agency would, and
              we are direct about scope and timelines because we are the ones who
              have to deliver them. It also means you get senior attention on
              every detail rather than a junior working from a brief they were
              handed second-hand.
            </TextReveal>

            <TextReveal
              as="p"
              className="mt-6 leading-relaxed text-ink-800"
              per="word"
              preset="fade-in-blur"
              speedReveal={2.2}
            >
              We work monochrome by conviction. Stripping colour out forces
              everything else — hierarchy, spacing, typography, motion — to do
              its job properly. If a layout works in black and white, it works.
            </TextReveal>
          </div>
        </div>

        {/* The process left this section on 2026-09-11 and is now its own
            pinned horizontal ride (`ProcessScroll`), rendered as a SIBLING
            after <Studio /> on every page that wants it. It has to be a
            sibling: ScrollTrigger pins by inserting a spacer around the
            element, which cannot work on a block nested inside another
            section's max-width container. */}
      </div>
    </section>
  );
}
