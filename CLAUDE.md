@AGENTS.md

# Black Line Agency — Project Context

Project-specific truth only. Account-level engineering standards live in the
`web-standards` skill and are deliberately not restated here.

## Source-of-truth order

1. This file
2. Client-confirmed facts (written confirmation from Brad)
3. Design decisions recorded below
4. Generic account defaults

## Identity

- **Client:** Black Line Agency (two words — as set on the business card)
- **Sector:** Web design & online marketing agency
- **Founders:** Bradley Hoxha and Shaun Padley, both 22. Founder-led, no
  account layer.
- **Contact at the studio:** Brad (bradhoxha6@gmail.com)

## Verified facts

Stated directly by the client, or read off the supplied business card. Safe to
use in copy.

- The agency is called Black Line Agency.
- Founders are **Bradley Hoxha** and **Shaun Padley**, both aged 22.
- Business email: **contact@BlackLineAgency.co.uk**
- Business phone: **07935364845**
- Domain: **blacklineagency.co.uk**
- Services: web design & build, Google SEO management, email marketing, SMS
  marketing, general marketing, **managed web hosting**, and ongoing
  maintenance / website optimisation.
- Brand theme is black and white; the card is silver foil on matte black.
- Website build pricing sits in the £1,500–£6,000 range.
- The site is **not going live** until they have their first few clients.

## Trademark symbol — IMPORTANT

The client asked for "®" next to the name. **® may only be used on a
registered trademark.** Misuse is a criminal offence in the UK (Trade Marks
Act 1994, s.95) and actionable false advertising in the US (Lanham Act
§43(a)).

`BRAND_MARK` in `src/lib/content.ts` is therefore set to **"™"**, which is
lawful on any mark, registered or not. Change it to `"®"` **only** once
"Black Line Agency" is actually registered with the UK IPO and
`TRADEMARK_REGISTERED` can honestly be set true. This has been raised with
the client and is awaiting their answer.

## Locked decisions

- **Framework:** Next.js 16.3.4 (App Router, Turbopack), React 19.2.8,
  TypeScript, Tailwind v4. `pnpm` — confirmed by `pnpm-lock.yaml`.
- **Palette:** monochrome only. An `ink-0` → `ink-1000` scale in
  `globals.css` is the entire palette. No colour is to be introduced.
  `ink-600` is pinned at `#808080` because it is the lowest value that clears
  WCAG AA 4.5:1 on `ink-0`; do not darken it.
- **Type:**
  - **Display** — Archivo 800/900, uppercase, tight negative tracking.
    Chosen to match the heavy uppercase reference the client supplied.
    Classes: `.display-xl` (hero), `.display`, `.display-soft`.
  - **Body/UI** — Inter.
  - **Eyebrow labels** — Geist Mono, wide tracking, uppercase.
  - **Wordmark** — Inter 300, very wide tracking, uppercase, `.foil` silver
    gradient. Deliberately the *opposite* of the display face: it mirrors the
    printed card, where the logo is thin and elegant. The logo whispers, the
    headlines shout. Do not set the wordmark in the display face.
  - Instrument Serif was removed — every reference the client gave is sans.
- **Motion:** Lenis smooth scroll (dynamically imported, post-paint),
  Motion/Framer for reveals and the scroll-craft hero. Every animation is
  disabled under `prefers-reduced-motion`; content is never gated on it.
- **Grain:** the fixed SVG noise layer (`.grain`) is intentional. It is what
  stops a pure-black page reading flat on OLED. Do not remove it for
  performance; it costs nothing over the wire.
- **Carousel slides are `<div>`, not `<ul>/<li>`.** Each slide needs
  `role="group"`, which overrides the implicit `listitem` role and leaves the
  list containing non-listitem children — axe flags that as a serious `list`
  violation. Do not "tidy" these back into a list.
- **Deployment target:** Vercel.

## Client input required

| Item | Status |
| --- | --- |
| Logo asset (vector) | Not supplied. Wordmark is set in type from the card. |
| Hero photograph | None. A designed CSS plate is the hero — see below. |
| Real testimonials | **None exist.** Temporary samples in place — see below. |
| Portfolio / case studies | **None supplied.** `PORTFOLIO_VERIFIED = false`. |
| Monthly retainer pricing | **Proposed by us, unconfirmed.** `PRICING_CONFIRMED = false`. |
| ® vs ™ | Awaiting confirmation of IPO registration. Currently ™. |
| Currency | Assumed GBP from British spelling and .co.uk. Unconfirmed. |
| Company registration / VAT | Unknown. Footer carries no registered details. |
| Enquiry form delivery | `ENQUIRY_WEBHOOK_URL` unset — form returns 501 by design. |

## Testimonials — temporary samples

The client has **no real testimonials yet** and explicitly asked for
temporary ones so the carousel design can be reviewed. The site is a private
preview and will not go live until they have clients.

Four invented quotes therefore sit in `PLACEHOLDER_TESTIMONIALS`, attributed
to "Sample Name / Sample Client Ltd". Three safeguards keep this contained:

1. `robots.ts` returns `Disallow: /` on any non-indexable build.
2. A visible dashed banner renders above the carousel saying the content is a
   sample and must be replaced.
3. `TESTIMONIALS_VERIFIED` is false, so **`pnpm verify` hard-fails** if anyone
   sets `NEXT_PUBLIC_SITE_INDEXABLE=true` with the samples still in place.

`SHOW_TESTIMONIALS = TESTIMONIALS_VERIFIED || !SITE_INDEXABLE` — the carousel
renders in preview, and can only reach a public build once the quotes are
real. Publishing invented testimonials is illegal in the UK (CPUTR 2008 /
DMCCA 2024, CMA and ASA enforced) and the US (FTC Act §5).

## Content integrity rules

- `src/lib/content.ts` holds all copy. Service and process copy is ours and
  freely editable.
- Anything asserting a fact about the business or a third party sits behind a
  `*_VERIFIED` flag.
- `Work` renders an honest "case studies publishing soon" state while
  unverified — it does not print `[Project name]` tiles.
- No fabricated metrics, ratings, review counts or client names in structured
  data. `ProfessionalService` JSON-LD carries only verified fields.

## Pricing (PROPOSED — not signed off)

Build tiers sit inside the client's stated £1.5k–£6k range. Retainers are our
proposal at UK SME market rate; the client said monthly pricing was undecided.
Confirm every figure before indexing.

- Builds: Essential £1,500 / Signature £3,500 / Flagship £6,000
- Retainers: Care £150pm / Growth £600pm / Scale £1,200pm

## Hero

No photograph exists. The hero backdrop is a **designed CSS plate** — raked
key light, counter-bounce, a specular sweep, the "black line" hairline motif
masked toward the copy, and a vignette. It is the intended hero, not a
fallback placeholder, and costs nothing over the wire.

`src/app/page.tsx` still resolves `public/images/hero.{avif,webp,jpg,png}` at
build time, so dropping a photograph in upgrades the hero with no code change.

Two candidate images were generated in the client's Higgsfield account
(job IDs `ed199949-4f60-4a2d-9140-fb68cf306bf6`,
`296eae7f-dba3-4914-bc22-2496c923eed6`), both **2752×1536 PNG — 2K, not 4K**,
5.9MB and 7.0MB. They could not be transferred here: the generation CDN is
blocked by the organisation egress policy, and the Higgsfield connector has
**no outbound binary handoff** — every media tool it exposes is inbound
(`media_upload` returns presigned PUT URLs, `media_import_url` pulls web URLs
*into* Higgsfield). Verified by inspecting the files inside Higgsfield's own
sandbox. Downloading manually and committing to `public/images/` is the
supported route.

`images.qualities` in `next.config.ts` is `[75, 90]`; Next 16 restricts this
to `[75]` by default and the hero is served at 90.

## Routes

- `/` — single page: hero, marquee, services, work, testimonials (preview
  only), pricing, studio, FAQ, contact
- `/api/enquiry` — POST. Returns **501** until `ENQUIRY_WEBHOOK_URL` is set.
  It never fakes success.
- `/robots.txt`, `/sitemap.xml`, `not-found`

## SEO expectations

Indexing is **opt-in** via `NEXT_PUBLIC_SITE_INDEXABLE=true`, set only on
production. Preview builds return `Disallow: /`, so a Lighthouse SEO score of
~66 on a preview URL is the **correct** result. Do not remove the guard to
turn it green.

## Verification

`pnpm verify` is the gate: content integrity → typecheck → lint → production
build → start one production server → poll for a real HTTP response → axe +
responsive tests at 390/768/1440 → Lighthouse (3 samples, median and spread)
→ teardown in `finally`, escalating SIGTERM to SIGKILL, then confirm the port
is free.

`scripts/verify.mjs` owns the server and sets `VERIFY_OWNS_SERVER=1` so
Playwright reuses it rather than killing it before the Lighthouse pass.
Playwright and Lighthouse both discover the preinstalled Chromium by scanning
`PLAYWRIGHT_BROWSERS_PATH` for a versioned `chromium-*` directory — the
revision changes on upgrade, so it is never hard-coded.

## Measured baseline

Recorded 2026-09-03, preview build, 3 Lighthouse samples:

| | median | spread |
| --- | --- | --- |
| Performance | 94 | 92–94 |
| Accessibility | 100 | 100–100 |
| Best practices | 100 | 100–100 |
| SEO | 66 | 66–66 (deliberate `noindex`) |
| FCP | 1003ms | 944–1038 |
| LCP | 3036ms | 3024–3046 |
| TBT | 106ms | 98–151 |
| CLS | 0 | 0–0 |

Playwright: 24/24 across the three viewports.

**On LCP:** measured directly in an unthrottled browser, the LCP element is
the hero `<h1>` at **260ms**, single candidate, no late swap. The ~3.0s figure
is Lighthouse's 4× mobile CPU throttling in a shared container, where
hydration contends for the main thread. It is still the honest throttled-mobile
number and remains **above the ≤2.5s target** — the outstanding lever is
initial JS, not the hero markup.

Run-to-run noise is roughly ±40ms on LCP and ±2 on Performance. Do not call
anything smaller a regression, and never compare a single run to this table.
