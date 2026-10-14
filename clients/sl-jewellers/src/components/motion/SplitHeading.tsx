import type { ElementType } from "react";

/**
 * Splits a heading into words that rise inside per-line masks. Server-only:
 * no JS, the parent Reveal adds `.in` (sections) or `split-load` runs a
 * one-time CSS animation (hero). Screen readers get the whole sentence once
 * via aria-label; the visual words are aria-hidden.
 *
 * `text` may contain "\n" for deliberate line breaks, `*a run of words*` for
 * gold keywords, `~a run of words~` for silver ones (same sheen, silver metal), and
 * "|" inside a word for a soft hyphen (a break the browser uses only when the word
 * cannot fit). Markers are stripped from the accessible label.
 */
export default function SplitHeading({
  as: Tag = "h2",
  text,
  className = "",
  load = false,
  id,
}: {
  as?: ElementType;
  text: string;
  className?: string;
  load?: boolean;
  id?: string;
}) {
  const lines = text.split("\n");
  let i = 0;
  let metal: "" | "gold" | "silver" = "";
  let k = 0;
  return (
    <Tag id={id} className={`split ${load ? "split-load" : ""} ${className}`} aria-label={text.replace(/\n/g, " ").replace(/[*~|]/g, "")}>
      {lines.map((line, li) => {
        const words = line.split(/\s+/).filter(Boolean);
        return (
          <span className="line" key={li} aria-hidden="true">
            {words.map((raw, wi) => {
              let w = raw;
              if (w.startsWith("*") || w.startsWith("~")) {
                metal = w.startsWith("*") ? "gold" : "silver";
                k = 0;
                w = w.slice(1);
              }
              const cls = metal;
              if (w.endsWith("*") || w.endsWith("~")) {
                metal = "";
                w = w.slice(0, -1);
              }
              return (
                <span key={wi} className={cls ? `w ${cls}` : "w"} style={{ ["--i" as string]: i++, ...(cls ? { ["--k" as string]: k++ } : {}) }}>
                  {w.replace(/\|/g, "\u00AD")}
                  {wi < words.length - 1 ? " " : ""}
                </span>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}
