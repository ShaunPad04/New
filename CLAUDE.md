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
- **Motion:** Lenis smooth scroll (dynamic import, post-paint); scroll
  entrances are **CSS transitions** driven by one `RevealObserver` (the
  `motion` package was removed 2026-09-16 — see "Mobile performance pass");
  the hero scrub uses GSAP ScrollTrigger (dynamically imported).
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
  dialog semantics. The panel carries **`data-lenis-prevent`** and must
  keep it: Lenis intercepts wheel events document-wide and the page is
  locked while the menu is open, so without it the panel would not scroll
  at all on a short viewport (reported 2026-09-13). `overflow-y-auto` is
  NOT enough on this site — any new scrollable overlay needs the same
  attribute. Asserted by a test that wheels the panel rather than setting
  `scrollTop`, because a direct set passed while the menu was broken. Desktop nav shows from `lg` with explicit gaps (was `md`
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
  **Phones (below 768px) get a STILL, not the sequence** — Shaun's choice,
  2026-09-17, "option 1"; see "Still hero on phones" below. Tablets and
  desktop are unchanged.

## Follow-ups, 2026-09-26 (Brad)

- **Footer START A PROJECT ribbon** links to `/#contact`. A hover invert
  (white fill, outlined words) was built and then REMOVED at Brad's
  request the same day; only the arrow turns on hover. Do not re-add it.
- **"Book a call" is now "Get in touch"** everywhere (header CTA,
  ContactBand, let's-work, contact eyebrow). The homepage labels the
  enquiry section `10 /Get in touch`.
- **Footer /Contact/** email and phone use the same `link` class as the
  other footer links.
- **The intro statement is PINNED** (`kit/scroll-pin.tsx` +
  `ScrollText pinned`). Native sticky, never a ScrollTrigger pin. The words
  finish lighting at ~86% of the pin, so the page only moves on once the
  sentence is whole. The track is 230svh, and only with scripting on and
  motion allowed. The stage must fit one screen: gutter word 650px +
  `lg:py-8` = 714px, so it fits a 1280×720 laptop. Re-measure if either
  grows.
- **Selected work is Nocta's "Case studies" layout** (`v3/lurais-work.tsx`):
  - striped label and big heading, lede on the right;
  - framed cover cards with the /001/ and sector chips, the name, year and
    status badge over a scrim, and a bracketed arrow;
  - a closing "More projects" row.
  The cards still OVERLAP on scroll (Brad's 2026-09-25 ask, kept). Nocta's
  own list does not stack, so drop StackCards if he wants it plain.

## New pricing + overnight pass (2026-09-26, Brad's written brief)

**Pricing (supersedes every figure in "Pricing" below — read the data,
not this list):**
- Builds: Essential £1,399 / Signature £2,500 / Commerce £4,450 (all
  fixed, no "from") / Flagship **from £7,500** / Bespoke **from £12,000**
  (paid discovery £495).
  - `Tier.from` marks a floor price; Flagship carries `extras` (priced on
    top) and `note` (same business, same name).
  - `**bold**` in a list line is Brad's emphasis. Render it with
    `<Rich>`; use `plainText()` for any text output.
  - Second and further sites for the same owner are 20% off.
- Payment is **40/30/30**. 50/50 is gone everywhere.
- Chatbot is £199 setup (waived on 12 months) + £59/month, an add-on on
  every plan. It is NOT in Growth any more.
- Voice on Scale is "up to 1,500 minutes a month, fair use". The word
  "unlimited" is gone from voice.
- New rate-card bands: Taking bookings (£650 / £1,200 / £1,950 / from
  £2,950) and CRM (£750 + £49/month optional; custom £2,500 + £299/month).
  Both live in `rateCard.sections`.
- Creative: £60 image, £160 video. Plans are Lite £295, Pro £595, Scale
  £995.
  - Pro and Scale now schedule posts, so the "what we do not do" line
    became community management only.
- Enquiry budget bands are rebracketed (…4,500–7,500 / 7,500–12,000 /
  12,000+). They must stay in step with `BUDGET_LABELS`.

**Claims to watch:**
- "Your Google ranking carried over … so you don't drop off Google" is
  Brad's wording. What we deliver is the redirect map, not a position.
  Keep the redirect clause attached if it is ever edited.
- "If it goes down, it's fixed within one working day" (Care) is now a
  service promise.

**Design, same night:**
- The intro pin carries a studio ledger (location + live UK time /
  founders / one-working-day reply), fading in at 70–86% of the pin.
- Chrome BL: no visible text, no click action. A click-to-spell
  "BlackLine" state (3D Geist lowercase) was built on 2026-09-26 and
  REMOVED the same day on Brad's word — the mark is just the BL. The
  studio was softened (wider, dimmer strips, PMREM sigma 0.045) because
  the thin bright ones strobed while spinning; the stage is `svh`-sized
  so a mobile toolbar never resizes (and clears) the canvas.
- Principles cards show their claims: founders by name, a working-day
  track, a reviewed diff. The diff's line numbers must stay ink-600:
  axe checks aria-hidden text too.
- The creative section is set in framed panels.
- **Every price set is ONE design now** (Brad: "use the same design as the
  framer one").
  - `PlanGrid` in `pricing-plans.tsx` renders the Nocta card for builds,
    monthly plans and creative plans on /pricing. The add-a-plan switch
    appears only on build tiers.
  - The homepage uses `Pricing summary`: the same card with five
    `highlights` per tier.
  - The old `TierDeck`/`TierCard` has no call sites.
- **Behind the build cards** (homepage and /pricing, `PlanGrid backdrop`)
  sits a single diagonal light streak,
  `public/images/pricing/backdrop.2026-09-26.webp` (Higgsfield, 0.25
  credits), at 30%. It is held that low because the streak crosses the
  grey delivery text; re-check by eye before raising it.
- **Card buttons move on hover** (`BracketButton`, Brad): a white fill
  rises, the label rolls to a black copy, the corners open out
  (`Brackets hover`) and the arrow turns. Transform-only; reduced motion
  keeps the colour swap only.
- **Projects sit on a CSS-drawn laptop** (`lurais-work.tsx`, Brad): generic
  lid and aluminium base, no maker's mark, screenshot `object-top` in a
  16:10 screen. The scroll reveal is crisp opacity only (Nakula), and
  bracket buttons carry `.btn-grain`.
- **Homepage service rows use font option C** (Brad chose it from four):
  the index sits in `StripeLabel` as /01/, and the name is semibold caps with
  tight tracking, like the case-study titles. The stills are square-framed.
  Options A (condensed Archivo), B (expanded) and D (Anton) were offered and
  not taken. The rest of the site's type is unchanged.
- **The mouse-follow spotlight (`SpotlightCursor`) was removed** (Brad
  asked; Nocta has none, and it washed the flat black). Do not re-add it.

**Measured (local, indexable build, Lighthouse ×3 median):**
- Mobile: 92–93 perf, 100 a11y, 100 SEO.
- Desktop: 99–100 perf.
- Best practices reads 96 locally, only because `/_vercel/insights` 404s
  off Vercel.

## Chrome turn, anchors, Nocta contact (2026-09-26, Brad)

- **Chrome BL does ONE full 360° turn** while pinned (section 320vh,
  sticky on any screen >= 560px tall, phones included). It is face-on at
  the start and at the end (the turn completes by 88% of the ride), with an
  ease-in-out and a slight nod on x. The studio is near-black with a ring
  of narrow softboxes; the environment stays fixed while the mark turns,
  so light bands run across the metal. The old bright wash in front made
  the face read flat white; do not bring it back.
- **Same-page hash links go through Lenis** (capture-phase click handler
  in `smooth-scroll.tsx`). A native jump was eased back if Lenis was
  mid-glide. `lenis.scrollTo(el)` already honours `scroll-margin-top`:
  passing an offset as well landed the page 96px short.
- **Contact section = Nocta's contact page layout** (`contact.tsx`):
  - backdrop at `public/images/contact/backdrop.2026-09-26.webp`
    (Higgsfield gpt_image_2_5, 0.25 credits, grayscale, decorative);
  - "Get in touch." heading, with the email and phone in a framed
    two-cell card;
  - the form in a framed panel.

  The budget is a radio row with the SAME six values as `BUDGET_LABELS`
  in the enquiry route. The field names, honeypot, Article 13 notice and
  honest error state are unchanged. The homepage rule above it reads
  `10 /Contact`.

## Nocta style across every route (2026-09-26)

Brad: "do the same style for the other pages". Done at the shared layer so
every route changed together: `.eyebrow` is now the striped square label
(bars + hairline box + painted bracket corners, `::before` bars);
`.bezel`/`.bezel-core(-invert)` are square hairline frames with painted
bracket corners (radius 0); `Cta` renders the square bracket button for
every variant (the Framer pill `ActionCta` has no call sites now);
`PageIntro` is label + big heading left, standfirst right; `ContactBand`
is a framed panel with the striped label; `Faq` delegates to the framed
accordion in `faq-tabs.tsx` (fixed subset → no tabs, "full FAQ page"
link). Rounded wells on service cards, work cards, studio and process
images were squared. Inside `.v3` (the homepage) the header pill is still
hidden in favour of the numbered rule.

## Nocta direction for pricing, footer, FAQ (2026-09-26, preview branch)

Brad chose these from rendered concepts (template nocta.framer.website —
studied, not copied). **Pricing** = `pricing-plans.tsx` (exported as
`Pricing`, so the homepage, service pages and Grimsby page all use it):
four tiers in one framed panel, "Recommended" on Signature (Brad's choice;
the old "Most chosen" badge stays gone), and a per-tier add-on switch —
Essential→Care £200, Signature→Growth £450, Commerce→Scale £950,
Flagship→Partner £1,750, read from `retainerTiers`, always a SEPARATE
"+ £X/month" line, never summed into the build price; Partner's line
carries "ad spend is billed by the platforms, not by us". The /pricing
rate card still uses `SharedIncludes`/`TierDeck`. **Footer** = Nocta
layout in normal flow (curtain removed): START A PROJECT ribbon (one
link), newsletter, /Socials/ (Instagram, TikTok, LinkedIn only — each
appears only with a URL in `socials`; LinkedIn has none yet), columns,
BLACK LINE AGENCY on one line as a white outline (CSS `content`),
bottom bar. **Newsletter** = `/api/newsletter` → Resend segment
"Newsletter" (4837f34e-a0b7-4cba-89df-341fc12fc9f6); unticked consent box
required, honeypot, rate limit, 501 without `RESEND_API_KEY`; the key
must have CONTACTS access, not sending-only. Privacy policy covers it.
**FAQ** = `faq-tabs.tsx` on /faq (Projects / Working together; any meta
not listed as Projects falls into Working together). Four Q&As appended
to `faqs` 2026-09-26 (Steps, Packages, Development, Brand) — sources in
the comment above them. **Homepage FAQ replaced by Why choose us**
(`why-us.tsx`, photos `public/images/why/`, AI-generated atmosphere,
never presented as founders or clients).

## Homepage = Lurais direction (2026-09-25, preview branch only)

Brad asked for the site rebuilt after the Framer template **Lurais**
(lurais.framer.website, Stacy More, "Limited" licence — layout and motion
studied, NO assets, code or copy taken). He chose from rendered previews:
**dark** (not Lurais's light), the **scroll film kept**, the chrome BL
**mid-page**, founder cards **removed** until photos exist. The homepage
now renders `src/components/v3/`: film hero with the Lurais foreground
(disciplines, Grimsby + live UK time, project count, the name huge) →
01 intro (ScrollText statement, /Built with marquee) → 02 selected work
(full-width, Concept/Live badges printed, a real `<ul>`, "View the
portfolio") → 03 chrome mark → 04 principles bento (every line read from
content.ts) → 05 services → 06 process ride → 07 "this site, measured"
(buildStandards only) → 08 pricing → 09 FAQ → start band → enquiry.
Section labels are `SectionRule` ("08 ——— /PRICING"); inside `.v3` the
reused sections' header pill is hidden (kit.css) so nothing is labelled
twice. Gutter words are CSS `content`, not text nodes (decoration at low
contrast). The template's testimonials and invented figures were left
out on purpose. The v2 sections below are no longer on `/` but stay in
the repo. Brad's standing rule: **show previews and ask before building.**
Capturing Lurais needs Node-verified routing in Playwright (Chromium's NSS
store predates the session CA); never disable TLS checks to do it.

## Design system v2 on the homepage (2026-09-25, branch `redesign/design-system-v2`)

Brad: "redo the whole website" with the v2 kit. **Type stays Archivo caps +
Geist** — a serif headline pass (Instrument Serif) was tried the same day and
rejected by Brad as "grandma like"; do not bring a serif back for this site.
Homepage order is now hero → **Manifesto** (ScrollText, the first sentence of
`site.description`) → **Work as the 3D coverflow** (`Work layout="carousel"`,
scrubbed by scroll on desktop, self-advancing with pause on phones) →
**ServiceMarquee** (velocity ribbons) → Services rows → **StartBand** (one
link, giant marquee) → **DisciplinesRing** (TextRing + the Capabilities pill
claims word for word; replaces the Capabilities band on the homepage only)
→ logo strip → studio → process → results → comparison → pricing → FAQ →
let's work → contact. `ScrollMeter` is global (layout). /portfolio cards
carry `Tilt`. Pricing tier cards do NOT: they are CSS subgrid and a wrapper
would break the row alignment. Components in `src/components/v2/`.

**Chrome BL monogram** (`src/components/v2/chrome-monogram*.ts(x)`, after the
logo strip): three.js, dynamically imported near the viewport; the favicon's
stroke geometry rebuilt as rects + half annuli and UNIONED (polygon-clipping)
into one outline per letter before extruding — separate pieces showed seams
Brad rejected. Sticky 240vh on desktop, unpinned on phones. Flat foil SVG for
reduced motion, no WebGL and SOFTWARE WebGL (renderer string checked:
SwiftShader stalled scrolling so badly the suite timed out;
`failIfMajorPerformanceCaveat` alone did not catch it). Screenshots in a
GPU-less sandbox need the renderer name masked in the test script only.

Contrast rules the kit had to learn (axe caught all three): a ScrollText
unlit word is visible text, so the manifesto runs `dim={0.4}`, not 0.14;
off-centre coverflow slides are made `inert` while it runs (faded AND
inactive, never just faded); the ring's far side is opacity 0, the near side
never below 0.4.

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
  hero foreground moves. **On phones the line is not shown at all** — see
  "Still hero on phones".
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
- **FAQ (home):** first five questions + link to the full set on /faq.
  Retailored 2026-09-25 to the four-tier pricing, the /pricing rate card,
  the service pages and the creative plans — fourteen entries now. Order
  is load-bearing: `compact` takes the first five and llms.txt the first
  six, so cost/timing/ownership/edits/plans stay at the top. `meta` is a
  key, not a label — /pricing and `servicePages[].faqMetas` select by it,
  so renaming one silently empties a section. Every figure in an answer is
  a copy of one held in `projectTiers`, `retainerTiers`, `aiSystems`,
  `creativeService.pricing` or `rateCard.smallPrint`, and the comment above
  each such entry names its source — grep this block whenever a price
  moves.
- **Work:** directly after the hero; ONE clearly-labelled dashed **concept
  slot** after the real cards, down from two as New Home Agents landed —
  remove one per real card added, and never fill one with an invented client.
  Video preview plumbing: drop `public/videos/work/<id>.{webm,mp4}` in for a
  muted looping hover/in-view preview (`preload="none"`, reduced-motion
  safe). **No card currently uses it.** The Watch Club had one and the
  client removed it on 2026-09-13 — he wants all three cards behaving the
  same way, static cover only. Turning a preview off is deleting its two
  files, not a code change; the component renders nothing when
  `resolveWorkVideo` finds none. So do not add a video for one card alone
  without asking. Covers resolve from `public/images/work/<id>.*` or
  `<id>.<version>.*` (newest version wins; use ISO dates) with a
  truncated-file check. **Replace a cover under a NEW dated name, never the
  same name**: the image optimiser and Vercel's image cache both key on the
  source path and outlive a deploy, so an overwritten `b-boutique.jpg`
  kept showing the old picture (2026-09-25). A `?v=` query does not work
  on local images in Next 16 without allow-listing every exact query in
  `images.localPatterns`. Resolver: `src/lib/work-image.ts`; (`resolveWorkImage` — a JPEG without EOI renders the
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
- Indexing (changed 2026-09-17 on Shaun's instruction): a Vercel
  PRODUCTION build is indexable unless `NEXT_PUBLIC_SITE_INDEXABLE=false`;
  every preview and local build stays `noindex` unless it is `true`
  (`SITE_INDEXABLE` in content.ts; robots.ts and the root metadata both
  read it). Preview Lighthouse SEO ~66–69 is still CORRECT. The off switch
  is the variable, not a code change.

## Pricing (client's own written figures, 2026-09-11)

Read `projectTiers` / `retainerTiers` / `aiSystems` in content.ts — never
quote a band from conversation (it has changed four times).

- Builds: Essential **£1,250** / Signature **£2,500** / Flagship
  **£6,000**. Flagship went £7,500 -> £6,000 on 2026-09-13 on the client's
  instruction; Signature went £2,500 -> £3,000 and back to £2,500 the same
  day, the £3,000 briefly live on production in between. Both bands have
  moved repeatedly, so quote them from `projectTiers`, never from memory
  or a chat log. The
  "Most chosen" badge was removed the same day — every tier now carries an
  audience eyebrow in `meta` (Sole traders & new starts / Established
  brands / E-commerce, multi-site & large business), which answers "is this
  one me?" without ranking the tiers. Signature is still `featured`, so it keeps the
  inverted card and the invert CTA.
- Each build tier carries a `delivery` line under the price: Essential 5
  working days, Signature 10, Flagship 2–3 weeks, all "**Live in** … from
  kickoff, **once we have your content**". Phrased "Live in", never
  "takes" — and the content conditional is not optional garnish, it is the
  only thing making the window keepable. The Timeline FAQ states the same
  three windows; they must not drift apart.
- Retainers: Care **£200pm** (was £99, client's own figure 2026-09-13 — the £99 had been OUR recommendation) / Growth **£450pm** / Scale **£950pm**. Quoted in two places, the tier card and the Retainers FAQ; keep them together.
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
- **Mobile Performance: 73 -> 93 on 2026-09-13** (real PageSpeed against
  production, not the local simulation). FCP 2.3s -> 1.1s, LCP 5.9s ->
  3.2s, TBT 100ms -> 10ms, Speed Index 4.6s -> 2.6s, CLS 0.

  What did it was NOT touching frame quality. The hero was downloading 2 MB
  of frames before the reader scrolled — measured, 35 frames in 15 seconds
  against 163 KB for the whole rest of the page — and everything else was
  queued behind it on a 1.6 Mbps link. The tail now waits for intent to
  scroll (`hero-sequence.tsx`) and the eager head is 3 frames, not 12.

  **Do not judge this work by the local Lighthouse run.** Locally the same
  change measured 88 -> 87 and looked like a regression, because the
  simulation prices a localhost fetch at nothing. Real PageSpeed moved 20
  points. On anything bandwidth-shaped, trust the deployment.

- **The hero poster is NOT the LCP element, and never was.** That was
  recorded here on 2026-09-13 as the candidate for closing the last amber
  metric, and it was wrong. Measured on 2026-09-14 against production on a
  throttled Moto G profile, cold cache and warm: the LCP element is the one
  PARAGRAPH under the wordmark (`hero.tsx`), and the poster does not appear
  in the candidate list at all. A lighter poster would have bought nothing,
  so that offer is withdrawn — do not revive it without re-measuring.

  What was actually happening: the paragraph's container was
  `max-w-[36ch]`, and `ch` is the width of the loaded font's "0". The box
  measured 335.5px in the fallback and 364px once Geist arrived, so Chrome
  logged the wider box as a SECOND, larger LCP candidate and mobile LCP went
  2,880ms (identical to FCP) -> 4,712ms for 28px of width nobody can see.
  Fixed by pinning it to 23.868rem, which is what 36ch computes to in Geist.

  **`ch` is still the right idiom everywhere else on this site** — it is a
  measure, and it is used on dozens of blocks. It only bites on an element
  that can be the LCP candidate, so the rule is narrow: any max-width on the
  hero lede, or on whatever is largest in a route's first viewport, must be
  font-independent. Checked on the route pages at the same time: PageIntro's
  lede is `54ch` = 608px, well past the 364px a phone gives it, so it never
  binds and is safe.

## Mobile composition (2026-09-14)

Two client reports on the same day, both about a phone showing too much of
the wrong thing.

- **Homepage service rows.** The index sat in an `.eyebrow` capsule, which
  as the only item in a one-column grid row stretched to the full 364px with
  "01" alone in it — an empty-looking pill that reads as a disabled input,
  six times down the page. The client's word was "very generic". It is now
  the printed-index treatment: hung mono figure, hairline out to the edge,
  arrow. The arrow also gives the row a tap affordance it never had — the
  desktop cursor plate is hover-only and cannot exist on touch, so mobile
  had no signal these were links at all. `sm:contents` on the wrapper
  restores the exact twelve-column desktop row from `sm`, capsule included.
  `.eyebrow-plain` in globals.css is the modifier, and it is wrapped in a
  `max-width: 639px` media query rather than being a Tailwind variant
  because `.eyebrow` is UNLAYERED and beats any utility (same trap as the
  Read more pill).
- **/services cards.** Each card showed summary, three clamped lines and all
  six deliverables. The list now shares the paragraph's disclosure, so a
  collapsed card is title, summary, three lines, button. Collapsed with
  `grid-rows-[0fr]`, NOT removed — same GEO reasoning as the clamp: the copy
  stays in the DOM and the a11y tree. The button sits ABOVE the revealed
  block so it does not move when pressed.
- The card height floors came down with it, 41/42rem -> 27/28rem, because
  the tallest collapsed card is 398px on a phone and 422px at `sm` and the
  rest was empty plate. `content-start` keeps the slack at the foot rather
  than sharing it between the rows. **Re-measure both numbers if the copy
  grows** — the equal-height test is what will tell you. The phone floor
  went 27 -> **31rem** on 2026-09-25 when each card gained its "Full
  details" link to `/services/<slug>` (tallest card 486px; 31rem = 496).
  Known and pre-existing, not a regression: from 1024 to ~1300px the SEO
  card runs taller than the rest (738px at 1024), because its right-hand
  detail column is the longest copy. The stack tests measure 390/768/1440
  only.
- **The closing band carries the LAST FRAME of the hero film** (`m/085`),
  so the page opens on frame 1 and closes on frame 85 and the image is a
  bookend rather than decoration. The client's note was that the page "loses
  more and more creativity as you scroll" — the bottom three thousand pixels
  were type on black. No asset was generated for this; it was already in
  `public/`. The scrim is load-bearing, not styling: this is the BRIGHTEST
  frame in the sequence and the type over it is white, so the image is held
  at 30% under a vignette that takes the centre to near-black. Do not raise
  either without re-checking the headline and the lede by eye — axe cannot
  evaluate text over an image.
- **The capabilities band has a phone-only backdrop** at
  `public/images/capabilities/build-tolerance.webp`. `LiquidChrome` behind
  that section is `hidden lg:block` — an interactive WebGL field driven by a
  pointer a phone does not have — so on mobile the band rendered a headline,
  a paragraph, some pills and several hundred pixels of nothing. The picture
  is machined plates meeting along one edge with the tolerance visible
  between them, which IS the section's argument rather than decoration near
  it. Generated 2026-09-14 on the client's instruction (Higgsfield
  **Seedream 4.5**, `quality: basic`, one job, 3:2, `use_unlim: false` so it
  spent credit); converted to grayscale WebP at 1400w, 41KB. Scrim
  discipline as the closing band — held at 36% under a gradient that is near
  black across the top two thirds where the type sits.
  **The tooling will not tell you what a generation costs.**
  `show_plans_and_credits` returns a sales page rather than a balance,
  `models_explore` carries no per-model price, and `nano_banana` — the model
  CLAUDE.md records the service stills using at 1 credit each — is no longer
  in the model list. Generate ONE job at a time and let the client read the
  cost off his own account.
- **The six service stills now render on phones too.** They had been
  `lg:block` behind a fine-pointer check since they were made, so touch
  devices never saw them and the section read as six blocks of text.
- Desktop was verified unchanged rather than assumed: at 1440 the service
  card's paragraph is still at x=633 w=368 and the deliverables list at
  x=1048 w=264, the columns they had before the nesting.

## Legal

`/legal/privacy` and `/legal/terms` from `src/lib/legal.ts`. NOT legal
advice; `LEGAL_REVIEWED` false. The site sets **zero cookies, zero storage,
zero third-party requests** (audited; asserted by the test suite — do not
weaken that test, change the policy and add consent instead). That is why
there is no cookie banner and no consent checkbox on the form (lawful basis
Art. 6(1)(b)). Outstanding before launch: controller postal address, company
number, ICO reference, solicitor review.

## Case studies / work

- **B Boutique** (`/portfolio/b-boutique`): signed client, **LIVE since
  September 2026 at `https://bboutiqueclee.com/`** (.com, confirmed by
  Shaun 2026-09-25 — not .co.uk). Card and case study say "Live"; the page
  still asserts no results, because it launched too recently to have any.
  Own Vercel project (`b-boutique`, repo `ShaunPad04/premium-webdev`,
  branch `client/b-boutique`, app in `clients/b-boutique`).
  `projects[0].href` is the real domain; the shop forwards
  `b-boutique.vercel.app` there. Never hand out per-deployment URLs.
  **The cover is re-shot by BUILDING the production commit locally**
  (clone the branch shallow, `pnpm install && pnpm build && PORT=3200
  pnpm start`, screenshot `/` at 1800x1013 after a 4s settle, convert
  with the pnpm-store sharp, SAVE AS `b-boutique.<ISO date>.jpg` and
  delete the old one — see "Covers" below) — the cloud sandbox cannot reach the domain
  and the Playwright MCP cannot start its browser, and a local build of
  the same commit renders the same page. Last shot 2026-09-25 from
  dff2804 (the horses hero). The case study's "One shoot, not a stock
  library" paragraph predates the launch and was NOT re-verified; check it
  against the live photography before quoting it.
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
  there (looping film), so use `domcontentloaded` plus a settle.
  **The cover is the HERO, taken at the top of the page** (client, and
  live on production since 2026-09-13; the test branch was still carrying
  the old one until 2026-09-14, which is why the preview and the live site
  disagreed and he spotted it).

  The listings band was the shot before that, and the reasoning for it is
  worth keeping because it is now WRONG in one particular: it said the
  cliffside film was a clean plate carrying no agency name. It is not —
  the current film shows the wordmark and the full nav across the top, so
  it reads as a website, which was the only objection. The listings band
  had one real drawback the hero does not: **its content changes**, so the
  cover went stale without the site breaking (Parkfields Lane -> Garstang
  Road on 2026-09-13, with the card still showing the old one). The hero
  is stable copy, so this cover should now only need re-shooting when the
  site is redesigned.
- **Paul Fox Estate Agents** (added 2026-09-25): concept/spec pitch,
  **Brad's own call on the badge**. Repo `ShaunPad04/paul-fox` (its own repo
  since the migration, branch `main`); the card links the promoted production
  alias `paul-fox.vercel.app`, so no branch-alias trap. Every fact on the
  card was read off the live build rather than assumed: independent and
  family-run, established 1990 by Paul Fox, a Chartered Surveyor; five
  offices named on the page as Scunthorpe, Brigg, Barton, Epworth and
  Gainsborough; four strands — buying, selling, lettings, RICS surveys;
  featured listings with real addresses and prices; a branch finder. The
  Concept badge is load-bearing for the same reason as The Watch Club's:
  the build carries their trading name, branches, listings and NAMED
  customer testimonials, and they have not engaged us.
  Cover at `public/images/work/paul-fox.2026-09-25.jpg`, shot the B
  Boutique way — clone, `npm ci`, `next build`, `next start -p 3300`,
  Playwright at 1800x1013 with a 14s settle, mozjpeg q86. The live host is
  egress-blocked from a cloud session, so a local build of the same commit
  is the only route. **The floating chat bubble is hidden for the still**
  (one injected `display: none`, nothing in the layout touched): at
  1800x1013 it lands squarely on the hero's own paragraph. The lede is NOT
  mid-animation in that shot — measured, it settles at x=1188 w=460 — so do
  not "fix" it by waiting longer.
  **NOINDEX SHIPPED 2026-09-25** (Brad: "keep it no index on paul fox"), in
  the paul-fox repo, commit 79be29b: `src/app/robots.ts` returning
  `Disallow: /` AND root metadata `index:false, follow:false, nocache,
  googleBot.noimageindex`. Both, because robots.txt only stops the FETCH —
  a URL disallowed there can still be listed from an inbound link, since
  the crawler never reads the page to learn it should not be. Neither is
  behind a flag; delete them deliberately if Paul Fox ever engage us.
  **Still open, raised and not actioned:** `site.url` in that repo is
  `https://www.paul-fox.com`, their real domain, so every canonical and
  og:url on the concept build names their site. That is a decision about
  what the build claims to be, not a crawler control, so it was left.
- **The Watch Club** card carries its Concept badge. `PORTFOLIO_VERIFIED`
  stays false until agreed metrics exist; `Work` renders an honest
  "publishing soon" state when the array is empty.

## Favicon — the BL monogram (2026-09-16)

`src/app/icon.svg`, `src/app/favicon.ico` and `src/app/apple-icon.png`. Until
then the site shipped the stock create-next-app favicon (25,931 bytes, the
Vercel triangle) in every tab, including on the live domain.

The mark is the client's BL monogram — a single-stroke B with an L nested in
its stem — **traced as vector geometry from the supplied 1240px raster**, not
the raster shrunk. Shaun asked for the logo only, so the coin it sits on is
dropped; the tile is a black rounded square with the `.foil` silver gradient on
the strokes. The SVG is the source of truth. The ICO holds 16/32/48 PNG layers
rendered from the same paths with the stroke thickened per tier (56 units in
the SVG, 68 at 32px, 96 at 16px), because a double-stroke monogram dissolves
below a pixel of stroke. At 16px it reads as a bold B; that is the ceiling for
this mark, not a defect to fix by simplifying the SVG. `apple-icon.png` is a
full square with no rounded corners because iOS applies its own mask.

`sharp` is not a direct dependency; the rasters were produced by a one-off
script against the copy in the pnpm store, not a new devDependency.

## Share preview (Open Graph) — 2026-09-25

When someone pastes the URL into WhatsApp, Slack, iMessage or LinkedIn, the
card now shows **the actual homepage**, not a generated plate. Brad's
report: the old card was a black rectangle with the wordmark on it, and he
wanted the real page.

- `src/app/opengraph-image.jpg` and `src/app/twitter-image.jpg` (identical,
  1200x630, ~88KB) plus their `.alt.txt` files. Next's file convention
  picks these up and emits `og:image` / `twitter:image` with width, height,
  type and alt; nothing in `layout.tsx` names them. The two files are
  duplicated on purpose — the convention resolves per filename, and a
  re-export only worked while these were `.tsx` routes.
- **The generated card is gone.** `opengraph-image.tsx` was a `next/og`
  `ImageResponse` drawing the wordmark on black. Do not reinstate it as a
  fallback: two sources for one card is how they drift.
- **To re-shoot it** (after a hero or homepage redesign): `npx next build`,
  `npx next start -p 3200`, then Playwright at **1440x756** (the 1.905
  ratio of 1200x630, so the downscale never crops), `domcontentloaded`
  plus a ~6s settle for the hero sequence to draw frame 1 —
  `networkidle` never fires, the film keeps loading. Convert with the
  sharp in the pnpm store (`node_modules/.pnpm/sharp@*/node_modules/sharp`;
  it is not a direct dependency), `resize(1200, 630)`, mozjpeg q88, 4:4:4.
  Chromium comes from `PLAYWRIGHT_BROWSERS_PATH` by the same versioned
  lookup `playwright.config.ts` uses — the top-level package is
  `@playwright/test`, not `playwright`, and its default revision is not
  the one installed here. Delete the throwaway script afterwards.
- Unlike the work covers, these need no dated filename: they are served by
  Next with a content hash in the query, so a new build busts the cache.

## Deployment (Vercel)

- Project **`blackline-agency`** (`prj_uuvDuoqKVBRADjy6kpUaGvmBFGIm`) in
  team **BlackLineAgency** (`team_x94jHbSiH6IewIGUOpoYNATA`), linked to
  `ShaunPad04/New`. **NOT the only project watching this repo** (found
  2026-09-18): `maison-de-muse` (`prj_nZIZv7TmdJ2bC4DwkpWqylEc7pOj`) is
  also linked to `ShaunPad04/New` with Root Directory
  `clients/maison-de-muse`, which no longer exists on any branch here, so
  every push to this repo queues two builds for it that fail on the clone
  ("The specified Root Directory … does not exist"). Harmless to the site
  but noise in the dashboard and a build-slot consumer on a Hobby team.
  Fix in the Vercel dashboard, not here: point that project at its own
  repo or delete it. The other client sites were split into their own
  repos on 2026-09-11.
- **The two branches were realigned on 2026-09-14.** Production had drifted
  for days — Flagship £6,000, the opengraph/twitter routes and the audit
  fixes existed ONLY there, while `test/homepage-redesign` had the mobile
  work — so the live site and the preview quoted different prices. The merge
  was resolved on production's side (one conflict, `pricing.tsx`: production's
  lit plate for the featured tier plus the branch's `p-7` mobile padding, both
  kept) and merged back down, so the two now agree. **Do not let them drift
  again**: promote with a real merge, never a fast-forward, and check
  `git log --oneline origin/<prod> ^test/homepage-redesign` is empty before
  assuming they match.
- **Production branch is `claude/premium-website-hero-setup-7elnor`**
  (client's own dashboard change), serving `blackline-agency.vercel.app`.
  "Production" means the short URL, not a launch — the indexable flag is
  unset there too. **Never deploy to Production or attach a domain unless
  Brad explicitly asks.** Every other branch builds as a Preview.
- The dashboard **Ignored Build Step only builds the production branch**;
  `vercel.json` on `test/homepage-redesign` overrides it (`exit 1` = always
  build) so this branch previews — **do not merge that file**.
- **Promoting `redesign/design-system-v2` to production (2026-09-26):**
  that branch carries two preview-only paths, `vercel.json` and
  `src/app/lab`.
  - After EVERY merge into production, run
    `git ls-files vercel.json src/app/lab` on the production branch. If
    either comes back, `git rm` it before pushing. Both slipped through
    once, because the sync merge back into the preview branch had
    restored them.
  - Syncing production back the other way would delete them from the
    preview branch. Restore them with
    `git checkout HEAD -- vercel.json src/app/lab` before committing.
- This branch's preview:
  `blackline-agency-git-test-homepage-redesign-black-line-agency.vercel.app`.
- Deployment protection is OFF (client's instruction) — note it silently
  reverts to the team default if the project is ever deleted and relinked.
- Preview hosts are egress-blocked from cloud sessions; the Vercel
  connector's `web_fetch_vercel_url` is how to read a deployment from there.
  The production domain is egress-blocked too; read it through the
  connector via `blackline-agency.vercel.app`, which the same deployment
  serves.
- **Builds can sit in QUEUED for 20+ minutes** with no log output and no
  platform incident (2026-09-18, the comparison merge). Earlier builds the
  same day were READY in 30 seconds. Nothing in the repo causes or cures
  it; if it outlasts patience, "Redeploy" on the stuck deployment from the
  dashboard. Never push an empty commit to kick it.

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

## Mobile performance pass (2026-09-16)

Shaun's PSI run: mobile 75 (FCP 2.7s, LCP 4.7s, SI 5.1s, TBT 30ms), desktop
97–99. Measured here first, before changing anything, with the repo's own
Chromium and Lighthouse 13 at `--preset=perf` (mobile) and `desktop`, three
samples each, on a `pnpm start` server. Same container, same protocol, before
→ after:

| | before | after |
| --- | --- | --- |
| Mobile score | 68 | **86–87** |
| Mobile FCP / LCP (simulated) | 1.4s / 5.2s | 2.4s / 2.4s |
| Mobile Speed Index | 3.7s | 3.0s |
| Mobile TBT | 460ms | 330–380ms |
| Desktop score | 97–99 (PSI) | **99–100** |
| First-load JS (gz) | ~270 KB | 227 KB |

**What the mobile LCP actually was.** Not the poster: Chrome excludes an image
that fills the whole viewport from LCP, so the candidate is the hero
paragraph, and it paints at first paint (236ms unthrottled, 464ms at 4× CPU,
measured with a PerformanceObserver). The 4.7s is Lighthouse's slow-4G
*simulation*: for a text LCP its pessimistic graph is every request that
started before the observed paint, and that was ~250 KB of gzipped JS plus
hero frames 2–3 (140 KB) plus fonts plus the poster. Mobile is a
bytes-before-paint problem, not a rendering one — the hero is fully painted
with JavaScript off (screenshotted) and at every throttled capture.

**What changed.**
1. `motion` (43 KB gz, only used by `Reveal` and `TextReveal`) removed. Both
   are now markup plus CSS in `globals.css`; `components/reveal-observer.tsx`
   is the one client component, an IntersectionObserver plus a
   MutationObserver for blocks that mount later. The hidden starting state is
   under `@media (scripting: enabled)`, so no-JS readers get the content.
   Reduced motion is still forced in CSS. GSAP stays (hero only, dynamic).
2. Hero frames 2–3 now start on `load`, not the instant frame 1 draws.
   Frame 1 is unchanged; `tick` still pulls frames on demand.

**Two experiments that did NOT ship, with why**, so nobody repeats them:
- Rendering `TextReveal` on the server (no client boundary) grew the document
  from 450 KB to 480 KB (RSC payload 190 → 231 KB): the payload carries the
  whole tree, a client component serialises as its props (one string) and a
  server one as its output (263 spans). It is a client component on purpose.
  `Reveal` has no state either way and is left as plain markup.
- `<Suspense>` boundaries around every below-fold section: FCP/LCP/SI each
  improved ~300ms but TBT rose 110ms; net score unchanged, worse interaction
  profile. Reverted.

**Why mobile 100 is not reachable with this architecture, in numbers.** A
mobile 100 needs FCP ≲ 1.0s, LCP ≲ 1.2s, SI ≲ 1.5s and TBT ≲ 50ms in the
slow-4G model. The document alone is 72 KB gzipped (450 KB raw: 190 KB of
that is the RSC payload Next emits for every page, 55 KB is inline SVG marks),
which is ~0.5s of transfer plus a 570ms parse/style task at 4× CPU before the
first paint can happen; React's hydration of a 1,700-element tree is the
TBT. Getting there means a page with a fraction of this HTML and JS — static
sections without hydration, no image-sequence hero — which is a different
site, not an optimisation. Desktop 100 is real and reproducible.

**The trap that cost an hour:** an orphaned `next-server` kept serving the OLD
build's HTML on port 3100 after a rebuild, its assets now 500ing, and
Lighthouse happily scored that (score 78, CLS 0.52, TBT 0, tiny byte counts).
Check the served chunk names match `.next` before trusting a number, and kill
servers with `pgrep -f "^next-server"` — a pattern like `next start` matches
the shell running it and kills that instead.

**Round two, 2026-09-17, on Shaun's "do what's best and looks best".** The
three levers left with a visible cost (drop the Geist Mono preload, lower the
poster's fetch priority, a still hero on phones) were put to him and ruled
out by that instruction. What was tried with no visible cost:

- **`experimental.inlineCss` — a net loss in Next 16, do not retry.** It
  removes the render-blocking stylesheet request (modelled first paint 2.1s
  → 1.2s) but Next also embeds the CSS a second time inside the RSC payload:
  the homepage went 71 KB → 144 KB gzipped, TBT 330ms → 790ms, score 86 →
  81. The docs' "styles are duplicated" caveat is the whole story.
- **The logo strip's sprite is now an external file — SHIPPED.**
  `public/logo-marks.svg`, emitted by `scripts/generate-logo-marks.mjs`
  next to `logo-marks.ts`, referenced by `<use href="/logo-marks.svg#…">`.
  The inline `<symbol>` sprite was 10 KB gzipped and, being server-rendered,
  sat in the RSC payload again: the homepage went **71 KB → 50 KB gzipped**
  for a strip below the fold. Verified every glyph paints from the external
  file (56 `<use>` nodes, 24×24 boxes) and the strip screenshots identically.
  Keep the ids in step with `markId()`.

**How to read the local numbers.** `--preset=perf` is DEVTOOLS throttling
(real emulated 4G + 4× CPU, observed metrics), not Lantern simulation; PSI
uses simulation. Under it the mobile first paint is ~2.4s and it is now
CPU-bound — CSS lands at ~1.0s and the paint follows ~0.9s later, which is
parsing and styling a 1,700-element document at 4× — so shaving bytes no
longer moves it, which is what the sprite change showed (2417ms → 2417ms).
The design-preserving levers are exhausted at mobile 85–87 local; the
architecture note above still stands.

**Why PSI mobile LCP sits ~2s above FCP, from Lighthouse's own source
(read 2026-09-17, `@paulirish/trace_engine/.../lantern/metrics/`).** Shaun's
PSI after the day's work: mobile 81, FCP 2.0s, LCP 4.2s, TBT 90ms, CLS 0,
SEO 100. The LCP element is the hero paragraph and it paints AT first paint
(observed FCP = observed LCP in every run, every mode). The gap is the
model: Lantern's LCP graph keeps every network node that finished before the
observed LCP timestamp, and drops a script only if its EvaluateScript task
started AFTER that timestamp. With no network throttling in the observing
browser every chunk has downloaded by ~100ms, so what decides the score is
whether the first paint lands before or after the async chunks *execute* —
and that instant is noise: the same build observed FCP at 257ms, 1,266ms and
1,444ms in three runs (simulated LCP 3.4s, 5.1s, 5.2s). Nothing in the page
controls it. Even the best case has a floor: HTML 50 KB + CSS 23 KB + three
fonts 88 KB + poster 73 KB all finish before any paint and are charged at
1.6 Mbps plus round trips, which is ~3.4s. Options that would lower it, all
with a visible cost and all declined under "looks best": `fetchpriority=low`
on the poster (drops it from the optimistic graph), subsetting or dropping a
font, a still hero on phones. Do not spend more time on the mobile score
without changing one of those three.

**Location on the page (2026-09-17).** "blacklineagency grimsby" found
nothing: the site was unindexed, the Business Profile unverified, and the
word Grimsby appeared only on the privacy policy and in a case-study
sentence. Now: the `ProfessionalService` JSON-LD carries a `PostalAddress`
read from `legalEntity.address` (the same lines the privacy policy prints
and the ICO holds — Holton le Clay, Grimsby, DN36 5BE), `areaServed: GB`,
the meta description ends "based in Humberston, Grimsby, Lincolnshire,
working across the UK", and the footer copyright line carries the town. The
copy says Humberston on Shaun's instruction; the legal address says Holton
le Clay because that is what was registered — if Humberston is where they
actually are, the legal address is the thing to change, not the schema.

**The bare brand query (2026-09-18).** Searching "blacklineagency" gets
rewritten by Google to "blackline agency" and returns four established
studios with that name (Blackline Creative, London, with a verified
Business Profile; The Blackline Agency; Blackline Creative Studio;
Blackline Studios) plus an Instagram account called exactly "Black Line
Agency". `site:blacklineagency.co.uk` returned nothing — the site became
indexable on 2026-09-17 and had not been indexed a day later. The homepage
JSON-LD now carries `alternateName: site.logotype` ("BlackLineAgency") on
the ProfessionalService node and a separate `WebSite` node with the same
two name forms, which is the documented input to Google's site-name
selection. That is the whole code lever: the rest of the brand query is
the Business Profile verification (the panel Blackline Creative holds),
the Search Console request-indexing already made, and time. Do not add
spellings the client does not use.

**Indexing push, 2026-09-25** (Shaun: "do this all for me"). Search
Console showed 1 page indexed, 1 "Page with redirect" (www, expected) and
6 "Discovered – currently not indexed" — Google's queue for a new,
barely-linked domain, not a fault. Everything on the site that can help is
now in:

- **Case studies in the sitemap**, read from `caseStudies`, so new ones are
  listed automatically. The sitemap's `lastmod` is the BUILD time (the
  route is static), so every deploy marks every page modified; harmless,
  and not worth faking per-page dates for.
- **IndexNow on every production deploy.** `scripts/indexnow.mjs` runs
  after `next build` (the build script in package.json) and POSTs every
  sitemap URL to api.indexnow.org — Bing, and through it ChatGPT search
  and Copilot. No-op unless `VERCEL_ENV=production`; always exits 0 with a
  10s timeout, so it can never fail a deploy. The key is PUBLIC by design
  and lives in `public/<key>.txt`; the constant in the script must match
  the file. The cloud sandbox cannot reach IndexNow (proxy 403), so the
  only evidence it ran is the `[indexnow]` line in the Vercel build log.
  Google does not accept IndexNow; for Google the levers are the sitemap,
  Request indexing and links.
- **One local landing page, `/web-design-grimsby`**, copy in `localPage`
  in content.ts. ONE page for the home area, deliberately not a page per
  town (a doorway pattern). It quotes no price itself and carries the live
  `Pricing compact` instead, so it cannot drift from the tiers. Linked from
  the footer on every page, in the sitemap at 0.8, with a `Service`
  JSON-LD node naming the towns it lists. Every claim in it is already
  made elsewhere on the site; add none that are not.

- **Brand identity in the structured data** (same day). The business
  node has `"@id": "<site>/#business"`, and the WebSite node's `publisher`
  and the Grimsby Service node's `provider` point at it, so Google reads
  one entity. `logo` and `image` are `public/logo.png`, the BL monogram at
  512px rendered from `src/app/icon.svg` with the pnpm-store sharp — a
  FIXED path on purpose (Google's logo must be a stable, crawlable raster
  of at least 112px; the favicon routes carry a hash). Re-render it if the
  monogram changes.

- **A page per service, `/services/<slug>`** (same day, Shaun: "build
  the service pages if it's better for the algorithm"). Six pages from
  `servicePages` in content.ts: web-design (Web Design + UI & UX),
  seo, email-sms (Email + SMS), hosting-care, creative, ai. Disciplines
  with too little to say alone SHARE a page on purpose — a page per
  discipline with one paragraph each is the thin, near-duplicate pattern
  Google demotes. Each page carries the discipline's full `detail` and
  `capabilities`, its pricing rendered from the tier data (never typed:
  `Pricing compact` for builds, `retainerTiers` marked Included / Not
  included for plans, `aiSystems` with every caveat beside its figure,
  `creativeService` plans), its FAQs by `meta`, links to every other
  service page, and Service + BreadcrumbList JSON-LD tied to the
  business `@id`. `Service.page` names each discipline's page; the
  homepage rows and the /services cards ("Full details") link there, and
  /services lists every page including creative and AI, which have no
  card. Sitemap and llms.txt read `publishedServicePages`; the creative
  page follows `CREATIVE_SERVICE_READY`. Which plan includes what is
  recorded in the comment on `servicePages` — re-check it whenever
  `retainerTiers.includes` changes. Plans a service is NOT in are shown
  at full contrast with a "Not included" label: fading them failed AA.
  **Open contradiction, raised with Shaun, not resolved here:** the
  creative section (homepage, /pricing) says "We do not touch your ad
  accounts" and lists "Media buying or ad account management" under what
  we do not do, while the Partner plan (added 2026-09-24) says "We run
  your Facebook and Google ads". The creative page states both truthfully
  (creative alone does not run ads; Partner does); the older sections
  still need his decision.

- **/pricing is one rate card** (2026-09-25, Shaun: it read "all over
  the place" rather than as a tidy agency price list). Order: intro → "At
  a glance" index (a "from" figure per band; the AI row quotes NONE, since
  it is two-part priced) → 01 builds → build standards → 02 monthly plans
  (no toggle any more) → 03 AI add-ons → 04 creative (`id="creative"`,
  the homepage's /pricing#creative target) → the small print → FAQ → CTA.
  Sections are in `components/rate-card.tsx`, copy in `rateCard`.
  Every plan set (builds, retainers, creative) renders in ONE `TierCard`
  anatomy: name → price + delivery → summary → button → list, and from
  `lg` each card is a CSS SUBGRID over five shared rows so prices,
  buttons and lists align across the row. The deck's row gap is 0 with
  `lg:mb-6` per card on purpose — a row gap would open inside every card.
  Every line-item price (AI, one-off creative) is the same `RateRow`.
  Lines on every build card were lifted to `projectTiersShared` ("Every
  build includes"), so "Founder-led" now visibly covers Essential too —
  a verified business fact, not a new promise. The creative capability
  grid, process and exclusions came OFF /pricing; /services/creative
  carries them (steps and the "creative supplier" note added there), and
  `CreativeService` is now the homepage block only. Page length: phone
  15,705 → ~14,500px; desktop grew ~1,000px because the monthly plans are
  no longer hidden behind a tab. The homepage `Pricing` lost its
  `compact` prop — it only ever renders the compact section now.

What only the founders can do (their logins): resubmit the sitemap and
Request indexing in Search Console, verify the Business Profile, connect
Bing Webmaster Tools, and get the URL into social bios and directories.

**Still hero on phones — SHIPPED 2026-09-17 (Shaun: "option 1").** Below
768px `HeroSequence` takes the branch reduced motion always took: the
server-rendered poster (frame 1, not the goggle close-up — switching frames
would download a second image and visibly swap), no canvas, no pin, no GSAP
import, no frame fetches. `still = reduced || phone`, both from
`matchMedia`, null until known so the first paint never commits to the
wrong branch. Verified on Pixel 7 and iPhone emulations: one request to
`hero-frames/` (the poster), zero GSAP chunks, no pin-spacer, and a wheel
event starts nothing. iPad Mini (768) still runs the full sequence.

**The scrub line is GONE on phones (Shaun, 2026-09-18).** For one day it
was kept as a static second headline high-left, with the scrim off and the
line 6rem from the top; he saw it on the live site and called it out of
place — against a frozen frame it was a caption that had lost its film.
`.hero-scrub` is `display: none` below 768px, so the phone hero is
wordmark, lede and two calls to action, and the reduced-motion hero block
in globals.css is back to `prefers-reduced-motion: reduce` alone (desktop
and tablet with reduced motion still get the static top-left line). If the
line ever comes back on phones, the measurements from that day are in git
(commit cea0f2a): 6rem clears the wordmark by 76px at 390×664, and under
640px of height there was no room for it at all.

**One tree for both modes.** The first cut had two return branches, and the
sequence's `<canvas>` came first in its list; when a phone resolved `still`
after hydration React saw a different element at every index and remounted
the poster, scrim and hero copy — the 44px touch-target test caught the
enquiry link mid-remount as a null bounding box. The canvas slot is now
held with `null`, so switching modes changes one class and one prop and
remounts nothing. Keep it that way: any new child goes AFTER the canvas
slot, in both modes.

Effect, same container, Lighthouse in PSI's simulated mode, three runs:
**mobile 64–68 → 87–92**, TBT 610ms → ~60ms, FCP 1.36s, LCP 3.4–4.0s,
CLS 0. Devtools-throttled mode 85–87 → 88–89. Desktop 99, unchanged. What
remains in the model is the byte floor (HTML, CSS, fonts, poster) noted
above; the phone hero no longer contributes JavaScript to it.

**Comparison ("Why us") rebuilt 2026-09-18** to a second reference Shaun
sent (a four-column matrix with a mark in every cell, centred opener). Rows
are `label` + three `ComparisonCell`s (`mark: yes | caution | no`, short
`text`), columns Black Line Agency / Other agencies / Hire in-house. The
first version ticked our column only, for the comparative-advertising
reason; the marks are now bounded instead — `yes` is a claim about us or
a structural plus elsewhere, `caution` is a tendency and the label SAYS
"often"/"usually"/"depends", `no` is a structural fact true of every
instance (salary plus overhead; a hire before any work). The rule and the
sources each row must track are in the comment on `comparison` in
content.ts. The close CTA band was dropped with the reference; the note
under the plate stays and carries the "once we have your content" caveat
the Speed row needs. The header cell is the `Wordmark` component, not the
name in type.

**Indexing — DONE 2026-09-17** on Shaun's repeated written instruction.
`SITE_INDEXABLE` is now true on a Vercel production build unless
`NEXT_PUBLIC_SITE_INDEXABLE=false`; verified by building with
`VERCEL_ENV=production` (robots `Allow: /`, no noindex meta) and without
(`Disallow: /`, noindex). PSI SEO 69 → 100 follows, since that one audit was
the whole gap. Two consequences he was told: `pnpm verify` still blocks an
indexable build while `TESTIMONIALS_VERIFIED`, `PORTFOLIO_VERIFIED`,
`PRICING_CONFIRMED` and `LEGAL_REVIEWED` are false (its `indexable` test
reads only the env var, so it passes locally and is simply not consulted by
Vercel's `next build`) — those flags all hide their content, so nothing
unverified is published, but the gate predates that and re-scoping it to
`LEGAL_DETAILS_VERIFIED` alone is the honest follow-up; and the legal pages
go public without a solicitor's review, which is his accepted risk.

## Client input required

| Item | Status |
| --- | --- |
| Logo asset (vector) | Raster BL monogram supplied by Shaun 2026-09-16 (silver on a black coin). Traced as vector for the favicon — see "Favicon". The header wordmark is still set in type. |
| Founder photos (B/W) | Not supplied. Labelled slots render; drop `public/images/founders/bradley-hoxha.*` / `shaun-padley.*`. |
| Real testimonials | None exist. Section hidden until they do. |
| Real client outcome figures | None exist. Deleted from the page. |
| Portfolio metrics | None agreed. `PORTFOLIO_VERIFIED = false`. |
| Work preview videos | None supplied. Plumbing live at `public/videos/work/<id>.*`. |
| Pricing sign-off | Figures are his; `PRICING_CONFIRMED` flip awaits his word. |
| ® vs ™ | Awaiting IPO registration confirmation. Currently ™. |
| Company registration / VAT / ICO | Partnership, under the VAT threshold (see legal.ts). **ICO registered: ZC251044** (from the ICO's own confirmation email, 2026-09-17), set in `legalEntity.icoReference` and printed on the privacy policy. |
| Enquiry delivery | **Working, verified 2026-09-17**: a live submission arrived in contact@blacklineagency.co.uk from `enquiries@` via Resend (key set in Vercel, DKIM/SPF in Porkbun DNS). `/api/enquiry` still returns 501 if the key is ever removed, never a fake success. |

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
