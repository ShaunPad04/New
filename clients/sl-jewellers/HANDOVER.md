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

Fifty-nine pieces from S&L's WhatsApp photos now sit under five categories in `content/collections.json` (watches 17, chains 8, bracelets 7, coins & bullion 17, collectibles 10), each with a product-only image in `public/images/pieces/<category>/`. The home page shows four per category with a "View all" button; the full list is on `/pieces/<category>`. Every image was cut out with Higgsfield (GPT Image 2.5) and placed on the house background by `scripts/product-card.mjs` from the transparent cut-outs in `assets/source/cutouts/`, so the background can be changed for all of them in one run without re-cutting. Titles describe only what is visible on the piece. Provenance and the one caveat (the AI reconstructs the part of a worn bracelet or chain that was hidden) are in `assets/SOURCES.md`. On 5 Oct 2026 the old "Pieces that went out the door" showcase (`Stock.tsx`, `ArcShowcase`, `content/stock.json`, the `orbit-piece-*` photos) and the rendered category covers (`cat-*.jpg`, `chain-cuban-bust.jpg`, `collectible-pamp-bar.jpg`, `checked.jpg`, `faq-still.jpg`) were removed at the client's request: only the shop's own product photos remain. Rings and Pendants have no photo until a real one is added (`image` is empty, the row shows just its button). Product cards animate on hover (`.piece-card` in `globals.css`: the card lifts and the photo zooms gently). To remove a sold piece, delete its entry from the category's `pieces` array; to add one, add a photo and an entry as described below.

### Adding stock to a category page

Each category ("Watches", "Rings" and so on) has its own page. An empty one reads
as finished — it says the case changes daily and invites a call — so there is no
obligation to fill them. If you do want to list a piece, see
[Category pages](#category-pages-adding-more-stock) below for the four lines to add.

Only add stock you are prepared to take down again when it sells. An out-of-date
case is worse than no case.

### Reviews

The numbers on the page ("Fifty-nine recommendations", 5.0 from 15 on Google) are
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
| `content/collections.json` | The categories: title, blurb, image, alt text, and the optional `pieces` array behind each `/pieces/<slug>` page. `show:false` hides one. The home page's "Shop by collection" trays take their order and pictures from `src/components/sections/collections/data.ts` (`ORDER`, and `LEAD` for a category that should not open on its first piece). |
| `content/reviews.json` | Every review, verbatim. Only `verified:true` reviews are rendered. Keep `rating` as a number for Google and `null` for Facebook recommendations. |
| `content/reels.json` | The reels carousel: MP4, poster image, title, duration, and `audio: true` for a clip with sound. Drop the pair in `public/reels/` and add a row. |
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
| `/part-exchange/` | `/enquiry?type=part-exchange` |
| `/contact/` | `/#visit` |

## Type and the gold sheen

Since 6 October 2026 the whole site is set in one family, **Archivo**, through `next/font/google` in `src/app/layout.tsx` with its width axis (`--font-archivo`, mapped to both `--font-display` and `--font-body` in `globals.css`). Headings, the nav, labels and buttons run **semi-expanded capitals** (`font-stretch: 108%`, weight 400); reading text runs at normal width. Shaun tried the full expanded cut (118%) and found it too wide, then chose 108% from six options rendered on the site. Changing every `108%` in `globals.css` moves the whole site to another width. It replaced Outfit (headings) and Manrope (body). The theme is black, warm white and **champagne gold (#c9ad74) as an accent only**: a heading's key word, stars, list markers, the price strip's figures and focus rings. Buttons are square hairline outlines that fill white on hover; links roll on hover in the same white. Heading sizes (`display-xl`/`display-l`) were set for capitals; for a word that cannot fit on a phone, put `|` where it may break (`recommen|dations.`); `SplitHeading` turns it into a soft hyphen and strips it from the accessible label.

Gold keywords (`*like this*` in a `SplitHeading`) are no longer flat gold: they carry a metallic gradient clipped to the text, and `src/components/motion/Shine.tsx` drives `--shine` (0 when the heading enters at the bottom of the viewport, 1 as it leaves the top) so the highlight sweeps across as the visitor scrolls. Each word in a run is offset by `--k` so the light reaches later words later. Headings inside the pinned hero derive `--shine` from the hero's own `--p` instead. Reduced motion holds a static sheen. Light sections use a darker gradient so the words stay readable on ash and fog. Silver keywords work the same way with `~like this~` (used on the prices heading: gold on "gold", silver on "silver").

## The section-by-section walk-through (from 6 October 2026)

Shaun is choosing every section of every page from three directions, shown to him as labelled videos. Each decision is recorded in `.21st/design.json` (with the design tokens and rules the options must keep) and here.

- **Round 1:** Header B "Shop bar", Menu B "Full-screen editorial", Hero B "Film + corner microtype".
- **Round 2:** under the hero, a statement that lights up word by word as it scrolls ("We sell gold, precious metals and watches…", `sections/Statement.tsx`), replacing the velocity marquee; "Shop by collection" as a bento with watches as the big tile (`sections/Collections.tsx`); and a new **watch shop**: all 17 watches as product cards running across the screen as a marquee (`sections/WatchShop.tsx`, `motion/CardMarquee.tsx`). Each card asks for a price by enquiry; nothing is priced online. The marquee pauses on hover, on keyboard focus, off screen and with its Pause button, and stands still under reduced motion. Its second, looping copy of the cards is `inert`, so keyboards and screen readers meet each watch once.
- **Round 3:** What we do stays as the three tiles and the gold line stays as the slim strip. The page black is now rich black `#0b0b0c` (was jet `#070707`): it is the ground of the product photos, so the cards sit into the page instead of showing as boxes. Product photos and cards have rounder corners (18px cards, the photo inset in a 6px bezel), so nothing reads as a sharp square. Reviews is still open: the spotlight shows by default and the two other options stay on the switch until Shaun picks.
- **Round 4:** the reels are a 3D carousel (after the Framer VideoCarousel Shaun linked): the front reel plays muted while it is on screen, the cards follow a finger or the mouse when dragged, the dots and arrow keys move it too, and an Instagram link sits under it on the right. There are no arrow buttons. Only the front card loads a video. Visit keeps the open-now line and the week as seven cells (today marked), with the black-and-white map on the left at the same height. The footer is quiet and centred with S&L's stacked logo. The header now uses the stacked logo too (crown and diamond over "S&L jewellers"), in a slightly taller bar. The menu was rebuilt after a reference Shaun sent: every page as one large centred word, with that item's photo following the pointer on a computer, and the address, hours, phone and icons under a hairline. The header's Enquire is being chosen from three options (`?v=enquire:a|b|c`).
- **Round 5 (in progress):** the header is the centred crest: the strip, then MENU and a two-line mark on the left, the stacked logo in the middle and a hairline Enquire pill on the right. The What we do photos now show S&L's own stock Rolexes (the gold Submariner on the Cuban chain; the GMT-Master II 'Bruce Wayne' in its green box), staged with Higgsfield from the shop's product photos. The menu drops from the top over everything; its design is being redone (Shaun: not the reference's centred list, which another client already has).
- **Round 6:** the hero's "(01) Gold, watches and bullion…" line now sits bottom left, lined up with MENU. The reviews were all called generic; of three new directions Shaun picked **stacked stories** (`sections/Reviews.tsx`, `ReviewsStack.tsx`): five reviews on cards that pin under the header and stack as the page scrolls, each beside a picture made for it from S&L's own stock photos (a scale of broken gold, the engraved bracelet in a gift box, three watches in a lit case, a chain laid on a velvet pad, the horseshoe ring on a counter tray), so none repeats a photo used elsewhere. The note under the cards says they are illustrations, not the reviewers' pieces. The open-now chip is white with a green dot while open. Rings and Pendants, which have nothing listed, now show an illustrated cover on wide tiles (`cover` in `content/collections.json`); swap in a real photo once S&L list a piece.
- **7 Oct 2026, later:** the phone call bar (Call / WhatsApp / Directions fixed to the foot of every page) is gone, on Shaun's instruction ("literally remove it"); the header's Enquire, the enquiry page and the footer still carry every way to reach the shop. Buttons are **black glass with Oyster steel** (Shaun's pick after two rounds of three): the main action is polished steel with black type, everything else black glass on a steel rim that lights up under the cursor, 44px and 40px tall. Controls are black and white, no gold: Add to basket, the form's subject pills, Send, the switches, the basket badge, the 360° switch, the card and tile arrows (Shaun: "get rid of the gold accents on buttons"). Gold stays in the type, as in "Watches in *the case.*", and in the numerals and eyebrows. The scroll no longer jerks over the watch rail (it had data-lenis-prevent, which handed the wheel back to the browser mid-scroll), and the menu's Services photo has its own sharp portrait crop.
- **7 Oct 2026, evening:** every product now has a new picture, the whole piece inside the frame on plain black with no grey glow behind it (Shaun: "dont let them extend off the top and bottom"). Watches are studio images from Higgsfield: the eight confirmed references from the maker's own images (`studio: true`), the other nine re-shot from S&L's own photo of that watch (`studio: "own"`), and each product page says which. Bracelets, chains, bullion and collectibles keep S&L's own photographs, cut out and re-framed, because an AI re-shoot would change engraving, link patterns and the serial numbers on assay cards. Watch 05 (the GMT-Master II 126710GRNR) has a 360° view: our own Blender model, 1.3 MB (`public/models/`). In the browser the crystal is a thin clear glaze rather than real refraction, which blurred the dial in WebGL. Images and the model are recorded in `assets/SOURCES.md`.
- **7 Oct 2026, night:** the bracelets and chains are now Higgsfield studio re-shoots of S&L's own photos too (Shaun: "bracelets and chains with Higgsfield too"), each checked link for link against the photo; bullion and collectibles keep their re-framed photographs because of the printed serials. **Round 8, open:** the product page's details, which Shaun found unprofessional ("there's just so much ... categorise it"), are grouped (this piece, the maker's case / movement / bracelet, buying, the notes about the pictures) and shown three ways on `?v=pdd:a|b|c`: A tabs, B a spec sheet beside a sticky "at a glance" card, C a numbered accordion. The listing title is split into labelled rows (dial, bezel, bracelet, metal, what it comes with) and the headline figures come out of the maker's specification or S&L's own title (`src/lib/piece-details.ts`). When one is picked, delete the other two and the old `Facts` / `Spec` in `product-parts.tsx`. Shaun picked **A, tabs**; B, C and the old rows are gone.
- **Shop all** (`/pieces`) is now every listed piece in one grid with a chip per category (`ShopAll.tsx`, `?cat=<slug>`), replacing the category-tile page and its three options. The category pages lost the lead photo beside their name. Type and spacing came down site-wide (Shaun: "most of the text on this whole website is huge"): big headings about a third smaller, section padding about a third tighter, body 16px. The enquiry now brings the basket's pieces along however the visitor arrives, and the old hover fills that turned "See all pieces" white under white text are gone.
- **Round 8, picked** (Shaun: "Use footer A. Use reviews A. For services, use B."). Footer **A, Wordmark** (after footer.design's typographic styles): a line about the shop and three link columns, then "S&L Jewellers" set the full width of the page, then the legal lines; `components/Footer.tsx`. Reviews **A, Rail**: above the footer on every page but the home page and the privacy policy, the cards drift left and stop under the pointer or focus, and hold still under reduced motion; `components/ReviewsBand.tsx`. Services **B, Sticky picture**: on a desktop the picture holds still and changes as the list scrolls, and on a phone each service carries its own picture; `components/sections/ServicesSticky.tsx`, with two new service pictures for part-exchange and delivery. The other options, `LocalTime.tsx` and their styles are gone; `foot`, `rv` and `svc` are off the switch.
- **8 Oct 2026:** the menu is the **dial** (Shaun: "do the dial version of the menu"; A Split stage and B Cinema are gone), and the footer opens with S&L's stacked logo where the line "Gold, watches and bullion, bought and sold over the counter" was (Shaun: "change this and put the logo"). On /about the still of the S&L mark now sits exactly where the 3D mark's first frame lands (within 2 px from phone to 1920 wide), so nothing jumps when the 3D fades in (`.amark-poster` in `globals.css`; if `cameraZ`, `cameraZPortrait` or `offsetY` change in `AboutMark.tsx`, re-measure). The name at the foot of every page is **cropped and rising** (Shaun's pick, after he turned down three treatments, struck, in gold and hallmark, as "terrible"): plain white Archivo the full width of the page, cut off by the page's bottom edge so the page ends on it, the letters rising in one after another as it comes into view; gold only on the ampersand; on a phone it breaks after "S&L" to be set larger. The legal lines now sit above it (`FooterWord.tsx`). The FAQ is nine questions in three topics (Buying, Selling, Repairs & made to order; merged from fifteen in S&L's own confirmed wording, `content/faq.json`), without the stray chain photo, laid out as an **index** (Shaun's pick B of three; `components/pages/FaqIndex.tsx`): every question listed on the left, the chosen answer set large on the right with previous and next; on a phone the answer opens under its question. **Product specifications** (Shaun: "get information on every product ... dont do it if you dont have the specific product"): 19 pieces identified exactly now carry their maker's specification on the product page's Specification tab, from `content/reference-specs.json` (a watch through `reference`, anything else through `spec`); each says whose wording it is (the maker, an official Rolex retailer, a dealer or trade press where the maker's page refuses automated requests, or the US statute for the Silver Eagle). The other 40 are left without: unconfirmed watch references, chains and bracelets with no maker, and bars or cards whose maker or weight can't be read. Four titles were corrected on the way (02 and 09 are 5 oz silver coins in a World Cup ticket box, not gold bar cards; 23 is PAMP's 5 g Barbie gold coin; 22 is Rolex's "Datejust II"), with redirects from their old addresses in `next.config.ts`. **Phone pass** (block "Phone pass" at the end of `globals.css`): the collection tiles no longer overlap (their 220px minimum height had made them wider than their column, hiding the arrows); What we do swipes across with the next card showing instead of stacking three screens tall; product cards drop "Ask for a price" on a phone; the product page drops the huge name behind the piece on a phone. **The hero hands off as a sheet** (Shaun: "should the hero be scroll craft?", then "use hero b" of three): the film stays put while the statement slides up over it with rounded top corners, the film sinking back and darkening underneath (`motion/HeroScroll.tsx`, block "Hero hand-off" in `globals.css`); Into the frame and Loupe are gone. Reduced motion keeps the still hero with no hand-off. The header turns to glass when the statement reaches it (`[data-hero-edge]`). **Shop by collection is the display case** (Shaun: "use display C", of three on `?v=coll`; he had asked "do we change it or should we keep it like that?"): one row of trays to swipe across, each a photo, the category's name and how many are in the case, with arrows and a line of progress on a computer (`sections/Collections.tsx`, `sections/collections/CollCase.tsx`; the order and pictures in `sections/collections/data.ts`). Categories with pieces come first, then Rings and Pendants on their illustrated covers, captioned "Ask what is in". The watches tray shows the Day-Date, since the watch rail below opens with the GMT. The refined grid, the index and the old bento, with their styles, are gone.
- **8 Oct 2026, phone and desktop pass** (Shaun: "optimise the whole mobile version and desktop make sure all buttons work perfectly ... nothing overlaps ... mobile should feel nice like desktop does"). Checked by script and by eye at 360, 390, 768 and 1440: every internal link on all 141 pages resolves (283 targets, no 404s or missing anchors), every control was pressed and checked (menu and each of its links, basket, Add to basket, the collection arrows, the watch rail's Pause, the reels, the product tabs, Photo/360°, Ask about this piece, the enquiry form and its piece picker, the FAQ), and no page scrolls sideways or has overlapping or clipped text. Fixed: the closed basket drawer's shadow had been darkening the right ~100px of every page; on a touch screen every control is now at least 44px (block "Touch pass" in `globals.css`), footer links get full-height rows; the phone header keeps the logo centred with the basket beside ENQUIRE; the review cards fit their quotes on small phones (the picture takes the height that is left); product cards line up their "View" row; the product tabs use short names on a phone (Piece, Spec, Buying, Pictures) and Add to basket runs the full width; the enquiry subjects sit two across, the reply ways three across; FAQ rows show + / × on a phone and fold again on a second tap; empty categories offer "Ask what is in" and a call; tall 3D pieces (the bars) are held to 70% of the stage instead of running under the name bar; the gold table's columns line up; the About hero, hero pause and watch rail Pause sit on the page margin; the header glass is more solid; the privacy page keeps a reading width; the repeated brands note under Shop by collection is gone (it stays under the watch rail). Block "Polish pass" in `globals.css` holds the rest, each rule saying what was off. Left as chosen: the green open dot, the cropped footer name, the reviewer Google lists as "Me". The red TODO badges (gold price feed, opening hours) are the launch checklist and hide in launch mode.
- **8 Oct 2026, later:** Shop by collection drags with the mouse (Shaun: "you should be able to just slide your mouse rather than having to click the arrows"): grab the row, it glides on and settles on a tray, and a drag never opens a tray (`CollCase.tsx`); the arrows stay. The Instagram link under the reels has no arrow and no underline (Shaun asked about both; the icon already says where it goes, and gold stays off links).
- **8 Oct 2026, watches named and specified:** every watch now says its brand and model (Shaun: "make sure it says the specific watch, the specific brand ... the case millimeters, the caliber, the power reserve, if it's the water resistant"). The maker shows above the name on the card and in the product page's heading (`brandOf`, from the reference's specification), and every watch's Specification tab and headline figures (case, calibre, power reserve, water resistance) come from `content/reference-specs.json`. The eight watches whose reference was read off S&L's photos (07, 10, 28, 31, 33, 47, 51, 54) carry `referenceFrom: "photo"`: the Reference row and the specification say to ask the shop to confirm it. Twelve watches were retitled from descriptions ("Gold Diver", "Steel Chronograph", "Square Steel Watch") to the model printed on the dial ("Submariner Date", "Cosmograph Daytona", "Santos de Cartier"); their old addresses redirect in `next.config.ts`. Discontinued references (16520, 16233) use Rolex Certified Pre-Owned wording and say so. Sources in `assets/SOURCES.md`.
- **8 Oct 2026, the 360° watches made more real** (Shaun: "the strap ... looks too fake ... get it as realistic looking as you can for everything"): every watch model was rebuilt in Blender with curved links and rounded, light-catching joints, real Oystersteel reflectance (the old steel read as glass), brushed satin and baked shading in the gaps between links, and the viewer lights them in a near-black studio of narrow strip lights with a soft overhead fill, like catalogue photography (`lib/watch-viewer.ts`, `scripts/3d/README.md`). Files are `public/models/*.2026-10-08b.glb`, 2.2 to 4.2 MB.
- **8 Oct 2026, evening:** **the product page, three ways** on `?v=pdp:a|b|c` (Shaun: "add the details on the left and right hand side of the actual product image / 360 thing", then for a computer "the product to one side and then the add to basket ... an e-commerce kind of vibe"; `components/pages/ProductViews.tsx`). **A Shop** (the default): the piece large on the left with thumbnails under it, front, back where there is one and 360° (`Gallery.tsx`), and on the right, kept in view as you scroll, the maker, the name, Add to basket and Ask about this piece, three lines on how buying works and the headline figures. **B Flanked**: the name and buttons on the left of the piece, the figures stacked on the right. **C Callouts**: the figures either side of the piece on hairline leaders, the name huge and faint behind. A piece with no figures shows its own details beside it, and one with none at all is topped up with how the shop sells (see it at the shop, weighed and priced in front of you, stock moves daily). On a phone all three are one clean column (Shaun: "this is so squished"): the crumbs, the piece with Photo / 360° under it rather than over it, the name, the figures two by two, then the buttons; the bar at the foot of the screen only appears once those buttons have scrolled away (`StickyBuy.tsx`). The figures no longer repeat in the "This piece" tab. When Shaun picks, delete the other two and their blocks in `globals.css` (block "Product page, three layouts"). **Header:** ENQUIRE is a slimmer pill on every screen (Shaun: "it shouldn't be that large") and on a phone the basket sits beside the menu, away from the logo (Shaun: "the basket is so close to the logo"). **Reviews on a phone** are a row of cards to swipe across instead of the stacking cards, which read as a glitch on a phone (Shaun: "why is this glitching"); the stack stays from 768px. The links to Facebook, Google and leaving a review sit beside the figures at the top, and the note under the cards is shorter. **"See all pieces"** is centred under Shop by collection. **Visit** has no Get directions button: the map's own "Open in Maps" does the same (Shaun: "do we even need this?"); /about keeps its one, having no map. **About** is cut to three short lines and a sub-heading (Shaun: "far too much writing"; `content/about.md`), the brands line as small print. **Footer:** on a computer the S&L mark turns in 3D in the left-hand column (Shaun: "instead of the static logo, add the 3D model so it fits in the left"; `FooterMark.tsx`); phones keep the flat logo.
- **7 Oct 2026, late:** every watch card now matches the GMT-Master II's (Shaun: "make it look exactly like the GMT Master 2, with how much is shown"): each watch re-shot in that framing and set by `scripts/watch-card.mjs` in `CARD_MODE=catalogue`, which copies the GMT card's own measurements (case 618 px wide, centred 714 px down, bracelet cut straight at 135 and 1365 on the 1200x1500 card). A new watch goes through the same mode. The footer's social logos lost their ring ("don't put a circle around them").
- **3D models:** use Blender (the Higgsfield Bridge) or Higgsfield's 3D Jutsu, not Higgsfield's image-to-3D generators (Tripo, Hunyuan3D) (Shaun, 7 Oct 2026).
- **3D spin on product pages (7-8 Oct 2026):** Shaun wants every piece to spin on its product page, built in Blender ("use Blender specifically"; 3D Jutsu is Blender hosted by Higgsfield, but it can't take our own photos as textures and caps each step at five minutes, so the models are built with Blender here). Done: the Root Beer GMT (watches 16 and 39), from the same build as watch 05's model, the three cast silver bars (00, 06, 41), whose fronts are S&L's own photos on a modelled bar, the three Submariners (10, 24, 49), the five chains with backs (32, 44, 46, 53, 56) the Stars & Bars bracelet (11), the Yacht-Master (57), the Datejust II (22) the two Wimbledon Datejusts (07 olive, as its photo shows; 54 slate) on a new Jubilee bracelet, the ivory Roman Datejust 36 (51), the stone-set green Datejust (47), the pavé Day-Date (28 and 31 share one model of the 228349RBR) and the Daytona (33). Every piece whose back can be shown honestly now spins (24 of them). Not modelled: the Cartier Santos (36) and the Royal Pop (13), and every piece without a back image. The build scripts are in `scripts/3d/` with a README. Only pieces whose backs can be shown honestly get a model (a spin shows every side). **Since 8 Oct 2026 only the watches turn** (Shaun: "we only use the 360 like models for the watches rather than jewelry"): the chains, the bracelet and the bars show their photographs, and their models are gone from `public/models/`.
- **7 Oct 2026, night:** a product card fades to the piece's back when the pointer is over it, as a shop's second picture does (Shaun: "when you hover it, it shows another image"), on Shop all, the category grids, the home watch rail and "More from". It is the `back` image in `content/collections.json`, a card in the same framing as the front (`WatchCard.tsx`, `.pcard-back`). A brief version that turned the piece over on the product page itself was taken out ("I don't mean when you're on that actual product page"); the product page is for the 3D spin. Backs exist for 15 watches, five chains, one bracelet and three cast silver bars. They are studio images, researched per piece, and each product page says so. There are none for pieces whose backs carry something particular to them: serials, assay certificates, graded holders, the Cartier's engraved caseback, game codes on the collectibles. There are also none for pieces whose backs we couldn't find out, such as engraved links that may or may not be engraved behind. `assets/SOURCES.md` lists both groups; S&L's own photos are the way to add them. Watch 05's 3D model now stops drawing while its photo is showing (it used to spin on, unseen, under the photo).
- **Round 7 (in progress):** the shop pages. Every piece now has its own product page (`app/pieces/[slug]/[piece]`, address from `lib/piece-url.ts`), so a card never jumps straight to the enquiry form. Pieces go into an **enquiry basket** (the bag in the header): kept in the visitor's own browser, no prices and nothing to pay; "Enquire about these" opens the enquiry form with every piece listed and filled in. The product page is the **stage** (Shaun's pick): the piece on a black stage under its name, with a bar holding "Add to basket" that sticks to the foot of the screen (since 8 Oct 2026 three layouts on `?v=pdp`, `components/pages/ProductViews.tsx`; see above). The category pages are **hero and case** (Shaun's pick A of three, 8 Oct 2026; `components/pages/CategoryHeroGrid.tsx`): the name with its line and count over a hairline, then the pieces as product cards; an empty category says the case changes daily (`CategoryEmpty.tsx`). Showcase rows and the stock list are gone. The enquiry page is **at the counter** (Shaun's pick A): the shop's own photo with the open-now chip and the four ways to reach them beside the form (`components/pages/EnquiryLayouts.tsx`). The form is **one regular contact form** (Shaun, 8 Oct 2026: "lets use a regular contact form", in place of the chat with the counter, which asked one thing at a time and could ask the wrong follow-up): what it is about (now including "Booking a visit"), which of S&L's pieces (tap them from a searchable grid of photos, or carry on if it isn't on the site), the message (its label follows the subject), photos, name, phone, email, how to reply and the consent switch, all on one page (`components/enquiry/EnquiryForm.tsx`, the grid in `PiecePicker.tsx`). The basket and a product page's "Ask about this piece now" (`?piece=<id>`) arrive with the piece already chosen. A failed check puts focus on the first answer to fix; once sent, the confirmation comes into view. It runs on one hook, `useEnquiry.ts`, which holds the values, the same field checks as the server, Turnstile, the honeypot and the POST to `/api/enquiry`. Without the mail settings the API still answers "could not send" and the form says so; it never pretends to have sent.

While a round is open, its options ship side by side and an inline script in `src/app/layout.tsx` shows one per section from the address bar, for example `/?v=marquee:b,collections:c` (remembered for the tab; `?v=reset` clears it). Without the parameter every section shows its current version, so the site never changes for visitors. Options live in wrappers marked `data-x="section" data-x-dir="a|b|c"`. The losers are deleted once Shaun picks, and the switch itself goes when the walk-through ends.

## Homepage changes of 6 October 2026 (round 7)

- **No stars anywhere.** The section starfield (`Starfield.tsx`), the twinkle over product cards on hover and the twelve gold sparkles printed into each of the 59 product photos are all gone. The photos were cleaned in place: the sparkles were drawn by `scripts/product-card.mjs` at positions fixed by each photo's index number, so each one was lifted out exactly against a re-render of the plain background, leaving the product untouched. The script no longer draws them.
- **"Shop by collection"** replaces "Our pieces" as the category heading.
- **The marquee** under the hero is set heavier (weight 650, a 1.4px outline on the second row); its edges fall away to near-black over the outer third and blur; the gold diamonds between phrases are gone.
- **What we do** has three new product shots (see `assets/SOURCES.md`).
- **Visit**: "Visit the shop"; the address line under the heading and the contact column (phone, WhatsApp, email) are gone; the hours list every day; the map is black and white (`filter: grayscale(1) invert(0.92) contrast(1.08)` on `.map-tray iframe`).
- **Services** ("Bring it in. Get a price.") left the home page for its own page, `/services` (in the header and the sitemap; the old `/services` → `/#services` redirect is gone). The actions are fitted metallic-black pills with the arrow in a gold disc (`.plan-cta`, `.plan-disc`); the cards run 1, 2, then 3 + 2 columns, never five across.

## Category pages: adding more stock

Every category in "What we sell" has its own page at `/pieces/<slug>`, and the cards on the home page open it. The pages are generated from `content/collections.json`, so adding stock is a content edit with no code change.

To add a piece, drop the photo into `public/images`, record where it came from in `assets/SOURCES.md`, then append to that category's `pieces` array:

```json
{ "id": "chains-60-a1b2c3d4", "title": "9ct Curb Chain, 60g", "image": "/images/pieces/chains/60-a1b2c3d4.jpg",
  "alt": "A 9 carat gold curb chain on a black tray", "width": 1200, "height": 1500,
  "note": "9ct, 60g" }
```

The `id` must start with the category's slug and a dash (`chains-…`, `watches-…`), and its last part must be unique: the piece's own page lives at `/pieces/<category>/<title>-<last part of the id>` (`src/lib/piece-url.ts`), so changing a title changes that address. Put the name before the first comma of the title and the details after it; the cards and the product page split it there. `note` is optional and is the place for a weight, a carat or a condition. Every piece gets its own product page with "Add to basket" and "Ask about this piece now". An empty `pieces` array is the normal state: the page then says nothing is listed and invites an enquiry, rather than pretending to a catalogue. Removing a category from `collections.json` removes its page, its sitemap entry and its card together, and the old URL then 404s.

## Built to need no upkeep

This is a build, not a retainer, so nothing on the site depends on someone feeding it:

- **Category pages** (`/pieces/<slug>`) read as finished with no stock listed. The `pieces` array on each category in `content/collections.json` is optional; fill it and a grid appears above the copy, leave it empty and the page still makes sense. Do not build a catalogue here unless someone is going to keep it current.
- **Gold and silver prices** refresh themselves daily from the feed. If the goldapi allowance runs out the table falls back to "ask" rather than showing a stale number.
- **Opening hours, address and phone** are static in `content/business.json` and only change when the shop does.
- **Review figures go stale on their own.** `content/reviews.json` holds 5.0 from 15 on Google and 59 recommendations on Facebook, and the Reviews heading spells "Fifty-nine" out in words (`HEADING` in `src/components/sections/Reviews.tsx`). Those numbers only grow, so they will drift low over time. Worth a check once a year; nothing breaks if they are not.
- **No database, no queue, no cron.** Nothing on the server holds state between requests. There is one serverless function, it sends an email, and that is the whole backend. Nothing can fill up, fall behind or need clearing out.
- **Every outside service is optional except the hosting**, and each one fails to a sensible, honest fallback rather than to a broken page. See [What the site depends on](#what-the-site-depends-on).

## Header

The **centred crest** (`src/components/Header.tsx`). A 32px strip (open now, from the real hours; the address; the phone) sits over an 84px bar (68px on phones): MENU and the menu mark on the left, S&L's own stacked logo (`public/logo-lockup-400.webp`: the crown and diamond over "S&L jewellers") in the middle, and a hairline Enquire pill on the right (the centred crest, Shaun's pick of three redesigns on 6 Oct 2026). The header is sticky at `top: -32px`, so the strip scrolls away and the bar stays; it is 116px tall (100px on phones), which is `--hdr` in `globals.css` (the hero film is pulled up by that much to run under it). Over the film the bar is clear; once the film has scrolled past it turns to glass (blur plus a 70% black), or solid black for visitors with Reduce transparency on (`MotionRoot` writes `data-scrolled`, comparing the film's bottom edge with the header's). Note for `globals.css`: write `backdrop-filter` only, never a hand-written `-webkit-backdrop-filter` beside it. The CSS minifier merges the pair and keeps only the prefixed one, which silently removes the blur in every browser.

## Menu

Full screen, with a watch dial in the middle (Shaun's pick C of three on 8 Oct 2026; `src/components/menu/`). The button in the header sets `data-menu-open` on `<html>` (`menu-state.ts`); `SiteMenu.tsx` draws the curtain, which drops from the top over everything with its own bar (the stacked logo, a close button), and `MenuDial.tsx` draws the body: the six entries sit round a fine dial like hour markers, a gold hand swings to the one under the pointer or keyboard focus, its photo shows in the dial's face and its line underneath. Phones get the six as a centred list. Under a hairline: the address, the week's hours (from `content/business.json`) and the three social icons. Each entry's photo and line are set in `ITEMS` at the top of `SiteMenu.tsx`; there must be six, one every 60 degrees. `MenuController.tsx` moves focus into the menu when it opens and back to the button when it closes, keeps Tab inside it, closes it on Escape, on a link and on a route change, and pauses smooth scrolling while it is open. The page behind does not scroll.

## Gold that reacts to the cursor

The "Our pieces" cards use `src/components/motion/Glint.tsx`: the photo saturates a touch and scales, a sheen sweeps across once when the cursor arrives, and the card tilts a few degrees toward the pointer. All of it is CSS under `.glint` in `globals.css`; the component only writes `--mx/--my/--rx/--ry` from pointer moves, rAF-throttled, on mouse pointers. Touch and reduced motion get the plain card. To use it elsewhere, replace a card's `Link` with `Glint` (same `href` and `className`).

## The hero film

One screen of film under the clear header: Shaun's clip of a hand reaching to the camera and ending on the rings, as a **boomerang loop** (forward then back, 7.75 s, so it loops with no cut). Files in `public/videos/hero/`: AV1 WebM for every browser that plays it (Chrome, Firefox, Edge, recent Safari) and H.264 MP4 for the rest; a 16:9 cut at 1080p and 1440p and a 9:16 crop for portrait screens. `src/components/HeroVideo.tsx` picks the file, starts it after the page has loaded, pauses it off screen and in a hidden tab, and shows a pause button (required for anything moving longer than five seconds). Visitors with reduced motion or Save-Data get a still instead (the clip's last frame, the close-up of the rings); everyone sees the first frame as the poster until the film is playing. The hero carries no words; the page's h1 is there for screen readers and search.

To change the film: encode from the master with ffmpeg as recorded in `assets/SOURCES.md` (boomerang, AV1 CRF 28 / H.264 CRF 20-22, SSIM 0.987-0.992 against the master), keep the file names, and replace the posters in `public/images/hero/`. The old three.js mark (`HeroMark.tsx`, `src/lib/sl-mark.js`) is still in the repo, unused, until the film is signed off.

Small corner type sits over the film (round 1 pick; `src/components/sections/HeroCorners.tsx`): what the shop does (top left), the address (bottom left), open now (bottom right, beside the pause button), the categories running up the right edge and a scroll cue (desktop). Phones keep the first three.

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
