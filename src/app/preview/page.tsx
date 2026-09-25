import type { Metadata } from "next";
import { LuraisHero } from "@/components/v3/lurais-hero";
import { LuraisIntro } from "@/components/v3/lurais-intro";

/**
 * /preview — the Lurais-direction comparison Brad asked for (2026-09-25):
 * the same hero + introduction twice, DARK then LIGHT, so he can pick before
 * anything is built on the real pages.
 *
 * Preview only: noindex/nofollow, absent from the sitemap (an explicit
 * list), linked from nowhere. Delete when the direction is settled.
 *
 * The light version is not a second set of components. `.theme-light`
 * re-points the ink scale — the site's ENTIRE palette — at its inverse, so
 * every `text-ink-*` / `bg-ink-*` flips together. Near-black is Lurais's own
 * #242424, the ground its #FAFAFA; ink-600 is darkened to #6b6b6b because
 * the dark theme's #808080 would fail AA (4.5:1) on a light ground.
 */
export const metadata: Metadata = {
  title: "Direction preview",
  robots: { index: false, follow: false },
};

const LIGHT = `
.theme-light {
  --color-ink-0: #fafafa;
  --color-ink-50: #f5f5f5;
  --color-ink-100: #f0f0f0;
  --color-ink-200: #e6e6e6;
  --color-ink-300: #dedede;
  --color-ink-400: #cccccc;
  --color-ink-500: #b3b3b3;
  --color-ink-600: #6b6b6b;
  --color-ink-700: #555555;
  --color-ink-800: #3d3d3d;
  --color-ink-900: #2e2e2e;
  --color-ink-950: #292929;
  --color-ink-1000: #242424;
}`;

function Label({ children }: { children: string }) {
  return (
    <div className="sticky top-0 z-50 bg-white px-4 py-2 text-center font-mono text-xs uppercase tracking-[0.2em] text-black">
      {children}
    </div>
  );
}

export default function PreviewPage() {
  return (
    <main id="main" className="flex-1">
      <style>{LIGHT}</style>
      <Label>Option A — Dark (your palette, Lurais layout)</Label>
      <LuraisHero headingId="hero-a" />
      <LuraisIntro headingId="intro-a" />
      <div className="theme-light">
        <Label>Option B — Light (Lurais palette)</Label>
        <LuraisHero headingId="hero-b" />
        <LuraisIntro headingId="intro-b" />
      </div>
    </main>
  );
}
