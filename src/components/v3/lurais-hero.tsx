import Image from "next/image";
import Link from "next/link";
import { heroDisciplines, projects, site } from "@/lib/content";
import { LocalTime } from "./local-time";

/**
 * HERO — Lurais layout, Black Line content.
 *
 * Full-bleed picture (the first frame of the client's own hero film), a thin
 * top bar, disciplines top-left, studio town and live UK time top-right, and
 * the name set enormous across the foot with the project count beside it.
 * The count is read from `projects`, so it is always true.
 *
 * Preview-only composition: the live homepage keeps the scrubbed film. If
 * this direction is chosen, the film drops back in behind this layout.
 */
export function LuraisHero({ headingId }: { headingId: string }) {
  const count = String(projects.length).padStart(2, "0");
  return (
    <section
      aria-labelledby={headingId}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#000] text-white"
    >
      <Image
        src="/hero-frames/d/001.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover opacity-80"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgb(0 0 0 / 0.55) 0%, rgb(0 0 0 / 0.1) 30%, rgb(0 0 0 / 0.15) 55%, rgb(0 0 0 / 0.8) 100%)",
        }}
      />

      {/* Top bar */}
      <div className="grid grid-cols-2 items-center px-6 pt-6 text-[0.8125rem] font-semibold uppercase tracking-[0.02em] sm:grid-cols-3 sm:px-8">
        <Link href="/" className="display-brand text-sm">
          {site.name}
        </Link>
        <a href={`mailto:${site.email}`} className="hidden justify-self-center sm:block">
          {site.email}
        </a>
        <span aria-hidden="true" className="flex flex-col gap-1.5 justify-self-end">
          <span className="block h-px w-8 bg-white" />
          <span className="block h-px w-5 self-end bg-white" />
        </span>
      </div>

      {/* Upper band: disciplines / place and time */}
      <div className="mt-10 flex items-start justify-between px-6 sm:px-8">
        <ul className="text-[0.9375rem] leading-snug text-white/90">
          {heroDisciplines.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
        <p className="text-right text-[0.8125rem] font-semibold uppercase tracking-[0.02em]">
          Grimsby, UK /
          <br />
          <LocalTime className="font-mono text-[0.9375rem] tracking-[0.06em]" />
        </p>
      </div>

      {/* Foot: count + the name, huge */}
      <div className="mt-auto px-6 pb-6 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:gap-14">
          <div className="shrink-0">
            <p className="display text-[clamp(3.5rem,7vw,6.5rem)] leading-[0.8] tabular-nums">/{count}</p>
            <p className="mt-2 text-[0.8125rem] font-semibold uppercase tracking-[0.02em]">
              Selected projects
            </p>
          </div>
          <h1
            id={headingId}
            className="display-xl text-[clamp(3.75rem,12.5vw,13rem)] leading-[0.8] [word-spacing:0.12em]"
          >
            Black Line
            <br />
            Agency
          </h1>
        </div>
        <div className="mt-8 flex items-center justify-between border-t border-white/25 pt-4 text-[0.8125rem] font-semibold uppercase tracking-[0.02em]">
          <span>Web design studio</span>
          <Link href="/#contact" className="underline-offset-4 hover:underline">
            Start a project ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
