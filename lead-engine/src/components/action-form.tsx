"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";
import { cn } from "@/lib/ui";
import type { ActionState } from "@/app/actions";

const EMPTY: ActionState = { ok: true, message: "" };

/**
 * Wraps a server action that returns an ActionState and shows what it said.
 * Outcomes are reported verbatim — including the awkward ones, like a run that
 * could not start because nothing is configured.
 */
export function ActionForm({
  action,
  children,
  className,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  children: ReactNode;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, EMPTY);
  return (
    <form action={formAction} className={cn("space-y-4", className)} aria-busy={pending}>
      {children}
      {state.message ? (
        <div
          role="status"
          className={cn(
            "rounded-lg border px-3.5 py-2.5 text-sm",
            state.ok
              ? "border-signal-good/30 bg-signal-good/[0.07] text-signal-good"
              : "border-signal-bad/30 bg-signal-bad/[0.07] text-signal-bad",
          )}
        >
          <p>{state.message}</p>
          {state.detail && state.detail.length > 0 ? (
            <ul className="mt-1 list-disc space-y-0.5 pl-4 opacity-85">
              {state.detail.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}

export function SubmitButton({
  children,
  variant = "primary",
  className,
}: {
  children: ReactNode;
  variant?: "primary" | "ghost" | "danger";
  className?: string;
}) {
  const { pending } = useFormStatus();
  const variants = {
    primary: "bg-ink-900 text-ink-0 hover:-translate-y-0.5",
    ghost: "border border-ink-400 text-ink-800 hover:border-ink-500 hover:text-ink-1000",
    danger: "border border-signal-bad/40 text-signal-bad hover:bg-signal-bad/10",
  } as const;
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] disabled:cursor-progress disabled:opacity-60",
        variants[variant],
        className,
      )}
    >
      {children}
      {pending ? <span className="font-mono text-[11px] uppercase tracking-[0.1em]">working…</span> : null}
    </button>
  );
}
