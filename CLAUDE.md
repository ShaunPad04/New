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
- Website build pricing has changed twice on **2026-09-07**: £1,500–£6,000,
  then £1,500–£12,000, and now **£999–£3,000**. See "Pricing" below. Always
  read the current figures from `projectTiers`; do not rely on any band quoted
  in conversation.
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
  (`prj_uuvDuoqKVBRADjy6kpUaGvmBFGIm`) in the **BlackLineAgency** team
  (`team_x94jHbSiH6IewIGUOpoYNATA`), linked to `ShaunPad04/New` via the
  GitHub integration, so every push deploys the branch it lands on.

  **This project was RECREATED on 2026-09-08.** The original
  (`prj_FPcWMfrHwVuNya5Wqwzo8iRWmKcb`) was deleted outside this session, which
  killed every preview URL including the branch alias that had been handed to
  the client — the first symptom was the Vercel connector returning 404 for a
  project ID that had worked all evening. The sibling `blacklineagencypreview`
  project went with it. If a preview link ever 404s again, check the project
  still exists BEFORE debugging the site: an ID recorded here is not proof it
  is still there.

  **The Vercel Production branch is `claude/premium-website-hero-setup-7elnor`**
  — changed by the client in the dashboard on 2026-09-08, on his own
  instruction ("Point production at my branch"), and verified here afterwards
  rather than taken on trust. It was
  `claude/premium-website-new-client-7radoq`, the repository's default branch,
  which Vercel had chosen automatically; the effect was that
  `blackline-agency.vercel.app` served a commit from a branch nobody works on
  while the current build sat on a long branch alias.

  So the working branch now publishes to `blackline-agency.vercel.app` on every
  push, and every other branch builds as a Preview. **That does not make the
  site live**: `NEXT_PUBLIC_SITE_INDEXABLE` is still unset, so `robots.ts`
  returns `Disallow: /` on the production host too. "Production" here means the
  short URL, not a launch. The site is not to go live until the client has his
  first few clients, and going live is a change to that flag, not a push.

  Linking requires two separate GitHub grants: the Vercel GitHub App installed
  on the repo owner's account (`ShaunPad04`) with `New` selected, AND the
  linking Vercel user holding write access on the repo.
- **Preview only. Never deploy to Production unless Brad explicitly asks.**
  Routine development changes deploy to Preview and stop there. A Production
  release happens only when Brad says, in his own words, "Deploy this to
  Production" — not because a change looks finished, not to check something,
  not as a side effect of anything else. Do not attach a custom domain, and do
  not change the Production branch setting back without asking.
  The canonical working state is the branch
  `claude/premium-website-hero-setup-7elnor`. It now serves BOTH
  `blackline-agency.vercel.app` and the stable branch alias
  `blackline-agency-git-claude-premium-we-e512ca-black-line-agency.vercel.app`;
  hand out the short one. The earlier stale production deployment from
  `cf21c9a` on the old default branch is superseded and is not the baseline for
  anything. Before starting work, confirm `git branch --show-current` matches.
- **Deployment protection is OFF.** Vercel Authentication was disabled on the
  client's instruction (2026-09-08), as it had been on the old project, so
  preview links open for anyone they are sent to without a Vercel login.

  It came back ON when the project was recreated — the new project inherited
  the team default, `all_except_custom_domains` — which is worth remembering:
  this setting does NOT survive a project being deleted and relinked, and the
  symptom is invisible to anyone already signed in to the team. Verified off by
  reading the setting back after the change, not by assuming the write took.

  Password protection and Trusted IPs are both off.

  Search invisibility does NOT depend on any of that: it is
  `NEXT_PUBLIC_SITE_INDEXABLE`, which is unset on the new project, so
  `robots.ts` returns `Disallow: /`. That guard is load-bearing and must not be
  removed while the sample testimonials and outcome figures are in place.

  **Deploy target, 2026-09-08: the working branch IS the Production branch.**
  He first chose to keep this a preview, then asked for production to be
  pointed at his branch and made the change in the dashboard himself — the
  connector exposes no tool for that setting, and the `deploy_to_vercel`
  workaround was declined because it creates a git-detached snapshot that goes
  stale silently.

  Verified on `blackline-agency.vercel.app` after he confirmed: the production
  deployment is `dpl_9kaFAsFafUQSQkVYt9awrWjNXZe7`, a redeploy of `130748d`
  from this branch; the HTML carries the current build's markers ("One team
  accountable", The Watch Club with its Concept badge, "PageSpeed, desktop",
  999 / 1,999 / 4,999, no "sample figure"); `/llms.txt` resolves; `/robots.txt`
  still returns `Disallow: /`.

  Preview URLs: the branch alias for the working branch is the one to hand out,
  and it always serves that branch's newest commit. Read it off the deployment
  rather than from memory. Neither preview host is reachable from this
  environment (agent proxy returns `CONNECT tunnel failed, 403`); the Vercel
  connector's `web_fetch_vercel_url` is how to read a deployment's HTML from
  here, and it is how the branch alias was verified to be serving current code
  rather than trusted to be.

  **There is a stale PRODUCTION deployment on this project**, from the default
  branch at `cf21c9a`, created automatically when the project was linked. It
  serves old code at the project's production URL. The client has asked for it
  to be deleted; the Vercel connector available here has no delete-deployment
  tool, so it has to be done from the dashboard.

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
| Real performance / conversion figures | **None exist.** Sample numbers in place — see "Results" below. |
| Portfolio / case studies | B Boutique written up — see "Case studies" below. `PORTFOLIO_VERIFIED` still false (no agreed metrics). |
| B Boutique screenshot | **Supplied file is truncated — replace it.** See "Work covers" below. |
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
to "Sample Name / Sample Client Ltd". Two safeguards keep this contained:

1. `robots.ts` returns `Disallow: /` on any non-indexable build.
2. `TESTIMONIALS_VERIFIED` is false, so **`pnpm verify` hard-fails** if anyone
   sets `NEXT_PUBLIC_SITE_INDEXABLE=true` with the samples still in place.

There used to be a third — a visible dashed "sample content" banner above the
section. The client asked for it to be removed (2026-09-04), so the machine
gate is now the only thing standing between these quotes and a public build.
Do not weaken it.

`SHOW_TESTIMONIALS = TESTIMONIALS_VERIFIED || !SITE_INDEXABLE` — the section
renders in preview, and can only reach a public build once the quotes are
real. Publishing invented testimonials is illegal in the UK (CPUTR 2008 /
DMCCA 2024, CMA and ASA enforced) and the US (FTC Act §5).

### Presentation

Rebuilt 2026-09-06: the client found the previous treatment bland and he was
right. It was a tilted 3D wall of quote cards — handsome as an object, useless
as social proof. Every card was ~15px grey on black, the edge fades sliced
half of them mid-sentence, the whole thing moved, and because it was
decorative duplication it had to be `aria-hidden` with the real quotes buried
in an `sr-only` list. Nobody could read a word of it.

It is now **one quote at a time, large, black on white** — the only inverted
plate on the page, which is how contrast is created in a palette with no
accent colour. The other quotes sit beside it as a labelled selector (each
carries a `topic`, so the rows read as four different things we are praised
for rather than four identical grey rectangles).

It is the WAI-ARIA tabs pattern: roving tabindex, arrow keys, Home/End, one
panel in the DOM at a time. It advances every 9s, so there is a real pause
control (WCAG 2.2.2) plus pause on hover and focus, and it never auto-advances
at all under `prefers-reduced-motion`. `marquee-track-y` was removed from
`globals.css` with the wall — nothing else used it.

## Results — "By the numbers"

`components/results.tsx`, between Work and Testimonials on the homepage:
proof of work, then proof in numbers, then proof in words. Added 2026-09-06 at
the client's request for performance and conversion analytics.

It carries **two kinds of figure and keeps them apart**, because they are not
the same kind of claim.

**1. Client outcomes — INVENTED SAMPLES, gated.** Load time, Lighthouse score,
enquiries, bounce rate, in `PLACEHOLDER_OUTCOMES`. No project has produced
them and no client has agreed to them. A fabricated performance or conversion
figure is the most dangerous claim an agency site can carry — more so than an
invented testimonial, because a number reads as *measured* rather than as an
opinion. Misleading commercial practice under CPUTR 2008 / DMCCA 2024 in the
UK (CMA and ASA), unsubstantiated advertising under FTC Act §5 in the US.

Two safeguards, the same pattern as the testimonials:

1. `robots.ts` returns `Disallow: /` on any non-indexable build.
2. `RESULTS_VERIFIED = false`, wired into `checkContentIntegrity` in
   `scripts/verify.mjs`, so **`pnpm verify` hard-fails** any build with
   `NEXT_PUBLIC_SITE_INDEXABLE=true`. Verified by running the gate directly:
   it returns false and prints the blocker.

To publish: replace each entry with a figure from a real project, recorded
from a named tool (Google Analytics, Search Console, CrUX, Lighthouse) over a
stated window, with the client's written agreement to quote it. Then set
`RESULTS_VERIFIED = true`.

**GEO band.** Added 2026-09-07 at the client's request: a dedicated bezel
band under the four figures, because a score nobody has seen before needs a
paragraph explaining what it measures, and that does not fit in a stat cell.
It shows 41 → 89 with the explanatory copy about AI answer engines.

The copy about AI search is ours and is accurate. The **scores are not** — and
they carry a caveat the other samples do not. **There is no industry-standard
GEO score.** Lighthouse is a real instrument anyone can re-run; a GEO score is
not. So printing one means citing *our own* audit, and that audit has to exist
as a written, dated, repeatable method before these numbers can go public,
otherwise it is an unsubstantiated claim dressed as a measurement. The method
it has to be: a fixed set of buying-intent prompts per sector, run across the
named engines, scored on citation frequency and accuracy plus the on-page
factors behind it. `geoOutcome.detail` names the instrument on the page
("Black Line GEO audit") so the provenance is not implied to be somebody
else's. Gated with everything else by `RESULTS_VERIFIED`.

**2. Our own build standards — REAL, ungated.** `buildStandards`: Lighthouse
accessibility 100, CLS 0, WCAG 2.2 AA. Measured on this page and reproducible
by anyone who opens DevTools, which is why they need no flag and survive to
production — the copy invites the reader to run Lighthouse themselves. They
are defended by the test suite rather than by good intentions: `pnpm verify`
runs axe at three viewports and Lighthouse three times, so they cannot
regress silently. Re-measure before changing them.

`SHOW_RESULTS` hides only the outcome figures. The standards strip always
renders, so on a public build the section degrades to the half that is true
rather than disappearing.

Presentation note: the figures use `normal-case!`. `.display` is uppercase and
is declared after the Tailwind layer, so a plain `normal-case` loses on source
order and "0.8s" renders as "0.8S". On mobile the four outcomes are a 2x2
block, not a column — 2,028px → 1,560px.

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

**Repriced twice on 2026-09-07**, both on the client's instruction. The band
went £1.5k–£6k → £1.5k–£12k → **£999–£3,000**, which is where it now sits.

- Builds: Essential **from £999** / Signature **from £1,500** / Flagship
  **from £3,000**
- Retainers: Care £150pm / Growth £600pm / Scale £1,200pm (unchanged
  throughout)

**These are the client's figures, not our recommendation**, and the distinction
matters if anyone revisits this. Our analysis of the middle move still stands
on its own terms: the studio hand-writes Next.js, ships a scroll-driven hero,
a bespoke design system and six routes, and holds accessibility 100 / CLS 0
behind an automated gate that runs on every build. UK studios producing that
typically quote £12k–£25k, and price is read as a positioning signal before it
is read as a fee — so a low ceiling costs credibility with the large brands the
client said he wants.

He has chosen entry-level pricing anyway. That is a coherent strategy for
winning the first few clients, which is the stated near-term goal, and it is
his business and his call. It was raised once, at the time, and not
re-litigated. The `BespokeBand` under the grid still absorbs anything above
Flagship, so nothing is capped.

Retainers were not part of either reprice and remain our proposal at UK SME
market rate. `PRICING_CONFIRMED` stays **false** — every figure still needs
sign-off before indexing.

GEO now appears in the tier scope ("GEO — built to be cited by AI engines" on
Signature, "Full GEO build & citation tracking" on Flagship) because it is a
named service and the headline differentiator, so it has to be visible in what
a buyer is paying for. The **Growth** retainer carries it too, added
2026-09-07: "Google SEO & GEO management" and "Local SEO, GEO & business
profile". GEO was added ALONGSIDE SEO rather than replacing it — the studio
still does both, and dropping SEO from a retainer line would misdescribe the
service.

**Page counts came off the build tiers 2026-09-07** at the client's request.
`Tier.meta` is therefore optional and the component renders the line
conditionally — an empty `<p>` left a 12px gap that read as a missing line.
Flagship keeps "Unlimited scope" because that is a statement about scope
rather than a tally; it is now the only build tier with a meta line, which is
a mild asymmetry the client can close by asking.

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

**Provenance — confirmed by the client 2026-09-07: the MP4 is his own, and it
is AI-generated.** That clears the copyright exposure that mattered, which was
the possibility of unlicensed stock or scraped footage sitting as the most
prominent element on every page. Two things still worth knowing, neither
urgent:

- **The generator's terms govern commercial use.** Whichever tool produced it,
  its licence — not the fact he made it — is what permits this use. Worth
  confirming the plan it was generated on allows commercial output.
- **He can use it; he may not be able to stop others copying it.** In the US,
  purely AI-generated work is not copyrightable. In the UK, CDPA s.9(3) gives
  computer-generated works a 50-year term with authorship resting on whoever
  made the arrangements for its creation, so a UK claim is at least arguable.
  This affects enforcement, not the right to publish. No disclosure of AI
  generation is legally required for imagery of this kind.

## Hero — foreground

The hero foreground is the **brand name and the two calls to action, nothing
else**. The eyebrow ("Founder-led studio — London") and the descriptive
paragraph were removed at the client's request (2026-09-04) — the footage
carries the register and the copy was competing with it.

The mark is set **solid — "BlackLineAgency"** — on the client's instruction
(2026-09-04), matching the domain and the email address. It lives in
`site.logotype`, deliberately separate from `site.name`: everything a machine
or a lawyer reads (page titles, meta descriptions, the `ProfessionalService`
JSON-LD, the copyright line) keeps the spaced "Black Line Agency" from the
business card, because that is the business's actual name and structured data
must not disagree with it.

Set on one unbroken line with `whitespace-nowrap` and sized from the character
count rather than a generic heading scale — fifteen uppercase Archivo
characters run ~9.3em wide, so ~8.4vw fills the container at every width.
Measured with no horizontal overflow at 390, 768 and 1440.

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

**That build-time still-image fallback is gone** (removed 2026-09-07). It was
described here as live but nothing in `src/` had referenced
`public/images/hero.*` since the frame sequence replaced the still hero, so the
three files and their README were 1.3 MB of dead weight and a stale
instruction. Deleted after confirming by grep that no code resolved them.
`resolveWorkImage` is now the only build-time file resolution in the project.

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

## Case studies

`/portfolio/<slug>`, generated statically from `caseStudies` in `content.ts`.
A prospect deciding on a five-figure build reads the write-up, not the tile,
so it gets a real URL with its own title, description and canonical. The
portfolio card now opens the case study rather than throwing the reader
straight out to a third-party domain; the study links out itself, one step
later, once it has made the argument.

**B Boutique** (`/portfolio/b-boutique`) — brief, approach, four measured
findings, standards. Confirmed with the client 2026-09-07: **B Boutique is a
signed client and the site is in build**, not a spec pitch. The build carries
visible "provisional" markers on prices, policies and reviews because the shop
has not supplied that content or the API keys yet; `previewNote` explains that
on the case study *before* the visitor clicks through, so the markers read as
discipline rather than as sloppiness.

**The page asserts no results, and says so.** The site has not launched, so
there are no traffic or conversion figures. `outcomeNote` states that plainly
in its own panel rather than leaving an empty results section for someone to
fill with plausible numbers later. Everything else on the page — what we were
asked for, what we designed, what we built — is ours to state and needs no
flag.

The four "what changed" items are real, checkable findings from the build
(dead nav links, four empty categories, a wordmark that did nothing on four
routes out of five, `sizes` overstating slots by up to 56% and costing 53 KB
per desktop load). Specifics are what make a case study credible at £12k;
replace them with adjectives and it becomes a brochure.

Covered by `tests/a11y.spec.ts` in its own `case studies` block — the ROUTES
loop cannot be used because it also asserts a nav item exists, and a case
study deliberately has none. 78 tests → 84.

### The B Boutique URL — three exist, one is correct

- `blacklineagencypreview.vercel.app` — the production alias. **Stale.** Every
  deployment on that project has `target: null`, i.e. nothing has ever been
  promoted to production. This is what the client kept seeing.
- `...-ql5txz7z9-...` — a single deployment. Correct today, dead on the next
  push. Do not use one of these, ever.
- `blacklineagencypreview-git-client-b-boutique-black-line-agency.vercel.app`
  — the **branch alias**. Always the newest commit on `client/b-boutique`, and
  it does not rot. This is the one in `projects[0].href`.

Verified rather than assumed: the branch alias and the deployment URL were
both fetched through the Vercel connector and their bodies compared — identical
byte for byte, SHA-256 match over 192,778 characters.

Note for future work: the B Boutique preview is **not reachable from this
environment** (agent proxy returns `CONNECT tunnel failed, 403`), but the
**Vercel MCP `web_fetch_vercel_url` fetches it server-side and does work**.
That is how the case study was written from the actual site rather than from
memory. It returns text, so it still cannot produce a screenshot.

## Work covers

`resolveWorkImage` picks up `public/images/work/<id>.{avif,webp,jpg,jpeg,png}`
at build time, so a screenshot is a drop-in with no code change. The media well
is **16/9**, matching the aspect of a browser capture — it was 16/11, which
forced `cover` to scale by height and then discard ~18% of the width.

**Fixed 2026-09-07 by rendering the site locally.** The B Boutique project
lives at `clients/b-boutique` in the public `ShaunPad04/premium-webdev` repo,
on branch `client/b-boutique`. That repo is attached to the session, so the
route that works is: fetch the branch, `pnpm install && pnpm build && pnpm
start -p 3100`, then screenshot with Playwright at DPR 2. Every asset resolved
(zero failed requests) — the CloudFront images referenced elsewhere in that
project are not on the homepage. Captured 2880x1620, downscaled to 2000x1125
and saved at JPEG q90, 413 KB. Next serves it at 1920 wide into a 604px slot,
so it is sharp at 2x.

Do NOT try to screenshot the deployed preview: the host is egress-blocked here.
Render it locally instead.

**The file that was there before was broken, and this is what it looked like:** `b-boutique.jpg` is a
26,866-byte progressive JPEG with **no EOI marker anywhere in it** — the upload
was cut off partway. A browser renders a truncated progressive JPEG quite
happily, as whichever low-frequency scans arrived, so the failure looks exactly
like a soft, over-compressed picture rather than like a broken file. It is not
a quality setting and no amount of `quality={90}` will fix it; the data is
simply not there. It needs re-exporting and re-uploading.

`resolveWorkImage` now checks the trailing marker (JPEG `FF D9`, PNG `IEND`)
and falls back to the designed plate, with a build warning, rather than
shipping a smear. AVIF and WebP are box formats and are taken on trust.

To replace it: a full-quality capture of the B Boutique homepage at **1800px
wide or more** (DevTools → ⋮ → Capture screenshot at 2x, or a full-page
capture), saved as PNG or a high-quality JPEG, dropped in at that path.

## Closing band — "Let's work together"

`components/lets-work.tsx`, between the FAQ and the enquiry form on the
homepage. Adapted from a component the client supplied (2026-09-06), not
pasted — the original was a shadcn component and would not have run here:

- Its tokens (`text-muted-foreground`, `bg-border`, `var(--border)`) do not
  exist in this project; everything is mapped onto the `ink` scale.
- Its status dot was `bg-emerald-400/500`. The palette is monochrome; it is
  white.
- It imported `lucide-react`, which is not a dependency and is not worth
  becoming one for two glyphs. The arrow is the same "↗" the CTAs use and the
  calendar is inline SVG.
- **It linked to `cal.com/jatin-yadav05/15min`** — a stranger's booking page —
  and printed `hello@example.com`. Both now come from `site`, and the call
  goes to our own `#contact`.
- Its trigger was a `<div onClick>` wrapping an `<h2>`: not keyboard-operable,
  not announced as a control, and invalid HTML besides. It is now a `<button>`
  *inside* the `<h2>`.
- Two layers occupy the same box and cross-fade. The faded one carries
  `inert`, so it leaves both the tab order and the accessibility tree; focus
  moves to "Book a call" on reveal. Without `inert` half the section is an
  invisible tab stop.

The category routes still close on `ContactBand` in `page-shell.tsx`. Rolling
this band out to them as well has not been asked for.

## Pricing — swipeable below `lg`

The three tiers are the same three-column grid at `lg` and above. Below it
they are a horizontal CSS scroll-snap carousel, added 2026-09-06 at the
client's request: stacked, the pricing section alone ran **3,308px** on a
390px phone — about six screens of thumb between the hero and the enquiry
form. As a carousel it is **2,142px**, and the homepage went 20,694px →
19,528px.

It is also the right shape for the content. Stacking forces a visitor to hold
Signature in their head while scrolling past it to reach Flagship; comparison
is what a carousel is for.

- Native scroll-snap only. No drag handler, no carousel library — the browser
  already has the right throw physics on every platform.
- The track bleeds edge-to-edge (`-mx-6 px-6`, `scroll-px-6`) so a card sits
  flush with the copy above it while the next one runs off the edge. That
  overhang is the affordance; there is no "swipe" instruction.
- Cards are `w-[82%]` on a phone, `60%` at `sm`, `auto` at `lg`.
- The dots are real buttons (44px targets around a 6px mark), `aria-current`
  on the active one, hidden at `lg` where there is no carousel.
- **It opens on the featured tier, not the first one.** On desktop the
  recommended tier is the middle column — white, badged, where the eye lands.
  A carousel opening on card one throws that away and shows a phone visitor
  the cheapest option first. `scrollWidth > clientWidth` is the test for "the
  carousel is live", so this is a no-op at `lg` without duplicating the
  breakpoint in JavaScript. It re-runs on a mode switch, because otherwise the
  track keeps its old offset and opens mid-card.
- Cards keep equal heights. Measured: natural heights are 740 / 730 / 777px,
  so the stretch costs under 50px and buys a section that does not resize as
  you swipe.
- The tier header wraps (`flex-wrap`). At ~280px the "Most chosen" badge
  overran "SIGNATURE" by a hair and was being clipped by the card's own
  overflow; wrapped, it drops under the title on a narrow card and stays
  top-right at 768 and above.
- `.no-scrollbar` in `globals.css` hides the native bar only; the gesture,
  wheel and keyboard scrolling are untouched.

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

## Legal — privacy, terms, cookies

`/legal/privacy` and `/legal/terms`, generated from `src/lib/legal.ts`, linked
from the footer on every page. Added 2026-09-07 at the client's request.

**NOT LEGAL ADVICE, and `LEGAL_REVIEWED` is false.** These were written by
auditing what the site actually does and describing it accurately. They still
need a solicitor before the site is indexed.

### The audit they are built on (2026-09-07, real browser, all seven routes)

| | |
| --- | --- |
| Cookies set | **0** |
| localStorage / sessionStorage | **0 keys** |
| Third-party hosts contacted | **0** — only the site's own origin |
| Analytics / pixels / session recording | none installed |
| Embeds, iframes, maps, booking widgets | none |
| Fonts | `next/font/google`, **self-hosted at build** — no request reaches Google |

**This is why there is no cookie banner.** PECR requires consent to store or
read information on a device; this site does neither, so a banner would be
theatre and would train visitors to dismiss a control that means nothing. The
"Cookies and tracking" section of the privacy policy states the position
instead.

**It is also why there is no consent checkbox on the enquiry form.** The
lawful basis for replying to an enquiry is UK GDPR Art. 6(1)(b) — steps prior
to a contract — not consent. A box a visitor cannot decline and still get a
reply would not be valid consent. What Art. 13 *does* require is a notice at
the point of collection, so the form carries one line plus a link to the
policy. A marketing opt-in would be a separate, genuinely optional box, and
there is no marketing list.

**The no-tracking claim is defended by a test, not by good intentions.**
`tests/a11y.spec.ts` asserts zero cookies, zero web storage and zero
third-party requests on the homepage. The moment somebody adds an analytics
script the suite fails — which is correct, because at that moment the privacy
policy has become a false statement and a consent mechanism becomes legally
required. Do not weaken that test; change the policy and add consent instead.

### Gates

`LEGAL_DETAILS_VERIFIED` and `LEGAL_REVIEWED` are both false and both wired
into `checkContentIntegrity`, so `pnpm verify` hard-fails an indexable build.
Outstanding before launch: the controller's registered postal address, the
company registration number if there is one, the ICO registration reference,
and a solicitor's review. A privacy notice without the controller's full
identity does not satisfy Art. 13.

### Presentation

Deliberately plain — no reveals, no bezels, no display face at scale. A legal
document that performs is one nobody trusts. One column, 68ch measure, numbered
anchored sections with a contents list, so a specific clause can be linked.

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

### Real deployed numbers — PageSpeed Insights, 2026-09-07

Lighthouse 13.4.1 against the branch alias, run by the client.

| | Desktop | Mobile |
| --- | --- | --- |
| Performance | **97–99** | **70–94** |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 69 | 69 |
| CLS | 0 | 0 |

**Mobile PageSpeed on this page is bimodal, and that is the single most
important thing to know before optimising it.** Six runs on the SAME commit
(`b404bc7`, whose `src/` and `public/` are byte-identical to `b125bb8`)
produced 94, 92 and 70 — with LCP at 3.0s, 3.2s and 7.9s. Three earlier runs
on other commits gave 78, 74 and 71. Desktop over the same period stayed
between 97 and 99 with LCP 0.8–1.0s.

So the mobile score moves by **24 points with no code change**. Any single
mobile run is noise. Two hours were spent on 2026-09-07 attributing swings in
that range to code — a poster encode, a `fetchPriority` hint, a deferred
frame tail — and none of those attributions survived the control. Changes
were made and reverted on the strength of single measurements that the
control later showed to be meaningless.

**The rule that follows: never judge a mobile change on fewer than five runs,
compare medians, and take every run at least 25 minutes after the deploy.**
Desktop is stable enough to read directly.

**What the variance probably is.** The two clusters — LCP ~3.0s and LCP
~6–8s — look like a race for the LCP element. The hero canvas is a
full-viewport paint and becomes the final LCP candidate once it fades in; when
its frames win the race it lands near 3s, when they lose it lands near 7s. If
that is right, the fix worth trying is one that makes the canvas paint
*deterministically* early, and it would show up as a narrower spread as much
as a higher median. Untested — and it needs the five-run protocol above, not
another single run.

**SEO 69 is the `noindex`, and nothing else.** PSI names the single failing
audit — "Page is blocked from indexing", sourced to
`<meta name="robots" content="noindex, nofollow" />` and `/robots.txt:2:0`.
Every other SEO audit passes. On a production build with
`NEXT_PUBLIC_SITE_INDEXABLE=true` this becomes 100. Do not "fix" it on preview.

**CrUX field data reads "No Data"** — no real users yet. Once the site is live
and has traffic, that is the number that matters and this whole lab exercise
becomes secondary.

### Container numbers — auditing artefact, not the site

Recorded 2026-09-03, preview build, 3 Lighthouse samples on the shared
container this project builds in:

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

**Performance on this container is bimodal, and the median is the only number
worth reading.** Samples land either around 89–90 with TBT ~110ms, or around 43
with TBT >3s. There is no middle. Identical commits produce both.

`scripts/lighthouse.mjs` takes one throwaway warm-up pass before the sampled
ones (added 2026-09-07), which **reduces but does not eliminate** it: the run
straight after adding it measured a clean 90 [89–90], the next still produced
one 43 out of three. So do not read the warm-up as a fix — it is a mitigation.

The leading explanation is server-side work stealing CPU from the browser on a
shared container: `next start` optimises images on demand, and the first
request for a source at a given width runs sharp synchronously. Adding one
413 KB work cover is what first surfaced this. Production never pays that cost,
which is why the low samples are an artefact of auditing on the same box rather
than a property of the page.

Practical rule: **a single low sample is not a regression.** Look at whether
the HIGH samples moved. If every sample is low, that is real.
