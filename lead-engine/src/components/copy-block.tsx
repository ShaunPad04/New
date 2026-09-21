"use client";

import { useState } from "react";

/** Read-only text with a copy button — the pack is meant to be pasted into an email. */
export function CopyBlock({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={copy}
        className="absolute right-4 top-4 rounded-full border border-ink-400 bg-ink-100 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-800 transition-colors hover:border-ink-500 hover:text-ink-1000"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="max-h-[560px] overflow-auto px-5 py-5 pr-24 font-mono text-[12.5px] leading-relaxed text-ink-800">
        {text}
      </pre>
    </div>
  );
}
