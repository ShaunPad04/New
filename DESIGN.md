# DESIGN.md

Documented from the existing code on 2026-09-14. `CLAUDE.md` outranks this
file; `src/app/globals.css` is the implementation of record.

## Colour

Monochrome only. The `ink-0` → `ink-1000` scale in `globals.css` is the whole
palette — there is no accent and none is wanted. Colour, where it appears,
comes from project imagery in the portfolio and nowhere else.

- `ink-0` is the page ground (near-black). `ink-1000` is the type white.
- **`ink-600` is pinned at `#808080`** — the lowest value clearing WCAG AA
  4.5:1 on `ink-0`. Never darken it.
- Hairlines are `ink-300`. Generic 1px grey borders are banned; rules are
  either a hairline at this value or a gradient that fades out.
- A fixed SVG grain layer sits over everything and is intentional.

## Typography

Two families, both variable, self-hosted by `next/font`.

| Role | Face | Treatment |
|---|---|---|
| Display | Archivo 800/900 | uppercase, tight tracking, `.display-*` |
| Body / UI | Geist | `.lede` for section ledes |
| Labels | Geist Mono | `.eyebrow` (pill) / `.field-label` (no pill) |

- Wordmark: display face at 800, 0.12em tracking, `.foil` silver gradient.
- Hero headline scrub line: `clamp(1.875rem, ..., 4.25rem)`.
- Any max-width on an element that can be the LCP candidate must be
  font-independent — never `ch`. See the hero lede.

## Surfaces

- **Double bezel** is the house card: `.bezel` + `.bezel-core`, concentric
  radii. This is the only card treatment.
- **Button-in-button** CTAs: `components/cta.tsx` / `action-cta.tsx`.
- Footer pills: `.footer-pill` in globals.css.
- Nested cards beyond the double bezel are wrong here as everywhere.

## Motion

- House ease `cubic-bezier(0.32, 0.72, 0, 1)`. `linear` and `ease-in-out` are
  banned.
- Animate transform, opacity and filter only.
- `backdrop-blur` only on fixed/sticky elements.
- Lenis smooth scroll, dynamically imported post-paint. **It intercepts wheel
  events document-wide — any scrollable overlay needs `data-lenis-prevent`.**
- GSAP ScrollTrigger is used for exactly one thing: the hero frame-sequence
  pin. The process ride is native `position: sticky` and must stay that way.
- Scroll entrances resolve blur as well as opacity and translate.
- Everything is disabled under `prefers-reduced-motion`, and content is never
  gated on it.
- Per-word reveals (`TextReveal`) are acceptable on supporting copy, never on
  a heading — the words are `aria-hidden` with an `sr-only` string behind.

## Layout

- 12-column grid, `max-w-[1600px]`, `px-6 / sm:px-10 / lg:px-16`.
- Desktop nav shows from `lg`; the burger exists at every width.
- Below `lg` the pricing tiers become a scroll-snap carousel.
- Carousel slides are `<div role="group">`, never `<ul>/<li>` — axe flags the
  list version.

## Known height budgets

- The footer is `h-[100svh]` with `overflow-hidden` and does **not** grow.
  Anything the bottom bar gains, the centre column loses; past the slack the
  back-to-top button is clipped off the page.
- Service cards on `/services` carry a min-height floor so the sticky stack
  releases cleanly. Re-measure it whenever the copy changes; the equal-height
  test is the guard.
