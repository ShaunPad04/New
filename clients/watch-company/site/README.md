# The Watch Club — Rolex Day-Date 36, Ref. 118238

Concept single-page site built around one piece of stock:
**Stock No. 16496 — Rolex Oyster Perpetual Day-Date 36, Ref. 118238, 2012, 18ct Gold, 36mm, £23,500.**

Built to the spec in `../BUILD-PROMPT.md`.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview
```

## Not indexable

This is a client-review build. `public/robots.txt` disallows everything, `index.html`
carries `noindex, nofollow`, and `netlify.toml` sets an `X-Robots-Tag` header.
Remove all three — and only all three together — when the client approves launch.

## Assets

No client photography exists yet. **Every image and the hero video are optional**:
anything that fails to load is removed at runtime and a designed CSS plate shows in
its place, so the layout never breaks. Drop the real files into the paths below and
each one upgrades with no code change.

| Path | What it is |
|---|---|
| `public/hero-video.mp4` | Hero background loop. Dark, warm-gold key light, no audio. |
| `public/assets/photo/logo.webp` | Watch Club wordmark, transparent (inverted to white in CSS). Until it lands, the name is set in type. |
| `public/assets/photo/bg1.png` | Product-reveal background — macro of the fluted bezel or bracelet. |
| `public/assets/photo/watch.png` | Front-on cut-out of the watch, transparent background. |
| `public/assets/photo/ethos-bg.png` | Chapter 1 background — **frame this on the diamond baguette markers at 6 and 9**, because that is what the copy beside it describes. |
| `public/assets/photo/ethos-bg-rs.png` | Chapter 2 background — fluted bezel / President links. |
| `public/assets/photo/ethos-watch.png` | Chapter 1 cut-out, dial forward. |
| `public/assets/photo/ethos-watch-rs.png` | Chapter 2 cut-out, side profile. |
| `public/assets/photo/q1.png` | Heritage background. Dark edges. |
| `public/assets/photo/z1.png` | Showcase hero, full bleed. Also used in the enquiry modal. |
| `public/assets/photo/v3/ezgif-frame-001.jpg` … `-152.jpg` | Scroll-scrubbed movement sequence, 1920×1080. |

The movement section detects the frame sequence: with the frames absent it drops its
300vh scroll runway so there are not three empty screens to scroll past. Add the
frames and the scrub turns itself back on.

## Content rules that are load-bearing

- **One watch, not an edition.** The badge is `Stock No. 16496 · 2012 · £23,500`.
- **£40,950 is the current ref. 128238 retail price**, not this watch's old price.
  It must always appear with "reference 128238" in the same sentence, and must never
  be struck through — that would be a misleading price comparison under the DMCC Act
  2024 and CMA pricing guidance.
- **The warranty is a fixed date** (September 2028), never a countdown.
- **One dial description: "diamond baguette hour markers"** — the dealer's own wording.
  The bezel is fluted gold and carries no stones.
- **The Rolex trademark / independent-dealer line in the footer stays.** Get The Watch
  Club's approved wording before launch.
- **No payment here.** Purchase CTAs link out to the live listing, which carries the
  real Add to Cart and Part Exchange buttons.
- **If the piece sells**, the page must stop soliciting enquiries — swap the badge and
  CTA to a sold state pointing at `/the-collection`.

## Enquiry form

Posts to Netlify (`data-netlify="true"`, hidden `form-name=enquiry`, honeypot
`company-name`). Submissions appear under Forms → "enquiry". Off Netlify the POST
fails and the form says so, handing over the phone number and email — it never fakes
a successful submission.

## Accessibility & motion

- Skip link, labelled inputs, focus-visible rings, modal is a real `role="dialog"`
  with focus trap and focus restore.
- Text tiers are contrast-checked against `#080808` for WCAG AA.
- Under `prefers-reduced-motion: reduce`: Lenis is never started, no scroll-scrub runs,
  the hero video is hidden, the movement section collapses, and the two chapters of
  "The Piece" stack as two readable sections instead of a cross-fading slider.

## Still to confirm with the client

Address, phone, founding year, opening hours, Instagram and YouTube accounts are from
third-party sources — `watchclub.com` is unreachable from the build environment. The
brand-page footer links (`/rolex`, `/patek-philippe`, `/panerai`, `/audemars-piguet`,
`/terms`, `/privacy`) are assumed slugs and need checking against the live site.
