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
- **Palette:** monochrome — the `ink-0`→`ink-1000` scale in
  `globals.css` — plus ONE accent, `--color-accent` #f02b42 (Brad,
  2026-09-28, "add the red accents", Neiden's red), used only on the hero's
  script line and the hero's project count. The load screen's line is
  white (Brad asked, same day). `ink-600` is pinned at `#808080`
  (lowest value clearing WCAG AA 4.5:1 on `ink-0`); do not darken it.
- **NEIDEN-FONTS TRIAL (2026-09-28, Brad: "can we try the Neiden fonts for
  the whole website") — NOT yet signed off.** `--font-display` = Cal Sans
  (one weight; `font-synthesis-weight: none` on body stops the faked bold),
  `--font-sans` = DM Sans. Inter (Neiden's third face) stays banned. Display
  tracking loosened to -0.015/-0.02em plus `word-spacing: 0.1em` (Cal Sans's
  space is narrow and caps words ran together). DM Sans set as Neiden sets
  it (measured): body -0.02em on `body` (Neiden: -0.05em at 16px); the hero
  phone sentence 500 / 17px / 1.4 / -0.04em; hero labels 700 / 12px / caps
  / -0.02em. Hero logo row has NO visible "/Built with" (Brad; sr-only
  label kept), white marks at 20px. Mono labels stay Geist Mono;
  the intro line stays Clash. Revert = the two theme lines in globals.css,
  the two `preload: false` flags in layout.tsx, and the two display
  tracking comments. The note below describes the pre-trial type.
- **Type:** Display = Archivo 800/900 uppercase, tight tracking
  (`.display-*`). Body/UI = **Geist** — Inter, Roboto, Arial, Open Sans and
  Helvetica are banned outright, including in fallback stacks. Eyebrows =
  Geist Mono pill (`.eyebrow`); `.field-label` is the same without the pill.
  Wordmark = display face at 800, 0.12em tracking, `.foil` silver gradient
  (client override 2026-09-04 — do not restore the thin Inter version).
- **Motion:** Lenis smooth scroll (dynamic import, post-paint); scroll
  entrances are **CSS transitions** driven by one `RevealObserver` (the
  `motion` package was removed 2026-09-16 — see "Mobile performance pass");
  the hero scrub is a native `position: sticky` hold (`.hero-track`),
  NOT a ScrollTrigger pin — see "Hero hold" below. GSAP is no longer
  loaded on any page.
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

## Neiden hero performance (measured 2026-09-29, local prod build, Lighthouse 13)

Mobile 80-84, desktop 97, a11y 100; SEO 69 / BP 96 are the preview noindex
and the missing /_vercel/insights, both 100 on an indexable Vercel build.
The LCP element is the hero wordmark, observed at ~224ms (= FCP); the
simulated 4.2s is the pre-paint byte floor: HTML 44KB, CSS 29KB, four
preloaded fonts (DM Sans 37, Geist Mono 23, Mr Dafoe 18, Cal Sans 16; Cal
Sans is ONE shared file), Clash 16KB (fetched because the intro text is in
the DOM), poster 59KB. The hero film is fetched at LOW priority only after
`load` and the preloader lift (~2.8s), which took its 851KB out of the
pre-paint graph. Tried and reverted: Geist Mono `preload: false` (no gain,
FCP slightly worse). Mobile 100 is not reachable with this design (see
"Mobile performance pass"); the remaining levers all have a visible cost
(fewer fonts, no poster, no load-screen script face).
**Compression pass, same day (Brad: "i like the fonts ... is there no
compressing we can do"), mobile 80-84 -> 86-90, nothing visible changed:**
Mr Dafoe self-hosted as a lowercase-only subset (17.3 -> 3.9KB,
`src/app/fonts/MrDafoe-lowercase.woff2`, both lines are lowercased); Clash
subset to Latin + typographic punctuation (15.3 -> 7.9KB); phones get a
960px poster (`vortex-poster-sm.webp`, 29KB, the same size as the phone
film) as the video's CSS background, and the `poster` attribute is gone
(it could not follow the breakpoint). Subsetting Cal Sans, DM Sans or Geist
Mono saves only 2-3KB each, not worth leaving next/font/google.

## Neiden hero (2026-09-28, Brad) — replaces the scroll film on `/`

Brad chose option A of three rendered at `/lab/hero?v=a|b|c` (lab page since deleted) (after
neiden.framer.media and ovra.framer.website — layout studied, no assets,
code or copy taken). `src/components/v3/neiden-hero.tsx`:
- Hairline three-column grid with corner ticks; numbered columns from
  `heroColumns`; the lede is `site.description`'s first sentence.
- **Wordmark = Cal Sans, lowercase "black line"** (Neiden's face — Brad said
  the Archivo caps looked out of place), fills the grid frame. Fill = Neiden's
  look (Brad, 2026-09-28): #f0f0f0 with a FAINT fine grain (was a heavy
  black "worn foil" speckle that read grey and dirty beside Neiden's).
  Desktop foot: socials in column 1, the logo row from the column-2 rule
  (Brad: "start from here like neiden does"); phones stack them.
- **Hero text = option B** (Brad: the plain paragraph "looks out of place"):
  a short mono-caps label, "Websites, search, email & SMS. Designed, built
  and run in-house." The full `site.description` sentence stays sr-only.
  Two lines under 640px. **The film runs through the letters** (Brad, after
  Neiden): `.hero-wm { mix-blend-mode: difference }`, so bright rings cut
  across the white letters as dark lines. Keep it on `.hero-wm` itself (its
  own stacking context); on a child it blends with nothing.
- **Below lg the hero follows Neiden's PHONE layout** (Brad: "make the hero
  like the neiden one design on mobile"), reading top down: centred
  `/NN selected projects`; the three numbered columns side by side (number
  over label, 12px) with all four grid rules showing; the name on ONE line
  edge to edge in the frame (22.2vw, measured 27-348 in a 24-351 frame at
  375) with the script written across its letters (7.3vw, left 5%); the
  label's words as a plain 20px sentence (desktop keeps the mono caps);
  the full-width bracket CTA; the proof row. Rejected on the way: a
  "black" left / "line" right split ("odd"), a two-line stack, and a
  bottom-anchored layout with the services as a ruled list under the name.
  Re-measure the wordmark width if the copy or face changes.
- **Hero script = Mr Dafoe (the load screen's brush), RED, flat** across
  the name's lower third, NO outline (Brad, 2026-09-29: "use the load
  screen font ... on the hero", "it should be red", "as it is"). A thin
  Sacramento (after Neiden's paid Patung) was tried on 2026-09-28 and
  dropped. Load screen: same face, WHITE. `heroScrubLine` lowercased.
  No black around it ("it should just look like neiden"): a black edge,
  and a black stroke painted over the fill to thin it on desktop, were both
  tried the same day and removed. Mr Dafoe has one weight, so it is at
  full brush weight; thinner means a smaller size or a thinner face.
- Proof cluster = founders' initials + `buildStandards` perf score. A
  founder's circle shows `public/images/founders/avatar-<slug>.*` when it
  exists (`resolveFounderAvatar`; separate from the studio portrait slot):
  Bradley's is the image Brad supplied on 2026-09-28, greyscale, 176px. Shaun's (2026-09-29, Brad: "it doesn't
  have to be their face") is an AI-generated silhouette in the same style
  (Higgsfield gpt_image_2_5): a profile with a light streak across the eyes,
  not a likeness. Replace it with a real picture whenever Shaun supplies one. Neiden's
  avatars / "4.9 from 361 reviews" are NOT copied (nothing fabricated).
  **Hero foot (Brad, 2026-09-28, "like neiden"):** the `/Built with` logo
  marquee (`StackMarquee` in lurais-parts, MOVED here from the intro so the
  page does not say it twice; keep the label, they are tools, not clients),
  then the socials row + "Stay connected". Socials now include X with an
  EMPTY href at Brad's request ("then we can add the links"): mark only,
  not a link, not in sameAs. Shaun had deleted X on 2026-09-15 as a dead
  ring, so fill or delete it before launch. Dribbble and Behance were
  added the same way and removed the next day (Brad).
  The phone hero fits 375x812 exactly with all of it.
- **Wordmark glitch** (Brad liked Neiden's): two stacked `aria-hidden`
  copies flash in horizontal bands for 340ms, monochrome (white + ink-600,
  no red/cyan). Fires ~1.3s after load, then every 5–9s while on screen
  (`data-glitch`, set by `ParticleWave`), and on hover. Off under reduced
  motion.
- **Background = `HeroFilm`, our own particle-vortex video** (Brad asked
  for "a closer match to Neiden's hero video" and declined spending
  Higgsfield credits: "can we create it somewhere else"). Rendered locally
  in Blender 5.2 by `scripts/hero-vortex/vortex.py` — a torus of dotted
  rings, EEVEE depth of field (near rings melt to soft bands), drifting
  dust, a per-frame spin handler so the 10s/24fps loop is exactly seamless.
  Encoded to `public/videos/hero/vortex{,-sm}.{webm,mp4}` +
  `vortex-poster.webp` with ffmpeg. Poster in the HTML; on idle after first
  paint the file is fetched ONCE and played from a blob: URL (CSP media-src
  allows blob:) — streamed, each 10s wrap went back to the server and could
  drop out (Brad: "why does the video keep disappearing"). Falls back to
  streaming if the fetch fails. The blob URL is cached per visit and never
  revoked (revoking it on unmount left remounts on a dead URL → black). An
  error re-attaches it; a 2s watchdog presses play if the film is stopped and
  the tab has been visible for 1s+. NEVER seek to "repaint": a currentTime
  nudge on focus/visibility made the film stutter every few seconds; paused off-screen / hidden tab; never loaded
  under reduced motion. **Keyframe every 0.5s (`-g 12`) in all four files —
  load-bearing.** The first encodes had one keyframe per 5.3s (WebM) / 10s
  (MP4); whenever Chrome dropped the decoder (pane hidden, off-screen,
  resize) it had to rebuild from that keyframe and the film vanished for
  seconds (Brad: "the video keeps disappearing", three times). Encode from
  the rendered PNGs: VP9 `-crf 40 -b:v 0 -g 12 -keyint_min 12`, x264
  `-crf 26 -preset slow -g 12 -keyint_min 12 -sc_threshold 0 -movflags
  +faststart`, `-sm` at 960x540. Check with `ffprobe -show_entries
  packet=flags` (expect 20 K per file). The poster is also the video's CSS
  background, so any gap shows the still, never black. The plexus places
  its points once (0-1 units) and only rescales them on resize, so the web
  never reshuffles. The code-drawn `ParticleWave` it replaced was
  deleted (in git). To change the look, edit the script, re-render
  (`blender -b -P scripts/hero-vortex/vortex.py -- <out> anim 1920 1080`;
  1080p since 2026-09-29, ~12 min for 240 frames; desktop WebM 1.9MB, MP4
  2.5MB). Higgsfield was tried the same day at Brad's request (195 credits):
  Kling and Seedance from a text prompt both drew a head-on tunnel, and
  Kling from our own frame smoothed the dots into lines and did not loop,
  so the Blender render stayed as the closest to Neiden's
  and re-encode.
- Both fonts are declared in the hero component (not the layout), so only
  `/` downloads them; next/font self-hosts them.
- Hero CTA = Neiden's (`HeroCta` + `.hero-cta*`, Brad, 2026-09-29: "go red
  like neiden", "exactly like neiden"): solid black 60px bar, label centred
  in 12px bold caps, "+" at the right; on hover the bar fades to the accent
  red, the "+" turns 180deg and the letters roll up 18ms apart (measured off
  Neiden's). Replaced the `BracketLink roll` here only; the menu and other
  sections keep the bracket button. The Grimsby / live-time line was
  removed from the hero (Brad, 2026-09-28).
- **Header = Neiden's** (supersedes the 2026-09-04 transparent bar and the
  2026-09-25 "Header A"): a 44px WHITE bar on the hero's 3-column grid:
  Home / Portfolio / Services / Pricing / Studio / Get in touch spread evenly
  across the bar as ORDINARY links (Brad: Home must not look "foreign" to
  the others), then the two-stroke menu button. Home on the homepage scrolls
  back to the hero. Below lg the bar is just the menu button; Home is first
  in the menu. FAQ is menu-only (Brad dropped it from the bar
  to make room for Home; the nav test opens the menu for /faq). **NO LOGO** (Brad: "maybe we just don't use a logo, it looks
  kinda cheap" — after rejecting the BL mark, a typed name, a Founder-led
  tag and two rounds of wordmark fonts on this bar). The home link stays as
  the Home nav link. Brad confirmed the logo-free bar ("this one") after
  seeing six new logo concepts; the concept and header-option lab pages
  were deleted. NO underline on hover or for the current page: the
  current route is set black, the rest ink-500.
  EXCEPT "Get in touch": always red, black on hover (Brad, 2026-09-29, the
  call to action). It is `#d91f36`, not the accent: #f02b42 on the white bar
  is 4.1:1, under AA for 12px text. `html { scrollbar-gutter:
  stable }` stops the bar shifting when the menu locks scroll.
- **Menu** (Brad: the first version "looks a bit generic"): a grained black
  panel with bracket corners; routes in Cal Sans lowercase (`--font-cal-ui`,
  loaded in the layout with `preload: false`) with /01 indices, rows roll on
  hover while the others dim, a dot marks the current route; phone / email /
  studio strip; the bracket "Start a project"; socials; legal line. No
  logo, wordmark or tag. Rows cascade in (70ms apart). Dialog semantics and
  `data-lenis-prevent` kept. **Below sm it is a full-screen sheet under the
  bar** (Brad: the card "looks broken and weird on mobile"): no card inset,
  no bracket corners (absolute corners in a scroller sat on the text), no
  close button in the panel at ANY width since 2026-09-29 (Brad removed the
  desktop ringed x too; the bar's x closes it and is in the Tab trap). The open state is a slim
  x with NO ring at any width (Brad, 2026-09-29, disliked the ringed x), phone |
  studio then email full width, scrollbar hidden. The grain is on an inner
  `min-h-full` block, not the scroller, or it stops at the first screen.
- **Plexus** (`plexus-cursor.tsx`, after Ovra's hero): a faint web of thin
  lines tiled into triangles on the hero, behind the type, on DESKTOP (fine
  pointers) only — touch screens get neither the web nor the cursor (Brad,
  2026-09-29: "get rid of this on mobile ... but keep it on desktop"); hovering brightens the part under the pointer (fine pointers,
  motion allowed). The pointer is a ring + dot with a verb beside it (our
  words: Design / Build / Launch / Rank / Convert / Refine). Over links and
  buttons it keeps its size and turns plain white (Brad, 2026-09-29: it grew
  1.8x and the difference blend made it teal on the red CTA). Two rejected
  versions, do not bring back: a disc carried by the cursor ("a bubble") and
  a patch that appeared only when the mouse moved. This is NOT the removed
  `SpotlightCursor` — Brad asked for this one.
- **NO LOAD SCREEN** (Brad, 2026-10-05: "remove the desktop load screen").
  The Neiden-style preloader (black, the line writing itself in Mr Dafoe,
  then the screen lifting, ~2.5s) was off on phones from 2026-10-02 and is
  now gone everywhere: `preloader.tsx`, its CSS and the hero's entrance
  delays keyed off it were deleted (in git), and `HeroFilm` no longer waits
  2.8s for the lift, so the film is fetched right after `load` at every
  width. It made every desktop visitor wait ~2.5s before seeing anything
  and was the main thing holding desktop Speed Index (PSI 97, not 99).
  **A reload always
  opens on the hero** (Brad reloaded from /#contact and landed on the form):
  `RELOAD_TO_TOP` in `app/layout.tsx`, an inline script in the server HTML.
  Chrome restores the old scroll at the reloaded page's FIRST LAYOUT, before
  any of its scripts can stop it (measured: setting `scrollRestoration` on
  the reloaded page changed nothing), so the page being LEFT marks `/`
  "manual" on pagehide (a bfcache return resets "auto"); the reloaded page
  drops the #hash before the parser reaches #contact, goes to the top on
  load only if the mark was missing, and hands back "auto" after load so
  in-site back/forward still restores. In the layout so it works whichever
  page a visit began on. Verified: zero frames at the old spot on reload
  (phone and desktop), inner-page reloads keep their place, back keeps the
  homepage position. It used to live in the Preloader's effect, which ran on
  EVERY mount: reload any page, then "Get in touch" to /#contact, and the
  effect stripped the hash and sent you to the top (fixed by the move). A
  real link to /#contact still lands on the form. The hero's fonts come
  from `v3/hero-fonts.ts`.
- `LuraisFilmHero`, `HeroSequence`, `HeroScrubLine` and `public/hero-frames/`
  are KEPT, unused on `/`, until the new hero is signed off — the notes
  below on "Hero hold" and "Hero footage" describe that retired film.
  `lets-work.tsx` still uses `hero-frames/m/085.webp`.

## Studio section + journey on `/` (2026-09-29, Brad)

- **01 = `StudioNeiden`** (`v3/studio-neiden.tsx`, after Neiden's "Who we
  are"; measured, nothing taken). Brad chose it on 2026-09-30 over an
  Ovra-style version (deleted; in git) that had replaced the pinned Lurais
  intro (`LuraisIntro` kept, unused). A WHITE band on the hero's
  three-column hairline grid: "Founder-led" top right (desktop only) where
  Neiden counts projects; a red four-bar mark + "[BL™ — THE STUDIO / 工房と理念]"
  (Neiden's bilingual label, OUR words: "the studio and its principles",
  `lang="ja"`, Brad asked to keep the Japanese); the site description's first
  sentence in DM Sans 600 at 5vw / 1.1 / -0.06em with the first line
  indented 7.2vw, from 6.2% to 92% across, so it runs DEEP into both
  pictures (Brad, 2026-09-30: "it barely overlaps on the left"; proportions
  taken from Neiden at his window: left picture flush 0-23%, right
  70.5-96%, both 28vw tall), set
  WHITE with `mix-blend-mode: difference` so it reads black on the band and
  INVERTS the pictures where it crosses them, lighting word by word
  (`ScrollText`, dim 0.45; axe reports those words "needs review", not a
  failure, because it cannot compute blends); two soft grainy AI portraits
  (`public/images/studio/soft-{mono,red}.*`, atmosphere, never the founders
  or a client, NO logos on them: Neiden's are its clients') on the outer
  edges, rising at Neiden's measured 1.1x / 1.3x the scroll at every width
  (`StudioDrift` writes `--d`; `.nd-drift-a/-b`; still under reduced
  motion); the founder-led line, both founders' avatars, and "Humberston,
  Grimsby" where Neiden prints its founding year (none confirmed). Phones
  drop the pictures (as Neiden) and are tightened (Brad: "too long"): 899 ->
  547px at 390x844. The accent label uses `--color-accent-ink` (#d91f36,
  the AA-safe red on white). Clash and Plus Jakarta are no longer on `/`.
- **02 = `CaseStudies`** (`v3/case-studies.tsx` + `case-studies-backdrop.tsx`,
  after Neiden's "Portfolio"/case studies; measured, nothing taken) REPLACES
  the Nocta stacked cards on `/` (Brad, 2026-09-30: the cards "look out of
  place"; three Neiden/Ovra-style options on screenshots were "kinda
  trash", because blown-up SITE SCREENSHOTS read as screenshots; black-band
  versions "looked kinda bad"). What made it work: each project is shown by
  its site's OWN hero imagery with the interface stripped out
  (`public/images/work/clean/<id>.2026-09-30.webp`, captured from the live
  sites with every text/nav/button hidden, blank bars trimmed; B Boutique
  is a film frame with both horses in view). B Boutique, New Home Agents
  and Paul Fox were AI-upscaled to 4K on 2026-10-02 (Brad: "so its not
  blurry"; Higgsfield `bytedance_image_upscale`, 2 credits each), saved at
  3840px as `<id>.2026-10-02.webp`; the 1.8k captures had been stretched
  past their pixels on 2x screens and by the zoom. The Watch Club's job
  FAILED (credits still taken, balance then ran out), so it is the
  1787px capture still: upscale it when credits allow. A project with no clean
  picture falls back to its normal cover. Layout, as Neiden's: dark intro
  (red bars + "[BL™ — PORTFOLIO / 仕事と記録]", `lang="ja"`, the lede, a giant
  "Case studies." sliding sideways, "© 2026"); ONE pinned full-screen
  background holding every picture blurred 8px at 1.2x, cross-fading to the
  project centred on screen; each project a picture ~72svh tall on the grid,
  zooming in from ~1.3x as it arrives and drifting as it leaves
  (`.cs-frame-img`, `--dn` written per block); the "01. · Year · Client"
  row in the gap above it (the client name is an `h3`, which the a11y test
  reads) and the sector line, Live/Concept badge and scope in the gap below,
  over the blurred background; closes on "More projects, more detail" + a
  white "All projects +" (the a11y test clicks it). `LuraisWork` is kept,
  unused. Over a picture, fine pointers get the HERO'S ring-and-dot cursor
  (`.plexus-ring*`, no words) eased after the pointer, the native cursor
  hidden (`[data-cs-frame]`; Brad, 2026-09-30: a red "View project" disc was
  tried and dropped for one cursor across the site); it re-checks what is under the pointer
  on scroll; touch never sees it; reduced motion keeps it, without easing.
- **06 = `Journey`** (`v3/journey.tsx`, after Neiden's "The Journey")
  REPLACES the Process ride on `/` only (/services and /studio keep
  `ProcessSection`). Heading held left, picture held centre, timeline right;
  a red rule with a glowing dot at its tip follows the middle of the screen
  continuously (Brad: "it should go down smoothly"), and a step lights and
  its picture swaps the moment the tip reaches THAT STEP'S DOT (Brad: "out
  of sync" when it keyed off the step's top; measured 0-9px). Phones: ONE
  picture pinned under the bar, text-only steps beneath (Brad: six pictures
  "a bit long"; 3.8 -> 2.1 screens; desktop 4.0 -> 3.3). Stills at
  `public/images/journey/<step>.2026-09-29.webp`, Higgsfield gpt_image_2_5,
  grayscale, hands and desks, no faces, never presented as the founders or
  a client. The timeline IS `processSteps`, so the copy stays in content.ts.
- **The chrome BL left the homepage** (Brad, 2026-09-30: "doesnt really fit
  anywhere"; my verdict: a second signature moment, three screens of pinned
  spin for a logo, beside a logo-free header). It now sits on /studio after
  the founders section as `ChromeMonogram compact`: no pin, about half a
  screen tall, one turn as it passes. Homepage sections renumbered: 01
  studio, 02 case studies, 03 principles, 04 services, 05 journey, 06
  standards, 07 pricing, 08 why us, 09 contact.
- Header links are **bold** (700; Brad asked for a thicker font, not a
  taller bar: 52px was tried and reverted, the bar stays 44px).
- **Clean-portfolio homepage** (Brad, 2026-10-02: "a clean portfolio, not
  too much writing but enough for a homepage"; previewed, then "make sure
  the website is optimised fully before putting it live"). Order: hero,
  studio (light), 02 case studies, 03 services (`ServicesExpand`), 04
  journey (light), 05 why us, 06 pricing (`PricingLine`; dark in the 2026-10-04 preview), 07
  contact, footer. ~860 words (was ~1,950), ~16,000px at 1440 (was
  ~19,800). OFF the homepage, still in the repo: `LuraisPrinciples`,
  `LuraisStandards`, `LuraisServices`, `CreativeService`, the `Pricing
  summary` cards (they repeated the 90+/100, five-day and "yours outright"
  claims three times; their copy lives on /services, /pricing, /studio).
  `Journey` and `LuraisServices` take an `index` prop for the numbering.
- **Light bands + `Bridge`s, NOT a live colour fade.** A whole-page theme
  fade (ink scale registered with @property and tweened on a wrapper) was
  previewed and approved, then MEASURED at ~7fps during each fade on a 4x
  slowed CPU (130ms frames: every element restyled every frame) and
  dropped. Instead: `.band-light` (ink scale turned over inside a wrapper,
  #f0f0f0 like the hero wordmark; ink-600 #686868 = 4.9:1; accent and
  accent-ink #cf1b32 = 4.8:1 for 12px text, because #d91f36 is 4.38:1 on
  #f0f0f0 and axe failed it) and `v3/bridge.tsx` between every light and
  dark section: a static eased gradient (oklab `color-mix`, 160-300px) whose
  `from`/`to` must equal the neighbours' exact colours (#000 dark, #161616
  case studies, #f0f0f0 bands). Zero runtime cost. Hard-coded
  `white`/`black` utilities do NOT flip inside a band; use ink tokens.
- **Studio statement = `ScrollText glyphs`**: the visible words are drawn
  from CSS `content` (aria-hidden) and the sentence is given once sr-only.
  White + `mix-blend-difference` reads ~17:1 on the band but axe cannot
  compute blends: on pure white it skipped the words (1:1 counts as
  "hidden"), on #f0f0f0 it failed them. Same treatment as the hollow
  `outline` words. `StudioNeiden` uses theme-relative ink tokens now, so it
  must sit inside `.band-light`.
- **`ServicesExpand`** (after the Framer marketplace "Expand OnHover List";
  rebuilt, nothing copied): one row open at a time; mouse hover or focus
  opens a row (pointer-type checked: a touch tap fires a synthetic hover);
  on touch the first tap opens and the second follows the link, decided by
  the open state at POINTER-DOWN (focus opens the row before the click, so
  the click alone cannot tell). Closed panels are `inert` (the
  reduced-motion test fails anything at opacity 0 that is not). Measured
  smooth at 4x CPU (median 10-13ms frames). `ScrollText` heading kept.
  **Rows open on `pointermove`, NOT `pointerenter`** (2026-10-04, Brad: "why
  do you have to scroll so far? Why is it so slow upon scrolling?"). Rows
  scrolling under a RESTING mouse fire pointerenter, so every row opened as
  it passed the cursor; the row above closing made the browser hold the
  page back. Measured by wheel at 1440x900 with the pointer over the list:
  3,100px of wheel moved the page 2,520px (0.81), p90 frame 23ms at 4x CPU;
  after, 1:1 and 13ms, same as with the pointer in the margin. Chrome sends
  no pointermove for content moving under a still pointer, so scrolling
  opens nothing; a real mouse move still does. Do not go back to enter.
  AND rows stay shut while the page is moving and for 250ms after (a
  `scroll` listener stamps the time; Brad, same day, "it still has that
  slowdown thing": a hand on the mouse nudges it mid-scroll). Measured with
  the pointer nudged 1-2px between notches: live (old) 0.84 with every row
  opening; preview 1.00, no row opening; hover after a stop still opens.
  **Heading = a statement, not "•• SERVICES"** (Brad: the dot heading
  "just looks weird"; under the rule and beside the sideways "/What we do"
  gutter word it said Services three times): `servicesIntro` in
  content.ts ("We build it, then we run it." + the /services lede, now
  shared), heading left / lede right as the price list sets it, the list
  full width, the white "All services" bar. No `GutterWord`, no
  `ScrollText` dot heading on `/` any more.
- **05 Why us + 07 Contact redone — LIVE 2026-10-05** (2026-10-04,
  Brad: "do the why us and contact"). `why-us.tsx`: the 2026-09-26 bento
  (striped label, stock-style AI portraits, four boxes repeating the price
  list: fixed price, five-day window) became "Founder-led, start to
  finish." + line, then ONE ruled row of four facts set large: 90+
  (guarantee), 2 (founders, names from `founders`), 1 (working day to
  reply), YOURS (ownership). Claims already made elsewhere; no rating, no
  count. The `public/images/why/` portraits are unused now. `contact-form.tsx`:
  the Nocta frames and `StripeLabel` are gone; heading + line, "What happens
  next" in three numbered steps (reply within a working day, a call, the
  scope and a fixed price in writing: all existing promises; the house
  standard asks for it beside every contact form), email and phone as ruled
  rows with the round arrow, the form on a plain dark panel with underlined
  fields (ink-600, over 3:1) and the `.hero-cta-light` bar as its submit
  button (the roll markup inline; `disabled:pointer-events-none`). Field
  names, honeypot, blur-time hints, Article 13 notice and the honest error
  state are untouched; the budget values still match `BUDGET_LABELS`. The
  email row is 1rem below sm so the address never breaks mid-word.
- **`PricingLine` = a rate card** (Brad, 2026-10-03: "i dont like this
  section" about the one-line version, "a whole screen for one sentence";
  chose option A of two at `/lab/pricing-line`, deleted; B was Neiden's
  packages deck). The builds' heading and lede from `rateCard`, then one
  ruled row per `projectTiers` build on the hero's three columns: red
  index + caps name (+ the shared `Recommended` tag from tier-deck) |
  audience + the FULL delivery line | the price (Cal Sans, "from" where
  set), each row a link to `/pricing#builds`; then "£ GBP — no VAT
  charged · Monthly plans from £[min retainer]/month · Bespoke [floor]"
  and a "See full pricing" bar. Nothing typed: every figure is the data
  /pricing renders. The band carries the faint `Grid` like /pricing's.
  **SUPERSEDED — LIVE 2026-10-05 (2026-10-04, Brad: "why does this
  look so terrible on the home page?")**: the white band read as a
  spreadsheet: the column rules boxed every row into a 12-cell table and
  crossed the lede, most of each row was empty, the closing line was tiny
  caps. Now on BLACK (no band, no Bridges, no Grid) under the homepage's
  `SectionRule` ("06 —— /PRICING", as Services); heading left, lede right;
  each row built like the `ServicesExpand` rows above it: red index on the
  name's baseline, caps name (+ `Recommended`) with who + the whole
  delivery line under it, price and the ringed arrow (turns on hover) on
  the row's middle; phones: number, name, price on one line. Closing line
  at body size + the white "See full pricing" bar. axe clean 390/1440.
- **Image weight (same day):** case-study frames at the default q75 (q90
  measured identical at 100% crop, 28% larger: B Boutique 3840w 863 ->
  622KB); 2880 added to `deviceSizes` (a 2x laptop at 1440 wanted ~2708px
  and got the 3840 file); the blurred backdrop asks for `25vw`.
- **Measured 2026-10-02** (local prod build, Lighthouse 13, after a warm-up
  pass): homepage mobile 88/88/88, desktop 98, a11y 100, CLS 0.002, TBT
  29ms; /portfolio, /services, /pricing, /studio, the case study: mobile
  91-94, desktop 100. Suite: 160 passed, 2 skipped (run with
  `VERIFY_PORT=3100 VERIFY_OWNS_SERVER=1 PLAYWRIGHT_CHROMIUM_PATH=<system
  chrome>` against `next start --port 3100`; pnpm is not installed on
  Brad's PC, so `pnpm verify` cannot run there as written). A first full
  run had five phone tests time out while the PC was busy: all fourteen
  re-ran green alone, then the full suite passed. /portfolio a11y reads 98
  (a work-card `h3` with no `h2`), pre-existing; it goes with the portfolio
  redesign. An orphaned `next start` on 3100 from an earlier session served
  a stale build once: check the served HTML before trusting a run.
- **Case study + portfolio — LIVE on `/portfolio` and `/portfolio/[slug]`**
  (2026-10-02, Brad: "we should do portfolio first"; previewed at
  `/lab/portfolio` and `/lab/case/[slug]`, both deleted). /portfolio also
  closes on the light-band `ProofBand` (the proof page keeps its proof).
  `CaseStudyView` (`v3/case-study-view.tsx`,
  after Neiden's project page): the clean picture full-screen behind the
  title, lede, buttons and facts (phones: the picture at 4:3 under the bar,
  words on black), then the write-up on a light band with `Bridge`s (brief,
  the dated live-site cover, approach, findings, standards, results note),
  then "More work". /portfolio = `CaseStudies heading="h1"
  closing={false}` (project names become h2 so no level is skipped).
  `resolveCleanImage` replaces the hand-dated CLEAN map (newest dated file
  wins). **Picture-to-page transition:** React `ViewTransition`
  `name="project-<id>" share="morph" default="none"` on BOTH the homepage
  frame and the case-study hero image wrapper (verified in Chrome: the morph
  group animates, desktop and phone); the header carries a static
  `view-transition-name: site-header` (else the growing picture covered it)
  and the hero words `case-copy` (a React `enter` boundary does not fire
  when the whole page mounts, so they only appeared once the picture
  landed). CSS in globals.css "PICTURE-TO-PAGE"; none under reduced motion.
  `src/types/react-canary.d.ts` brings in React's canary types.
- **Mobile pass, 2026-10-02** (Brad: "can we make the mobile more
  optimised"). SHIPPED, nothing visible: (1) **content.ts no longer reaches
  the browser from the header or the homepage.** Client components importing
  `@/lib/content` pulled the whole 125KB copy file (and the 26KB logo paths
  via SocialLinks, and lurais-parts via BracketLink) into every page's JS.
  Now `header.tsx` / `contact.tsx` / `testimonials.tsx` are SERVER wrappers
  handing `HeaderBar` / `ContactForm` / `TestimonialsCarousel` only the
  values they show; `Journey` takes `steps` and `Preloader` takes `line` from
  the page; `BracketLink` lives in `v3/bracket-link.tsx` (re-exported from
  lurais-parts). Rule: a "use client" file must not import content.ts (type
  imports are fine) — pass props. Still bundled where the client component
  displays the data (pricing-plans, faq, faq-tabs, process-scroll). (2) The
  hero's cursor web loads through `PlexusCursorLoader` (next/dynamic behind a
  fine-pointer check), so phones never download it. Suite 160 passed.
  **Why the phone score sits at ~89 (87-93 over 5 runs; desktop 98):**
  traced, the browser's first layout takes ~100ms even on a desktop CPU
  (~1,400 boxes, cold text shaping; warm, every section re-lays out in
  <=3ms; blocking fonts/sprite/images/JS changed nothing), so the scripts
  (arriving ~45ms) evaluate before the first paint, and Lighthouse's
  simulation then charges all ~200KB of JS (mostly React + Next themselves)
  to the LCP. TRIED AND REVERTED: `content-visibility: auto` on the
  below-fold sections (boxes 1,400 -> 1,000, layout unchanged, score 88,
  a11y 96 and Speed Index worse when extended to case studies/contact/
  footer); an AVIF phone poster (q55 saves 8.6KB; it sits under the load
  screen anyway). Levers left all change what visitors see: the load screen
  on phones (~2.5s before the hero), the moving film on phones (~0.9MB after
  load), fewer fonts.
- **Dot headings reveal on scroll** (Brad, 2026-10-02, "How we work"):
  dot-led headings are `ScrollText as="h2"` with `lead={<Dots />}`
  (ScrollText gained `id`, `lead` and `glyphs`), dim 0.45 so an unlit word
  still clears 3:1 as large text on a light band. None on `/` since
  2026-10-04 (Services became a statement heading).
- **Footer = the Neiden bookend** (Brad, 2026-10-02: "i dont like my
  footer", approved the preview: "yes put it on the site"). Replaces the
  Nocta footer on every route (`components/footer.tsx`; the old one is in
  git). The hero's hairline grid runs to the foot; "got a project? / let's
  talk." in Cal Sans lowercase with a white "Start a project +" bar (red on
  hover) to `/#contact`; newsletter (unchanged form) + the socials with
  URLs as text links; pages in Cal Sans lowercase with /01 indices, as the
  menu; contact + the one-working-day reply line; then the hero's
  corner-ticked frame with "black line" and the red Mr Dafoe "see you
  soon." (my pick; Brad did not object). The bookend glitches like the
  hero (`GlitchWordmark`: shared `.hero-wm` styles, its own in-view timer;
  Brad: "the footer should also have the glitch"). Fonts: Cal Sans from the
  layout's `--font-cal-ui` (mapped onto `--font-cal` on the footer) and its
  own Mr Dafoe declaration with `preload: false`, so no route preloads the
  hero's fonts for a footer. The footer-reach test needs the two bottom-bar
  `p`s and the back-to-top button: keep them.

## Inner pages in the homepage's system (2026-10-02, Brad)

Brad: the other pages cannot have "a whole different design/font system"
from the homepage. The audit that day: the FONTS were already shared
(Cal Sans / DM Sans / Geist Mono are site-wide tokens); every inner page
still wore the Nocta look (photo-banner `PageIntro` + caps heading,
striped `.eyebrow`, bracket `.bezel` frames, all-black). Plan he accepted:
restyle the shared pieces once, then page by page, each previewed in
`/lab` before it replaces the real route. DONE: Services, Portfolio, the
case studies and Pricing (all live on blacklineagency.co.uk 2026-10-02);
the AI page (live 2026-10-05); and, also live 2026-10-05 (Brad: "do the
remaining old pages", then "Go live"), Studio, FAQ, Grimsby, the other five
service pages and the two legal pages, below. No page wears the Nocta look
any more.
- **The rest of the old pages — LIVE 2026-10-05.** All
  on black like /pricing and /services/ai, each opening with `PageHero` and
  built from `Part` (pricing-parts; `lede` optional, `heading` a node) with
  the faint `Divided` rule between parts; the footer's "let's talk" closes
  every page, so `ContactBand`/`BackHome` are gone.
  - **Five service pages = `v3/service-view.tsx` (`ServiceView`)**: the
    service (each discipline's paragraph and its counted list on the page's
    columns; creative shows its eight kinds of work, what is and is not
    included, then "Brief to delivery" steps) → "How it's priced." as /pricing
    sets it (`BuildPrices` = the shared line + build deck + `BuildNotes`; the
    plan deck with a line per plan saying whether it includes the service,
    `PackageDeck marks`, only where some plan leaves it out; the creative
    deck + terms + one-off rates + the Partner ads note) → the page's
    questions → `OtherServices`. `LOOK` in that file holds each page's giant
    word, bar label, Japanese and statement heading; the per-plan email/SMS
    labels there must agree with `pricingNote` in content.ts. The AI page
    now shares `JumpList` and `OtherServices`.
  - **/studio**: facts in column 3 (Humberston, the founders, one working
    day), 01 founders (the hero's avatars + the three studio paragraphs), the
    chrome BL (kept where Brad put it), the homepage `Journey` instead of the
    horizontal process ride, the stack as a ruled seven-column grid (not a
    second marquee), `ProofBand` on a light band with Bridges, as /services.
  - **/faq**: tabs gone; every question on the page in three groups by
    `meta` (cost & timing / working with us / after launch, the last taking
    any meta not listed, so a new question never goes missing), each the
    numbered accordion; the enquiry form stays at the foot. FAQPage JSON-LD
    unchanged.
  - **/web-design-grimsby**: "grimsby" over `process/launch.webp` (a line of
    light on a horizon; the old plates still was mean brightness 106 against
    12-24 for the other tops, and the `difference` blend broke the word up),
    the local points + the areas set large, `BuildPrices`, the local
    questions. Still quotes no figure itself.
  - **Legal**: `PageHero` without its bar (`cta={false}`), last-updated and
    the other document in column 3, the contents held in view in column 1,
    the clauses across two at a 68ch measure, no reveals.
  - `PageHero` sizes the giant word from its MEASURED width (`ADVANCE`, Cal
    Sans advances at -0.05em; `--em` in CSS, 96% of the frame) instead of a
    letter count, which ran "seo & geo" and "web design" past the frame.
  - Deleted with their pages (in git): `page-shell`, `service-page`,
    `studio`, `faq`, `faq-tabs`, `process-section`, `process-scroll`,
    `logo-cloud`, `results`, and the process ride's CSS.
- **/ai REPLACES /services/ai (2026-10-06, branch `feature/ai-automation-page`,
  NOT on production yet).** The new AI automation landing page carried the
  same two systems, demos and prices, so the old page went: `/services/ai`
  308s to `/ai` (`redirects()` in next.config.ts), the `ai` entry left
  `servicePages`, `AiPage` was deleted (demos now `v3/ai-demos.tsx`), and
  every link that pointed at it (services index, "Other services", the
  /pricing AI line, sitemap, llms.txt) reads `automationPage` in
  `lib/ai-automation.ts`. /ai is indexable and carries the Service JSON-LD,
  because once this ships it is the site's only AI page. "AI Automation" is
  in `nav` (header bar, menu, footer). The bullet below is the old page.
- **/services/ai — the first service page redone — LIVE 2026-10-05**
  (2026-10-04, Brad: "maybe we create a page specifically for ai, or a new
  website for AI side of things?", then "do the AI page as well"; advised a
  page on THIS site, not a second site: a new domain starts from zero on
  Google, doubles the legal pages and hosting, and the systems sell beside
  the plans). `v3/ai-page.tsx`, reached from `services/[slug]/page.tsx` when
  the slug is "ai" (the other five keep the old body until redone; same
  metadata and Service/Breadcrumb JSON-LD). All on black: `PageHero`
  (giant "ai systems", h1 = the page heading via the new `word` prop,
  "/02 systems", a jump list in column 3) → 01 "Answers when you can't."
  with the two systems SIDE BY SIDE, each SHOWN in the hero's
  corner-ticked frame: a labelled example chat (bubbles arriving in turn
  on the site's `Reveal`, then "Enquiry sent to your inbox") and a
  labelled example call (number, "After hours", a breathing waveform
  `.ai-wave`, then the texted summary card), under it the index, where it
  answers, the name and the summary → 02 "What each one costs." as ONE
  table, a row per line, a column per system, every condition with its
  figure, a dash where a system has no such line → the AI questions
  (`FaqList`) → "Other services" as a quiet two-column list (every
  service page links every other). The FIRST cut (one `Part` per system:
  giant heading, grey paragraph, rate rows) was rejected the same day:
  "looks cheap, like a PowerPoint". The demo copy is `aiExamples` in
  content.ts: invented, labelled "Example", acting out only what the
  `aiSystems` summaries say (no booking, no 24/7, no counts). The old
  `AiPricing` block was deleted. /pricing's AI line links "Full details"
  here. axe clean 390/1440 with motion and reduced; suite 153/153 at 4
  workers (at the default worker count, two phone axe tests on /pricing
  and /services hit the 30s limit while the PC was loaded; alone, 6.5s).
  (The giant word is sized from its measured width since 2026-10-05; see
  the bullet above.)
- **Shared pieces** (`src/components/v3/`): `page-grid.tsx` (`Grid` with
  `reading` = no inner column rules below lg on light bands, `LABEL`,
  `H2`, `SectionLabel` "[ 01 — Label ]", `Block`, `BarLabel` "[BL™ —
  Label / 日本語]"), `page-hero.tsx`, `hero-cta.tsx` (the Neiden bar, moved
  out of neiden-hero; `light` = white, red on hover, for plain black, as
  the footer's bar: the black bar vanished there). The case study now uses
  page-grid too.
- **`PageHero`**: the homepage hero's frame without its signature (no film,
  script or glitch): bar label + "/NN count", the page name enormous in
  Cal Sans lowercase in the corner-ticked frame (`.page-wm` + the
  wordmark's `.hero-wm-base` grain; sized from `--chars`, ~0.41em a letter,
  so "services" spans the frame; cap 26rem for short words), the lede and
  the white bar from column 2, optional `aside` in column 3 (desktop).
  The page's old monochrome still sits in the top 72% only, fading out
  above the lede (its light strips crossed the sentence when full-bleed),
  with the name in `difference` over it, as the wordmark is over the film.
  The h1 is sr-only with the same word; the giant word is aria-hidden.
- **/services — LIVE** (2026-10-02, Brad: "put it on the site"; was
  previewed at `/lab/services`, deleted): PageHero (jump list of the six
  disciplines in the aside) → light band `ServiceIndex` (`service-index.tsx`:
  number + caps name | one-line summary | "Includes (N)" ruled list, the
  page blueprint's counted sub-list; phones read name, summary, list, then
  "Full details +"; then "Also from the studio": creative + AI pages) →
  the homepage `Journey` on dark → light band `ProofBand` (`proof-band.tsx`,
  `buildStandards` as a ruled row, count-up, "Run it yourself" to
  PageSpeed; no `tabular-nums`, it spaced "0.8s" out) → footer. The old
  contact band is gone: the footer's "got a project? let's talk." is the
  close. Lighthouse (local): mobile 94 (old /services 93), desktop 100,
  a11y 100; axe clean at 390/1440 with and without reduced motion.
  The old `Services` cards and `Expandable` were deleted with their tests
  (Read more pill, equal-height stack); the "services page" test checks a
  row per discipline and a link to every published service page. The
  header-CTA test now opens the menu below lg (it had been passing on the
  old page's own contact-band button). Suite: 153 passed, 2 skipped.
- **/pricing — REGROUPED and LIVE** (2026-10-04, Brad: "I don't like the
  pricing page", "it feels unorganised and messy"; previewed at
  `/lab/pricing`, deleted; "go live now after you optimise it"). Replaces the
  2026-10-02 eight-band version (TierDeck, AddOnSwitch: deleted, in git).
  FOUR bands, each a kind of price: 01 builds (light) | 02 monthly plans
  (dark) | 03 add-ons + 04 creative (light) | 05 small print + 06 money
  questions (dark) → footer; four Bridges, not six. Same figures, same
  load-bearing wording, all read from the data; the At-a-glance ids
  (#builds #plans #ai #bookings #crm #creative) all survive.
  - **One card for every set of plans** (`v3/package-deck.tsx`,
    `PackageDeck`, after Neiden's pricing column): index + name (+
    `Recommended`), who it is for, price, FIVE lines, the bar (light bands:
    recommended black, the rest white; dark: all white), "Timeframe:" with
    the whole delivery line, then "Full list (N) +" as a native `<details>`
    (no script; summary + every include, still in the HTML for search).
    Subgrid rows from lg; phones SWIPE the set (scroll-snap, the next card
    peeking) instead of stacking it. Five lines = `highlights` (builds),
    `retainerPicks` in content.ts (verbatim `includes` lines; a pick that
    stops matching drops out), or the whole short list (creative). No tint
    on the recommended card: it took the red index under 4.5:1 on light
    bands (axe). The deck is opaque with `mx-px` so the band's three-column
    rules never cross a four-column set (Brad, 2026-10-03, "fix your
    pricing lines").
  - **Under the build cards** (`BuildNotes`): the 20%-off line | Flagship's
    priced-on-top lines and same-business note (kept out of the card so
    they never open a gap in the others); then Bespoke (+ discovery, "Discuss
    a brief") | the 90+ guarantee with its conditions | how it is met.
    "Every build includes" (`SharedLine`) sits on the page's columns now
    (it crossed the 2/3 rule before).
  - **Add-ons** (`AddOns`): one band, groups on the columns: the two AI
    systems side by side, then bookings, then CRM, each as `RateRows` with
    every condition beside its figure. Creative keeps its band heading,
    the card deck and the one-off groups (the AI-generated aerial
    disclosure at its price).
  - Dropped on purpose: the per-build "add a monthly plan" switch (the
    plans sit directly below; Brad told, offered back). Measured, local
    prod build: desktop 100, mobile 93 (old 94, noise), a11y 100, axe clean
    at 390/1440; 14,400 -> 11,900px at 1440, 23,800 -> 16,000px at 390;
    12 bars, 6 headings (were 8). The old `PlanGrid`/`Faq` stay for the
    pages not yet redone (service pages, Grimsby, /faq). `.hero-cta`
    colours are FIXED (#000/#fff, white variant #fff/#000): on ink tokens
    the black bar went black-on-black inside a light band.
  - **ALL DARK + LEANER — LIVE 2026-10-05**
    (2026-10-04, Brad: "the pricing page looks terrible. Why is it all
    white?", then "there is just so much on the pricing page that makes it
    look ugly and unorganised"). The light bands were ~half the page, and
    its two longest stretches. Now: every part on black, split by a faint
    rule (no Bridges); NO column rules under the hero (on this page they
    ran through every list's body text, live too); the decks lead;
    `BuildNotes` (second pass, same day: the one ruled list "looks out of
    place") sets each thing as what it is: the 20%-off line and Flagship's
    priced-on-top lines + same-business note as small FOOTNOTES under the
    cards (Flagship's under Flagship); Bespoke as a TIER, the fifth row in
    the cards' anatomy (05, name, line, discovery, "from £12,000", the
    white "Discuss a brief" bar); the guarantee as PROOF, its four scores
    large (`scoreLabels` on the measured block in content.ts) with its body
    and note in full beneath, under the cards whose "Every build includes"
    line makes the claim. The "how we work" block is OFF (sold the method,
    priced nothing); add-ons are one line each, an opening figure + "See
    prices (N)" (`More`, a native `<details>`; never for terms). EVERY
    disclosure on the page (`More`, the cards' "Full list") slides open and
    shut (Brad: it "shouldn't instantly be a drop down"): `.disclosure` in
    globals.css, `::details-content` height to `auto` via
    `interpolate-size` (Chromium; the FAQ rows already did this), the rows
    fading and settling in (a closed state to fade FROM, plus
    @starting-style; motion allowed only, so nothing waits at opacity 0
    under reduced motion). The small print (Brad: it "just looks weird",
    a giant heading over a table) is fine print now: a modest heading and
    the terms flowing in three columns (stacked it was 1,477px on a phone,
    "no one's gonna scroll through that"; a sideways swipe was tried next
    and "having to scroll is even worse"). THEN THE BLOCK WENT ALTOGETHER
    (Brad: "get some inspiration from other framer portfolios"; studied
    Nocta: plan cards straight into the FAQ; Neiden: pricing, then "Quick
    answers", "Terms of Service" only in the footer; neither has a
    small-print section). Each term now sits where it applies: revision
    rounds in the build cards, payment in the "How and when do I pay?"
    question, plan terms under the plans, "no VAT" beside every price set,
    the referral line in the build footnotes, and `CreativeTerms`
    (turnaround, ownership, the revision round with its £75 charge for
    more, verbatim) under the creative cards, in view beside the prices it
    adds to. The questions are part 05. The site's own /legal/terms says
    the written agreement, not the website, is the contract, so moving
    terms on the page changes nothing contractual; the rule that still
    holds is that a CHARGE or a CONDITION of a claim stays visible next to
    the figure it qualifies. The
    AI line shows the cheapest system's two parts together ("from £199 +
    £59/month", `aiFrom()`), never a lone monthly; one-off creative sits
    behind one `More` with the aerial disclosure inside at its price; the
    plan terms are no longer repeated in the small print; six money
    questions (AI and creative ones repeated the lists). 11,933 -> 9,719px
    at 1440, 16,016 -> 11,599px at 390. axe clean closed and open.
- **Trap:** deleting a route while `.next/dev/types` (written by the dev
  server) still lists it fails `next build` at TypeScript
  ("Cannot find module …/page.js"). Those are generated files: delete
  `.next/dev/types` and build again.

## Follow-ups, 2026-09-26 (Brad)

- **Hero hold** (Brad, "the hero moves and scrolls down the page when it
  shouldn't"): the film section is `sticky top-0` inside `.hero-track`,
  whose height (100svh + 150vh, or + 100vh on coarse pointers) is CSS in
  globals.css, so the hold exists from the first paint. The old
  ScrollTrigger pin arrived only after GSAP loaded and frame 1 decoded:
  measured by wheel at 1440x900, an early scroll slid the hero 195px up,
  then it snapped back with the film a sixth through. Progress is read
  from the track's rect every frame in `tick` and eased (0.3/frame) into
  `--hero-progress`. The CSS conditions (768px+, motion allowed,
  scripting on) must stay in step with `still === false`. Phones keep
  the still with no hold.
- **Intro statement = Brad's "P3"** — RETIRED from `/` on 2026-09-29 (see
  "Studio section + journey"); kept for the record (after porto-template.framer.website):
  caps, grey linking words (`tone: "mute"`), three pictures in the line
  (B Boutique cover, SEO and email stills), "earning" hollow
  (`tone: "outline"`, glyphs from CSS `content`, the real word sr-only).
  Built as `ScrollText tokens` in `v3/lurais-intro.tsx`; the tokens must
  spell `site.description`'s first sentence or it falls back to plain text.
  Muted words wait at dim 0.62, not 0.4, so the unlit grey stays above 3:1.
  Size is `min(3.6vw, 4.3svh)`, so the pinned stage fits 1280x720.
  **Face:** Clash Display Semibold (Fontshare, ITF Free Font License),
  self-hosted at `src/app/fonts/ClashDisplay-Semibold.woff2` via
  `next/font/local` as `--font-clash`, `preload: false` (below the fold).
  Used on this line only; the headings are still Archivo.
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
- **Selected work WAS Nocta's "Case studies" layout** — replaced on `/` by
  `CaseStudies` on 2026-09-30 (see above); kept for the record (`v3/lurais-work.tsx`):
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
- **No laptop on the project cards.** A CSS-drawn laptop (later a MacBook
  Pro style) was built on 2026-09-26 and REMOVED the same day on Brad's
  word; the cards are back to the full-bleed cover with the name over a
  scrim. Do not re-add a device frame. The scroll reveal is crisp opacity
  only (Nakula), and bracket buttons carry `.btn-grain`.
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
rate card still uses `SharedIncludes`/`TierDeck`. **Footer** (REPLACED 2026-10-02 by the Neiden bookend, see above) = Nocta
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
  re-measured 2026-10-05: 100, LCP 0.6s — re-measure before changing), counting up on first
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
  dff2804 (the horses hero).
  **Re-shot 2026-09-30 straight from the live sites** (Brad: "update the
  projects previews to their up-to-date websites"), from Brad's own PC,
  which CAN reach them: Playwright with system Chrome at 1800x1013, JPEG
  q86, saved as `<id>.2026-09-30.jpg`, old files deleted. B Boutique had a
  new header and framed hero (frame picked with both horses left of the
  name); New Home Agents had new cliff-house footage and HIDES its header
  until the mouse moves, so the shot moves the mouse to the top first (a
  visitor sees it at once); Paul Fox's floating "Chat with us" button hidden
  as before. The Watch Club was unchanged, so `watch-club.jpg` stays. The case study's "One shoot, not a stock
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

**Re-shot 2026-10-05** (found in passing: the card still showed the
September goggles hero and "Book a call" a week after the Neiden homepage
went live). Same recipe as below, from a local `next start` build: 1440x756
at 2x, a 6s settle so the film and the red script are in, then 1200x630
mozjpeg q88 4:4:4; alt text rewritten for the new hero. Re-shoot it with
every hero change; nothing flags a stale card.

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
- **RELEASE 2026-10-02** (Brad: "push it live to blacklineagency.co.uk"):
  `redesign/design-system-v2` merged into the production branch with a real
  merge, `vercel.json` and `src/app/lab` removed there as above. What went
  live: the Neiden homepage (hero, studio, case studies, services list,
  journey, why us, pricing line, contact), the Neiden header/menu/footer,
  the Cal Sans / DM Sans fonts site-wide, the load screen off on phones,
  and the new Services, Portfolio, case-study and Pricing pages. FOUND
  before pushing: the live site was NOT the production branch head. The
  branch had auto-deployed the 2026-09-26 promotions, then on 2026-09-29/30
  the `shaunpad04` account redeployed the older 2026-09-25 commit 333479e
  ("Merge the comparison rebuild and the SEO work, keeping the new
  pricing") about 16 times from the CLI, which rolled production back to
  it. The release replaced that version; reason for the rollback unknown
  (raised with Brad). Check `get_deployment` → `meta.githubCommitSha` on
  the live alias before assuming the branch head is what is live.
  Shipped as merge 3dff8ff (deployment dpl_FePpqiS3DPZAjCU8jdfKvLPvuheq,
  READY in ~25s, source git). Verified live: every route 200, /lab 404,
  robots `Allow: /`, `index, follow`, www → 308 apex, no console errors.
  Live Lighthouse from Brad's PC (simulated, ×3): home desktop 98 / mobile
  95; /services 100 / 97; /pricing 100 / 97; a11y, best practices and SEO
  100 on all three. The keyless PageSpeed Insights API was over its daily
  quota, so the hero's "PageSpeed 99 desktop" (`buildStandards`, measured
  2026-09-07 on the old site) still wanted a real PSI run on the new
  homepage. **Done 2026-10-04 in the PSI web UI (the keyless API stays over
  quota), desktop ×3: 97 / 98 / 97, LCP 0.6–0.7s, TBT 0–10ms, CLS 0.001,
  a11y / best practices / SEO 100.** `buildStandards` changed to perf 97
  and LCP 0.6s on 2026-10-04 (Brad: go live "without errors"; a figure a
  prospect's own run contradicts is the error content.ts warns about).
  What took desktop from 99 to 97 is Speed Index under the desktop load
  screen.
- **RELEASE 2026-10-04** (Brad: "go live now after you optimise it to the
  best of your ability without errors"): commit 8487404 on the redesign
  branch, merge aa67c45 on the production branch (`--no-ff`; vercel.json
  and src/app/lab checked absent), deployment
  dpl_92ysS8WXcb8Wt2ReYfBEYs7vJxum READY in ~21s, aliased to
  blacklineagency.co.uk. Shipped: the homepage price list (06), the
  regrouped /pricing, the opaque plan decks, PageSpeed 97 / LCP 0.6s.
  Before: lint, typecheck, build, 153/153 tests, axe clean at 390/1440.
  Verified live: 19 routes 200, /lab 404, www → 308, `index, follow`, no
  console errors or failed requests on /, /pricing, /services, /portfolio
  at 1440 and 390. Live Lighthouse ×3: /pricing mobile 97 / desktop 100;
  home 95 / 98; a11y, best practices and SEO 100 on both.
- **FULL-SITE AUDIT 2026-10-04 (live 2026-10-05)** (Brad: "go through
  the whole website ... no dead links ... the 404 page works ... social
  medias are linked ... a CTA goes to the specific place ... optimize").
  Crawled from the sitemap + every link: 16 pages 200, no missing #anchor,
  no empty href; external links all answer (Facebook gives bots 400; the
  page exists, checked in a real browser, as do Instagram @blacklineagency0
  and TikTok @blacklineagency). Clicked every visible #section link and CTA
  on 10 pages: all land with the section at 96px (the scroll margin).
  FIXED: the footer's three-name allow-list left Facebook off every page
  (now every social with a URL); `SocialLinks` no longer shows an entry
  without a URL (the X mark; give it a URL in `socials` and it returns);
  "Skip to content" scrolled but left focus in the header because the Lenis
  hash handler prevented the native jump: it now focuses the target
  (tabindex -1 if needed; no ring on such landing points); the 404's old
  bracket buttons and run-together `display-soft` heading (now the white
  bar + a quiet link, `display` heading); Studio's "We work monochrome by
  conviction" (untrue since the red accent) rewritten; `.page-wm` uses
  0.425 em/char on phones ("services" ran 5px past its frame at 390).
  Lighthouse (local, ×2 after a warm-up): home 94 mobile / 98 desktop,
  /pricing 94 / 100, /services/ai 93 / 100, a11y 100, CLS 0; the only SEO /
  best-practice flags are the local noindex and the /_vercel/insights 404,
  both gone on Vercel. Axe across 17 routes × 2 widths: clean once reveals
  settle.
- **RELEASE 2026-10-05** (Brad: "Remove the desktop load screen, then go
  live"): commit fd14f67 on the redesign branch, merge 0b418fd on the
  production branch (`--no-ff`, made in a separate `git worktree` so Brad's
  dev server on the main checkout never saw a branch switch; vercel.json and
  src/app/lab checked absent), deployment dpl_2J8cDjzAbdJVVP5ypvNkmc6ijHwg
  READY in ~28s on blacklineagency.co.uk. Shipped everything previewed on
  2026-10-04 (services scroll fix, dark lean /pricing, homepage price list,
  /services/ai, Why us, Contact, the audit fixes) plus NO LOAD SCREEN.
  Before: lint, typecheck, build, 153/153. Verified live: 19 routes 200,
  /lab and an unknown path 404, www → 308, `index, follow`, no console
  errors or failed requests on 7 pages at 1440 and 390. Live Lighthouse ×3:
  home mobile 95 / desktop 100 (98 before the load screen went), /pricing
  97 / 100, /services/ai 96 / 100; a11y, best practices, SEO 100.
  PSI web UI after the release (the keyless API is still over quota),
  desktop: 100 / 100, LCP 0.5s / 0.6s (a third run hung in the UI); mobile
  90 / 95. So `buildStandards` perf went 97 -> 100 in the next preview (LCP
  stays 0.6s).
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
