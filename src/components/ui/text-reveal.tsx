"use client";

import type { CSSProperties, ReactElement } from "react";
import { cn } from "@/lib/utils";

/**
 * TEXT REVEAL — segmented entrance for a block of copy.
 *
 * Supplied by the client as a shadcn-style Motion component. It is now plain
 * markup plus CSS (2026-09-16): the Motion version was the other half of a
 * 43 KB gzipped library shipped on every page, and it mounted one animated
 * component per word — 263 of them on the homepage — which is hydration work
 * a phone pays for before it can do anything else. It has no hooks and no
 * state; `RevealObserver` (layout.tsx) sets `data-in` when the block scrolls
 * into view, and the CSS does the rest.
 *
 * IT STAYS A CLIENT COMPONENT ON PURPOSE. The RSC payload carries the whole
 * rendered tree, and a client component is serialised as its props — here
 * one string — where a server component is serialised as its output, which
 * here is 263 spans with their inline stagger index. Measured: rendering this
 * on the server grew the homepage document by 30 KB (231 KB of payload
 * against 190 KB) for no gain, since the spans are in the HTML either way. The choreography is
 * unchanged: each segment fades, un-blurs and rises on its own transition,
 * and the stagger is `transition-delay` computed from the segment's index
 * (`--i`) and the container's stagger (`--tr-stagger`).
 *
 * It TRIGGERS ON SCROLL, once. On a page this long an on-mount entrance plays
 * out thousands of pixels above the reader and is over before anyone sees
 * it. `trigger={true}` renders it already revealed.
 *
 * THE MARKUP IS THE SAME UNDER EVERY PREFERENCE, and that is deliberate. The
 * server cannot know `prefers-reduced-motion`; if the client rendered a single
 * text node where the server rendered word spans, React would discard and
 * rebuild the root at hydration (measured once: six tests failing with
 * "Element is not attached to the DOM" on a grid this component never
 * touches). So the spans are always rendered, and `globals.css` forces their
 * final state under reduced motion. The hidden starting state is scoped to
 * `@media (scripting: enabled)`, so with JavaScript off the paragraph is
 * simply there.
 *
 * WHAT IT MUST NOT BE USED FOR: a primary heading, or any text the page
 * depends on being readable. Splitting an `<h1>` into per-word elements is
 * what broke the section headings once already. This is for supporting copy,
 * where the worst case is a paragraph that fades rather than a page with its
 * middle missing.
 */

export type TextRevealPreset =
  | "blur"
  | "fade-in-blur"
  | "scale"
  | "fade"
  | "slide";
export type TextRevealPer = "word" | "char" | "line";

export type TextRevealProps = {
  children: string;
  per?: TextRevealPer;
  as?: "p" | "span" | "div" | "h2" | "h3";
  className?: string;
  preset?: TextRevealPreset;
  /** Seconds before the first segment starts. */
  delay?: number;
  /** Multiplier on the stagger: 2 halves the gap between segments. */
  speedReveal?: number;
  /** Multiplier on each segment's own duration. */
  speedSegment?: number;
  /** `true` renders the copy already revealed. Omit to reveal on scroll. */
  trigger?: boolean;
  segmentWrapperClassName?: string;
  style?: CSSProperties;
};

const defaultStaggerTimes: Record<TextRevealPer, number> = {
  char: 0.03,
  line: 0.1,
  word: 0.05,
};

function splitText(text: string, per: TextRevealPer) {
  if (per === "line") return text.split("\n");
  return text.split(/(\s+)/);
}

type SegStyle = CSSProperties & { "--i"?: number };

function SegmentItem({
  segment,
  per,
  index,
  wrapperClassName,
}: {
  segment: string;
  per: TextRevealPer;
  /** Running segment index; the stagger counts whitespace too, as it always did. */
  index: number;
  wrapperClassName?: string;
}): ReactElement {
  const isWhitespace = segment.length > 0 && segment.trim() === "";
  const at = (i: number): SegStyle => ({ "--i": i });
  const content =
    per === "line" ? (
      <span data-seg="" className="block" style={at(index)}>
        {segment}
      </span>
    ) : per === "word" ? (
      /*
        THE GAPS BETWEEN WORDS ARE NOT INLINE-BLOCKS. `splitText` keeps
        whitespace as its own segment; rendered as an atomic inline-block it
        could neither collapse nor drop at a line break, so every wrapped
        line began with a visible space (2026-09-14). A plain inline span
        collapses the way the browser intends. It still counts in the
        stagger so the choreography the paragraphs are tuned to is unchanged.
      */
      isWhitespace ? (
        <span data-seg="" aria-hidden="true" style={at(index)}>
          {segment}
        </span>
      ) : (
        <span
          data-seg=""
          aria-hidden="true"
          className="inline-block whitespace-pre"
          style={at(index)}
        >
          {segment}
        </span>
      )
    ) : (
      <span className="inline-block whitespace-pre">
        {segment.split("").map((char, i) => (
          <span
            data-seg=""
            aria-hidden="true"
            className="inline-block whitespace-pre"
            key={i}
            style={at(index + i)}
          >
            {char}
          </span>
        ))}
      </span>
    );

  if (!wrapperClassName) return content;
  return (
    <span
      className={cn(
        per === "line" ? "block" : isWhitespace ? "inline" : "inline-block",
        wrapperClassName,
      )}
    >
      {content}
    </span>
  );
}

type ContainerStyle = CSSProperties & {
  "--tr-stagger"?: string;
  "--tr-duration"?: string;
  "--tr-delay"?: string;
};

export function TextReveal({
  children,
  per = "word",
  as: Tag = "p",
  className,
  preset = "fade",
  delay = 0,
  speedReveal = 1,
  speedSegment = 1,
  trigger,
  segmentWrapperClassName,
  style,
}: TextRevealProps) {
  const segments = splitText(children, per);
  const stagger = defaultStaggerTimes[per] / speedReveal;
  const duration = 0.3 / speedSegment;

  const vars: ContainerStyle = {
    ...style,
    "--tr-stagger": `${stagger}s`,
    "--tr-duration": `${duration}s`,
    "--tr-delay": `${delay}s`,
  };

  // Chars are indexed across the whole string so the cascade runs through
  // the paragraph rather than restarting at every word.
  const starts: number[] = [];
  let running = 0;
  for (const segment of segments) {
    starts.push(running);
    running += per === "char" ? segment.length : 1;
  }

  return (
    <Tag
      data-text-reveal={preset}
      data-in={trigger ? "" : undefined}
      className={className}
      style={vars}
    >
      {/* The real string, for anything that reads rather than looks. Every
          visible segment is aria-hidden, so without this the paragraph does
          not exist to a screen reader. */}
      {per !== "line" ? <span className="sr-only">{children}</span> : null}
      {segments.map((segment, i) => (
        <SegmentItem
          key={`${per}-${i}-${segment}`}
          per={per}
          segment={segment}
          index={starts[i]}
          wrapperClassName={segmentWrapperClassName}
        />
      ))}
    </Tag>
  );
}

export default TextReveal;
