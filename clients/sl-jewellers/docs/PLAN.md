# S&L Jewellers rebuild — plan (for approval)

Companion to `docs/audit/AUDIT.md`. Nothing below is built yet.

## Who this is for

S&L is not a Bond Street jeweller and should not pretend to be one. The photos are heavy gold on tattooed wrists, sovereigns in a palm, PAMP bars, a Submariner, a Pokémon card. The reviews say "the guys", "great banter", "opened the shop at night for me", "unbeatable prices". The audience is local, arrives from Instagram and Facebook on a phone, and wants three things fast: what have you got, what will you give me for my gold, and when are you open. The page's single job is to turn that visit into a call, a WhatsApp, or a walk to 49 Cambridge Street.

## Sitemap

```
/                one page, anchored
  #collections   What we sell          image grid by category (their photos only)
  #services      Services              Sell your gold · Part-exchange · Next-day delivery · Made to order (TBC)
  #reviews       Reviews               Google 5.0 (12) + verified quotes, Read all / Leave a review
  #about         The shop              facts only + shop photos; story text TODO from S&L
  #instagram     From Instagram        static 9-grid linking to posts, Follow button
  #visit         Visit us              address, map, hours table, phone, WhatsApp (TBC), email
/enquiry         full form (pre-filled by ?type= and ?item=)
/privacy         privacy policy covering the form
/404             not found
/api/enquiry     serverless (POST only)
```

Redirects (301) from the old URLs are in the audit, section 3.

## Visual direction (pick one)

Brand fixed points: black and gold, the crown-and-diamond mark, the rounded "S&L" letterforms and the script "Jewellers" in the logo (`assets/source/site-sl-jewellers-logo.svg`, gold #C2A03C).

The conventional answer for a jeweller is ivory, a thin serif, gold hairlines and a ring on velvet. The conventional answer for a watch dealer, and what the current site does, is pure black, all-caps tracking and a serif. Both are defaults. Three directions that are S&L's, not a template's:

### 1. Counter light (recommended)

The shop after dark: the counter lamp on gold, then daylight sections in bone so it is not wall-to-wall black.

| Token | Hex | Use | Contrast |
|---|---|---|---|
| Ink | `#0E0C0A` | dark ground (warm, not #000) | — |
| Velvet | `#1C1815` | cards, tray surfaces on Ink | — |
| Sovereign | `#C9A648` | brand gold, tuned up from the logo for text | 9.2:1 on Ink |
| Brass | `#E4CC7A` | gold hover / focus ring | 12:1 on Ink |
| Bone | `#F3EDE2` | light ground (services, visit, enquiry) | — |
| Coal | `#3B3631` | secondary text on Bone | 9.5:1 on Bone |

Type: **Bricolage Grotesque** for display, set condensed and heavy like a painted shop sign, with the width axis widened for the odd single word. **Figtree** for body, round and friendly to sit with the logo's letterforms; tabular figures for prices, grams and hours. No third face. Sentence case everywhere except two eyebrows.

Signature: the **"Open now · until 17:30" chip**, computed from the real hours and repeated in the header, the hero, the Visit section and the sticky bar. It turns gold when the shop is open and says "Opens Tuesday 10:00" when it isn't. Honest, useful, and only a walk-in shop can have it. Everything else stays quiet: one full-bleed wrist shot in the hero, generous space, motion limited to a single fade-up per section and a 1.03 hover scale on images.

Dials: variance mid-high (asymmetric grid, large type), motion low, density spacious.

### 2. Velvet tray

Daylight jeweller's window. Bone ground, aubergine-black `#16121A` type and footer, Sovereign gold accents, and one borrowed colour: the Submariner-dial blue `#1E4EB4` for links and focus only. Display **Young Serif** (chunky, warm, nothing like Playfair), body **Source Sans 3**. Reads more traditional and older; the product photos, which are all dark, pop harder on it. Risk: cream-plus-serif is close to what everyone ships this year.

### 3. Signage

Poster-like and Instagram-native. Black, gold and white, **Archivo** Expanded Black for display (continuity with the current site's Archivo), Archivo for body. The hero is their reel footage, muted, with a poster fallback. Loudest of the three; closest to what exists today.

## Stack

- Next.js 15, App Router, TypeScript, Tailwind v4, deployed on Vercel. Every page statically generated; only `/api/enquiry` runs on demand.
- `next/image` with the pre-generated AVIF/WebP sources; everything below the fold lazy. Fonts self-hosted through `next/font` (no runtime Google request).
- Content in `content/business.json` (name, address, phone, hours, socials), `content/services.json`, `content/collections.json`, `content/reviews.json`, `content/instagram.json`, `content/about.md`, `content/privacy.md`.
- Enquiry: zod validation server-side, honeypot, Cloudflare Turnstile verified server-side, per-IP rate limit, Resend to the owner plus an auto-reply, images (max 3 × 5 MB) attached to the owner email. Every submission logged before email is attempted. Env: `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL`, `ENQUIRY_FROM_EMAIL`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, plus the store's keys.
- Vercel Analytics (cookieless), so no cookie banner; the privacy page explains it.
- SEO: per-page titles/descriptions for "jewellers in Cleethorpes" and "sell gold Cleethorpes"; repair/battery terms only if those services are confirmed. JSON-LD `JewelryStore` with geo, hours, `sameAs`, and `aggregateRating` from the real Google figure. OG image built from their own photo. `sitemap.xml`, `robots.txt`, favicon set from the crown mark.
- QA: Playwright screenshots at 375/430/768/1280/1440/1920, axe, Lighthouse on a served build, a real test enquiry.

## Hard-rule check on this plan

- No invented facts: hours, founding year, WhatsApp, made-to-order, repairs and the About story are all TODO until answered.
- Reviews: the 10 Google reviews are verified verbatim; 7 of the 8 Facebook quotes could not be re-verified through the login wall and are flagged `verified: false` in `content/reviews.json`. They will not be published unless you or S&L confirm them.
- Images: 48 files, all S&L's own. No stock.
- UK English, GBP, UK phone and date formats throughout.
