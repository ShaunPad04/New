import Link from "next/link";

/**
 * FlipLink: on hover the word rolls up letter by letter and a second copy
 * rolls in beneath it, each letter a beat behind the last. Ported from the
 * framer-motion original to plain CSS (globals.css, `.flip`): the same
 * stagger via `--i` and transition-delay, no runtime, and it works for
 * keyboard focus as well as hover. Screen readers get the word once.
 */
export function FlipLink({ children, href, className = "" }: { children: string; href: string; className?: string }) {
  return (
    <Link href={href} className={`flip ${className}`} aria-label={children}>
      <FlipRows text={children} />
    </Link>
  );
}

/** The two letter rows on their own, for a control that is not a link (the header's Menu toggle). Its parent takes `flip` and the label. */
export function FlipRows({ text }: { text: string }) {
  const letters = text.split("").map((l) => (l === " " ? " " : l));
  const row = (cls: string) => (
    <span className={cls} aria-hidden="true">
      {letters.map((l, i) => (
        <span key={i} style={{ ["--i" as string]: i }}>
          {l}
        </span>
      ))}
    </span>
  );
  return (
    <>
      {row("flip-a")}
      {row("flip-b")}
    </>
  );
}

/** The original demo block: four big flip links stacked. Kept for reuse; not rendered on the site. */
export function RevealLinks({ links }: { links: { href: string; label: string }[] }) {
  return (
    <section className="grid place-content-center px-8 py-24">
      {links.map((l) => (
        <FlipLink key={l.href} href={l.href} className="display-xl font-display">
          {l.label}
        </FlipLink>
      ))}
    </section>
  );
}
