import { Fragment, type CSSProperties, type ReactNode } from "react";

/**
 * SCROLL-TRIGGERED ENTRANCE — CSS first, JavaScript only for the trigger.
 *
 * These are server components. They emit ordinary, visible markup with a
 * `data-reveal` hook; the hidden state lives in globals.css behind a `.js`
 * class that an inline script sets before first paint, and one small
 * client observer (`RevealEngine`) flips `data-revealed` when the element
 * scrolls into view.
 *
 * Why not a motion library: a `motion.div` with an `initial` prop
 * serialises `opacity:0` into the server HTML, so a visitor whose
 * JavaScript fails gets a blank page — and the browser cannot count a
 * transparent element for LCP. Doing it this way the content is visible by
 * default, ships no per-section JavaScript, and animates identically.
 *
 * Reveals fire once. Re-animating on every scroll-back is the single most
 * common way a premium site starts feeling cheap.
 */

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger offset in seconds, for sequencing siblings. */
  delay?: number;
  /** Travel distance in pixels. */
  y?: number;
  as?: "div" | "section" | "li" | "span";
};

function revealStyle(delay: number, y?: number): CSSProperties {
  const style: Record<string, string> = {};
  if (delay) style["--reveal-delay"] = `${delay}s`;
  if (y !== undefined) style["--reveal-y"] = `${y}px`;
  return style as CSSProperties;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y,
  as: Tag = "div",
}: RevealProps) {
  return (
    <Tag data-reveal="" className={className} style={revealStyle(delay, y)}>
      {children}
    </Tag>
  );
}

/**
 * Word-by-word headline reveal.
 *
 * Splits on whitespace and rises each word out of its own clipping box on
 * a stagger. Real text nodes throughout, so the heading is read normally
 * by a screen reader and stays selectable — an important difference from
 * canvas or per-character splitting.
 */
export function RevealWords({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");

  return (
    <span data-reveal="words" className={className}>
      {words.map((word, i) => (
        // The separating space sits OUTSIDE the clipping box. Inside an
        // inline-block with overflow:hidden a trailing space is collapsed
        // away, which runs every word together.
        <Fragment key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden align-bottom">
            <span data-reveal-word="" style={revealStyle(delay + i * 0.045)}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
