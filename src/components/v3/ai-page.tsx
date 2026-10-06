import type { CSSProperties, ReactNode } from "react";
import { aiExamples, aiSystems, type ServicePage } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { CORNERS, PageHero } from "./page-hero";
import { FaqList } from "./faq-list";
import { H2, LABEL, SectionLabel } from "./page-grid";
import { JumpList, OtherServices } from "./service-view";

const two = (n: number) => String(n).padStart(2, "0");

/** The top's third column: each system, the prices, the questions, the full price list. */
function AiJump() {
  return (
    <JumpList
      rows={[
        ...aiSystems.map((s, i) => ({ href: `#${s.id}`, label: s.title, tag: two(i + 1) })),
        { href: "#prices", label: "Prices", tag: two(aiSystems.length + 1) },
        { href: "#faq", label: "Questions", tag: two(aiSystems.length + 2) },
        { href: "/pricing#ai", label: "All pricing", tag: "→" },
      ]}
    />
  );
}

/** A visitor and the chatbot, the bubbles arriving one after another as it comes into view. */
export function ChatDemo() {
  const c = aiExamples.chat;
  return (
    <div className="w-full max-w-[22rem] overflow-hidden rounded-[18px] border border-white/10 bg-[#0b0b0b] text-left">
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <span aria-hidden="true" className="grid size-8 place-items-center rounded-full bg-white/[0.08] text-[0.6875rem] font-bold text-ink-1000">
          AI
        </span>
        <div className="leading-tight">
          <p className="text-[0.875rem] font-semibold text-ink-1000">{c.name}</p>
          <p className="text-[0.75rem] text-ink-700">{c.status}</p>
        </div>
      </div>
      <ol className="grid gap-2.5 px-4 pb-5 pt-4">
        {c.lines.map((l, i) => {
          const visitor = l.from === "visitor";
          return (
            <Reveal key={i} as="li" variant="rise" y={12} delay={0.3 + i * 0.6} className={visitor ? "justify-self-end" : "justify-self-start"}>
              <span
                className={`block max-w-[16rem] rounded-2xl px-3.5 py-2.5 text-[0.875rem] leading-snug ${visitor ? "rounded-br-md bg-white text-black" : "rounded-bl-md bg-white/[0.08] text-ink-1000"}`}
              >
                <span className="sr-only">{visitor ? "Visitor: " : `${c.name}: `}</span>
                {l.text}
              </span>
            </Reveal>
          );
        })}
        <Reveal as="li" variant="settle" delay={0.3 + c.lines.length * 0.6} className="mt-2 justify-self-center">
          <span className={`inline-flex items-center gap-2 rounded-full border border-white/12 px-3 py-1.5 text-ink-1000 ${LABEL}`}>
            <span aria-hidden="true" className="text-accent">
              ✓
            </span>
            {c.outcome}
          </span>
        </Reveal>
      </ol>
    </div>
  );
}

/* The waveform's bar heights, as fractions of its height: a voice, not a meter. */
const WAVE = [0.35, 0.6, 0.9, 0.5, 0.75, 1, 0.65, 0.4, 0.8, 0.55, 0.95, 0.45, 0.7, 0.85, 0.5, 0.3, 0.6, 0.9, 0.4, 0.65, 0.5, 0.8];

/** A call the team missed being answered, then the summary that lands as a text. */
export function CallDemo() {
  const c = aiExamples.call;
  return (
    <div className="grid w-full max-w-[22rem] gap-3 text-left">
      <Reveal variant="settle" className="rounded-[18px] border border-white/10 bg-[#0b0b0b] p-5">
        <div className="flex items-center justify-between gap-4">
          <p className={`${LABEL} text-ink-700`}>{c.label}</p>
          <p className="text-[0.75rem] tabular-nums text-ink-700">{c.time}</p>
        </div>
        <p className="mt-3 text-[1.25rem] font-semibold tracking-[-0.03em] text-ink-1000">{c.caller}</p>
        <span className="mt-2 inline-flex rounded-full border border-white/12 px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-[-0.02em] text-ink-800">{c.tag}</span>
        <div aria-hidden="true" className="ai-wave mt-6 flex h-14 items-center gap-[3px] text-ink-1000">
          {WAVE.map((h, i) => (
            <span key={i} style={{ "--h": h, "--i": i } as CSSProperties} />
          ))}
        </div>
        <p className="mt-4 flex items-center gap-2 text-[0.8125rem] text-ink-800">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
          {c.status}
        </p>
      </Reveal>
      <Reveal variant="settle" delay={1.1} className="rounded-[18px] border border-white/10 bg-white/[0.04] p-5">
        <p className={`${LABEL} text-ink-1000`}>{c.summaryTitle}</p>
        <p className="mt-2 text-[0.9375rem] leading-snug text-ink-900">{c.summary}</p>
        <p className="mt-3 text-[0.75rem] text-ink-600">{c.summaryMeta}</p>
      </Reveal>
    </div>
  );
}

/** One system: its demo in the hero's corner-ticked frame, then who it answers, its name and what it does. */
function System({ system, index, where, example, children }: { system: (typeof aiSystems)[number]; index: string; where: string; example: string; children: ReactNode }) {
  return (
    <article id={system.id} aria-labelledby={`${system.id}-title`} className="scroll-mt-24">
      <div className="relative border border-white/12 bg-[radial-gradient(120%_80%_at_15%_0%,rgba(255,255,255,0.07),transparent_60%)]">
        {CORNERS.map((p) => (
          <span key={p} aria-hidden="true" className={`absolute size-1.5 bg-ink-1000 ${p}`} />
        ))}
        <p className={`absolute left-4 top-4 text-ink-600 ${LABEL}`}>{example}</p>
        <div className="flex min-h-[28rem] items-center justify-center px-6 pb-10 pt-14 lg:min-h-[32rem]">{children}</div>
      </div>
      <div className="mt-8">
        <p className="flex items-baseline gap-3">
          <span className="font-[family-name:var(--font-cal-ui)] text-[1.25rem] leading-none tabular-nums text-accent">{index}</span>
          <span className={`text-ink-700 ${LABEL}`}>{where}</span>
        </p>
        <h3 id={`${system.id}-title`} className="mt-3 text-[clamp(1.75rem,2.6vw,2.5rem)] font-semibold uppercase leading-[0.95] tracking-[-0.045em] text-ink-1000">
          {system.title}
        </h3>
        <p className="mt-4 max-w-[52ch] text-[1rem] leading-relaxed text-ink-800">{system.summary}</p>
      </div>
    </article>
  );
}

/**
 * Both systems' prices in one table, a row per line (setup, monthly, calls),
 * a column per system, so the two read side by side rather than as two
 * lists. Every figure sits with its condition. Read from `aiSystems`, the
 * same lines /pricing opens; a system with no such line shows a dash.
 * Phones stack each row and name the system in each cell.
 */
function PriceTable() {
  const labels = [...new Set(aiSystems.flatMap((s) => s.lines.map((l) => l.label)))];
  const cols = "lg:grid-cols-[1fr_1.6fr_1.6fr]";
  return (
    <div className="mt-12 lg:mt-16">
      <div aria-hidden="true" className={`hidden border-b border-ink-1000 pb-4 lg:grid ${cols}`}>
        <span />
        {aiSystems.map((s) => (
          <p key={s.id} className={`text-ink-1000 ${LABEL}`}>
            {s.title}
          </p>
        ))}
      </div>
      <dl className="border-t border-ink-1000 lg:border-t-0">
        {labels.map((label) => (
          <div key={label} className={`grid gap-5 border-b border-ink-300 py-6 lg:gap-0 ${cols}`}>
            <dt className={`text-ink-700 lg:pr-10 lg:pt-1 ${LABEL}`}>{label}</dt>
            {aiSystems.map((s) => {
              const line = s.lines.find((l) => l.label === label);
              return (
                <dd key={s.id} className="m-0 lg:pr-10">
                  <span className={`mb-1.5 block text-ink-600 lg:sr-only ${LABEL}`}>{s.title}</span>
                  {line ? (
                    <>
                      <span className="display block text-[1.25rem] leading-tight normal-case! text-ink-1000">{line.value}</span>
                      {line.detail ? <span className="mt-1.5 block max-w-[44ch] text-[0.8125rem] leading-relaxed text-ink-700">{line.detail}</span> : null}
                    </>
                  ) : (
                    <span className="text-ink-600">
                      <span aria-hidden="true">—</span>
                      <span className="sr-only">Not applicable</span>
                    </span>
                  )}
                </dd>
              );
            })}
          </div>
        ))}
      </dl>
    </div>
  );
}

/** A numbered section's top: the label in column one, heading and lede across two. */
function Head({ id, index, label, heading, lede }: { id: string; index: string; label: string; heading: string; lede?: string }) {
  return (
    <div className="grid gap-8 lg:grid-cols-3 lg:gap-0">
      <SectionLabel index={index} label={label} className="lg:pr-10" />
      <div className="lg:col-span-2 lg:pl-3">
        <h2 id={id} className={H2}>
          {heading}
        </h2>
        {lede ? <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-[1.45] tracking-[-0.02em] text-ink-800">{lede}</p> : null}
      </div>
    </div>
  );
}

/**
 * /services/ai — THE AI PAGE, the first service page in the homepage's
 * system (Brad, 2026-10-04: "do the AI page as well"; one page on this site,
 * not a second site). Its first cut stacked each system as a giant heading,
 * a grey paragraph and a table, and Brad called it "cheap, like a
 * PowerPoint": nothing on it showed the product. So it SHOWS them: each
 * system's demo in the hero's corner-ticked frame (a labelled example chat,
 * a labelled example call with its texted summary; `aiExamples`), side by
 * side, then both price lists as ONE table, then the questions and the other
 * services. Motion is one beat per demo, on the site's own reveal (bubbles
 * arriving in turn; the waveform), transform and opacity only, still under
 * reduced motion.
 */
export function AiPage({ page }: { page: ServicePage }) {
  const where: Record<string, { where: string; example: string; demo: ReactNode }> = {
    "ai-chat": { where: "On your website", example: "Example conversation", demo: <ChatDemo /> },
    "ai-voice": { where: "On your phone line", example: "Example call", demo: <CallDemo /> },
  };
  return (
    <>
      <PageHero
        id="ai-page-heading"
        title={page.heading}
        word="ai systems"
        label="AI"
        ja="人工知能"
        count={{ value: two(aiSystems.length), label: "systems" }}
        lede={page.lede}
        image={page.image}
        aside={<AiJump />}
      />

      <div className="bg-ink-0 px-6 sm:px-10">
        <section aria-labelledby="systems-heading" className="py-16 lg:py-24">
          <Head id="systems-heading" index="01" label="Systems" heading="Answers when you can't." />
          <div className="mt-12 grid gap-16 lg:mt-16 lg:grid-cols-2 lg:gap-10">
            {aiSystems.map((system, i) => (
              <System key={system.id} system={system} index={two(i + 1)} where={where[system.id]?.where ?? ""} example={where[system.id]?.example ?? "Example"}>
                {where[system.id]?.demo}
              </System>
            ))}
          </div>
        </section>

        <section id="prices" aria-labelledby="prices-heading" className="scroll-mt-24 border-t border-white/12 py-16 lg:py-24">
          <Head
            id="prices-heading"
            index="02"
            label="Prices"
            heading="What each one costs."
            lede="A one-off setup and a monthly fee, both published. The monthly fee is what keeps the system hosted, trained and answering."
          />
          <PriceTable />
        </section>

        <div className="border-t border-white/12">
          <FaqList index="03" metas={page.faqMetas} heading="Questions we get asked." lede={`What people usually ask about ${page.label} before they get in touch.`} />
        </div>

        <OtherServices current={page.slug} />
      </div>
    </>
  );
}
