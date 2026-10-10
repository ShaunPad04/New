# S&L Jewellers — content and site audit

Audited 25 September 2026 by Black Line Agency. Sources: current Vercel preview, its deployment source (`/Users/sj/sl-jewellers-site`), Facebook, Instagram, Google Maps, Companies House.

## 1. Business details (confirmed vs unconfirmed)

| Item | Value | Source | Status |
|---|---|---|---|
| Trading name | S&L Jewellers (Google: "S & L Jewellers"; FB: "S&L Jewellers21"; IG: "S&L Jewellers LTD") | all | Confirmed |
| Legal entity | S&L JEWELLERS LTD, company no. 14326234, incorporated 31 Aug 2022, active, SIC 47770 (retail sale of watches and jewellery) | Companies House | Confirmed |
| Registered office | 49 Cambridge Street, Cleethorpes, England, DN35 8HD | Companies House | Confirmed |
| Shop address | 49 Cambridge Street, Cleethorpes DN35 8HD (same as registered office) | Google Maps, Facebook About, current site | Confirmed |
| Map position | 53.5573647, -0.0271527 · Plus code HX4F+W4 | Google Maps | Confirmed |
| Phone | 07383 376663 (+44 7383 376663), listed as "Mobile" on Facebook | Google, Facebook, site | Confirmed |
| Email | sljewellers21@gmail.com | Facebook About, site, FB cover image | Confirmed |
| WhatsApp | Not stated anywhere | — | **Question** |
| Opening hours | Site: "TODO"; Google: none listed ("Add hours"); Facebook: "Always open" (a page setting, not real hours); old repo note: Mon–Sat 10:00–17:30 "unconfirmed" | — | **Question** |
| Year opened | Company incorporated 31 Aug 2022. Social handles end in "21" and the Instagram profile picture dates from Dec 2021, which suggests trading from 2021 | — | **Question** |
| Tagline | Facebook intro: "Cleethorpes Based Jewellers — We Offer Gold/Jewellery At Unbeatable Prices". Instagram bio: "Gold/Silver & Watches · We Buy All Gold & Jewellery · Cleethorpes Shop · Next Day Delivery Available · WE ARE NOT AFFILIATED WITH THE BRANDS WE SELL" | FB, IG | Confirmed |
| Google rating | 5.0 from 12 reviews (10 with text) | Google Maps | Confirmed |
| Facebook rating | 100% recommend, 59 reviews | Facebook | Confirmed (count only) |
| Followers | Instagram 12.9k (2,057 posts) · Facebook 6.8k | IG, FB | Confirmed |
| Director | One director on the public register (Companies House). Not to be used on the site without S&L's say-so | Companies House | **Question** |
| Website | None linked from Google or Facebook; Instagram bio has no link | — | Note |

## 2. Products and services

**Stocked (evidence in photos/copy):** pre-owned luxury watches (Rolex-style pieces in every wrist shot; IG bio disclaims brand affiliation), gold chains (curb, Cuban), gold bracelets, rings (signet, stone-set, coin rings), pendants (cherub, coin), gold coins and bullion (sovereign in box, PAMP bars), collectibles (site category "Collectibles"; Pokémon card and FIFA World Cup gold ticket in reels), silver (IG bio "Gold/Silver").

**Services stated:** we buy all gold and jewellery in any condition (site, FB, IG); part-exchange (site); next-day delivery (IG bio, site); pieces made to order (three Facebook recommendations mention custom-made items, unverified: see reviews).

**Not mentioned anywhere:** repairs, ring resizing, watch batteries, engraving, valuations, hallmarking, any trade membership. These stay off the site until confirmed.

## 3. Current site

- Hand-built static site (no framework), one 3D hero (three.js) of the S&L mark exploding into gold shards, Lenis smooth scroll, ~350 KB CSS/JS plus three.js.
- Header: `X-Robots-Tag: noindex` and `<meta robots noindex,nofollow>`; deployment protection on (302 to Vercel login unless signed in). **It has never been indexable, so there is no Google ranking to protect.** Redirects are still worth adding for shared links.
- Canonical/OG URLs point at the placeholder domain `sl-jewellers.example`; OG image is `placeholder.svg`.
- Visible TODOs on live pages: opening hours (every page), founder/partner/manager names and portraits (About), "TODO-FOUNDED", "TODO-TERMS-URL", "TODO-PRIVACY-URL", "TODO - describe this image" alt text.
- The catalogue is 6 placeholder rows ("Price on enquiry") and `llms.txt` is residue from a luxury-watch template (Patek, Richard Mille, "three decades in Cleethorpes", "two-year warranty") that must not carry over.
- Both forms are "concept previews" that open a mailto; nothing is sent server-side.
- Reviews: 8 Facebook recommendations quoted verbatim plus Google 5.0/12. Facebook quotes were read on 19 Sep 2026 by a previous build; only one could be re-verified today (login wall).
- Design: strong black/gold brand, but the site reads as a luxury-watch template retrofitted: uppercase-everything, numbered section markers `[01]…[07]` that encode nothing, a 3D hero that hides the actual product, three different section systems, and no mobile quick-contact.
- Performance risk: three.js + video carousel on the home page; not measured (login-protected), but the bundle alone rules out 95+ on mobile.

### URL map (old → new)

| Old | New |
|---|---|
| `/` | `/` |
| `/collection/`, `/collection/?brand=*`, `/collection/?sort=*` | `/#collections` |
| `/piece/:id/` | `/#collections` |
| `/services/` | `/#services` |
| `/part-exchange/` | `/enquiry?type=selling-gold` |
| `/about/` | `/#about` |
| `/contact/` | `/#visit` |
| `/llms.txt`, `/sitemap.xml` | regenerated |

## 4. Social

- Facebook: https://www.facebook.com/p/SL-Jewellers21-100071408394727/ (id 100071408394727). Reviews at `profile.php?id=100071408394727&sk=reviews`. About page readable; Photos/Videos/Reviews beyond the first item need a login.
- Instagram: https://www.instagram.com/sl_jewellers21/ — 12 most recent post URLs and 640px thumbnails captured; highlights and older posts need a login.
- TikTok / others: none linked from either profile.
- Google Maps listing: https://www.google.com/maps/place/S+%26+L+Jewellers/@53.5573647,-0.0271527,17z/data=!4m6!3m5!1s0x487883b4bb6d0e41:0x6d6b331b9d296add!8m2!3d53.5573647!4d-0.0271527!16s%2Fg%2F11yyflf3y4 — "Write a review" short link still to be generated from the Business Profile dashboard.

## 5. Images

48 files in `assets/source/` (see `assets/SOURCES.md`): 15 product photos, 5 reel posters + 5 reel MP4s, shop interior photo + MP4, 2 stills, logo SVG, favicon, touch icon, 3D-mark poster, Facebook cover + profile, Instagram profile + 12 recent thumbnails. Optimised variants in `assets/img/`.

Best hero candidates: `site-orbit-piece-14` (Cuban chain on bust), `site-checked` (chain lifted with tweezers, landscape), `site-orbit-piece-01`/`-05` (watches), `site-shop-interior` (the shop itself), `ig-2025-03-12-reel` (shopfront).
