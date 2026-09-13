import type { ReactNode } from "react";

export type Block = [tag: string, text: string];

const linkify = (text: string): ReactNode => {
  // Turn bare URLs and e-mail addresses into links; everything else is plain text.
  const parts = text.split(/(https?:\/\/[^\s\]]+|www\.[a-z0-9.-]+\.[a-z]{2,}[^\s\]]*|[\w.+-]+@[\w-]+\.[\w.]+)/gi);
  return parts.map((part, i) => {
    if (/^https?:\/\//i.test(part) || /^www\./i.test(part)) {
      const href = part.startsWith("http") ? part : `https://${part}`;
      return (
        <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-4 hover:decoration-ink-900">
          {part}
        </a>
      );
    }
    if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(part)) {
      return (
        <a key={i} href={`mailto:${part}`} className="underline decoration-ink-300 underline-offset-4 hover:decoration-ink-900">
          {part}
        </a>
      );
    }
    return part;
  });
};

/**
 * Renders the captured `[tag, text]` blocks (legal pages, survey pages,
 * blog posts) in the house type scale. Consecutive list items are grouped.
 */
export function Prose({ blocks, className = "" }: { blocks: Block[]; className?: string }) {
  const out: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (!list.length) return;
    out.push(
      <ul key={`ul-${out.length}`} className="flex flex-col gap-2 pl-5">
        {list.map((li, i) => (
          <li key={i} className="body list-disc marker:text-ink-300">
            {linkify(li)}
          </li>
        ))}
      </ul>,
    );
    list = [];
  };
  blocks.forEach(([tag, text], i) => {
    if (tag === "li") {
      list.push(text);
      return;
    }
    flush();
    if (tag === "h2" || tag === "h3") {
      out.push(
        <h2 key={i} className="h5 pt-4">
          {text}
        </h2>,
      );
    } else if (tag === "h4") {
      out.push(
        <h3 key={i} className="h6 pt-2">
          {text}
        </h3>,
      );
    } else {
      out.push(
        <p key={i} className="body">
          {linkify(text)}
        </p>,
      );
    }
  });
  flush();
  return <div className={`flex flex-col gap-4 ${className}`}>{out}</div>;
}
