import { nav } from "@/lib/content";
import { Monogram } from "@/components/monogram";

/** Static mock-ups of two header treatments, shown over the hero still. */
function Bar({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-[15rem] overflow-hidden rounded-2xl bg-black">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/hero-frames/d/001.webp" alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="relative">{children}</div>
    </div>
  );
}

const linkCls = "text-[0.8125rem] font-semibold uppercase tracking-[0.04em] text-white/85";

function Cta() {
  return (
    <span className="flex items-center gap-2">
      <span className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black">Book a call</span>
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20">
        <span className="flex flex-col gap-1.5">
          <span className="block h-px w-4 bg-white" />
          <span className="block h-px w-4 bg-white" />
        </span>
      </span>
    </span>
  );
}

/** A — the monogram centred, nav on the left, actions on the right. */
export function HeaderA() {
  return (
    <Bar>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-8 py-5">
        <nav className="flex gap-7">
          {nav.map((n) => (
            <span key={n.href} className={linkCls}>
              {n.label}
            </span>
          ))}
        </nav>
        <Monogram id="hdr-a" className="h-10 w-10" />
        <span className="justify-self-end">
          <Cta />
        </span>
      </div>
    </Bar>
  );
}

/** B — monogram + a tight wordmark lock-up on the left, nav centred. */
export function HeaderB() {
  return (
    <Bar>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-8 py-5">
        <span className="flex items-center gap-3">
          <Monogram id="hdr-b" className="h-9 w-9" />
          <span className="flex flex-col leading-none">
            <span className="display-brand text-[0.9375rem] text-white">Black Line</span>
            <span className="mt-1 font-mono text-[0.5625rem] uppercase tracking-[0.4em] text-white/55">Agency</span>
          </span>
        </span>
        <nav className="flex gap-7">
          {nav.map((n) => (
            <span key={n.href} className={linkCls}>
              {n.label}
            </span>
          ))}
        </nav>
        <span className="justify-self-end">
          <Cta />
        </span>
      </div>
    </Bar>
  );
}
