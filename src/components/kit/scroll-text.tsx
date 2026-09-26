"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { useScrollProgress } from "./use-kit";

/**
 * SCROLL TEXT — a paragraph that lights up word by word AS YOU SCROLL, and
 * dims again on the way back up.
 *
 * This is the difference from the existing `TextReveal`, which plays once on
 * entry against a clock. Here scroll position owns every frame: the reader
 * controls the pace, stops mid-sentence and the sentence stops with them.
 * That is what makes it read as engineered rather than decorative.
 *
 * All the per-word maths is CSS `calc()` off one variable, `--p`, which
 * `useScrollProgress` writes once per frame on the wrapper. Each word only
 * knows its own index `--i` and the count `--n`. No JavaScript touches a
 * word, so a 60-word paragraph costs the same as a 6-word one.
 *
 * CONTENT IS NEVER GATED. Every rule falls back to `var(--p, 1)` — fully lit
 * — so with JavaScript off, before hydration, and under reduced motion (the
 * hook never subscribes, `--p` is never written) the text simply reads.
 *
 * The visible words are the accessible text: spans keep their spaces, so
 * find-in-page and screen readers get one contiguous sentence, read once.
 */
/**
 * One piece of a styled sentence (Brad, 2026-09-26, Porto "P3"): a word,
 * optionally `mute` (grey linking word) or `outline` (hollow letters), or a
 * small picture that sits in the line and lights with it. Every token counts
 * as one step of the reveal.
 */
export type ScrollToken =
  | string
  | { text: string; tone?: "mute" | "outline" }
  | { img: string };

export function ScrollText({
  text,
  tokens,
  as: Tag = "p",
  className,
  dim = 0.14,
  pinned = false,
}: {
  text: string;
  /** Optional styled version of `text`, token by token. `text` stays the
      source of truth for what the sentence says; the tokens must spell it. */
  tokens?: ScrollToken[];
  as?: "p" | "h2" | "h3" | "blockquote";
  className?: string;
  /** Opacity of an unlit word. Low enough to read as "not yet", high
      enough that the whole shape of the sentence is visible from the start. */
  dim?: number;
  /** Inside a `ScrollPin`: read the pin's `--p` (inherited) instead of
      measuring this paragraph, and finish lighting before the pin lets go. */
  pinned?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollProgress(ref, pinned ? "off" : "pass");
  const words: ScrollToken[] = tokens ?? text.split(" ");

  return (
    <div
      ref={ref}
      className="kit-scrolltext"
      data-pinned={pinned ? "" : undefined}
      style={{ "--n": words.length, "--dim": dim } as CSSProperties}
    >
      <Tag className={className}>
        {words.map((word, i) => {
          const style = { "--i": i } as CSSProperties;
          if (typeof word !== "string" && "img" in word) {
            return (
              <span key={i}>
                {" "}
                <span aria-hidden="true" className="kit-scrolltext-word kit-scrolltext-chip" style={style}>
                  <Image src={word.img} alt="" fill sizes="96px" className="object-cover object-top" />
                </span>
              </span>
            );
          }
          const w = typeof word === "string" ? word : word.text;
          const tone = typeof word === "string" ? undefined : word.tone;
          return (
            <span key={i}>
              {i > 0 ? " " : null}
              {tone === "outline" ? (
                /* Hollow letters are drawn from CSS `content`, so the
                   visible glyphs are decoration and the real word is read
                   from the sr-only copy: transparent text with a stroke
                   has no contrast an automated check can measure. */
                <span className="kit-scrolltext-word" data-tone="outline" data-t={w} style={style}>
                  <span className="sr-only">{w}</span>
                </span>
              ) : (
                <span className="kit-scrolltext-word" data-tone={tone} style={style}>
                  {w}
                </span>
              )}
            </span>
          );
        })}
      </Tag>
    </div>
  );
}
