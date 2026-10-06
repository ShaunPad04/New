# S&L Jewellers website — handover

Next.js 15 (App Router) + Tailwind v4, statically generated, deployed on Vercel. One serverless function (`/api/enquiry`). Built by Black Line Agency, September 2026, and handed over outright: there is no retainer, no monthly fee to Black Line and nothing here that needs someone feeding it. The site is designed to sit still and keep working.

**If you read one section, read [Looking after the site](#looking-after-the-site-no-code-needed) and [What the site depends on](#what-the-site-depends-on).**

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build && pnpm start
pnpm typecheck
```

## Looking after the site (no code needed)

This section is written for whoever owns the shop, not for a developer. Nothing
here needs any software installing.

### First, the one setup job worth doing

Right now the website is updated by running a command on a computer that has the
project folder on it. That is fine for a developer and no use to anyone else.
Ask any developer to spend twenty minutes doing this once:

1. Put this folder into a **GitHub** repository (free).
2. In **Vercel**, connect the project to that repository.

After that, changing the site is: open the file on github.com, click the pencil,
type, click **Commit changes**. Vercel rebuilds on its own and the change is live
in about two minutes. No commands, no installing anything. Everything below
assumes that has been done.

If a change ever looks wrong, GitHub keeps every previous version, and Vercel
keeps every previous build: in Vercel, **Deployments → the last good one →
Promote to Production** puts the site back the way it was in seconds.

### Changing what you pay for scrap

`content/business.json` → `buying`: `goldScrapPercent` and `silverPercent` are the share of the
live spot price shown as "We pay" in the gold and silver table and quoted in the FAQ. Change the
number, nothing else.

### Changing the opening hours

Open `content/business.json` and find the `hours` block. Each day looks like this:

```json
"monday": { "open": "10:00", "close": "16:00" },
"sunday": null
```

Change the times, or write `null` (no quotes) for a day the shop is shut. Use the
24-hour clock, always four digits, e.g. `"09:30"` and `"16:00"`. A day that is open by
appointment only is written `{ "appointment": true }` (Sunday is set that way now), and a
closed day is `null`. The "Enquiries answered 24/7" line under the table is `enquiriesNote`
in the same block; delete it to remove the line.

Keep the commas and the quote marks exactly where they are. If the site does not
rebuild after a change, it is almost always a missing comma or a missing `"`.

The hours feed three things at once: the opening-hours table on the page, the
"Open now / Closed" badge that works itself out from the current time, and what
Google reads about the shop. Change them in the one place and all three follow.

### Changing the phone number, email or address

Same file, `content/business.json`, near the top. Change it once and it updates
the header, the enquiry page, the footer, the map link and the Google data.

### Changing the words on the page

- The paragraphs on the **About page** (`/about`) are in `content/about.md`. It is
  plain text: leave a blank line between paragraphs. A line starting with `##`
  becomes a small heading.
- The **service cards** ("We buy gold", "Part-exchange" and so on) are in
  `content/services.json`: `title`, `lead` (the sentence under it), and `points`
  (the bullet list).
- The **privacy policy** is in `content/privacy.md`.
- The big headlines — "Bring it in. Get a price.", "Pull up and have a look." —
  are in the page code, in `src/components/sections/`. They can be changed, but
  that one is a job for a developer, because the words are tuned to fit the
  screen width and a long replacement will wrap badly on a phone.

Anything wrapped in `*asterisks*` in a headline is the part that catches the gold
shine as you scroll. Keep the asterisks if you change that text.

### Changing or adding photos

1. Save the photo as a JPG. Aim for at least 1,200 pixels on the long side; a
   photo straight off a phone is fine. Portrait (taller than wide) suits the
   category cards.
2. Put it in the `public/images` folder. On GitHub: open the folder, then
   **Add file → Upload files**.
3. Point the site at it in `content/collections.json`. Find the category, and
   change `image` to `/images/your-new-photo.jpg`. Update `alt` to a plain
   description of what is in the picture — that is what a blind visitor hears and
   what Google reads, so "a 9 carat gold curb chain on a black tray", not
   "chain1".
4. Set `width` and `height` to the photo's real pixel size. If they are wrong the
   picture still shows, but the page jumps about as it loads.

Two rules that matter more than they look:

- **Use your own photographs.** Every image on the site is either a photo of real
  stock or a recorded, credited render, and `assets/SOURCES.md` says which is
  which for each one. Keep that file up to date if you add anything.
- **Do not put text into a photo.** Type in a picture cannot be read out, cannot
  be translated, and goes blurry on a big screen.

### The product catalogue (added 5 October 2026)

Fifty-nine pieces from S&L's WhatsApp photos now sit under five categories in `content/collections.json` (watches 17, chains 8, bracelets 7, coins & bullion 17, collectibles 10), each with a product-only image in `public/images/pieces/<category>/`. The home page shows four per category with a "View all" button; the full list is on `/pieces/<category>`. Every image was cut out with Higgsfield (GPT Image 2.5) and placed on the house background by `scripts/product-card.mjs` from the transparent cut-outs in `assets/source/cutouts/`, so the background can be changed for all of them in one run without re-cutting. Titles describe only what is visible on the piece. Provenance and the one caveat (the AI reconstructs the part of a worn bracelet or chain that was hidden) are in `assets/SOURCES.md`. On 5 Oct 2026 the old "Pieces that went out the door" showcase (`Stock.tsx`, `ArcShowcase`, `content/stock.json`, the `orbit-piece-*` photos) and the rendered category covers (`cat-*.jpg`, `chain-cuban-bust.jpg`, `collectible-pamp-bar.jpg`, `checked.jpg`, `faq-still.jpg`) were removed at the client's request: only the shop's own product photos remain. Rings and Pendants have no photo until a real one is added (`image` is empty, the row shows just its button). Product cards animate on hover (`.piece-card` in `globals.css`: a gentle zoom and a drifting layer of gold stars). To remove a sold piece, delete its entry from the category's `pieces` array; to add one, add a photo and an entry as described below.

### Adding stock to a category page

Each category ("Watches", "Rings" and so on) has its own page. An empty one reads
as finished — it says the case changes daily and invites a call — so there is no
obligation to fill them. If you do want to list a piece, see
[Category pages](#category-pages-adding-more-stock) below for the four lines to add.

Only add stock you are prepared to take down again when it sells. An out-of-date
case is worse than no case.

### Reviews

The numbers on the page ("Fifty-nine recommendations", 5.0 from 13 on Google) are
typed into `content/reviews.json` and do not update themselves. They only ever go
up, so they will drift low rather than become wrong. Worth checking once a year.
To add a review, copy it **exactly** as written on Google or Facebook — never
tidy up someone's words — and update the count in the same edit.

### Gold and silver prices

The full table is on its own page, `/gold-prices`; the home page has a one-line strip linking to it. These look after themselves. The table fetches the London price once a day and
shows the time it was last checked. If the price feed ever stops, the table shows
the carats and the word "ask" rather than a stale figure, so it can never mislead
a customer. Nothing to do.

### What to do if something breaks

The site is static files: it does not go down in the way a shop till does. In
order of likelihood:

1. **The enquiry form says it cannot send.** The email service key has expired or
   the free allowance has run out. The form tells the visitor to phone instead,
   so nothing is silently lost. See [Enquiry email](#what-the-site-depends-on).
2. **A change made the site vanish.** A typo in one of the `.json` files stopped
   the rebuild. Vercel shows the failed build and keeps the old site live. Fix
   the comma, or promote the previous deployment.
3. **The prices say "ask" for days.** The goldapi allowance has run out. Harmless.


## Content files, in detail

Everything a person would want to change lives in `content/`:

| File | What it controls |
|---|---|
| `content/offers.json` | The three "What we do" bands on the home page: buying and selling, sourcing and made to order, repairs and soldering. Words, photo and the short FAQ under each |
| `content/business.json` | Name, address, phone, email, WhatsApp number, **opening hours**, social links, Google Maps and review links, founding year |
| `content/services.json` | The Services cards. `confirmed:false` items show a red TODO badge until you flip them to `true` (or delete them). `enquiryType` pre-selects the form. |
| `content/collections.json` | The "Our pieces" category cards: title, blurb, image, alt text, and the optional `pieces` array behind each `/pieces/<slug>` page. `show:false` hides one. The first card is the big one. |
| `content/reviews.json` | Every review, verbatim. Only `verified:true` reviews are rendered. Keep `rating` as a number for Google and `null` for Facebook recommendations. |
| `content/reels.json` | The video strip: MP4, poster image, title, duration. Drop the pair in `public/reels/` and add a row. |
| `content/instagram.json` | The Instagram profile link behind the Follow button, and the archived post list. |
| `content/faq.json` | The questions on `/faq`. Items with a `todo` are hidden in launch mode. |
| `content/about.md` | The About paragraphs. A line starting `## ` becomes a sub-heading (used for "About us"); HTML comments starting `TODO:` render as red badges. |
| `content/privacy.md` | The privacy policy (simple Markdown: headings, paragraphs, bullets, bold, links). |

After editing, commit and push (Vercel rebuilds on its own), or run `vercel --prod` from the project folder.

### Opening hours

In `content/business.json` set each day to `{ "open": "10:00", "close": "16:00" }` or `null` for closed, then set `"confirmed": true`. That single flag removes every "hours to be confirmed" note, lights up the "Open now" chip with confidence, and adds `openingHoursSpecification` to the JSON-LD for Google.

### Reviews

1. Copy the review text exactly as written on Google or Facebook.
2. Add it to the right array with `"verified": true` and the date shown on the platform.
3. Update `google.rating` and `google.reviewCount` (or `facebook.reviewCount`) to the figures shown on the platform on that day. These feed the hero badge, the Reviews section and the JSON-LD `aggregateRating`, so never round up.
4. Paste the "Get more reviews" link from the Google Business Profile dashboard into `google.writeReviewUrl` to replace the TODO badge.

### Images

- Put originals in `public/images/` (JPG/PNG, at least 1200 px on the long side). `next/image` serves AVIF/WebP at the right size automatically.
- Reference them from the JSON files. Always write an `alt` that says what is in the picture.
- The source archive with provenance is in `assets/source/` and `assets/SOURCES.md`; pre-generated 400/800/1200/1600 px AVIF/WebP variants are in `assets/img/` if they are ever needed outside Next.
- The hero uses `public/images/sl-mark-poster-*.{avif,webp}` (the still) and a 28 px blurred copy in `src/lib/poster-blur.ts` painted underneath. `public/logo-mark.svg` (crown and diamond) is used at small sizes such as the header; `public/logo.svg` is the full lock-up for the footer and OG image. Regenerate the poster set from `sl-mark-poster.png` if the mark ever changes.

### Services

Edit `content/services.json`. To add repairs, batteries, resizing or engraving once S&L confirm them: add an item with a matching `enquiryType` (`repair`, `resizing`, `bespoke`, `buying`, `selling-gold`, `part-exchange`, `other`) and `confirmed: true`. Then add the matching SEO phrase to the home page title/description in `src/app/layout.tsx`.

## What the site depends on

Five outside services. Four of them are optional: the site builds, deploys and
serves every page with none of them configured. Only the hosting is essential.

Everything below is on a free plan and, at this shop's volume, stays on one.

| Service | What it does | If it is missing or fails | Free tier | Account needed |
|---|---|---|---|---|
| **Vercel** (hosting) | Serves the site and runs the enquiry function | Nothing to serve. This is the only hard dependency. | Hobby: free for a site like this. 100 GB bandwidth a month; this site is a few MB a visit. | Yes — must be the owner's |
| **Resend** (enquiry email) | Sends each enquiry to the shop, and a confirmation to the customer | The form still accepts, validates and thanks correctly, then tells the visitor to phone instead. No enquiry is silently swallowed. Phone, WhatsApp and the email link on the page all still work. | 3,000 emails a month, 100 a day. A busy week here is maybe twenty. | Yes — the owner's own, free |
| **Cloudflare Turnstile** (spam check) | The tick-box on the enquiry form | The tick-box disappears and the form still works, protected by a hidden honeypot field and a five-per-ten-minutes limit per visitor. Expect a little more spam. | Free, no limit. | Optional |
| **goldapi.io** (metal prices) | The live gold and silver figures | The price table still renders, showing the carats and "ask" instead of numbers. It never shows a stale or invented figure. | 100 requests a month; the site uses about 60. | Optional |
| **Google Maps embed** | The map in the shop section | The map panel is blank. Address, postcode and the "Get directions" link still work. | Free, no key, no account. | No |

Two things that are **not** dependencies, and were removed at handover so they
could not become someone's problem:

- **Upstash Redis / Vercel KV.** It kept a second copy of every enquiry and
  counted submissions per visitor. That is a database, an account and a bill to
  inherit, for a copy of something that is already in an inbox. Enquiries now go
  to the inbox and nowhere else, and the rate limit runs in memory. If a
  searchable record is ever wanted, set `LEAD_STORE=sheet` and point
  `LEAD_WEBHOOK_URL` at a Google Apps Script on the owner's own Google account.
- **Vercel Web Analytics.** Still switched on (it is cookieless, which is why the
  site needs no cookie banner), but it is a Vercel feature rather than a separate
  account, and the site does not depend on it in any way.

## Environment variables

Set these in Vercel → Project → Settings → Environment Variables. `.env.example`
carries the same list with the same notes. None of them are required to build.

| Variable | Needed for | What happens without it |
|---|---|---|
| `RESEND_API_KEY` | Enquiry email | Form cannot send; visitor is told to phone |
| `ENQUIRY_TO_EMAIL` | Enquiry email | As above. Comma-separate for several recipients |
| `ENQUIRY_FROM_EMAIL` | Enquiry email | As above. Must be an address on a domain verified in Resend, or Resend's `onboarding@resend.dev` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Spam tick-box | Tick-box not shown; form still works |
| `TURNSTILE_SECRET_KEY` | Spam tick-box | Submissions accepted without a challenge; a warning is logged |
| `METALS_API_KEY` | Live prices | Price table shows "ask" |
| `METALS_API_HOST` | Live prices | Defaults to `goldapi.io`. The only other value is `metalpriceapi.com` |
| `NEXT_PUBLIC_SITE_URL` | Links and SEO | Canonical links, sitemap and share previews point at the wrong address |
| `LEAD_STORE` | Optional record | Defaults to `none`. `sheet` also POSTs each enquiry to `LEAD_WEBHOOK_URL` |
| `LEAD_WEBHOOK_URL` | With `LEAD_STORE=sheet` | The webhook is skipped and the failure logged |
| `HIDE_UNCONFIRMED` | Launch flag | `true` hides anything the shop has not confirmed instead of showing a red TODO badge |

Cloudflare's public **test keys** (`1x00000000000000000000AA` /
`1x0000000000000000000000000000000AA`) are in `.env.example` so the form works
locally; they always pass, and they must not be used in production.

### Where the keys stand (27 September 2026)

All four are currently on **Black Line Agency accounts**. They work, and they
will keep working, but they are not the owner's and nobody at Black Line is
being paid to watch them. Replacing them is the whole of the handover job.

| Service | State | To hand over |
|---|---|---|
| Vercel | Project `sl-jewellers-next` in the `black-line-agency` team, aliased to `sl-jewellers-next.vercel.app`. | Transfer the project to the owner's own Vercel account (Project → Settings → Transfer), or redeploy it there from scratch. |
| Resend | Key set. **No verified domain**, so mail goes from `onboarding@resend.dev` and only reaches the Resend account's own inbox. The customer confirmation is skipped until a domain is verified. | Owner creates a free Resend account with the shop's email, verifies the shop domain when it exists, and sets the three `ENQUIRY_*`/`RESEND_*` variables to his own. |
| Cloudflare Turnstile | Real keys. Widget "S&L Jewellers website", hostname `sl-jewellers-next.vercel.app`. | Owner creates a free Cloudflare account, adds a widget for his domain, and swaps the two keys. Or drops it: the form works without. |
| goldapi.io | Free plan, 100 requests a month. Upstream is fetched once a day per metal through the Vercel Data Cache (about 60 calls a month) and the edge serves it for an hour, so the free plan holds. | Owner creates a free goldapi.io account and swaps `METALS_API_KEY`. Or drops it: the table then reads "ask". |

## Taking ownership: the checklist

1. **Hosting.** Create a free Vercel account for the shop. Either transfer the
   existing project into it (Vercel → Project → Settings → Transfer, which keeps
   the deployment history and the URL), or import the code fresh.
2. **Code.** Put the project folder into a GitHub repository on the shop's own
   account and connect Vercel to it. Without this, the only way to change the
   site is a developer running a command from a copy of the folder — see the
   [setup job](#first-the-one-setup-job-worth-doing) at the top.
3. **Email.** Free Resend account in the shop's name → set `RESEND_API_KEY`,
   `ENQUIRY_TO_EMAIL`, `ENQUIRY_FROM_EMAIL`. Until a domain is verified, keep
   `ENQUIRY_FROM_EMAIL` as `onboarding@resend.dev` and make `ENQUIRY_TO_EMAIL`
   the same address that owns the Resend account, or the mail will not arrive.
4. **Spam check.** Free Cloudflare account → a Turnstile widget for the site's
   hostname → set the two Turnstile keys. Skippable.
5. **Prices.** Free goldapi.io account → set `METALS_API_KEY`. Skippable.
6. **Domain**, when there is one: see [Adding the domain](#adding-the-domain).
   Do not forget `NEXT_PUBLIC_SITE_URL`, the Resend domain verification and the
   Turnstile hostname; all three point at the Vercel address today.
7. **Send one test enquiry** through the live form and confirm it lands in the
   shop's inbox, before anyone is told the site is theirs.

Nothing on this list costs money at this shop's volume, and none of it expires
on its own. Total ongoing cost of the site as handed over: **£0**, plus a domain
if one is registered.

### How the enquiry flow works

1. Browser validates, then POSTs multipart form data (up to 3 photos, 5 MB each) to `/api/enquiry`.
2. Server: honeypot check → per-IP rate limit (5 per 10 minutes, in memory) → zod validation → Turnstile verification if it is configured → photo checks.
3. The lead is emailed to the owner with the photos attached, `replyTo` set to the customer so a reply goes straight back to them. The customer's confirmation is sent after that, and only if `ENQUIRY_FROM_EMAIL` is on a verified domain.
4. If the email cannot be sent and nothing was stored, the visitor gets a clear failure telling them to phone or WhatsApp instead — never a false success. Each enquiry carries a short reference ID that appears in both emails and the server log.


## Adding the domain

1. Vercel → Project → Settings → Domains → add `sljewellers.co.uk` and `www.sljewellers.co.uk` (choose which redirects to which).
2. At the registrar, add the A record (`76.76.21.21`) for the apex and the CNAME (`cname.vercel-dns.com`) for `www`, as Vercel shows.
3. Set `NEXT_PUBLIC_SITE_URL` to the final URL and redeploy.
4. In Resend, verify the sending domain (SPF + DKIM records) and set `ENQUIRY_FROM_EMAIL` to an address on it.
5. In Turnstile, add the domain to the widget's hostnames.
6. Add the website URL to the Google Business Profile, Facebook page and Instagram bio, then submit `https://<domain>/sitemap.xml` in Google Search Console.

## Redirects from the old site

Defined in `next.config.ts`. The old preview was never indexed (it carried `noindex` and Vercel login protection), so these protect shared links rather than rankings.

| Old URL | New URL |
|---|---|
| `/collection/`, `/collection/?brand=…`, `/piece/:id/` | `/#collections` |
| `/services/` | `/#services` |
| `/part-exchange/` | `/enquiry?type=part-exchange` |
| `/contact/` | `/#visit` |

## Type and the gold sheen

Since 6 October 2026 the whole site is set in one family, **Archivo**, through `next/font/google` in `src/app/layout.tsx` with its width axis (`--font-archivo`, mapped to both `--font-display` and `--font-body` in `globals.css`). Headings, the nav, labels and buttons run **semi-expanded capitals** (`font-stretch: 108%`, weight 400); reading text runs at normal width. Shaun tried the full expanded cut (118%) and found it too wide, then chose 108% from six options rendered on the site. Changing every `108%` in `globals.css` moves the whole site to another width. It replaced Outfit (headings) and Manrope (body). The theme is black, warm white and **champagne gold (#c9ad74) as an accent only**: a heading's key word, stars, list markers, the price strip's figures and focus rings. Buttons are square hairline outlines that fill white on hover; links roll on hover in the same white. Heading sizes (`display-xl`/`display-l`) were set for capitals; for a word that cannot fit on a phone, put `|` where it may break (`recommen|dations.`); `SplitHeading` turns it into a soft hyphen and strips it from the accessible label.

Gold keywords (`*like this*` in a `SplitHeading`) are no longer flat gold: they carry a metallic gradient clipped to the text, and `src/components/motion/Shine.tsx` drives `--shine` (0 when the heading enters at the bottom of the viewport, 1 as it leaves the top) so the highlight sweeps across as the visitor scrolls. Each word in a run is offset by `--k` so the light reaches later words later. Headings inside the pinned hero derive `--shine` from the hero's own `--p` instead. Reduced motion holds a static sheen. Light sections use a darker gradient so the words stay readable on ash and fog. Silver keywords work the same way with `~like this~` (used on the prices heading: gold on "gold", silver on "silver").

## Starfield behind Our pieces

`src/components/Starfield.tsx` redraws the hero's sky for a section: the same distribution as the three.js points in `sl-mark.js` (mostly small with a few larger, a gold-warm bias on some, each star twinkling at its own rate with the faintest winking out), on a 2D canvas with additive blending, so there is no second WebGL context. It only animates while the section is on screen and the tab is visible, and reduced motion paints one still frame. Drop `<Starfield />` as the first child of any `on-black` section that has `position: relative`, and give the content `relative z-10`. Density follows the hero (about 420 stars per laptop screen), capped at 900.

## Category pages: adding more stock

Every category in "What we sell" has its own page at `/pieces/<slug>`, and the cards on the home page open it. The pages are generated from `content/collections.json`, so adding stock is a content edit with no code change.

To add a piece, drop the photo into `public/images`, record where it came from in `assets/SOURCES.md`, then append to that category's `pieces` array:

```json
{ "id": "curb-9ct-60g", "title": "9ct curb chain", "image": "/images/curb-9ct-60g.jpg",
  "alt": "A 9 carat gold curb chain on a black tray", "width": 900, "height": 1125,
  "note": "9ct, 60g" }
```

`note` is optional and is the place for a weight, a carat or a condition. Every piece links to the enquiry form with its own title pre-filled. An empty `pieces` array is the normal state: the page then says nothing is listed and invites an enquiry, rather than pretending to a catalogue. Removing a category from `collections.json` removes its page, its sitemap entry and its card together, and the old URL then 404s.

## Built to need no upkeep

This is a build, not a retainer, so nothing on the site depends on someone feeding it:

- **Category pages** (`/pieces/<slug>`) read as finished with no stock listed. The `pieces` array on each category in `content/collections.json` is optional; fill it and a grid appears above the copy, leave it empty and the page still makes sense. Do not build a catalogue here unless someone is going to keep it current.
- **Gold and silver prices** refresh themselves daily from the feed. If the goldapi allowance runs out the table falls back to "ask" rather than showing a stale number.
- **Opening hours, address and phone** are static in `content/business.json` and only change when the shop does.
- **Review figures go stale on their own.** `content/reviews.json` holds 5.0 from 13 on Google and 59 recommendations on Facebook, and the Reviews heading spells "Fifty-nine" out in words in `src/components/sections/Reviews.tsx`. Those numbers only grow, so they will drift low over time. Worth a check once a year; nothing breaks if they are not.
- **No database, no queue, no cron.** Nothing on the server holds state between requests. There is one serverless function, it sends an email, and that is the whole backend. Nothing can fill up, fall behind or need clearing out.
- **Every outside service is optional except the hosting**, and each one fails to a sensible, honest fallback rather than to a broken page. See [What the site depends on](#what-the-site-depends-on).

## Header

Sixty-four pixels, sticky, and it never slides away (a hide-on-scroll-down version jittered under the smooth scroll). The stacked logo sits centred (`public/logo-lockup-400.webp`, 56px tall); Pieces, Services, Reviews and Visit on the left, Enquire and Menu on the right as plain words with no frames (phones: Enquire left, Menu right). Over the hero film the bar is completely clear; once the film has scrolled past it turns to glass (blur plus a 66% black), or solid black for visitors with Reduce transparency switched on (`MotionRoot` writes `data-scrolled`). The words are `FlipLink`s from `src/components/ui/reveal-links.tsx`: on hover or keyboard focus the word rolls up letter by letter and its twin rolls in. Menu opens a full-width black panel under the bar with every section, the address, the phone and the socials; it carries `data-lenis-prevent`, without which it would not scroll on a short screen. Note for `globals.css`: write `backdrop-filter` only, never a hand-written `-webkit-backdrop-filter` beside it. The CSS minifier merges the pair and keeps only the prefixed one, which silently removes the blur in every browser.


## Gold that reacts to the cursor

The "Our pieces" cards use `src/components/motion/Glint.tsx`: the photo saturates a touch and scales, a sheen sweeps across once when the cursor arrives, and the card tilts a few degrees toward the pointer. All of it is CSS under `.glint` in `globals.css`; the component only writes `--mx/--my/--rx/--ry` from pointer moves, rAF-throttled, on mouse pointers. Touch and reduced motion get the plain card. To use it elsewhere, replace a card's `Link` with `Glint` (same `href` and `className`).

## The hero film

One screen of film under the clear header: Shaun's clip of a hand reaching to the camera and ending on the rings, as a **boomerang loop** (forward then back, 7.75 s, so it loops with no cut). Files in `public/videos/hero/`: AV1 WebM for every browser that plays it (Chrome, Firefox, Edge, recent Safari) and H.264 MP4 for the rest; a 16:9 cut at 1080p and 1440p and a 9:16 crop for portrait screens. `src/components/HeroVideo.tsx` picks the file, starts it after the page has loaded, pauses it off screen and in a hidden tab, and shows a pause button (required for anything moving longer than five seconds). Visitors with reduced motion or Save-Data get a still instead (the clip's last frame, the close-up of the rings); everyone sees the first frame as the poster until the film is playing. The hero carries no words; the page's h1 is there for screen readers and search.

To change the film: encode from the master with ffmpeg as recorded in `assets/SOURCES.md` (boomerang, AV1 CRF 28 / H.264 CRF 20-22, SSIM 0.987-0.992 against the master), keep the file names, and replace the posters in `public/images/hero/`. The old three.js mark (`HeroMark.tsx`, `src/lib/sl-mark.js`) is still in the repo, unused, until the film is signed off.


## Analytics and privacy

Vercel Web Analytics is cookieless, so there is no cookie banner. If Google Analytics or a Meta pixel is ever added, a consent banner and a privacy-policy update are required first.

## Files

```
content/            editable copy and data
public/images/      photos served by next/image
assets/source/      original images + SOURCES.md (provenance)
assets/img/         pre-generated AVIF/WebP at 400/800/1200/1600
docs/audit/         AUDIT.md, contact sheet, social download log
docs/PLAN.md        the approved plan
docs/CHECKLIST.md   launch checklist and open TODOs
docs/screenshots/   breakpoint screenshots
docs/lighthouse/    Lighthouse reports
src/app/            routes: /, /gold-prices, /faq, /pieces/<slug>, /enquiry, /privacy, 404, /api/enquiry, sitemap, robots
src/components/     UI
src/lib/            content loaders, hours logic, enquiry backend, 3D mark
```
