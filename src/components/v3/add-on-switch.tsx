"use client";

import { useId, useState } from "react";

/**
 * The add-a-plan switch on a build tier (Brad, 2026-09-26; the inner pages'
 * system 2026-10-02). The plan appears as its OWN "+ £X/month" line under
 * the switch, never summed into the build price: one is one-off, the other
 * monthly. The line arrives whole from the server (figures read from
 * `retainerTiers`), so this island carries no copy file into the browser.
 */
export function AddOnSwitch({ plan, line }: { plan: string; line: string }) {
  const [on, setOn] = useState(false);
  const id = useId();
  return (
    <div className="mt-6">
      <div className="flex min-h-12 items-center justify-between gap-4 border-y border-ink-300">
        <label htmlFor={id} className="text-[0.9375rem] text-ink-900">
          Add the {plan} plan
        </label>
        <button id={id} type="button" role="switch" aria-checked={on} onClick={() => setOn((v) => !v)} className="group grid h-11 w-14 shrink-0 place-items-center">
          {/* Square track and knob, on the site's hairline language; the knob
              travels on transform only, reduced motion keeps the state. */}
          <span aria-hidden="true" className={`relative block h-6 w-11 border transition-colors duration-300 ${on ? "border-accent bg-accent" : "border-ink-500"}`}>
            <span
              className={`absolute left-[3px] top-[3px] size-4 transition-[transform,background-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${
                on ? "translate-x-5 bg-white" : "bg-ink-600 group-hover:bg-ink-800"
              }`}
            />
          </span>
        </button>
      </div>
      <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <p aria-live="polite" className="overflow-hidden text-[0.8125rem] leading-relaxed text-ink-900">
          {on ? <span className="block pt-3">{line}</span> : null}
        </p>
      </div>
    </div>
  );
}
