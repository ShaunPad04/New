import { aiSystems, rateCard } from "@/lib/content";
import { automationFaqs, automationSectors, automationSteps, automationSystems } from "@/lib/ai-automation";
import { Reveal } from "@/components/reveal";
import { Contact } from "@/components/contact";
import { CORNERS, PageHero } from "./page-hero";
import { FaqAccordion } from "./faq-accordion";
import { HeroCta } from "./hero-cta";
import { H2, LABEL, SectionLabel } from "./page-grid";
import { CallDemo, ChatDemo } from "./ai-demos";
import { JumpList } from "./service-view";
import { LossCalculator } from "./loss-calculator";

const two = (n: number) => String(n).padStart(2, "0");

/** A numbered section's top: the label in column one, heading and lede across two (as the AI page). */
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

/** The corner-ticked frame the hero and the AI page's demos sit in. */
function Frame({ children, className = "", tag }: { children: React.ReactNode; className?: string; tag?: string }) {
  return (
    <div className={`relative border border-white/12 ${className}`}>
      {CORNERS.map((p) => (
        <span key={p} aria-hidden="true" className={`absolute size-1.5 bg-ink-1000 ${p}`} />
      ))}
      {tag ? <p className={`absolute left-4 top-4 text-ink-600 ${LABEL}`}>{tag}</p> : null}
      {children}
    </div>
  );
}

/** One system as a card: where, name, then problem → what it does → result. */
function SystemCard({ s, index }: { s: (typeof automationSystems)[number]; index: string }) {
  const rows = [
    { k: "The problem", v: s.problem },
    { k: "What it does", v: s.does },
    { k: "The result", v: s.result },
  ];
  return (
    <Reveal as="li" variant="rise" y={16} className="h-full">
      <article id={s.id} aria-labelledby={`${s.id}-name`} className="flex h-full scroll-mt-24 flex-col border border-white/12 bg-white/[0.02] p-6 transition-colors duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] hover:bg-white/[0.05] lg:p-7">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-[family-name:var(--font-cal-ui)] text-[1.25rem] leading-none tabular-nums text-accent">{index}</span>
          <span className={`rounded-full border px-2.5 py-1 ${LABEL} ${s.status === "live" ? "border-white/30 text-ink-1000" : "border-white/12 text-ink-700"}`}>
            {s.status === "live" ? "Priced" : "Quoted at audit"}
          </span>
        </div>
        <p className={`mt-6 text-ink-700 ${LABEL}`}>{s.where}</p>
        <h3 id={`${s.id}-name`} className="mt-2 text-[clamp(1.5rem,2.2vw,2rem)] font-semibold uppercase leading-[0.95] tracking-[-0.045em] text-ink-1000">
          {s.name}
        </h3>
        <dl className="mt-6 grid gap-4 border-t border-white/12 pt-5">
          {rows.map((r) => (
            <div key={r.k}>
              <dt className={`text-ink-600 ${LABEL}`}>{r.k}</dt>
              <dd className="m-0 mt-1 text-[0.9375rem] leading-snug text-ink-900">{r.v}</dd>
            </div>
          ))}
        </dl>
      </article>
    </Reveal>
  );
}

/** A mock of the client dashboard, labelled as an example: invented rows, no claim. */
function DashboardMock() {
  const tiles = [
    { k: "Calls caught", v: "23", d: "this week" },
    { k: "Leads replied", v: "41", d: "under a minute" },
    { k: "Reviews asked", v: "18", d: "since Monday" },
  ];
  const feed = [
    { t: "21:42", e: "Call answered after hours", m: "Table for 6 on Saturday — summary texted" },
    { t: "19:08", e: "New lead replied in 38s", m: "Website form · valuation request" },
    { t: "17:55", e: "Review request sent", m: "Order #1042 · delivered yesterday" },
    { t: "14:20", e: "Invoice reminder sent", m: "INV-2291 · 7 days overdue" },
  ];
  return (
    <Frame tag="Example dashboard" className="bg-[radial-gradient(120%_80%_at_15%_0%,rgba(255,255,255,0.07),transparent_60%)]">
      <div className="px-5 pb-6 pt-14 lg:px-8 lg:pb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/12 pb-4">
          <p className="text-[1rem] font-semibold tracking-[-0.03em] text-ink-1000">Your business, this week</p>
          <p className={`flex items-center gap-2 text-ink-700 ${LABEL}`}>
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
            All systems running
          </p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {tiles.map((t, i) => (
            <Reveal key={t.k} variant="settle" delay={0.15 * i} className="border border-white/10 bg-[#0b0b0b] p-4">
              <p className={`text-ink-700 ${LABEL}`}>{t.k}</p>
              <p className="mt-3 font-[family-name:var(--font-display)] text-[2.5rem] leading-none tabular-nums text-ink-1000">{t.v}</p>
              <p className="mt-2 text-[0.75rem] text-ink-600">{t.d}</p>
            </Reveal>
          ))}
        </div>
        <ol className="mt-5 grid gap-2">
          {feed.map((f, i) => (
            <Reveal key={f.t} as="li" variant="rise" y={10} delay={0.4 + 0.2 * i} className="grid grid-cols-[3.25rem_1fr] gap-3 border-t border-white/10 pt-3 text-[0.875rem]">
              <span className="tabular-nums text-ink-600">{f.t}</span>
              <span>
                <span className="block font-semibold text-ink-1000">{f.e}</span>
                <span className="block text-ink-700">{f.m}</span>
              </span>
            </Reveal>
          ))}
        </ol>
      </div>
    </Frame>
  );
}

/**
 * /ai — THE AI AUTOMATION LANDING PAGE (test, 2026-10-06). One long page whose
 * only job is to book a free automation audit. Built in the inner pages'
 * system (PageHero, the three-column grid, bracketed section labels, the
 * corner-ticked frames, the red accent) so it reads as the same studio as
 * the rest of the site; utomic.framer.website was the reference for the
 * order of sections only. Content rules are at the top of lib/ai-automation.ts.
 */
export function AiAutomationPage() {
  /* Every published price, read from the data /pricing renders, so the two
     pages cannot disagree: the two AI systems, then the CRM band. */
  const crm = rateCard.sections.crm;
  const priced = [
    ...aiSystems.map((s) => ({ id: s.id, title: s.title, lines: s.lines })),
    {
      id: "crm-price",
      title: automationSystems.find((s) => s.id === "crm")?.name ?? crm.label,
      lines: crm.rows.map((r) => ({ label: r.name, value: r.price, detail: r.detail })),
    },
  ];
  return (
    <>
      <PageHero
        id="ai-automation-heading"
        title="AI automation for UK businesses"
        word="automation"
        label="AI Automation"
        ja="自動化"
        count={{ value: two(automationSystems.length), label: "systems" }}
        lede="Systems that answer, follow up and book while you get on with the work. Built around your business, connected to the tools you already use, and looked after every month."
        image="/images/pages/services.webp"
        ctaLabel="Book a free audit"
        ctaHref="#contact"
        aside={
          <JumpList
            rows={[
              { href: "#cost", label: "What it's costing you", tag: "01" },
              { href: "#systems", label: "The systems", tag: "02" },
              { href: "#demo", label: "See it working", tag: "03" },
              { href: "#process", label: "How it works", tag: "04" },
              { href: "#prices", label: "Prices", tag: "05" },
              { href: "#contact", label: "Free audit", tag: "→" },
            ]}
          />
        }
      />

      <div className="bg-ink-0 px-6 sm:px-10">
        <section id="cost" aria-labelledby="cost-heading" className="scroll-mt-24 py-16 lg:py-24">
          <Head
            id="cost-heading"
            index="01"
            label="The leak"
            heading="What missed enquiries cost you."
            lede="Every call that rings out and every form that waits a day is a customer who may go elsewhere. Put in your own numbers."
          />
          <div className="mt-12 lg:mt-16">
            <LossCalculator />
          </div>
        </section>

        <section id="systems" aria-labelledby="systems-heading" className="scroll-mt-24 border-t border-white/12 py-16 lg:py-24">
          <Head
            id="systems-heading"
            index="02"
            label="Systems"
            heading="Seven systems. One less job each."
            lede="Start with the one that fixes your biggest leak, and add the rest when they make sense. Each one names the problem it solves."
          />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {automationSystems.map((s, i) => (
              <SystemCard key={s.id} s={s} index={two(i + 1)} />
            ))}
            <Reveal as="li" variant="rise" y={16} className="h-full lg:col-span-2">
              <div className="flex h-full flex-col justify-between border border-white/12 bg-ink-1000 p-6 text-ink-0 lg:p-7">
                <p className={LABEL}>Not sure where to start?</p>
                <p className="mt-6 text-[clamp(1.5rem,2.2vw,2rem)] font-semibold uppercase leading-[0.95] tracking-[-0.045em]">
                  The free audit tells you where to start.
                </p>
                <HeroCta label="Book a free audit" href="#contact" className="mt-8" />
              </div>
            </Reveal>
          </ul>
        </section>

        <section id="demo" aria-labelledby="demo-heading" className="scroll-mt-24 border-t border-white/12 py-16 lg:py-24">
          <Head
            id="demo-heading"
            index="03"
            label="See it working"
            heading="Answers when you can't."
            lede="The two systems most businesses start with, acted out. Examples, not real customers."
          />
          <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-2">
            <Frame tag="Example call" className="bg-[radial-gradient(120%_80%_at_15%_0%,rgba(255,255,255,0.07),transparent_60%)]">
              <div className="flex min-h-[28rem] items-center justify-center px-6 pb-10 pt-14">
                <CallDemo />
              </div>
            </Frame>
            <Frame tag="Example conversation" className="bg-[radial-gradient(120%_80%_at_15%_0%,rgba(255,255,255,0.07),transparent_60%)]">
              <div className="flex min-h-[28rem] items-center justify-center px-6 pb-10 pt-14">
                <ChatDemo />
              </div>
            </Frame>
          </div>
        </section>

        <section aria-labelledby="dash-heading" className="border-t border-white/12 py-16 lg:py-24">
          <Head
            id="dash-heading"
            index="04"
            label="Control"
            heading="Your business, on autopilot."
            lede="See what every system caught this week in one place: calls answered, leads replied to, reviews asked for, invoices chased."
          />
          <div className="mt-12 lg:mt-16">
            <DashboardMock />
          </div>
        </section>

        <section id="process" aria-labelledby="process-heading" className="scroll-mt-24 border-t border-white/12 py-16 lg:py-24">
          <Head id="process-heading" index="05" label="Process" heading="Audit to autopilot." />
          <ol className="mt-12 grid border-t border-ink-1000 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {automationSteps.map((s, i) => (
              <Reveal key={s.id} as="li" variant="rise" y={12} delay={0.1 * i} className="border-b border-white/12 py-8 sm:pr-8 lg:border-b-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0">
                <span className="font-[family-name:var(--font-cal-ui)] text-[1.25rem] tabular-nums text-accent">{two(i + 1)}</span>
                <h3 className="mt-4 text-[1.5rem] font-semibold uppercase tracking-[-0.045em] text-ink-1000">{s.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-800">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </section>

        <section aria-labelledby="sectors-heading" className="border-t border-white/12 py-16 lg:py-24">
          <Head id="sectors-heading" index="06" label="Who it's for" heading="Built for busy local businesses." />
          <ul className="mt-12 border-t border-ink-1000 lg:mt-16">
            {automationSectors.map((s) => (
              <li key={s.name} className="grid gap-2 border-b border-white/12 py-5 lg:grid-cols-3 lg:gap-0">
                <span className="text-[1.125rem] font-semibold uppercase tracking-[-0.04em] text-ink-1000 lg:pr-10">{s.name}</span>
                <span className="text-[0.9375rem] text-ink-800 lg:col-span-2 lg:pl-3">{s.line}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="prices" aria-labelledby="prices-heading" className="scroll-mt-24 border-t border-white/12 py-16 lg:py-24">
          <Head
            id="prices-heading"
            index="07"
            label="Prices"
            heading="Setup, then monthly."
            lede="The website assistant, the voice receptionist and the CRM have published prices. Everything else is quoted after the free audit, as a one-off setup and a monthly fee, agreed in writing before we start."
          />
          <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-3">
            {priced.map((p) => (
              <div key={p.id} className="border border-white/12 p-6 lg:p-7">
                <p className={`text-ink-700 ${LABEL}`}>Published price</p>
                <h3 className="mt-3 text-[1.5rem] font-semibold uppercase tracking-[-0.045em] text-ink-1000">{p.title}</h3>
                <dl className="mt-6 grid gap-4 border-t border-white/12 pt-5">
                  {p.lines.map((l) => (
                    <div key={l.label}>
                      <dt className={`text-ink-600 ${LABEL}`}>{l.label}</dt>
                      <dd className="m-0 mt-1 text-[1.25rem] font-semibold tracking-[-0.03em] text-ink-1000">{l.value}</dd>
                      {l.detail ? <dd className="m-0 mt-1 text-[0.8125rem] leading-relaxed text-ink-700">{l.detail}</dd> : null}
                    </div>
                  ))}
                </dl>
              </div>
            ))}
            <div className="flex flex-col justify-between border border-white/12 bg-white/[0.04] p-6 lg:col-span-3 lg:flex-row lg:items-end lg:gap-10 lg:p-7">
              <div>
                <p className={`text-ink-700 ${LABEL}`}>Everything else</p>
                <h3 className="mt-3 text-[1.5rem] font-semibold uppercase tracking-[-0.045em] text-ink-1000">Quoted at audit</h3>
                <p className="mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-800">
                  Speed-to-lead, reviews, win-back and admin automation are built to fit, so they are priced to fit: a fixed setup and a monthly fee, both in writing.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 lg:w-[calc((100%-5rem)/3)] lg:shrink-0">
                <HeroCta label="Book a free audit" href="#contact" light />
              </div>
            </div>
          </div>
          <p className="mt-6 text-[0.875rem] text-ink-700">
            Every published price is also on the{" "}
            <a href="/pricing#add-ons" className="text-ink-1000 underline underline-offset-4 hover:text-accent">
              pricing page
            </a>
            , with its full terms.
          </p>
        </section>

        <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-24 border-t border-white/12 py-16 lg:py-24">
          <Head id="faq-heading" index="08" label="Questions" heading="Before you book." />
          <div className="mt-12 lg:ml-[33.333%] lg:mt-16 lg:pl-3">
            <FaqAccordion items={automationFaqs} />
          </div>
        </section>
      </div>

      <Contact />
    </>
  );
}
