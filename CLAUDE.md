@AGENTS.md

# Blackline Agency — Project Context

Project-specific truth only. Account-level engineering standards live in the
`web-standards` skill and are deliberately not restated here.

## Source-of-truth order

1. This file
2. Client-confirmed facts (written confirmation from Brad)
3. Design decisions recorded below
4. Generic account defaults

## Identity

- **Client:** Blackline Agency
- **Sector:** Web design & online marketing agency
- **Services sold:** web design & build, Google SEO management, email
  marketing, SMS marketing, website optimisation/care
- **Structure:** two founders, both 22, founder-led with no account layer
- **Contact at the studio:** Brad (bradhoxha6@gmail.com)

## Verified facts

These were stated directly by the client and are safe to use in copy:

- The agency is called Blackline Agency.
- There are two founders, both aged 22.
- They offer web design plus email and SMS marketing, Google SEO management,
  and ongoing website optimisation/maintenance.
- Brand theme is black and white.
- Website build pricing sits in the £1,500–£6,000 range.

## Locked decisions

- **Framework:** Next.js 16.3.4 (App Router, Turbopack), React 19.2.8,
  TypeScript, Tailwind v4. `pnpm` — confirmed by `pnpm-lock.yaml`.
- **Palette:** monochrome only. An `ink-0` → `ink-1000` scale in
  `globals.css` is the entire palette. No colour is to be introduced.
  `ink-600` is pinned at `#808080` because it is the lowest value that clears
  WCAG AA 4.5:1 on `ink-0`; do not darken it.
- **Type:** Inter (UI/display), Instrument Serif (editorial accents, italic),
  Geist Mono (eyebrow labels). Loaded via `next/font`, self-hosted.
- **Motion:** Lenis smooth scroll (dynamically imported, post-paint),
  Motion/Framer for reveals and the scroll-craft hero. Every animation is
  disabled under `prefers-reduced-motion` — content is never gated on it.
- **Grain:** the fixed SVG noise layer (`.grain`) is intentional. It is what
  stops a pure-black page reading flat on OLED. Do not remove it for
  performance; it costs nothing over the wire.
- **Deployment target:** Vercel.

## Client input required

Nothing below may be invented. Each item blocks launch.

| Item | Status |
| --- | --- |
| Logo asset | Not supplied. Header/footer use a text wordmark placeholder. |
| Hero photograph | Not in repo — see "Hero image" below. |
| Real testimonials | **None supplied.** `TESTIMONIALS_VERIFIED = false`. |
| Portfolio / case studies | **None supplied.** `PORTFOLIO_VERIFIED = false`. |
| Monthly retainer pricing | **Proposed by us, unconfirmed.** `PRICING_CONFIRMED = false`. |
| Confirmed domain | Assumed `blacklineagency.co.uk`. Unconfirmed. |
| Real enquiry inbox | Assumed `hello@blacklineagency.co.uk`. Unconfirmed. |
| Currency | Assumed GBP from British spelling. Unconfirmed. |
| Founder names | Not supplied — the studio section deliberately avoids naming them. |
| Company registration / VAT | Unknown. Footer carries no registered details. |
| Enquiry form delivery | `ENQUIRY_WEBHOOK_URL` unset — form returns 501 by design. |

## Content integrity rules

Fabricated testimonials and case-study results are illegal in the UK (CPUTR
2008 / DMCCA 2024 — CMA and ASA enforced) and the US (FTC Act §5). They will
not be written into this project under any framing.

- `src/lib/content.ts` holds all copy. Service and process copy is ours and
  freely editable.
- Anything asserting a fact about the business or a third party sits behind a
  `*_VERIFIED` flag.
- `Work` renders an honest "case studies publishing soon" state while
  unverified. `Testimonials` is excluded from the tree entirely.
- `pnpm verify` **fails the build** if any flag is still false while
  `NEXT_PUBLIC_SITE_INDEXABLE=true`.

## Pricing (PROPOSED — not signed off)

Build tiers sit inside the client's stated £1.5k–£6k range. Retainers are our
proposal at UK SME market rate; the client explicitly said monthly pricing was
undecided. Confirm every figure before indexing.

- Builds: Essential £1,500 / Signature £3,500 / Flagship £6,000
- Retainers: Care £150pm / Growth £600pm / Scale £1,200pm

## Hero image

`src/app/page.tsx` resolves the hero at **build time** from `public/images/`,
trying `hero.avif`, `hero.webp`, `hero.jpg`, then `hero.png`. If none exists
it falls back to a designed CSS plate — that fallback is intentional, not a
broken image.

Two candidate images were generated in the client's Higgsfield account
(job IDs `ed199949-4f60-4a2d-9140-fb68cf306bf6` and
`296eae7f-dba3-4914-bc22-2496c923eed6`), both **2752×1536 PNG (2K, not 4K)**,
5.9MB and 7.0MB. They could not be transferred into this repository: the
generation CDN is blocked by the organisation egress policy, and the
Higgsfield connector exposes no binary handoff into the local filesystem —
every media tool it offers is inbound to Higgsfield. Downloading them
manually and committing to `public/images/` is the supported route.

Note `images.qualities` in `next.config.ts` is `[75, 90]`; Next 16 restricts
this to `[75]` by default and the hero is served at 90.

## Routes

- `/` — single-page site: hero, marquee, services, work, pricing, studio,
  FAQ, contact
- `/api/enquiry` — POST. Returns **501** until `ENQUIRY_WEBHOOK_URL` is set.
  It never fakes success.
- `/robots.txt`, `/sitemap.xml`, `not-found`

## SEO expectations

Indexing is **opt-in** via `NEXT_PUBLIC_SITE_INDEXABLE=true`, set only on
production. Preview builds return `Disallow: /`, so a Lighthouse SEO score of
~66 on a preview URL is the **correct** result. Do not remove the guard to
turn it green.

## Verification

`pnpm verify` is the gate. It runs: content integrity → typecheck → lint →
production build → starts one production server → polls for a real HTTP
response → axe + responsive tests at 390/768/1440 → Lighthouse (3 samples,
median and spread) → tears down in `finally` and confirms the port is free.

The server is owned by `scripts/verify.mjs`, which sets `VERIFY_OWNS_SERVER=1`
so Playwright reuses it rather than killing it before the Lighthouse pass.

## Measured baseline

Recorded 2026-09-03 on the preview build, 3 Lighthouse samples:

| | median | spread |
| --- | --- | --- |
| Performance | 93 | 93–93 |
| Accessibility | 100 | 100–100 |
| Best practices | 100 | 100–100 |
| SEO | 66 | 66–66 (deliberate `noindex`) |
| FCP | 981ms | 966–1014 |
| LCP | 3076ms | 3062–3102 |
| TBT | 109ms | 107–136 |
| CLS | 0 | 0–0 |

Playwright: 24/24 passing across the three viewports.

**On LCP:** measured directly in an unthrottled browser, the LCP element is
the hero `<h1>` at **260ms**, with a single candidate and no late swap. The
~3.1s figure is Lighthouse's 4× mobile CPU throttling inside a shared
container, where hydration contends for the main thread. It is still the
honest mobile number and remains **above the ≤2.5s target** — the outstanding
lever is initial JS, not the hero markup.

Do not compare a single future Lighthouse run against this table. Run-to-run
noise here is roughly ±40ms on LCP; anything smaller is not a regression.
