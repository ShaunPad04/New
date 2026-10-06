import { aiSystems, rateCard } from "@/lib/content";
import { automationPageFaqs, automationSectors, automationSteps, automationSystems } from "@/lib/ai-automation";
import { Reveal } from "@/components/reveal";
import { Contact } from "@/components/contact";
import { FaqAccordion } from "./faq-accordion";
import { HeroCta } from "./hero-cta";
import { H2, LABEL } from "./page-grid";
import { CallDemo, ChatDemo } from "./ai-demos";
import { LossCalculator } from "./loss-calculator";
import { DemoCall } from "./demo-call";
import { AiHero } from "./ai-hero";

/* The live voice demo appears once both values are set in Vercel (a Retell
   PUBLIC key locked to our domains, and the demo agent id); until then the
   acted-out example call shows in its place. */
const DEMO_KEY = process.env.NEXT_PUBLIC_RETELL_PUBLIC_KEY ?? "";
const DEMO_AGENT = process.env.NEXT_PUBLIC_RETELL_DEMO_AGENT_ID ?? "";
const DEMO_MINUTES = 3;

const two = (n: number) => String(n).padStart(2, "0");

/** Utomic-style section top: a pill eyebrow, a big centred heading, a short lede. */
function Head({ id, index, label, heading, lede }: { id: string; index: string; label: string; heading: string; lede?: string }) {
  return (
    <div className="mx-auto flex max-w-[52rem] flex-col items-center text-center">
      <p className={`inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-ink-800 ${LABEL}`}>
        <span className="tabular-nums text-accent">{index}</span>
        <span aria-hidden="true" className="h-3 w-px bg-white/20" />
        {label}
      </p>
      <h2 id={id} className={`${H2} mt-6 text-balance`}>
        {heading}
      </h2>
      {lede ? <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-[1.45] tracking-[-0.02em] text-ink-800">{lede}</p> : null}
    </div>
  );
}

/** The glass card every block sits in: rounded, a hairline, a faint top light. */
const CARD = "relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.012))]";

/** A soft red light that comes up under the pointer's card. */
function Glow({ at = "50% 0%" }: { at?: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] group-hover:opacity-100"
      style={{ background: `radial-gradient(70% 60% at ${at}, rgba(240,43,66,0.22), transparent 70%)` }}
    />
  );
}

/** A panel for the demos and the dashboard, with its tag top left. */
function Frame({ children, className = "", tag }: { children: React.ReactNode; className?: string; tag?: string }) {
  return (
    <div className={`${CARD} ${className}`}>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(240,43,66,0.12),transparent_70%)]" />
      {tag ? (
        <p className={`absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/40 px-3 py-1 text-ink-700 ${LABEL}`}>
          <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
          {tag}
        </p>
      ) : null}
      <div className="relative">{children}</div>
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
      <article id={s.id} aria-labelledby={`${s.id}-name`} className={`group flex h-full scroll-mt-24 flex-col p-6 transition-[border-color,transform] duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:border-accent/40 lg:p-7 ${CARD}`}>
        <Glow />
        <div className="relative flex items-center justify-between gap-4">
          <span className="grid size-11 place-items-center rounded-2xl border border-accent/30 bg-accent/10 font-[family-name:var(--font-cal-ui)] text-[1rem] tabular-nums text-accent">{index}</span>
          <span className={`rounded-full border px-2.5 py-1 ${LABEL} ${s.status === "live" ? "border-white/30 text-ink-1000" : "border-white/12 text-ink-700"}`}>
            {s.status === "live" ? "Priced" : "Quoted at audit"}
          </span>
        </div>
        <p className={`relative mt-7 text-ink-700 ${LABEL}`}>{s.where}</p>
        <h3 id={`${s.id}-name`} className="relative mt-2 text-[clamp(1.5rem,2.2vw,2rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-ink-1000">
          {s.name}
        </h3>
        <dl className="relative mt-6 grid gap-4 border-t border-white/10 pt-5">
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
    <Frame tag="Example dashboard">
      <div className="px-5 pb-6 pt-16 lg:px-8 lg:pb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/12 pb-4">
          <p className="text-[1rem] font-semibold tracking-[-0.03em] text-ink-1000">Your business, this week</p>
          <p className={`flex items-center gap-2 text-ink-700 ${LABEL}`}>
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
            All systems running
          </p>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {tiles.map((t, i) => (
            <Reveal key={t.k} variant="settle" delay={0.15 * i} className="rounded-2xl border border-white/10 bg-black/50 p-4">
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
 * The three big numbers, after Utomic's stat cards (Brad, 2026-10-06: "showing
 * how much faster it is … efficiency … consistent … accuracy"). These are
 * what each system is BUILT to do, from lib/ai-automation.ts, not client
 * results; the footnote says so. Swap in measured client numbers only once
 * a client has them and agrees to them being used.
 */
function Stats() {
  const big = "display text-[clamp(4rem,8vw,7rem)] leading-[0.85] tabular-nums";
  return (
    <section aria-labelledby="stats-heading" className="relative pb-4 pt-20 lg:pt-28">
      <h2 id="stats-heading" className="sr-only">
        What changes
      </h2>
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Speed: red glass with a light streak. */}
        <Reveal variant="rise" y={16} className="relative min-h-[24rem] overflow-hidden rounded-[28px] bg-[linear-gradient(145deg,#5a0b16_0%,#b3192d_45%,#f02b42_75%,#ff6b7c_100%)] p-7 lg:min-h-[28rem] lg:p-10">
          <span aria-hidden="true" className="pointer-events-none absolute -right-1/4 top-0 h-[180%] w-px origin-top rotate-[38deg] bg-gradient-to-b from-white/0 via-white/70 to-white/0" />
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_85%_10%,rgba(255,255,255,0.25),transparent_60%)]" />
          <div className="relative flex h-full flex-col justify-end text-white">
            <p className={big} style={{ textTransform: "none" }}>&lt;60s</p>
            <h3 className="mt-5 text-[1.5rem] font-semibold tracking-[-0.03em]">First reply to every enquiry</h3>
            <p className="mt-3 max-w-[40ch] text-[0.9375rem] leading-relaxed text-white/80">Speed-to-lead answers new forms, ad leads and missed calls by text or email within a minute, while they still want to talk.</p>
          </div>
        </Reveal>

        {/* Coverage: black with chrome rings. */}
        <Reveal variant="rise" y={16} delay={0.1} className="relative min-h-[24rem] overflow-hidden rounded-[28px] border border-white/10 bg-black p-7 lg:min-h-[28rem] lg:p-10">
          <svg aria-hidden="true" viewBox="0 0 400 400" className="pointer-events-none absolute -right-24 -top-28 w-[26rem] opacity-90">
            <defs>
              <linearGradient id="ring-chrome" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ffffff" />
                <stop offset="0.3" stopColor="#5c5c5c" />
                <stop offset="0.55" stopColor="#f2f2f2" />
                <stop offset="0.8" stopColor="#2a2a2a" />
                <stop offset="1" stopColor="#f02b42" />
              </linearGradient>
            </defs>
            {Array.from({ length: 14 }, (_, i) => (
              <ellipse key={i} cx="200" cy="200" rx={60 + i * 9} ry={34 + i * 5} transform={`rotate(${-28 + i * 4} 200 200)`} fill="none" stroke="url(#ring-chrome)" strokeWidth="2.5" opacity={1 - i * 0.05} />
            ))}
          </svg>
          <div className="relative flex h-full flex-col justify-end">
            <p className={`${big} text-ink-1000`}>100%</p>
            <h3 className="mt-5 text-[1.5rem] font-semibold tracking-[-0.03em] text-ink-1000">Of overflow calls picked up</h3>
            <p className="mt-3 max-w-[40ch] text-[0.9375rem] leading-relaxed text-ink-800">When the line is busy or the office is shut, the voice receptionist answers, takes the enquiry and texts you a summary.</p>
          </div>
        </Reveal>

        {/* Consistency: wide, with a chrome ring. */}
        <Reveal variant="rise" y={16} delay={0.2} className={`relative min-h-[22rem] p-7 pt-36 sm:pt-7 lg:col-span-2 lg:p-10 ${CARD}`}>
          <span aria-hidden="true" className="pointer-events-none absolute -right-28 -top-28 size-[16rem] rounded-full opacity-90 sm:-right-20 sm:-top-24 sm:size-[26rem] bg-[conic-gradient(from_210deg,#ffffff,#3a3a3a,#e8e8e8,#111,#f02b42,#d9d9d9,#ffffff)] [mask-image:radial-gradient(closest-side,transparent_62%,#000_64%,#000_98%,transparent_100%)] lg:right-10" />
          <span aria-hidden="true" className="pointer-events-none absolute -right-28 -top-28 size-[16rem] rounded-full sm:-right-20 sm:-top-24 sm:size-[26rem] shadow-[0_0_120px_rgba(240,43,66,0.25)] lg:right-10" />
          <div className="relative flex h-full max-w-[44ch] flex-col justify-end">
            <p className={`${big} text-ink-1000`}>0</p>
            <h3 className="mt-5 text-[1.5rem] font-semibold tracking-[-0.03em] text-ink-1000">Follow-ups forgotten</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-800">
              Follow-ups, review requests and invoice reminders send themselves on schedule. Every system answers from the same trained knowledge, so customers get the same answer every time, and anything it is unsure of goes to a person.
            </p>
          </div>
        </Reveal>
      </div>
      <p className="mt-5 text-center text-[0.8125rem] text-ink-600">What each system is built to do, not a client result.</p>
    </section>
  );
}

/**
 * /ai — THE AI AUTOMATION LANDING PAGE. One long page whose only job is to
 * book a free automation audit.
 *
 * 2026-10-06, second pass (Brad: "a landing page like this one on framer
 * [utomic.framer.website] … with a cool design", black + Black Line red,
 * whole page restyled, site header and footer kept): a cinematic hero with a
 * live 3D core that follows the mouse (`ai-hero.tsx`), then centred section
 * heads with pill eyebrows, rounded glass cards with a red glow, and a big
 * closing call to action. The content and its rules are unchanged (top of
 * lib/ai-automation.ts): no invented numbers, examples labelled as examples.
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
  const liveDemo = Boolean(DEMO_KEY && DEMO_AGENT);
  const section = "relative scroll-mt-24 py-20 lg:py-32";
  return (
    <>
      <AiHero systems={automationSystems.map((s) => s.name)} />

      <div className="relative isolate overflow-hidden bg-ink-0 px-6 sm:px-10">
        {/* Red light pooled down the page, behind everything. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[8%] h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(240,43,66,0.12),transparent)]" />
          <div className="absolute left-[-20rem] top-[38%] h-[40rem] w-[50rem] rounded-full bg-[radial-gradient(closest-side,rgba(240,43,66,0.08),transparent)]" />
          <div className="absolute right-[-20rem] top-[68%] h-[40rem] w-[50rem] rounded-full bg-[radial-gradient(closest-side,rgba(240,43,66,0.09),transparent)]" />
        </div>

        <div className="mx-auto max-w-[84rem]">
          <Stats />

          <section id="cost" aria-labelledby="cost-heading" className={section}>
            <Head
              id="cost-heading"
              index="01"
              label="The leak"
              heading="What missed enquiries cost you."
              lede="Every call that rings out and every form that waits a day is a customer who may go elsewhere. Put in your own numbers."
            />
            <div className={`mt-14 p-6 sm:p-8 lg:mt-20 lg:p-12 ${CARD}`}>
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_100%_100%,rgba(240,43,66,0.14),transparent_70%)]" />
              <div className="relative">
                <LossCalculator />
              </div>
            </div>
          </section>

          <section id="systems" aria-labelledby="systems-heading" className={section}>
            <Head
              id="systems-heading"
              index="02"
              label="Systems"
              heading="Seven systems. One less job each."
              lede="Start with the one that fixes your biggest leak, and add the rest when they make sense. Each one names the problem it solves."
            />
            <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
              {automationSystems.map((s, i) => (
                <SystemCard key={s.id} s={s} index={two(i + 1)} />
              ))}
              <Reveal as="li" variant="rise" y={16} className="h-full lg:col-span-2">
                {/* The audit, shown rather than shouted (Brad, 2026-10-06: the
                    flat red card was "bland" and "unnecessarily big"): a dark
                    card, the pitch on the left, an example audit on the right. */}
                <div className={`group grid h-full gap-8 p-6 sm:grid-cols-2 lg:p-8 ${CARD}`}>
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_90%_at_0%_100%,rgba(240,43,66,0.22),transparent_70%)]" />
                  <div className="relative flex flex-col justify-between gap-6">
                    <div>
                      <p className={`inline-flex items-center gap-2 text-accent ${LABEL}`}>
                        <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
                        Not sure where to start?
                      </p>
                      <p className="mt-4 text-[clamp(1.5rem,2.2vw,2rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-ink-1000">The free audit finds your biggest leak first.</p>
                      <p className="mt-3 max-w-[36ch] text-[0.9375rem] leading-relaxed text-ink-800">One call. We rank where enquiries and hours slip away, and tell you which system pays back first.</p>
                    </div>
                    <HeroCta label="Book a free audit" href="#contact" light className="sm:max-w-[18rem]" />
                  </div>
                  <div className="relative flex flex-col rounded-2xl border border-white/10 bg-black/60 p-5">
                    <div className="flex items-center justify-between">
                      <p className={`text-ink-700 ${LABEL}`}>Example audit</p>
                      <p className={`text-ink-600 ${LABEL}`}>Leak size</p>
                    </div>
                    <ol className="mt-4 grid gap-4">
                      {[
                        { k: "Calls missed after 5pm", v: 0.92, first: true },
                        { k: "Web enquiries waiting overnight", v: 0.74 },
                        { k: "Quotes typed out by hand", v: 0.48 },
                        { k: "Reviews never asked for", v: 0.3 },
                      ].map((r) => (
                        <li key={r.k}>
                          <div className="flex items-center justify-between gap-3 text-[0.875rem]">
                            <span className={r.first ? "font-semibold text-ink-1000" : "text-ink-800"}>{r.k}</span>
                            {r.first ? <span className={`shrink-0 rounded-full bg-accent px-2 py-0.5 text-white ${LABEL}`}>Fix first</span> : null}
                          </div>
                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                              className={`h-full origin-left rounded-full transition-transform duration-1000 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] ${r.first ? "bg-accent shadow-[0_0_12px_rgba(240,43,66,0.6)]" : "bg-white/35"}`}
                              style={{ transform: `scaleX(${r.v})` }}
                            />
                          </div>
                        </li>
                      ))}
                    </ol>
                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4 max-sm:mt-6">
                      <span className={`text-ink-600 ${LABEL}`}>Start with</span>
                      <span className="flex items-center gap-2 text-[0.9375rem] font-semibold text-ink-1000">
                        AI Voice Receptionist
                        <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 text-accent">
                          <path d="M4 10h12M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </ul>
          </section>

          <section id="demo" aria-labelledby="demo-heading" className={section}>
            <Head
              id="demo-heading"
              index="03"
              label="See it working"
              heading="Answers when you can't."
              lede={liveDemo ? "Talk to our own AI receptionist in your browser, then see how the website assistant handles an enquiry (an example, not a real customer)." : "The two systems most businesses start with, acted out. Examples, not real customers."}
            />
            <div className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-2">
              <Frame tag={liveDemo ? "Live demo — try it" : "Example call"}>
                <div className="flex min-h-[30rem] items-center justify-center px-6 pb-10 pt-16">
                  {liveDemo ? <DemoCall publicKey={DEMO_KEY} agentId={DEMO_AGENT} maxMinutes={DEMO_MINUTES} /> : <CallDemo />}
                </div>
              </Frame>
              <Frame tag="Example conversation">
                <div className="flex min-h-[30rem] items-center justify-center px-6 pb-10 pt-16">
                  <ChatDemo />
                </div>
              </Frame>
            </div>
          </section>

          <section aria-labelledby="dash-heading" className={section}>
            <Head
              id="dash-heading"
              index="04"
              label="Control"
              heading="Everything it caught, in one place."
              lede="See what every system did this week: calls answered, leads replied to, reviews asked for, invoices chased."
            />
            <div className="mx-auto mt-14 max-w-[64rem] lg:mt-20">
              <DashboardMock />
            </div>
          </section>

          <section id="process" aria-labelledby="process-heading" className={section}>
            <Head id="process-heading" index="05" label="Process" heading="Audit to autopilot." lede="Four steps, and you only have to be in the first one for long." />
            <ol className="relative mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
              <span aria-hidden="true" className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[2.375rem] hidden h-px bg-gradient-to-r from-accent/0 via-accent/60 to-accent/0 lg:block" />
              {automationSteps.map((s, i) => (
                <Reveal key={s.id} as="li" variant="rise" y={12} delay={0.1 * i} className={`group p-6 lg:p-7 ${CARD}`}>
                  <Glow />
                  <span className="relative grid size-11 place-items-center rounded-full border border-accent/40 bg-black font-[family-name:var(--font-cal-ui)] text-[1rem] tabular-nums text-accent shadow-[0_0_24px_rgba(240,43,66,0.35)]">{two(i + 1)}</span>
                  <h3 className="relative mt-6 text-[1.5rem] font-semibold tracking-[-0.045em] text-ink-1000">{s.title}</h3>
                  <p className="relative mt-3 text-[0.9375rem] leading-relaxed text-ink-800">{s.body}</p>
                </Reveal>
              ))}
            </ol>
          </section>

          <section aria-labelledby="sectors-heading" className={section}>
            <Head id="sectors-heading" index="06" label="Who it's for" heading="Built for busy local businesses." />
            <ul className="mt-14 grid gap-3 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
              {automationSectors.map((s) => (
                <li key={s.name} className={`group p-5 ${CARD}`}>
                  <Glow at="0% 50%" />
                  <span className="relative flex items-center gap-3 text-[1.0625rem] font-semibold tracking-[-0.03em] text-ink-1000">
                    <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent" />
                    {s.name}
                  </span>
                  <span className="relative mt-2 block pl-[1.125rem] text-[0.9375rem] leading-snug text-ink-800">{s.line}</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="prices" aria-labelledby="prices-heading" className={section}>
            <Head
              id="prices-heading"
              index="07"
              label="Prices"
              heading="Setup, then monthly."
              lede="The website assistant, the voice receptionist and the CRM have published prices. Everything else is quoted after the free audit, as a one-off setup and a monthly fee, agreed in writing before we start."
            />
            <div className="mt-14 grid gap-4 lg:mt-20 lg:grid-cols-3">
              {priced.map((p) => (
                <div key={p.id} className={`group p-6 lg:p-8 ${CARD}`}>
                  <Glow />
                  <p className={`relative text-ink-700 ${LABEL}`}>Published price</p>
                  <h3 className="relative mt-3 text-[1.5rem] font-semibold tracking-[-0.045em] text-ink-1000">{p.title}</h3>
                  <dl className="relative mt-6 grid gap-4 border-t border-white/10 pt-5">
                    {p.lines.map((l) => (
                      <div key={l.label}>
                        <dt className={`text-ink-600 ${LABEL}`}>{l.label}</dt>
                        <dd className="m-0 mt-1 font-[family-name:var(--font-display)] text-[1.75rem] leading-none tracking-[-0.03em] text-ink-1000">{l.value}</dd>
                        {l.detail ? <dd className="m-0 mt-2 text-[0.8125rem] leading-relaxed text-ink-700">{l.detail}</dd> : null}
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
              <div className={`flex flex-col justify-between p-6 lg:col-span-3 lg:flex-row lg:items-end lg:gap-10 lg:p-8 ${CARD}`}>
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_120%_at_100%_100%,rgba(240,43,66,0.16),transparent_70%)]" />
                <div className="relative">
                  <p className={`text-ink-700 ${LABEL}`}>Everything else</p>
                  <h3 className="mt-3 text-[1.5rem] font-semibold tracking-[-0.045em] text-ink-1000">Quoted at audit</h3>
                  <p className="mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-800">
                    Speed-to-lead, reviews, win-back and admin automation are built to fit, so they are priced to fit: a fixed setup and a monthly fee, both in writing.
                  </p>
                </div>
                <div className="relative mt-8 lg:mt-0 lg:w-[calc((100%-5rem)/3)] lg:shrink-0">
                  <HeroCta label="Book a free audit" href="#contact" light />
                </div>
              </div>
            </div>
            <p className="mt-6 text-center text-[0.875rem] text-ink-700">
              Every published price is also on the{" "}
              <a href="/pricing#add-ons" className="text-ink-1000 underline underline-offset-4 hover:text-accent">
                pricing page
              </a>
              , with its full terms.
            </p>
          </section>

          <section id="faq" aria-labelledby="faq-heading" className={section}>
            <Head id="faq-heading" index="08" label="Questions" heading="Before you book." />
            <div className="mx-auto mt-14 max-w-[52rem] lg:mt-20">
              <FaqAccordion items={automationPageFaqs} />
            </div>
          </section>

          {/* The closing call: one big line, one button. */}
          <section aria-labelledby="close-heading" className="relative pb-20 lg:pb-32">
            <div className="relative overflow-hidden rounded-[36px] border border-accent/30 bg-[radial-gradient(70%_120%_at_50%_100%,rgba(240,43,66,0.45),rgba(240,43,66,0.06)_55%,transparent)] px-6 py-16 text-center sm:px-10 lg:py-24">
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.15] [background-image:radial-gradient(rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(60%_70%_at_50%_100%,#000,transparent)]" />
              <p className={`relative text-ink-800 ${LABEL}`}>Free automation audit</p>
              <h2 id="close-heading" className="display relative mx-auto mt-6 max-w-[16ch] text-[clamp(2.5rem,6.5vw,6rem)] leading-[0.9] text-ink-1000">
                Stop missing the ones that matter.
              </h2>
              <p className="relative mx-auto mt-6 max-w-[46ch] text-[1.0625rem] leading-[1.45] text-ink-800">
                One call to find where enquiries and hours leak out of your business, and which system to fix first.
              </p>
              <div className="relative mx-auto mt-10 max-w-[22rem]">
                <HeroCta label="Book a free audit" href="#contact" light />
              </div>
            </div>
          </section>
        </div>
      </div>

      <Contact />
    </>
  );
}
