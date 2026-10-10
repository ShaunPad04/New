# Launch checklist and open TODOs

Preview: https://sl-jewellers-next.vercel.app (Vercel project `sl-jewellers-next`, team Black Line Agency, deployed 25 Sep 2026). The old project `sl-jewellers` is untouched.

## Images from the old site: all accounted for

| Old site asset | Where it is now |
|---|---|
| `assets/orbit/piece-01…15.jpg` (15 product photos) | `public/images/orbit-piece-*.jpg`; 05, 14, 13, 10, 12, 08 used in "What we sell"; the rest available in `assets/source/` |
| `assets/reels/reel-01…05.{jpg,mp4}` (5 reels) | `assets/source/site-reel-0*`; posters in `public/images/`. Not on the page: the Instagram grid links to the live posts instead of hosting copies of reels |
| `assets/img/checked.jpg` | Services section image |
| `assets/img/faq-still.jpg` | About section |
| `assets/img/shop-interior.{jpg,mp4}` | About section (photo); MP4 kept in `public/images/` for a future hero video option |
| `assets/img/sl-mark-poster.png` | Hero poster, regenerated as 480/720/1000/1400 AVIF+WebP |
| `assets/sl-jewellers-logo.svg` | `public/logo.svg`, header, footer, JSON-LD logo |
| `favicon.svg`, `apple-touch-icon.png`, `icon-192/512.png` | `src/app/icon.svg`, `src/app/apple-icon.png`, `public/icon-*.png` + manifest |
| `assets/placeholder.svg` | Dropped on purpose (placeholder) |
| `assets/social/*.svg` | Replaced by text buttons |

Plus, from socials: 12 latest Instagram thumbnails (9 in the grid), Facebook cover and profile image. Full provenance in `assets/SOURCES.md`.

## Reviews: verified against source

| Source | Count in JSON | Verified verbatim | Published |
|---|---|---|---|
| Google (5.0, 12 reviews) | 10 with text | 10 (read on Google Maps 25 Sep 2026) | 10 |
| Facebook (100% recommend, 59) | 8 | 1 (Lisa Hinch); 7 behind the login wall | 1 |

The 7 unverified Facebook quotes stay in `content/reviews.json` with `verified:false` and are not rendered. Header, hero badge, Reviews section and JSON-LD all read the same real figures.

## Form: tested end to end

- Local (`next start`): API smoke tests for honeypot, validation, and a valid enquiry with a photo attachment. Browser test (Playwright): prefill from `?type=repair&item=Watch strap`, empty submit shows a focused error summary with 6 flagged fields, Turnstile token received, success state shown, zero console errors.
- Live (Vercel): same browser test passed; lead ref logged in the function log.
- **Not yet possible:** a real email. `RESEND_API_KEY` and a verified sender domain are needed (question 11). Until then the API stores the lead and reports `emailed:false`.

## Lighthouse (live, 25 Sep 2026)

| Page | Device | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|---|
| Home | Mobile | 93 cold cache, 98 warm (26 Sep, after reels, prices and launch mode) | 100 | 100 | 100 |
| Home | Desktop | 100 | 100 | 100 | 100 |
| Enquiry | Mobile | 84–99 (three runs; the swing is the Cloudflare Turnstile script, LCP 2.2 s and TBT ≤40 ms every run) | 100 | 100 | 100 |

Mobile home: LCP 2.6 s, TBT 40 ms, CLS 0. Reports in `docs/lighthouse/`. Note: three.js loads only after the visitor's first interaction, so these numbers describe the page a visitor gets before the 3D upgrade.

## Accessibility (axe-core, WCAG 2.2 AA)

Home, Enquiry, Privacy, 404: 0 violations after making the review carousel keyboard-focusable. Reduced motion verified: no canvas, no three.js request, every section visible.

## Breakpoints

375, 430, 768, 1280, 1440, 1920: no horizontal overflow, no console errors (`docs/screenshots/final/`).

## Scan fixes, 26 Sep 2026

Fixed: review-wall cards no longer stretch; marquees hold a full card for 1.2 s before moving and start inside the gutter; header uses the mark-only logo; FAQ "Speak with the team" is a button; hero utility and footer links padded to 24 px targets; a 28 px blurred poster paints under the hero and the poster is preloaded. Added: reel rail (5 reels), live gold and silver panel (needs `METALS_API_KEY`), launch mode (`HIDE_UNCONFIRMED=true`) that hides every unconfirmed item instead of badging it.

Not fixable without credentials: Turnstile is on Cloudflare's test keys and leads go to the function log until `RESEND_API_KEY`, real Turnstile keys and a lead store are set (TODOs 3–5).

## 29 September to 3 October 2026: "cinema" concept built as a preview, then scrapped

A home page on the Watch Club concept (looping hero film, boutique header, scroll-driven loupe
gallery, review wall, brand carousel, looping gold buttons) was built and deployed as Vercel
previews only. On 3 October 2026 the client asked to keep the design that was live at
sl-jewellers-next.vercel.app and drop the concept entirely. The source was restored from the
production deployment of 29 September (dpl_8ohfWfKMLFRyunBYGVVXpeLDyWYx); production was never
changed. An archive of the scrapped version sits at `~/sl-jewellers-cinema-scrapped-2026-10-03.tgz`
and can be deleted. The preview deployments from 29 Sep to 1 Oct are not aliased and are behind team login.

## 3 October 2026: no scroll journey on phones (superseded the same day, see below)

At the client's request the pinned, scroll-scrubbed hero is off below 768px: phones get the
stacked layout that reduced-motion users already had (mark above, headline below, one screen),
the mark still loads and idles, and image parallax is off. Desktop is unchanged.

## Open TODOs (visible as red badges on the preview until resolved)

1. ~~**Opening hours**~~ — confirmed by Tom 3 Oct 2026: Mon–Sat 10:00–16:00, Sunday by appointment, enquiries answered 24/7. Bank holiday / Christmas hours are deliberately not on the site; Shaun edits `hours.week` when needed.
2. ~~**WhatsApp**~~ — confirmed by Tom 3 Oct 2026; customers may message 07383 376663 from the site.
3. ~~**Lead store**~~ — removed at handover (27 Sep 2026). Enquiries go to the inbox and nowhere else; `LEAD_STORE` defaults to `none`. Optional `sheet` mode remains if a searchable record is ever wanted.
4. **Resend** — API key, verified sending domain, `ENQUIRY_FROM_EMAIL`; then send a real test enquiry.
5. **Turnstile** — replace Cloudflare's test keys with real ones for the final domain.
6. **Google "write a review" link** — `social.google.writeReviewUrl`.
7. ~~**Made to order**~~ — confirmed by Tom 3 Oct 2026: S&L source pieces and make to order (`sourced-and-made-to-order` card).
8. **Collectibles** category — confirm or set `show:false`.
9. ~~**About story**~~ — Tom, 3 Oct 2026: no story for the shop. Copy stays factual. "89 Sets" / "Tilly and Tia's" spelling still unconfirmed.
10. **Facebook reviews** — verify the 7 quotes or leave Google-only.
11. **Year opened** — `founded.year`.
12. ~~**Repairs**~~ — jewellery repairs and soldering confirmed 3 Oct 2026 (services card, FAQ, SEO description). Resizing, batteries and engraving are still not mentioned anywhere.
13. ~~**Privacy policy**~~ — approved by Tom 3 Oct 2026 as is.
14. **Domain** — Tom said yes to sljewellers.co.uk (3 Oct 2026). Available, but Vercel's registrar does not sell .co.uk, so it must be bought at a UK registrar in S&L Jewellers Ltd's name, then: add to Vercel, set `NEXT_PUBLIC_SITE_URL`, verify the domain in Resend, Turnstile hostname, update GBP/FB/IG links, submit sitemap.
15. **Git** — the project is not yet a git repository or on GitHub; run `git init`, commit, and connect the repo to the Vercel project for push-to-deploy.

16. **Metals API key** — `METALS_API_KEY` from goldapi.io (or metalpriceapi.com) so the live gold and silver panel shows. Without it the panel is hidden.

## 3 October 2026: client answers applied (questionnaire)

Q1 hours, Q2 WhatsApp, Q3 all solid, Q4 genuine watches, Q5 source and make to order, Q6 no
online sales so no returns policy (FAQ now "Can I buy online?"), Q7 next-day delivery nationwide,
UK only (cost, tracking, insurance not given), Q8 the "Me" Google review is a customer, Q9 enquiry email stays sljewellers21@gmail.com, Q10 yes to sljewellers.co.uk, Q11 privacy approved, Q12 no story, Q13 show a rate: scrap gold 94% of spot, silver 75%, wearable pieces on enquiry (the "We pay" column), Q14 buys gold, silver and other precious metals and watches, photo ID needed (services card, FAQ, proof strip). TikTok @sljewellers21 added to header, footer and JSON-LD. Google listing re-read: 15 reviews, five new quotes added (g9–g13; g13 held off the wall). Each confirmed item carries a `source` line in its
JSON entry. Waiting on Q8 to Q16.

## 3 October 2026: mobile optimisation pass

Lighthouse mobile on the live site had fallen to 58 (TBT 11.2 s) once the 3D mark started
loading by itself on phones: the extrusion build was a 9 s task under Lighthouse's 4x CPU
throttle. Fixed without losing the spin: on phones the mark now builds with 8/2 curve/bevel
segments instead of 20/5, 160 stars instead of 420, a 30 fps cap, pixel ratio 1.5, and it waits
for an idle callback (2.5 s timeout) after load. Live results, three runs: 93 / 91 / 91 mobile,
TBT 220 to 330 ms, LCP 2.3 to 2.5 s, CLS 0; desktop 99. Accessibility, best practices and SEO
100. Reports in `docs/lighthouse/v27-mobile*.json`. Also: the header menu closes on a tap
outside it, Escape, or choosing a link; the hero Google-reviews link is a 48 px tap target;
the price-table labels went from 10 px to 11 px. No horizontal overflow at 375 or 430, axe clean,
~345 KB transferred for the full home page on a phone.

## 3 October 2026: scroll journey back on phones, lag removed

The client wanted the spin and the explosion on phones but without the scroll lag. The
pinned, scroll-scrubbed hero now runs below 768px again, with three changes that remove
the lag rather than the journey:

- The scrub is applied 1:1 to the scroll position on phones (`scrubEase: 0`). Desktop keeps
  its ~130 ms trail because Lenis has already smoothed the wheel there; on native touch
  scrolling that same trail reads as the logo lagging the thumb.
- The 30 fps cap is now an idle cap only (`idleFps`): any scroll, drag or burst lifts it for
  the next 400 ms, so the scrub renders at the full display rate.
- The canvas is `touch-action: pan-y` on touch devices, so a vertical swipe anywhere on
  the full-screen stage scrolls the page; a sideways drag still spins the mark and a tap
  still bursts it. (It was `none`, which swallowed vertical swipes on the stage.)
- Progress is written straight from the scroll event rather than one animation frame
  later. Image parallax stays off on phones.
- Short phones (under 780px tall, e.g. iPhone SE) lift and shrink the seated mark further
  as the copy lands, so it never sits on the headline.

Verified with Playwright in real Chrome at 390x844 and 375x667 (touch, DPR 3): journey
present, mark live without a touch, --p tracks scroll, phases open/journey/settle, settle
copy inside the viewport, swipe on the stage scrolls the page, tap bursts, no long tasks
while scrubbing, no overflow, no console errors; axe 0 violations. Frame rate under
software GL is not representative of a phone GPU and was not used as a pass/fail.
Deployed 19:42 BST. Lighthouse mobile on the live site, two runs: 94 / 90 performance (LCP 2.3-2.4 s,
TBT 230-360 ms, CLS 0), accessibility, best practices and SEO 100. Report: `docs/lighthouse/v28-mobile-journey.json`.

## 4 October 2026: silver sheen, We-pay colours, mobile fit pass

- Prices heading: gold sheen on "gold", a new silver sheen on "silver" (`~word~` in SplitHeading).
  Silver is two layers: a vertical chrome banding plus the sweeping glint, so it reads as metal at
  any size. The descender of sheen words was being clipped (text-clipped gradients paint nothing
  outside the word's box, and the tight heading line-height ended above the g's tail): fixed with
  bottom padding and a matching negative margin.
- Price table: the gold section's "We pay" figures and the word "Gold" use the gold metal; the
  silver section's use the silver metal. "/g" stays grey.
- Mobile fit: the Visit column was 409px wide on a 375px phone (the "Opening hours" row did not
  wrap and the open-now chip is nowrap), which clipped the hours table and the About text at the
  right edge. Fixed: the row wraps, the chip may wrap under 480px, and the Visit grid's children
  get min-width 0. Reel playlist state "Up" renamed "Next".
- Audited every section at 375x667 and 430x932 (28 and 25 frames): no horizontal overflow
  outside the intended scrollers (stock rail, ticker, parallax), no clipped visible text, axe 0
  violations, journey checks 27/27.

## 5 October 2026: product catalogue

59 WhatsApp photos processed through Higgsfield GPT Image 2.5 (165 credits): product only, hands and
backgrounds removed, transparent PNG. Background (black, grey lift, beam, gold stars) rendered locally by
`scripts/product-card.mjs`. Catalogue in `content/collections.json`, new "Coins & Bullion" category, home
"Our pieces" section rebuilt as category rows with four previews and a "View all N" button each; the
full list is on `/pieces/<slug>`, now with "Ask for a price" on every card. Footer hours column removed
the same day (hours live in Visit only).

## 5 October 2026: renders and old showcase removed, hover animation

Client asked for every AI render and gold-glare image to go, keeping only the new catalogue
photos. Removed: the "Pieces that went out the door" ArcShowcase section (and its orbit
photos), the rendered category covers, the offers and FAQ stills (replaced with catalogue
images), content/stock.json. Rings and Pendants rows have no image until a real one exists.
Product cards now zoom slightly and show a drifting, twinkling layer of gold stars on hover
(hover-capable devices only; reduced motion gets a still layer).

## 5 October 2026: new logo everywhere, single-piece showcase, first reel

Shaun supplied the logo lock-up; it now drives the header mark, footer lock-up, favicon and app icons, and the share image. Home "Our pieces" rows now showcase one piece each with a "More <category>" button (full list on the category page). New first reel "Counter banter" with a sound button; reels show whole rather than cropped.

