import type { CSSProperties } from "react";
import { aiExamples } from "@/lib/content";
import { Reveal } from "@/components/reveal";
import { LABEL } from "./page-grid";

/* The two acted-out examples on /ai (moved here from the retired
   /services/ai page, 2026-10-06). The copy is `aiExamples` in content.ts:
   invented, labelled "Example", and only acting out what the `aiSystems`
   summaries say. */

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

