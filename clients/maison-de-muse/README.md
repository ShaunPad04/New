# Maison de Muse

Website for Maison de Muse — a speciality coffee shop, brunch café and wine
bar at 49 Sea View Street, Cleethorpes.

Built on the structure of the Beanro coffee-shop template, re-set in an
editorial serif with a warm ivory / blush / plum palette.

A self-contained app: it has its own `package.json` and is not part of the
root pnpm workspace. Run every command from this directory.

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 ·
three.js · Lenis

## Getting started

```bash
cd clients/maison-de-muse
pnpm install
cp .env.example .env.local
pnpm dev
```

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm test:a11y` | Playwright: axe, keyboard, responsive and content checks on every route |
| `pnpm lighthouse [url] [samples]` | Lighthouse with median and spread |
| **`pnpm verify`** | **The gate — run this before shipping** |

`scripts/dev/` holds focused diagnostics (axe detail, overflow source,
no-JavaScript rendering, screenshots). See its README.

## Where things live

- `src/lib/site.ts` — verified business facts: address, phone, email,
  opening hours, Food Standards Agency rating, coordinates, social links.
  The source for each is recorded inline.
- `src/lib/menu.ts` — the menu as typed data. Items the printed menu left
  ambiguous carry a `review:` note for the client rather than a silent fix.
- `src/lib/reviews.ts` — public reviews, paraphrased and linked to source.
- `src/lib/content.ts` — all other copy.
- `src/lib/images.ts` — the photography manifest; see
  `public/images/README.md`.
- `src/components/hero-scene.tsx` — the procedural three.js iced matcha.

## Routes

`/` · `/menu` · `/our-story` · `/gallery` · `/reviews` · `/visit` ·
`/privacy`, plus `robots.txt`, `sitemap.xml`, `manifest.webmanifest`,
`icon.svg` and a generated `opengraph-image`.

## Before launch

Indexing is opt-in: set `NEXT_PUBLIC_SITE_INDEXABLE=true` on production
only. Preview builds return `Disallow: /`. See `CLAUDE.md` for the items
still awaiting client confirmation.
