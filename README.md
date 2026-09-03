# Blackline Agency

Marketing site for Blackline Agency — a founder-led web design and online
marketing studio. Monochrome by design.

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · pnpm

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` | Production build (also typechecks) |
| `pnpm start` | Serve the production build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm test:a11y` | Playwright: axe, keyboard, responsive, content checks |
| `pnpm lighthouse [url] [samples]` | Lighthouse with median and spread |
| **`pnpm verify`** | **The gate — run this before shipping** |

### `pnpm verify`

One command that answers whether the site is shippable:

```
content integrity → typecheck → lint → production build
  → start ONE production server → poll for a real HTTP response
  → axe + responsive tests at 390 / 768 / 1440
  → Lighthouse (3 samples, median + spread)
  → teardown in `finally` → confirm the port is free
```

The server is owned by `scripts/verify.mjs`, which sets `VERIFY_OWNS_SERVER=1`
so Playwright reuses it instead of tearing it down before Lighthouse runs.

## Before launch

`pnpm verify` **fails** if any content flag in `src/lib/content.ts` is still
`false` while `NEXT_PUBLIC_SITE_INDEXABLE=true`:

- `TESTIMONIALS_VERIFIED` — needs real, permissioned client quotes
- `PORTFOLIO_VERIFIED` — needs real projects and measured results
- `PRICING_CONFIRMED` — retainer pricing is our proposal, not signed off

Also outstanding: logo asset, hero photograph, confirmed domain and inbox, and
`ENQUIRY_WEBHOOK_URL` so the contact form actually delivers. Until that last
one is set, `/api/enquiry` returns 501 and the UI shows the direct email
address — it never fakes a success state.

See `CLAUDE.md` for the full project context and the recorded baseline.

## Content

All copy lives in `src/lib/content.ts`. Service and process copy is ours and
freely editable. Anything asserting a fact about the business or a third party
sits behind a `*_VERIFIED` flag and must be confirmed before it ships.
