import { Fragment } from "react";

/**
 * Renders a content line with `**bold**` lead-ins (Brad's emphasis in the
 * 2026-09-26 pricing brief) as <strong>. Anything else is plain text, so a
 * stray asterisk can never inject markup.
 */
export function Rich({ text, strongClassName = "font-semibold text-ink-1000" }: { text: string; strongClassName?: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? (
          <strong key={i} className={strongClassName}>
            {p}
          </strong>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}
