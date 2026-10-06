"use client";

import { useId, useState } from "react";

const LABEL = "text-[0.75rem] font-bold uppercase tracking-[-0.02em]";
const gbp = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;

/**
 * "What missed enquiries cost you" — the visitor's own three numbers, the sum
 * shown in full beside the answer so it reads as their estimate, never our
 * claim. No figures of ours: the defaults are deliberately modest and
 * labelled as a starting point.
 */
export function LossCalculator() {
  const base = useId();
  const [missed, setMissed] = useState(10);
  const [rate, setRate] = useState(30);
  const [value, setValue] = useState(150);

  const perYear = missed * (rate / 100) * value * 52;

  const fields = [
    { id: "missed", label: "Missed calls & enquiries a week", min: 1, max: 100, step: 1, v: missed, set: setMissed, show: String(missed) },
    { id: "rate", label: "Share that would have become customers", min: 5, max: 80, step: 5, v: rate, set: setRate, show: `${rate}%` },
    { id: "value", label: "Average value of a customer", min: 20, max: 5000, step: 10, v: value, set: setValue, show: gbp(value) },
  ];

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-10">
      <div className="grid gap-8">
        {fields.map((f) => (
          <div key={f.id}>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor={`${base}-${f.id}`} className={`${LABEL} text-ink-700`}>
                {f.label}
              </label>
              <output htmlFor={`${base}-${f.id}`} className="text-[1.125rem] font-semibold tabular-nums tracking-[-0.03em] text-ink-1000">
                {f.show}
              </output>
            </div>
            <input
              id={`${base}-${f.id}`}
              type="range"
              min={f.min}
              max={f.max}
              step={f.step}
              value={f.v}
              onChange={(e) => f.set(Number(e.target.value))}
              className="loss-range -mb-[21px] -mt-[5px] w-full"
            />
          </div>
        ))}
        <p className="text-[0.8125rem] leading-relaxed text-ink-600">
          Your figures, your estimate. Start from a normal week; the defaults are only a starting point.
        </p>
      </div>

      <div className="relative flex flex-col justify-between border border-white/12 bg-[radial-gradient(120%_80%_at_85%_0%,rgba(240,43,66,0.12),transparent_60%)] p-6 lg:p-8">
        <div>
          <p className={`${LABEL} text-ink-700`}>Walking out of the door each year</p>
          <p aria-live="polite" className="mt-4 font-[family-name:var(--font-display)] text-[clamp(3rem,7vw,5.5rem)] leading-[0.9] tracking-[-0.03em] text-ink-1000 tabular-nums">
            {/* Tabular digits keep the total from jittering as it changes, but
                Cal Sans gives the comma a digit's width too ("£23 , 400"), so
                the comma alone is set proportional. */}
            {gbp(perYear)
              .split(/(,)/)
              .map((part, i) => (part === "," ? <span key={i} className="[font-variant-numeric:normal]">,</span> : part))}
          </p>
        </div>
        <p className="mt-10 text-[0.875rem] leading-relaxed text-ink-700">
          {missed} a week × {rate}% × {gbp(value)} × 52 weeks. The free audit works out how much of it a system could catch,
          and whether that is worth more than it costs.
        </p>
      </div>
    </div>
  );
}
