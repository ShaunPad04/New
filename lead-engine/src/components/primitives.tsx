import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/ui";
import { TIER_LABELS } from "@/lib/domain/scoring";
import { STATUS_LABELS } from "@/lib/domain/status";
import type { LeadStatus, Tier } from "@/lib/domain/types";

/** The outer-tray / inner-plate card used for every surface in the product. */
export function Panel({
  children,
  className,
  innerClassName,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div className={cn("bezel", className)}>
      <div className={cn("bezel-core", innerClassName)}>{children}</div>
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}

export function SectionHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h2 className="text-lg font-semibold tracking-tight text-ink-900">{title}</h2>
        {description ? <p className="mt-1 text-sm leading-relaxed text-ink-700">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

const TIER_STYLES: Record<Tier, string> = {
  high_intent: "border-signal-high/40 bg-signal-high/10 text-signal-high",
  potential: "border-signal-potential/40 bg-signal-potential/10 text-signal-potential",
  prospect: "border-ink-500 bg-ink-300/50 text-ink-700",
  disqualified: "border-ink-400 bg-ink-200 text-ink-600",
};

export function TierBadge({ tier, className }: { tier: Tier; className?: string }) {
  const meta = TIER_LABELS[tier];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.08em]",
        TIER_STYLES[tier],
        className,
      )}
    >
      <span aria-hidden="true">{meta.mark}</span>
      {meta.label}
    </span>
  );
}

const BOOKED_STATUSES = new Set<LeadStatus>(["booked"]);
const CLOSED_BAD = new Set<LeadStatus>(["lost", "not_qualified", "no_response", "duplicate", "not_suitable"]);

export function StatusPill({ status }: { status: LeadStatus }) {
  const tone = BOOKED_STATUSES.has(status)
    ? "border-signal-good/40 bg-signal-good/10 text-signal-good"
    : CLOSED_BAD.has(status)
      ? "border-signal-bad/30 bg-signal-bad/10 text-signal-bad"
      : "border-ink-400 bg-ink-200 text-ink-800";
  return (
    <span className={cn("inline-flex whitespace-nowrap rounded-md border px-2 py-0.5 text-xs", tone)}>
      {STATUS_LABELS[status]}
    </span>
  );
}

/** A score with its rubric denominator, so 91 never reads as a percentage by accident. */
export function ScoreBadge({ total, max, size = "sm" }: { total: number; max: number; size?: "sm" | "lg" }) {
  const ratio = total / max;
  const tone = ratio >= 0.75 ? "text-signal-high" : ratio >= 0.55 ? "text-signal-potential" : "text-ink-700";
  return (
    <span className={cn("metric", tone, size === "lg" ? "text-4xl" : "text-sm font-medium")}>
      {total}
      <span className={cn("text-ink-600", size === "lg" ? "text-xl" : "text-xs")}>/{max}</span>
    </span>
  );
}

export function Stat({
  label,
  value,
  sub,
  href,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  href?: string;
}) {
  const body = (
    <div className="px-5 py-4">
      <p className="field-label">{label}</p>
      <p className="metric mt-2 text-3xl leading-none text-ink-900">{value}</p>
      {sub ? <p className="mt-2 text-xs leading-relaxed text-ink-600">{sub}</p> : null}
    </div>
  );
  if (!href) return <Panel>{body}</Panel>;
  return (
    <Panel className="transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5">
      <Link href={{ pathname: href }} className="block">
        {body}
      </Link>
    </Panel>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <p className="text-sm font-medium text-ink-800">{title}</p>
      <p className="max-w-md text-sm leading-relaxed text-ink-600">{body}</p>
      {action}
    </div>
  );
}

/** A visible, dismissible-by-fixing warning. Used wherever data is incomplete by design. */
export function Notice({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warn" | "danger";
  title: string;
  children?: ReactNode;
}) {
  const tones = {
    info: "border-ink-400 bg-ink-200/60 text-ink-800",
    warn: "border-signal-potential/30 bg-signal-potential/[0.07] text-signal-potential",
    danger: "border-signal-bad/30 bg-signal-bad/[0.07] text-signal-bad",
  } as const;
  return (
    <div className={cn("rounded-xl border px-4 py-3", tones[tone])}>
      <p className="text-sm font-medium">{title}</p>
      {children ? <div className="mt-1 text-sm leading-relaxed opacity-85">{children}</div> : null}
    </div>
  );
}
