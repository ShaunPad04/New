/**
 * Two rows of the same word, one letter per span with its index in --i, for a letter-roll
 * hover: the first row rolls up and the second rolls in beneath it, each letter a beat behind
 * the last. Both rows are aria-hidden, so the parent carries the label. Used by the menu.
 */
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
