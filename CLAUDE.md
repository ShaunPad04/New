@AGENTS.md

# Black Line Agency — Project Context

Project-specific truth only. Condensed 2026-09-11 after the homepage
redesign on `test/homepage-redesign`; full histories live in git.

## Source-of-truth order

1. This file
2. Client-confirmed facts (written confirmation from Brad)
3. Design decisions recorded below
4. Generic account defaults

## Identity & verified facts

Stated by the client or read off the supplied business card. Safe in copy.

- **Black Line Agency** (two words on the card). Founders **Bradley Hoxha**
  and **Shaun Padley**, both 22. Founder-led, no account layer. Contact:
  Brad, bradhoxha6@gmail.com.
- Email **contact@BlackLineAgency.co.uk** · phone **07935364845** · domain
  **blacklineagency.co.uk**.
- Services: web design & build, UI/UX design, Google SEO management, email
  marketing, SMS marketing, general marketing, managed web hosting, ongoing
  maintenance/optimisation.
- Brand is black and white; the card is silver foil on matte black.
- The site does **not go live** until they have their first few clients.

## Trademark symbol

`BRAND_MARK` in `src/lib/content.ts` is **"™"**. "®" is a criminal offence
in the UK on an unregistered mark (Trade Marks Act 1994 s.95) and false
advertising in the US (Lanham Act §43(a)). Flip to "®" only once the mark is
actually registered with the UK IPO. Raised with the client; awaiting answer.

## Stack & locked decisions

- **Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind v4,
  pnpm.** Deploy target Vercel.
- **Palette:** monochrome only — the `ink-0`→`ink-1000` scale in
  `globals.css` is the entire palette. `ink-600` is pinned at `#808080`
  (lowest value clearing WCAG AA 4.5:1 on `ink-0`); do not darken it.
- **Type:** Display = Archivo 800/900 uppercase, tight tracking
  (`.display-*`). Body/UI = **Geist** — Inter, Roboto, Arial, Open Sans and
  Helvetica are banned outright, including in fallback stacks. Eyebrows =
  Geist Mono pill (`.eyebrow`); `.field-label` is the same without the pill.
  Wordmark = display face at 800, 0.12em tracking, `.foil` silver gradient
  (client override 2026-09-04 — do not restore the thin Inter version).
- **Motion:** Lenis smooth scroll (dynamic import, post-paint); Motion/Framer
  for reveals; the hero scrub uses GSAP ScrollTrigger (dynamically imported).
  House ease `cubic-bezier(0.32, 0.72, 0, 1)`; scroll entrances resolve blur
  as well as opacity/translate. Animate only transform, opacity, filter.
  `backdrop-blur` only on fixed/sticky elements. Every animation is disabled
  under `prefers-reduced-motion`; content is never gated on it.
- **House design standard** (`high-end-visual-design`, ShaunPad04/premium-webdev):
  banned generic 1px grey borders, banned `linear`/`ease-in-out`;
  **double-bezel** cards (`.bezel` + `.bezel-core`, concentric radii);
  **button-in-button** CTAs (`components/cta.tsx` / `action-cta.tsx` — the
  Framer-derived primary, rebuilt locally, no Framer runtime or requests).
- **Header** (client override 2026-09-04): full-width transparent bar, no
  surface at any scroll position; mobile = full-height overlay menu with
  dialog semantics. Desktop nav shows from `lg` with explicit gaps (was `md`
  — items collided ~800px); the burger exists at every width.
- **Grain:** the fixed SVG noise layer is intentional; keep it.
- **Carousel slides are `<div role="group">`, not `<ul>/<li>`** — axe flags
  the list version. Do not "tidy" them back.
- **Hero footage:** client's own AI-generated MP4 (confirmed 2026-09-07).
  Desktop = all 169 source frames at native 1920×1080 WebP q93 (~25MB,
  loaded progressively); mobile = orientation-picked 85-frame tiers (~4MB).
  Priority order set by the client: visual quality > scrub smoothness >
  loading > Lighthouse. Do not downscale the frames to buy a score. The
  source MP4 lives outside the repo and must be re-supplied to regenerate.

## Homepage redesign (2026-09-11, this branch)

The homepage went from ~20,230px / 2,398 words to ~14,100px / ~1,500 words
at 1440×900. Order: **hero → "Built with" strip → work → capabilities →
services → studio → results → pricing → FAQ → let's-work → contact.**
Shared section components take a `compact` prop on the homepage; the routes
carry the full versions.

- **Hero:** pin shortened 320vh → **150vh** (`scrollVh` in
  `hero-sequence.tsx`) — all frames still play, mapped over less scroll.
  `HeroScrubLine` (hero.tsx + `.hero-scrub-*` in globals.css) reveals
  **"Make premium look premium."** word-by-word over 30→65% of the pin,
  gone by 88%. The copy was cut from the seven-word "Websites that make
  premium brands look premium." (client chose it from four rendered
  variants, 2026-09-12) so it breaks to TWO lines at much larger type —
  four lines forced the type small and read as a paragraph. "PREMIUM"
  ending both lines is deliberate. **The per-word stagger is tuned to
  the word count**: 0.05 apart (was 0.03 for seven words), defined to
  eight words in globals.css so new copy cannot silently lose its
  pacing — a word with no rule falls back to 0.3 and arrives with the
  first. Past eight words, add a row AND check completion against 0.88 — pure CSS `calc()` on `--hero-progress`
  (published by the sequence's ScrollTrigger), so it scrubs and reverses
  with no JS of its own. **Softened at the client's request** (same day):
  no mask wipe — each word drifts 0.35em with an 8px blur resolving over a
  0.2 window, opacity squared for a gradual arrival, the whole line settles
  from 1.03 scale, type a size down (clamp 1.875rem–4.25rem). It should
  read as a line spoken over the film, not a title card. Below `sm` the
  line reveals as one unit, blur dropped. The wordmark + CTAs exit by
  ~20% — one message at a time.
- **The line is anchored BOTTOM-LEFT on the hero's own grid, not
  centred** (client, 2026-09-12: centred read "significantly less
  premium"). Centred caps over footage is the stock-poster composition
  and it fought a hero whose wordmark and CTAs both live in the
  lower-left band; anchored there the line takes the exact stage
  position the wordmark vacates, so the two read as one handover. The
  scrim went with it — bottom-weighted like the hero's own, not a
  centred vignette flattening the grade across the peak.
- **Under `prefers-reduced-motion` the line moves to the TOP of the
  frame** (`.hero-scrub` / `.hero-scrub-inner` in the reduced-motion
  block). The hero never pins there, so the wordmark never fades and
  both would occupy the same corner — measured, the line spanned
  575-836 over an h1 at 762-836, both at x=64. Top-left line plus
  low-left wordmark is the static composition; check this whenever the
  hero foreground moves.
- **Services (home):** six editorial index rows, sub-20-word summaries, each
  a real link to `/services#<id>`; a cursor-following monochrome still per
  service on fine pointers (`service-rows.tsx` — pointer position written as
  CSS vars, no per-frame re-render; plate is aria-hidden, absent under
  reduced motion). Hover-reveal was chosen over a pinned horizontal scroll:
  the hero owns the page's one scroll-jack and a pin dies on mobile.
  Images are AI-generated (Higgsfield `nano_banana`, 1 credit each,
  client-authorised) — abstract monochrome, no people/text/marks — at
  `public/images/services/<id>.webp`; replace freely.
- **Pricing (home):** three build tiers only + CTA to /pricing. The footnote
  stating the AI chatbot's monthly fee applies is legally load-bearing —
  "includes setup" standing alone is a misleading commercial practice
  (CPUTR 2008 / DMCCA 2024). Retainers, AI systems and the bespoke band live
  on /pricing. Below `lg` the tiers are the scroll-snap carousel, opening on
  the featured tier.
- **FAQ (home):** first five questions + link to the full ten on /faq.
- **Work:** directly after the hero; ONE clearly-labelled dashed **concept
  slot** after the real cards, down from two as New Home Agents landed —
  remove one per real card added, and never fill one with an invented client.
  Video preview plumbing: drop `public/videos/work/<id>.{webm,mp4}` in for a
  muted looping hover/in-view preview (`preload="none"`, reduced-motion
  safe). Covers resolve from `public/images/work/<id>.*` with a
  truncated-file check (`resolveWorkImage` — a JPEG without EOI renders the
  designed plate and warns, instead of shipping a smear).
- **Studio:** two labelled B/W founder portrait slots
  (`public/images/founders/<slug>.*`, grayscale enforced by the component).
- **Results:** only real figures (`buildStandards`: PageSpeed desktop,
  measured 2026-09-07 — re-measure before changing), counting up on first
  view (`ui/count-up.tsx`). The invented outcomes and GEO scores were
  deleted along with their gates.
- **Logo strip:** "Built with the tools we'd stake the work on." —
  nominative use, un-gated. `clientLogos` still render only with
  `LOGO_CLIENTS_VERIFIED` (written permission per logo). Marks generated
  from simple-icons; OpenAI deliberately absent (asked to be removed — do
  not hand-draw it); NVIDIA in at the client's explicit request.
- **Route intros** are choreographed, not static: the backdrop settles from a zoomed soft state on load (pure CSS keyframes), the h1 builds word by word (CSS-only — never observer-gated; sr-only string kept for AT), the lede blur-reveals, and `IntroFx` writes `--intro-p` so the image parallaxes behind the scroll. `PageIntro` takes an optional `image` — cinematic
  monochrome backdrops (Higgsfield `nano_banana`, 1 credit each,
  client-authorised) at `public/images/pages/{services,pricing,faq,studio,
  portfolio}.webp`, ~22–60KB, heavy foot scrim so the type owns the band.
  Decorative (`alt=""`). The `<h1>` is never wrapped in a Reveal — only the
  lede animates. /portfolio now uses `PageIntro` like the rest.
- **Route pages carry full structures** (redesign, 2026-09-11), composed
  from shared sections so copy stays in content.ts: /services = cards +
  pinned horizontal process + proof band; /pricing = full pricing + the
  money FAQs (Faq takes metas/heading/lede props); /faq = all ten + the
  actual enquiry form; /studio = studio + Built-with strip + proof band;
  /portfolio = work grid + proof band.
- **Process is six steps** (Design and Launch split out, 2026-09-11) with
  a still per step at public/images/process/<id>.webp. It is the horizontal
  scroll ride on EVERY page that shows it — homepage, /services and /studio
  (client request; the draggable ProcessTrack was deleted). `ProcessSection`
  is the server wrapper that resolves the images.
- **The ride is built on native `position: sticky`, NOT a ScrollTrigger
  pin, and it must stay that way.** A pin stores an absolute start captured
  at creation; the hero pins independently and inserts 150vh of spacer
  ABOVE this section, asynchronously, so whichever effect ran second left
  the other's start stale. A stale start does not degrade gently — the
  section slammed to the top of the viewport from hundreds of pixels away,
  which the client reported. Refreshing on layout change was tried and is
  the wrong shape of fix: it chases the symptom and a refresh landing
  mid-scroll causes its own jump. Sticky has no stored measurement: the
  pane is held by the browser and the travel is read live from
  `getBoundingClientRect()` each frame, so it is correct whatever loads or
  pins above. Verified by WHEEL scrolling (never `window.scrollTo` — Lenis
  eases back from a programmatic jump and any measurement taken that way is
  wrong): the pane sits at exactly 0 for the whole ride and the worst
  unexpected movement approaching it is 57px, which is the hero still
  holding rather than a jump.
- The section's height is set from the track's overflow, so the ride runs
  1:1 with the wheel. `process-scroll.tsx` renders a plain grid on the
  server — what no-JS, reduced motion and viewports under 768px wide or
  620px tall keep — and adds `.process-h` to enhance.
- **Testimonials:** hidden EVERYWHERE (`SHOW_TESTIMONIALS =
  TESTIMONIALS_VERIFIED`, currently false) until real, permissioned quotes
  exist. The carousel component and sample data stay in the repo. Publishing
  invented testimonials is illegal (UK CPUTR/DMCCA; US FTC Act §5).

## Content integrity

- `src/lib/content.ts` holds all copy. Our capability/process copy is freely
  editable; anything asserting a fact about the business or a third party
  sits behind a `*_VERIFIED` flag.
- `pnpm verify` hard-fails an indexable build while any of
  TESTIMONIALS_VERIFIED, PORTFOLIO_VERIFIED, PRICING_CONFIRMED,
  LEGAL_DETAILS_VERIFIED or LEGAL_REVIEWED is false.
- No fabricated metrics, ratings or client names anywhere, including
  JSON-LD (`ProfessionalService` carries only verified fields).
- Indexing is opt-in: `NEXT_PUBLIC_SITE_INDEXABLE=true` on production only.
  Previews return `Disallow: /`, so preview Lighthouse SEO ~66–69 is
  CORRECT. Do not remove the guard.

## Pricing (client's own written figures, 2026-09-11)

Read `projectTiers` / `retainerTiers` / `aiSystems` in content.ts — never
quote a band from conversation (it has changed four times).

- Builds: Essential **£1,250** / Signature **£3,000** / Flagship
  **£7,500**. Signature went £2,500 -> £3,000 on 2026-09-13. The
  "Most chosen" badge was removed the same day — every tier now carries an
  audience eyebrow in `meta` (Sole traders & new starts / Established
  brands / E-commerce & multi-site), which answers "is this one me?"
  without ranking the tiers. Signature is still `featured`, so it keeps the
  inverted card and the invert CTA.
- Each build tier carries a `delivery` line under the price: Essential 5
  working days, Signature 10, Flagship 2–3 weeks, all "**Live in** … from
  kickoff, **once we have your content**". Phrased "Live in", never
  "takes" — and the content conditional is not optional garnish, it is the
  only thing making the window keepable. The Timeline FAQ states the same
  three windows; they must not drift apart.
- Retainers: Care **£99pm** / Growth **£450pm** / Scale **£950pm**
- AI systems: Text Chatbot £495 setup + £79pm (unchanged); Voice
  Receptionist **repriced and repositioned 2026-09-12** — £495 setup
  (waived with a 12-month Scale commitment), £349pm standalone with 600
  minutes then £0.25/min, or £299pm on Scale with unlimited calls on
  the standard configuration (overflow and out of hours, ONE site, no
  per-minute charge). Was £950 setup + £199pm / 300 min / £0.40.
  The "≈ 200 calls" gloss was DELETED rather than scaled to 600 minutes
  — it was always an unverified estimate, and a bigger unverified number
  is worse. Restore it only with a real average call length behind it.
  The summary no longer says "24/7": what we deploy as standard is
  overflow and out of hours, and always-on answering is a separate quote.
  The card summary and the Usage rows have to keep agreeing — the
  unlimited claim is only defensible while the description states the
  configuration it is scoped to.

`PRICING_CONFIRMED` is still false — the figures are now his in writing, so
flipping it is his call; do not flip unasked. Two claims put him on the
hook: the Flagship "performance budget guarantee" and the voice
receptionist's **"unlimited calls on the standard configuration"** — that
one is bounded by SCOPE (overflow and out of hours, one site) rather than by
an undisclosed ceiling, which is what makes it sayable at all; an unlimited
offer whose real limit is hidden is a misleading omission under the CPUTR
2008 / DMCCA 2024. The scope therefore travels with the word everywhere it
appears — card, FAQ, JSON-LD — and never in small print beneath it. If
"unlimited" is ever allowed to float free of the configuration, it becomes
a claim we cannot stand behind. "Powered by Retell AI" was removed on his instruction; the
resale-terms question with the supplier still stands.

## Claims on /pricing (2026-09-13)

The `BuildStandardsBand` under the tier cards, plus the Guarantee and
Timeline FAQs, now carry the studio's public quality promise. Four rules
are baked into that copy and every edit has to keep them (the long comment
on `buildStandardsBand` in content.ts is the canonical version):

1. **Scores, never conformance.** Never "accessible", never "WCAG
   compliant". Lighthouse accessibility is an automated check of a subset
   of the criteria; conformance is a human audit nobody has done. Three
   places said otherwise and were changed: the capabilities marquee, the
   results panel prose, and the web-design capability bullet.
2. **Never "secure", "hack-proof", "penetration tested" or "free of
   vulnerabilities".**
3. **No guaranteed rankings, no guaranteed AI citations.** Both are third
   parties' decisions. This is also why Flagship's bullet became "Full GEO
   build — structured to be cited, with citation tracking" and Signature's
   "GEO — structured for AI engines to read and cite".
4. **Never "perfect" or "perfectly optimised" on that page.**

**The security block was asked for and withheld.** The client supplied copy
— dependency vulnerabilities, injection and XSS, security headers, exposed
keys, auth and form handling, "scanned before launch, anything found is
fixed" — conditional on that scan genuinely running on every build today.
It does not. `pnpm verify` is content integrity, typecheck, lint, build,
axe and Lighthouse; package.json has no audit or secret-scanning script;
there is no CI at all. Three security headers are set in next.config.ts,
which is a control, not a scan, and no test asserts they survive. Ship the
block when the scan exists and runs — not before.

**MEASURED 2026-09-13 against an indexable build** (`NEXT_PUBLIC_SITE_INDEXABLE=true`,
`next start`, Lighthouse with explicit form-factor settings, throwaway pass
discarded). This replaces the earlier worry that the SEO claim was
unsupportable — it was wrong:

| | Perf | A11y | BP | SEO | LCP |
| --- | --- | --- | --- | --- | --- |
| Desktop ×3 | **99** | 100 | 100 | **100** | 0.98s |
| Mobile ×5 | **88** | 100 | 100 | **100** | 3.87s |

- **SEO 100 on both, zero failing audits.** The 66–69 seen on live hosts is
  entirely the `Disallow: /` guard, exactly as the client said. Nothing else
  is holding SEO down, so the claim is sound the moment indexing is on. Do
  not "fix" the robots guard to chase the score on a preview.
- **Mobile Performance is the one real gap: 88 against a claim of 95+, and
  LCP 3.87s against a stated 1.5s.** It was stable at 88 across five runs on
  a settled machine — the historic bimodality is a shared-container
  artefact, not this. The homepage is the worst page because of the hero
  frame sequence; /pricing and /services both hit 93 with LCP ~3.15s. So
  this is the hero's weight, not a site-wide problem. Closing it means
  cutting the mobile hero payload, and until it is closed the studio's own
  homepage is the weakest evidence for its own guarantee.

## Legal

`/legal/privacy` and `/legal/terms` from `src/lib/legal.ts`. NOT legal
advice; `LEGAL_REVIEWED` false. The site sets **zero cookies, zero storage,
zero third-party requests** (audited; asserted by the test suite — do not
weaken that test, change the policy and add consent instead). That is why
there is no cookie banner and no consent checkbox on the form (lawful basis
Art. 6(1)(b)). Outstanding before launch: controller postal address, company
number, ICO reference, solicitor review.

## Case studies / work

- **B Boutique** (`/portfolio/b-boutique`): signed client, site in build.
  The page asserts no results and says so. It has its OWN Vercel project
  now (`b-boutique`, repo `ShaunPad04/premium-webdev`, branch
  `client/b-boutique`) and its latest deployment is promoted, so the URL in
  `projects[0].href` is the production alias `b-boutique.vercel.app`. The
  old branch alias on `blacklineagencypreview` now 404s — it was live on
  the card until 2026-09-12. Never hand out per-deployment URLs.
- **New Home Agents** (added 2026-09-11): concept/spec pitch, **confirmed
  by Brad**, so the card carries the Concept badge for the same reason The
  Watch Club's does — the build uses their trading name, brand and
  membership marks, service copy and a dated snapshot of their live
  listings and photography, and they have not engaged us. The evidence was
  genuinely mixed and was checked rather than assumed: the repo calls the
  homepage films "the client's own uploads" and the mortgages page verbatim
  client copy, but its README calls the whole thing a website preview and
  the listings are scraped. Do not soften to "In build" without his word.
  Repo `ShaunPad04/new-home-agents`; card links its production alias
  `new-home-agents.vercel.app` (promoted, so no branch-alias trap). Cover
  captured from that live URL at 1800x1013 — `networkidle` never fires
  there (looping film), so use `domcontentloaded` plus a settle. Take it
  from the FEATURED-LISTINGS band (about 24 wheel notches down), not the
  hero: that hero is bare scrubbed film with no nav, wordmark or overlay
  anywhere in its range, so a cover shot there reads as a stock photograph
  of a house rather than as a website.
- **The Watch Club** card carries its Concept badge. `PORTFOLIO_VERIFIED`
  stays false until agreed metrics exist; `Work` renders an honest
  "publishing soon" state when the array is empty.

## Deployment (Vercel)

- Project **`blackline-agency`** (`prj_uuvDuoqKVBRADjy6kpUaGvmBFGIm`) in
  team **BlackLineAgency** (`team_x94jHbSiH6IewIGUOpoYNATA`), linked to
  `ShaunPad04/New`; the only project watching this repo (client sites were
  split into their own repos, 2026-09-11).
- **Production branch is `claude/premium-website-hero-setup-7elnor`**
  (client's own dashboard change), serving `blackline-agency.vercel.app`.
  "Production" means the short URL, not a launch — the indexable flag is
  unset there too. **Never deploy to Production or attach a domain unless
  Brad explicitly asks.** Every other branch builds as a Preview.
- The dashboard **Ignored Build Step only builds the production branch**;
  `vercel.json` on `test/homepage-redesign` overrides it (`exit 1` = always
  build) so this branch previews — **do not merge that file**.
- This branch's preview:
  `blackline-agency-git-test-homepage-redesign-black-line-agency.vercel.app`.
- Deployment protection is OFF (client's instruction) — note it silently
  reverts to the team default if the project is ever deleted and relinked.
- Preview hosts are egress-blocked from cloud sessions; the Vercel
  connector's `web_fetch_vercel_url` is how to read a deployment from there.

## Verification

`pnpm verify`: content integrity → typecheck → lint → build → one prod
server → axe + responsive tests at 390/768/1440 → Lighthouse ×3 (median) →
teardown. `scripts/verify.mjs` owns the server (`VERIFY_OWNS_SERVER=1`);
Playwright otherwise starts its own and **reuses anything on port 3000 — do
not run tests with a dev server up**. Chromium is discovered from
`PLAYWRIGHT_BROWSERS_PATH`, never hard-coded. Suite: **151 passing** after
the redesign (services-stack equal-height test runs on /services now).

Measurement rules that keep being relearned: mobile PageSpeed on this page
is bimodal (24-point swings on identical commits) — never judge a mobile
change on fewer than five runs, compare medians; desktop is stable. On the
shared build container a single low Lighthouse sample is an artefact, not a
regression. Real 2026-09-07 PSI: desktop 97–99, a11y 100, BP 100, CLS 0.

## Client input required

| Item | Status |
| --- | --- |
| Logo asset (vector) | Not supplied. Wordmark set in type. |
| Founder photos (B/W) | Not supplied. Labelled slots render; drop `public/images/founders/bradley-hoxha.*` / `shaun-padley.*`. |
| Real testimonials | None exist. Section hidden until they do. |
| Real client outcome figures | None exist. Deleted from the page. |
| Portfolio metrics | None agreed. `PORTFOLIO_VERIFIED = false`. |
| Work preview videos | None supplied. Plumbing live at `public/videos/work/<id>.*`. |
| Pricing sign-off | Figures are his; `PRICING_CONFIRMED` flip awaits his word. |
| ® vs ™ | Awaiting IPO registration confirmation. Currently ™. |
| Company registration / VAT / ICO | Unknown. Blocks legal gates. |
| Enquiry delivery | Needs `RESEND_API_KEY` in Vercel + domain verified in Resend. `/api/enquiry` returns 501 until then, never fakes success. |

## Not a design reference

`blacklineagencypreview.vercel.app` is Brad's portfolio, not a reference —
he said so. `ShaunPad04/premium-webdev` is where the house design skills
live; `ShaunPad04/New` is this repo.

---

# Studio standards (account-level defaults)

Project decisions above take precedence where they conflict.

## Stack
- Next.js (App Router) + Tailwind + TypeScript
- GSAP + ScrollTrigger + SplitText for all motion; Lenis for smooth scroll
- Deploy target: Vercel

## Design bar
- Quality bar is premium Framer marketplace templates, never "Bootstrap startup".
- Big type (clamp-based, 8–14vw hero headlines), generous whitespace, strict 12-col grid
- Max 2 fonts. Every section must have one clear motion moment, not ten small ones.
- No generic stock-photo layouts, no default Tailwind shadows/rounded-cards look.

## Motion rules
- Animate transform/opacity/clip-path only. 60fps on a mid-range phone.
- Default eases: expo.out / power4.out. Reveals 0.8–1.2s, staggers 0.05–0.08s.
- Every ScrollTrigger cleaned up (gsap.context / useGSAP).
- Respect prefers-reduced-motion with a static fallback.
- Simplify pinned/scrubbed sections on mobile (under 768px).

## Media
- Hero videos: muted, autoplay, playsinline, poster image, MP4 + WebM, under 5MB
- Images: next/image, AVIF/WebP, lazy below the fold

## Workflow
- Plan before coding. Build one section at a time.
- After each section, screenshot it at 1440px and 390px (Playwright MCP) and critique it before moving on.
- Playwright screenshots: navigate first, then resize to 1440, screenshot, resize to 390, screenshot. Resizing before navigating gives a blank shot.
