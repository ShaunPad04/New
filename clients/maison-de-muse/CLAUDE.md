@../../AGENTS.md

# Maison de Muse — Project Context

Project-specific truth only. Account-level engineering standards live in the
`web-standards` skill and are deliberately not restated here.

## Source-of-truth order

1. This file
2. Primary sources for business facts (official website, FSA register,
   official social accounts) — recorded inline in `src/lib/site.ts`
3. The supplied printed menu pages — transcribed in `src/lib/menu.ts`
4. Design decisions recorded below
5. Generic account defaults

## Where this lives

`clients/maison-de-muse/` — a self-contained app with its own
`package.json`, outside the root pnpm workspace, exactly as
`clients/paul-fox` and `clients/new-home-agents` are. The repository root
is the Blackline Agency site and is not touched by this project. Run every
command from this directory.

## Identity

- **Client:** Maison de Muse (always written exactly so)
- **Sector:** Speciality coffee shop, brunch café and wine bar
- **Location:** 49 Sea View Street, Cleethorpes, DN35 8EU
- **Studio contact:** Brad (bradhoxha6@gmail.com)

## Verified facts (2026-09-09)

- Address, phone (01472 472140), email (info@maisondemuse.co.uk) and
  opening hours — official website footer.
- Hours: Mon–Thu 7am–6pm · Fri–Sat 7am–11pm · Sun 7am–6pm.
- Food hygiene rating **5**, inspected 2026-06-04, North East Lincolnshire
  — FSA API, establishment 1785044. Geo 53.55709, -0.0264903 from the same
  record.
- Opened February 2025 as a French-inspired coffee shop and wine bar; dog
  friendly — local press (Gi Grimsby, Grimsby Live) and Tripadvisor.
- Instagram `@maison.demuse`, Facebook page id 61573710291824 — from the
  client brief.
- Food 8am–5pm and evening menu from 4pm Fri/Sat — from the printed menu
  supplied with the brief (not on the official website: **confirm**).

## Template

The site is a transformation of the **Beanro** Framer coffee-shop template
(beanro.framer.website), preserved in structure and interaction:
announcement strip → nav → centred two-line hero with an interactive
three.js drink → ticker → about statement → tabbed product cards → dark
"rolling word" band → numbered cards → testimonial carousel → image band →
FAQ accordion → closing CTA with flanking plates → footer with oversized
wordmark. Beanro's own copy, imagery, 3D model, fonts (Bayon/Boldonse/
Bungee/Manrope) and orange palette were replaced.

## Locked decisions

- **Framework:** Next.js 16 (App Router, Turbopack), React 19, TypeScript,
  Tailwind v4, `pnpm`. Deployment target Vercel.
- **Palette** (`globals.css` `@theme`): ivory page `#fbf7f1`, cream plates,
  plaster alternate sections, sand hairlines, blush and peach accents,
  espresso text, **plum `#5b2a3a`** for buttons/links/italic headline beats,
  sage for dietary markers. `mocha #74645c` is the lightest text allowed on
  ivory (5.0:1) — do not lighten it. No gold, no gradients beyond the soft
  plate washes.
- **Type:** Cormorant Garamond 500/600 + italic for display, menu item
  names and the wordmark; Manrope 400/500/600 for everything else. Nothing
  lighter than 500 is loaded. Eyebrows are pill badges (`.eyebrow`).
- **Wordmark** is set in type (no logo file supplied). Swap in
  `components/wordmark.tsx` when a vector arrives.
- **Hero 3D:** `components/hero-scene.tsx` is a procedural iced matcha —
  glass, two-tone pour, ice, straw — built from three.js primitives, no
  model or texture download. Drag to spin (inertia), pointer tilt, idle
  turn; static under reduced motion; loop pauses off-screen; loaded after
  paint via `next/dynamic`. The headline is the LCP element and never waits
  for it.
- **Motion:** Motion/Framer for reveals (once, with blur), Lenis smooth
  scroll (post-paint, off under reduced motion), CSS for the ticker, the
  rolling word and the photo drift. `cubic-bezier(0.32,0.72,0,1)` everywhere.
- **House standard** (`high-end-visual-design`): double-bezel plates,
  button-in-button CTAs, fluid island nav with staggered mobile overlay,
  `backdrop-blur` only on fixed elements. The paper grain layer is
  intentional.
- **Carousel slides are `<div>`, not `<ul>/<li>`** (axe `list` rule).
- **No forms.** There is no booking system; every CTA is `tel:`/`mailto:`
  or a Google Maps link. Do not add a reservation or newsletter form.
- **No third-party embeds.** The map is a designed plate linking out.

## Content integrity

- Facts live in `src/lib/site.ts` with their source. Copy in
  `src/lib/content.ts` is ours or the café's own website copy.
- Reviews (`src/lib/reviews.ts`) are paraphrased public reviews rendered
  without quotation marks, labelled "Summary", each linked to source. No
  reviewer names, star counts or aggregate rating are shown:
  `GOOGLE_RATING_VERIFIED = false` until the client supplies the live
  figure. No `aggregateRating` in schema.
- Menu items the printed menu left ambiguous carry a `review:` note in
  `src/lib/menu.ts`; `pnpm verify` counts them.

## Photography

None is in the repository yet. `src/lib/images.ts` resolves named files in
`public/images/` at build time (see `public/images/README.md`); every
section has a designed state when a file is absent. The café's own
photographs on maisondemuse.co.uk (`wp-content/uploads/2025/02/`) are
authorised and are the intended source — 16 square 1080px gallery shots
(`1.jpg` … `18.jpg`), `About-IMG.jpg`, `Hero-MDM.jpg` 1920×1080 and
`Contact.jpg` 1500×1920. They could not be pulled into this build
environment (egress policy), so downloading them and saving under the
manifest's file names is a client/studio step.

## Client input required

| Item | Status |
| --- | --- |
| Photography | Not in repo — see above |
| Logo vector | Not supplied — wordmark set in type |
| Google rating and review count | Unverified — linked, not printed |
| Food-service and evening-menu hours | From the printed menu; not on the website |
| "Grilled Cheese & Ham" vegetarian marker | Source appears to show one — withheld |
| "À La Cheese Ploughman’s" wording | Confirm |
| Hummus with Toasted Pitta £4.00 (Sides) vs £5.50 (Evening) | Confirm |
| Dog friendly / event hire | From press and the website's "Event Hire Available" line |
| Company registration / VAT | Unknown — footer carries no registered details |
| Bank holiday hours | Unknown |

## Routes

`/` `/menu` `/our-story` `/gallery` `/reviews` `/visit` `/privacy`,
plus `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, `icon.svg`,
`opengraph-image` (rendered at build).

## SEO expectations

Indexing is **opt-in** via `NEXT_PUBLIC_SITE_INDEXABLE=true` on production
only. Preview builds return `Disallow: /`, so a Lighthouse SEO score below
100 on a preview URL is the correct result. Schema: `CafeOrCoffeeShop` with
verified fields only, `Menu` mirroring the typed data, `BreadcrumbList` on
inner pages.

## Verification

`pnpm verify`: content integrity → typecheck → lint → production build →
one production server → axe + keyboard + responsive + content tests on every
route at 390/768/1440 → Lighthouse (3 samples) → teardown. Screenshot and
overflow helpers live in `scripts/dev/`.
