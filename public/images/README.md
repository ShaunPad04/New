# Hero image

`src/app/page.tsx` resolves the hero at build time, trying these filenames in
order:

1. `hero.avif`
2. `hero.webp`
3. `hero.jpg`
4. `hero.png`

Drop a file here with one of those names and the hero uses it automatically —
no code change needed. If none is present the hero falls back to a designed
CSS plate, which is intentional rather than a broken-image state.

## Guidance

- Landscape, at least 2560px wide. The composition should keep its left side
  relatively empty: the headline sits there.
- Monochrome. Colour will look wrong against the rest of the system.
- Prefer AVIF or WebP. A 5–7MB PNG will be re-encoded by Next's image
  optimiser, but shipping the smaller source keeps the repository sane.
- It is served at `quality={90}` (see `images.qualities` in `next.config.ts`).
