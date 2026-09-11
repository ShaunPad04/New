import { founders } from "@/lib/content";
import { TextReveal } from "@/components/ui/text-reveal";
import { Reveal, RevealWords } from "@/components/reveal";
import { ProcessTrack } from "@/components/process-track";

export function Studio() {
  return (
    <section
      id="studio"
      aria-labelledby="studio-heading"
      className="scroll-mt-24 border-t border-ink-300 bg-ink-50"
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-28 sm:px-10 lg:px-16 lg:py-40">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-6">The studio</p>
            <h2
              id="studio-heading"
              className="display text-display-md text-ink-1000"
            >
              <RevealWords text="Two founders. No account managers." />
            </h2>

            <ul className="mt-10 space-y-4">
              {founders.map((f) => (
                <li key={f.name} className="flex items-baseline gap-4">
                  <span aria-hidden="true" className="h-px w-6 bg-ink-500" />
                  <span>
                    <span className="block text-lg tracking-tight text-ink-1000">
                      {f.name}
                    </span>
                    <span className="text-sm text-ink-700">{f.role}</span>
                  </span>
                </li>
              ))}
            </ul>
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

            <Reveal variant="unblur" delay={0.15}>
              <p className="mt-6 leading-relaxed text-ink-800">
                It means we take on fewer projects than a larger agency would,
                and we are direct about scope and timelines because we are the
                ones who have to deliver them. It also means you get senior
                attention on every detail rather than a junior working from a
                brief they were handed second-hand.
              </p>
              <p className="mt-6 leading-relaxed text-ink-800">
                We work monochrome by conviction. Stripping colour out forces
                everything else — hierarchy, spacing, typography, motion — to do
                its job properly. If a layout works in black and white, it
                works.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Process */}
        <div className="mt-28 border-t border-ink-300 pt-16">
          <h3 className="eyebrow mb-12">How a project runs</h3>
          {/* Draggable, and the cards turn with the drag. See
              `process-track.tsx` — the gesture is the browser's own scroll
              container, the depth is computed from that container's position,
              and neither touches the window's scroll. */}
          <ProcessTrack />
        </div>
      </div>
    </section>
  );
}
