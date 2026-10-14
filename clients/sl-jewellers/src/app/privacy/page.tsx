import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy and Your Data | S&L Jewellers Cleethorpes" },
  description: "How S&L Jewellers Ltd, 49 Cambridge Street, Cleethorpes, uses the details you send through the enquiry form, what the website records and your UK GDPR rights.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

/** Tiny markdown renderer: headings, paragraphs, bullet lists, bold, links. */
function render(md: string) {
  const inline = (s: string) =>
    s
      .replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\[(.+?)\]\((.+?)\)/g, (_, t, h) => (/^https?:/.test(h) ? `<a href="${h}" class="underline" target="_blank" rel="noopener noreferrer">${t}</a>` : `<a href="${h}" class="underline">${t}</a>`));
  // Comments are stripped up front. Dropping only blocks that *start* with one let a
  // comment sharing a line with real copy fall through and print on the page.
  const blocks = md
    .replace(/<!--[\s\S]*?-->/g, "")
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  return blocks
    .map((b) => {
      if (b.startsWith("# ")) return `<h1 class="display-xl">${inline(b.slice(2))}</h1>`;
      if (b.startsWith("## ")) return `<h2 class="display-m mt-12">${inline(b.slice(3))}</h2>`;
      if (b.startsWith("### ")) return `<h3 class="mt-7 text-[13px] font-semibold uppercase tracking-[0.14em]">${inline(b.slice(4))}</h3>`;
      if (/^- /m.test(b)) return `<ul class="list-disc space-y-1 pl-6">${b.split(/\n/).map((l) => `<li>${inline(l.replace(/^- /, ""))}</li>`).join("")}</ul>`;
      return `<p>${inline(b)}</p>`;
    })
    .join("\n");
}

export default function PrivacyPage() {
  const md = fs.readFileSync(path.join(process.cwd(), "content", "privacy.md"), "utf8");
  return (
    <div className="on-fog">
      {/* .wrap sets its own max-width, so the reading measure sits on the article inside it */}
      <div className="wrap py-16 lg:py-24">
        <article className="max-w-[72ch] space-y-4 text-[17px] text-steel [&_h1]:text-black [&_h2]:text-black [&_h3]:text-black" dangerouslySetInnerHTML={{ __html: render(md) }} />
      </div>
    </div>
  );
}
