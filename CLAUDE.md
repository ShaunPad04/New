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
- Services: web design & build, **UI/UX design** (added on the client's
  instruction, 2026-09-04), Google SEO management, email marketing, SMS
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
  - **Body/UI** — **Geist**, NOT Inter. The house standard bans Inter,
    Roboto, Arial, Open Sans and Helvetica outright. Fallback stacks must not
    name Helvetica or Arial either.
  - **Eyebrow labels** — Geist Mono in a pill badge (`.eyebrow`), never bare
    text. `.field-label` is the same typography without the pill, for form
    labels.
  - ~~**Wordmark** — Inter 300, wide tracking~~ — **overridden by the client,
    2026-09-04.** He found it too thin to read as premium in the header. It is
    now the display face at 800 with tracking pulled from 0.34em to 0.12em: the
    wide tracking existed to give a light face presence, and left on a bold
    face it just reads loose. The `.foil` silver gradient stays. The "logo
    whispers, headlines shout" rule no longer applies — do not restore Inter
    300 without asking.
  - Instrument Serif was removed — every reference the client gave is sans.
- **Motion:** Lenis smooth scroll (dynamically imported, post-paint),
  Motion/Framer for reveals and the scroll-craft hero. Every animation is
  disabled under `prefers-reduced-motion`; content is never gated on it.
- **Grain:** the fixed SVG noise layer (`.grain`) is intentional. It is what
  stops a pure-black page reading flat on OLED. Do not remove it for
  performance; it costs nothing over the wire.
- **House design standard.** This site follows
  `.claude/skills/high-end-visual-design` from `ShaunPad04/premium-webdev`
  — the client's own written spec for agency-tier work. Its binding rules
  here:
  - Banned fonts (see Type above), banned generic 1px grey borders, banned
    edge-to-edge navbars glued to the top, banned `linear`/`ease-in-out`.
  - **Double-bezel** (`.bezel` + `.bezel-core`): every premium card is an
    outer tray holding an inner plate, with *concentric* radii — the inner
    radius is the outer minus the shell padding. Do not flatten these back
    into a single bordered box.
  - **Button-in-button**: a CTA's trailing arrow always sits in its own
    circular wrapper flush with the right inner padding, translating
    diagonally and scaling on hover. See `components/cta.tsx`.
  - ~~**Fluid island nav**~~ — **overridden by the client, 2026-09-04.** The
    header is a bar across the full width with the nav items distributed by
    `justify-evenly`, and it is **fully transparent at every scroll position**
    — no surface, no hairline, no `backdrop-blur`. The house standard bans a
    navbar glued to the top and prefers the detached pill, so this is a
    recorded client override, not a drift. The mobile overlay is unchanged.
    A soft top-down gradient sits behind the bar: not a surface, costs
    nothing, and stops the wordmark colliding with a bright hero frame.
  - **The inset rounded hero panel was tried and reverted** (2026-09-04, same
    day). Brad asked for the `thoughtbulb.dev` shape, saw it, and did not want
    it. The hero is a full-bleed `100svh` band again (`BAND` in
    `hero-sequence.tsx`). Do not reintroduce the panel without asking.
    One thing from that experiment was deliberately kept: the hero canvas is
    sized from its own bounding rect rather than `window.innerWidth`. It is
    equivalent while the hero is full-bleed and correct if it is ever inset
    again.
  - **Hero scrim is per-breakpoint and deliberately light.** The client said
    the footage was reading too dark. It was: a 0.92 black at the foot, a 0.55
    mid-stop and a second left-to-right wash were crushing the grade and the
    whole right of the frame. Desktop now gets a short ramp resolved by 55% of
    the height; mobile gets a taller, heavier one because the same copy block
    is three lines longer in a much narrower frame and was sitting on a bright
    helmet. Do not collapse these into one value — a single value has to serve
    the worse case and gives back the grade on desktop for nothing.
  - **Motion**: custom `cubic-bezier(0.32, 0.72, 0, 1)` everywhere; scroll
    entrances resolve blur as well as opacity and translate.
  - `backdrop-blur` only on fixed/sticky elements, never scrolling content.
    Animate only `transform`, `opacity` and `filter`.
- **Carousel slides are `<div>`, not `<ul>/<li>`.** Each slide needs
  `role="group"`, which overrides the implicit `listitem` role and leaves the
  list containing non-listitem children — axe flags that as a serious `list`
  violation. Do not "tidy" these back into a list.
- **Deployment target:** Vercel. Project **`blackline-agency`**
  (`prj_FPcWMfrHwVuNya5Wqwzo8iRWmKcb`) in the **BlackLineAgency** team
  (`team_x94jHbSiH6IewIGUOpoYNATA`), linked to `ShaunPad04/New` via the
  GitHub integration, so every push deploys the branch it lands on.
  **The Vercel Production branch is `claude/premium-website-new-client-7radoq`.**
  Pushing to that branch publishes to Production; every other branch —
  including `claude/premium-website-hero-setup-7elnor` — builds as a Preview.
  The site is not to go live until the client has their first few clients, so
  treat a push to the production branch as a release, not a routine commit.
  Linking requires two separate GitHub grants: the Vercel GitHub App installed
  on the repo owner's account (`ShaunPad04`) with `New` selected, AND the
  linking Vercel user holding write access on the repo.
- **Preview only. Never deploy to Production unless Brad explicitly asks.**
  Routine development changes deploy to Preview and stop there. A Production
  release happens only when Brad says, in his own words, "Deploy this to
  Production" — not because a change looks finished, not to check something,
  not as a side effect of anything else. Do not change the Production branch
  setting, and do not attach a custom domain.
  **The Production deployment is currently STALE**: it was accidentally
  redeployed from `a7746d5`, eleven commits behind. It is not the baseline for
  anything — not design, not code, not QA, not screenshots. Never compare a
  Preview against it to work out which code is current; use git.
  The canonical working state is the branch
  `claude/premium-website-hero-setup-7elnor` and its stable alias
  `blackline-agency-git-claude-premium-we-e512ca-black-line-agency.vercel.app`.
  Before starting work, confirm `git branch --show-current` matches.
- **Deployment protection is OFF.** Vercel Authentication (SSO) was disabled
  on the client's instruction (2026-09-04) so preview links open for anyone
  they are sent to. Password protection and Trusted IPs are also off. The only
  thing keeping the site out of search is now `NEXT_PUBLIC_SITE_INDEXABLE`,
  which makes `robots.ts` return `Disallow: /` — so that guard is load-bearing
  and must not be removed while the testimonials are samples.
  Preview URLs: the stable branch alias
  `blackline-agency-git-claude-premium-we-e512ca-black-line-agency.vercel.app`
  always serves the latest commit on this branch. Neither preview host is
  reachable from this environment (agent proxy returns `CONNECT tunnel failed,
  403`), so anonymous access can only be confirmed from outside.

## Not a design reference

`blacklineagencypreview.vercel.app` is **Brad's portfolio**, not a reference
for how this site should look — he said so explicitly. Do not try to match it.
It is also unreachable from this environment (egress-blocked, and its Vercel
team returns 403), as is the earlier `-git-claude-prem-*` preview URL.

`ShaunPad04/premium-webdev` IS reachable (public) and is where the house
design skills live. `ShaunPad04/New` is this repo.

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
| Enquiry form delivery | **Client answered: contact@blacklineagency.co.uk.** Code is done; needs `RESEND_API_KEY` set in Vercel, and the domain verified in Resend before `ENQUIRY_EMAIL_FROM` can leave `onboarding@resend.dev`. |

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

## Logo strip — "Trusted by experts"

The client asked for the reference component's heading, **"Trusted by experts.
Used by the leaders."** That is an objective claim about the business, not
puffery, and the business currently has **no clients**. Publishing it is a
misleading commercial practice under the CPUTR 2008 / DMCCA 2024 (CMA and ASA
enforced) and unsubstantiated under the CAP Code.

The client asked for the visible review banner and the "the stack we build on"
label to be removed (2026-09-04), leaving the heading directly above the logos.
His stated reason — that we are entitled to say what tools we use — is correct,
but it is the LABEL that made this nominative use. Without it, the marks sit
under "Trusted by experts" and read as clients.

So the machine gate is now the only safeguard, and it is load-bearing:

1. `LOGO_CLIENTS_VERIFIED = false`, so `pnpm verify` **hard-fails** on any
   build with `NEXT_PUBLIC_SITE_INDEXABLE=true`.
2. `SHOW_TRUST_CLAIM = LOGO_CLIENTS_VERIFIED || !SITE_INDEXABLE` now gates the
   **entire section**, not just its heading — on a public build with the flag
   still false, no strip renders at all. Do not weaken this to show the row
   without the claim; the two now carry the same meaning.

The **demo's logos were not used and must not be.** The reference ships Nvidia,
OpenAI, GitHub, Vercel, Supabase, Turso, Clerk and Anthropic under that
heading; publishing those would assert a client relationship with eight
companies that have never heard of us — false association (Lanham Act §43(a)),
misleading advertising here, and unlicensed trademark use in both.

The row itself shows `stackLogos` — the tools we genuinely build with,
labelled "the stack we build on". Nominative use, asserting nobody's
endorsement. Populate `clientLogos` and flip the flag once there are real
logos with **written permission**; an entry renders as an image the moment it
is given a `src`, so no code change is needed.

**Marks are generated, not hand-drawn.** `scripts/generate-logo-marks.mjs`
emits `src/lib/logo-marks.ts` from `simple-icons` (a devDependency — it never
reaches the client bundle). They are inlined 24x24 single-path glyphs rendered
with `fill="currentColor"`, which is what makes the row read as one set rather
than a pile of borrowed brand colours, and costs no extra requests on a
server-rendered strip.

**OpenAI is deliberately absent.** Its mark is not in simple-icons because
OpenAI asked to be removed. Hand-drawing it to route around a trademark
holder's own request is not something to do; if the client insists, it goes in
as a typographic wordmark, which the component already supports.

**NVIDIA is the weak entry.** "We build with NVIDIA" is not really true of a
web studio. It is in at the client's explicit request and was flagged as such.

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

## Hero — frame sequence fidelity

The desktop sequence is **every one of the 169 source frames at native
1920x1080**, WebP quality 93, ~25 MB. Nothing is interpolated, duplicated,
dropped, resized, denoised, sharpened, recoloured or graded — `ffmpeg` reads
the original MP4 with `-fps_mode passthrough` and encodes straight to WebP.

It was previously 1440w/~6 MB, which measured **SSIM 0.878** against the source
on the opening frames. At native resolution the same frames measure
**0.977–0.989** (PSNR +9 dB). Do not reintroduce a downscale to save bytes or
lift a Lighthouse score — the client set the priority explicitly as visual
quality, then scrub smoothness, then loading, then Lighthouse.

Mobile has **two** tiers, and only one is ever fetched — chosen by orientation,
re-initialised on rotate:

- `m/` landscape phone/tablet: every second frame at 1280x720 q84, ~4.1 MB
- `p/` portrait phone/tablet: every second frame at **720x1080 q88**, ~4.2 MB —
  a centred crop of the source at its own full height

The portrait tier exists because `cover` is brutal on a phone held upright. On
a 390x844 device at DPR 3 the viewport is 1170x2532: covering it with a
landscape 1280x720 frame scales it **3.52x** and discards everything but a
333px-wide strip — three quarters of every downloaded byte is cropped off
before it renders. Pre-cutting that strip at 720x1080 lands at **2.34x**, which
is the *same* figure the full 1920x1080 desktop sequence would achieve there,
because the source is 1080 tall and portrait `cover` is height-limited. It is
the best that exists, for 4.2 MB rather than 25 MB.

Centred crop, deliberately: the browser's `cover` already centres, so this
changes resolution, not composition.

Verified filling the viewport with correct aspect and no letterboxing on iPhone
SE / 12-14 / 14 Pro Max, Pixel 7, Galaxy S20 and Z Fold inner. Changing any
mobile tier must not touch the desktop tier.

The canvas backing store is capped so it never exceeds what the frames can
fill. On a 1440x900 viewport at DPR 2 that yields 1728x1080 rather than
2880x1800 — the source height is matched exactly, and 1.7x of pure upscale is
not allocated. Enlarging a frame does not create detail.

To regenerate, the source MP4 must be re-supplied: it lives outside the repo
(27 MB, in the session upload directory) and is not committed.

## Hero — foreground

The hero foreground is the **brand name and the two calls to action, nothing
else**. The eyebrow ("Founder-led studio — London") and the descriptive
paragraph were removed at the client's request (2026-09-04) — the footage
carries the register and the copy was competing with it.

The name is the page's **visible `<h1>`**, set in the display face at
`clamp(2.5rem, 9vw, 7.5rem)`, uppercase, `-0.045em` tracking, `0.86` leading,
modelled on a reference the client supplied. It replaced a screen-reader-only
`<h1>`, which is strictly better: the document outline, the search result and
what a visitor sees are now the same string.

`BRAND_MARK` is inline after the final letter and raised with `align-super` —
**not** a flex sibling. As a flex child it sat after the text *box*, which is
wider than the last line, leaving it floating in space well away from the word.

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

Every nav category is a **real route**, not a homepage fragment. The homepage
keeps the same sections as a scroll narrative; the routes are the destination
version, each with its own `<h1>`, title, description, canonical and a closing
enquiry band (`components/page-shell.tsx`). Section components are shared, so
copy only ever lives in `src/lib/content.ts`.

- `/` — hero, marquee, services, work, testimonials (preview only), pricing,
  studio, FAQ, contact
- `/portfolio` — honest "case studies being written up" state while
  `PORTFOLIO_VERIFIED` is false
- `/services`, `/pricing`, `/faq`, `/studio` — the four nav categories.
  `/faq` additionally emits `FAQPage` JSON-LD (our own copy, nothing to verify)
- `/api/enquiry` — POST. Returns **501** until `ENQUIRY_WEBHOOK_URL` is set.
  It never fakes success.
- `/robots.txt`, `/sitemap.xml`, `not-found`

The header CTA is **"Book a call"**, not "Enquire" — it names the actual next
step. The contact copy states we book a call, so the label stays honest.

Because sections are shared between `/` and their own route, the two carry
overlapping copy. Each route sets its own canonical and opens with distinct
page-level copy; if the homepage is ever indexed alongside them, revisit this
before it becomes a duplicate-content problem.

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
| Performance | 93 | 91–93 |
| Accessibility | 100 | 100–100 |
| Best practices | 100 | 100–100 |
| SEO | 66 | 66–66 (deliberate `noindex`) |
| FCP | 1003ms | 990–1030 |
| LCP | 3020ms | 3019–3020 |
| TBT | 140ms | 124–206 |
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
