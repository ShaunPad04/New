# Watch Club — pitch build

Speculative rebuild of **watchclub.com** (The Watch Club, 4 & 5 Royal Arcade,
28 Old Bond Street, Mayfair) to win them as a Black Line Agency client.

**This is not their site and it is not live.** It carries demo inventory under a
real business's name, so it is never indexable.

## Stack

Next.js 16.3.4 (App Router, Turbopack), React 19.2.8, Tailwind v4, TypeScript,
`motion` v13, Lenis. pnpm workspace member — the Black Line Agency site at the
repo root is a separate app and shares nothing but the lockfile.

Dev runs on **3100**, verification on **3100** (`VERIFY_PORT`), so both apps can
run at once.

## Deliberate decisions

- **`motion` v13, not framer-motion.** Same library, current name. The supplied
  components imported `framer-motion`; installing both ships two copies.
- **No anime.js.** Its only job in the supplied cinematic component was one
  staggered entrance. A third animation library for that is not worth the bytes.
- **No VP9/WebM for the film.** It was encoded alongside H.264 at matched
  quality and came out *larger* — the footage is a near-black field, where VP9's
  advantages do not apply. One `<source>`, 1.4MB.
- **Brand SVGs are served `unoptimized` with a fixed `#f4f1ec` fill.** Next's
  image optimizer refuses SVG unless `dangerouslyAllowSVG` is set, and enabling
  that app-wide to raster files that need no rastering is the wrong trade. The
  fill is baked in rather than `currentColor` because an SVG loaded through
  `<img>`/`next/image` cannot inherit the page's colour.
- **`WatchPlate`, not stock photography.** No photographs of these references
  exist. Each card names a real reference, so an image of a different watch
  would misrepresent it. The plate is a designed CSS light study; set `image`
  on a watch in `content.ts` and the photograph renders instead.
- **Reduced motion is enforced in CSS as well as JS.** `.reveal-step` and
  `.color-mask` are opened by a media query in `globals.css`, not only by
  `useReducedMotion()`. Without that, the cinematic section is blank between
  first paint and hydration for exactly the visitors who asked for no motion.
- **Carousel dots carry `aria-current`; paging buttons carry `aria-label`.**
  The supplied component had neither.

## Content integrity

`src/lib/content.ts` holds all copy and the flags.

| Flag | State | Meaning |
| --- | --- | --- |
| `INVENTORY_VERIFIED` | false | All stock, references and prices are invented |
| `TESTIMONIALS_VERIFIED` | false | Quotes are real public Trustpilot reviews, not client-supplied |
| `SITE_INDEXABLE` | unset | `robots.ts` returns `Disallow: /` |

`pnpm verify` **hard-fails** any build that sets `NEXT_PUBLIC_SITE_INDEXABLE=true`
while those flags are false. Publishing invented stock and prices under a real
dealer's name is a CPUTR 2008 / DMCCA 2024 problem.

`ProfessionalService` JSON-LD carries **no `aggregateRating` and no review
count** — the totals are not verified.

`/api/enquiry` returns **501** until `ENQUIRY_WEBHOOK_URL` is set. It never
fakes a successful send.

## Still needed from the client

| Item | Status |
| --- | --- |
| Watch Club logo | Not supplied. `components/wordmark.tsx` sets it in type. |
| Brand SVGs | **3 of 12 supplied** — Omega, Blancpain and Zenith are in `public/images/brands`. The other nine came as chat images, which never reach disk. Paste the SVG source as text and fill `mark` in `content.ts`; the marquee sets names in type meanwhile. |
| Product photography | None. `WatchPlate` renders instead. |
| Real inventory | None. All six pieces and three Pateks are invented. |
| Hero film | **Supplied and live.** |

## Assets

All media is the client's own footage. Nothing here is generated.

**Hero** — `herovideo.mp4` (1920×1080, 10s, 19 Mbps, no audio): a slow push-in
from a three-quarter shot of a gold Day-Date to a full-frame macro of the dial.
Scaled to 1600px at CRF 30 → `public/video/hero-daydate.mp4` (1.3MB), with its
own first frame as `hero-poster.jpg` at q6/1600px so the still and the film are
the same picture.

Because the shot **ends** on a bright gold dial filling the frame, the hero's
floor gradient runs to 80% height at 90% opacity. That is load-bearing: it keeps
the headline above 4.5:1 at every frame of the push-in, not just the opening
one. Do not lighten it.

**Promise panel** — `rolexy.mp4` (720×1280, 22s, H.264+AAC), a monochrome orbit
of a Submariner. Audio stripped, trimmed to 13s from t=4, CRF 32, 1.4MB, with
its first frame as the poster.

## Measured baseline

Preview build, 3 Lighthouse samples, 42/42 Playwright across 390/768/1440:

| | median | spread |
| --- | --- | --- |
| Performance | 89 | 89–90 |
| Accessibility | 100 | 100–100 |
| Best practices | 100 | 96–100 |
| SEO | 63 | 63–63 (deliberate `noindex`) |
| FCP | 913ms | 910–915 |
| LCP | 3712ms | 3699–3784 |
| TBT | 65ms | 58–77 |
| CLS | 0 | 0–0 |

**The hero film costs about 3 performance points.** Before it, on a static
near-black plate, this measured 92 with LCP 3258ms. The colour poster is a lit
photograph rather than a mostly-black frame, so it is a heavier LCP element even
at q75 and 1600px. That is a deliberate trade for the hero the client chose, not
a regression to chase. If it has to come back, the lever is the poster's weight
and the initial JS — not the markup.

**SEO 63 is the correct result** of the indexing guard on a preview URL. Do not
remove the guard to turn it green.

**On LCP:** 3.26s is Lighthouse's 4× mobile CPU throttling in a shared
container, and is above the 2.5s target. The lever is initial JS, not the hero
markup. Run-to-run noise is roughly ±2 on Performance; do not call anything
smaller a regression, and never compare a single run to this table.

## Verification

`pnpm verify` — content integrity → typecheck → lint → production build → start
one production server → poll for a real response → axe + responsive at
390/768/1440 → Lighthouse ×3 → teardown in `finally`.

Beyond axe, the suite pins the things these three components actually break:
the marquee forcing horizontal page scroll, the menu overlay's focus trap and
Escape handling, the cinematic section rendering under reduced motion, that no
image loads from a third-party host, and that every video is muted, looping,
inline and postered.
