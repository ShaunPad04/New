# Paul Fox Estate Agents — homepage rebuild

A single-page rebuild of [paul-fox.com](https://www.paul-fox.com/) on the
Marby editorial layout: Next.js 16 (App Router) · React 19 · Tailwind v4 ·
Motion · Lenis. Route `/` only.

Every fact on the page comes from paul-fox.com — the homepage, About Us,
Our Staff, the service pages, the office list and the customer reviews the
agency publishes. Nothing is invented. Copy lives in `src/lib/content.ts`.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint && npm run typecheck
```

## Media

All photographs and the hero video belong to Paul Fox Estate Agents and are
loaded straight from `paul-fox.com` (see `src/lib/assets.ts`). To serve
them from this deployment instead:

```bash
npm run mirror-assets                    # downloads into public/assets/
NEXT_PUBLIC_ASSET_BASE=/assets/ npm run build
```

`public/assets/` is committed once mirrored, so the site no longer depends
on the old WordPress host.

## Page structure

| # | Section | Source on paul-fox.com |
| --- | --- | --- |
| 1 | Fixed nav + full-screen menu | Main navigation |
| 2 | Hero (video, wordmark) | Homepage banner video and intro copy |
| 3 | About + stats | About Us |
| 4 | Sticky service cards: buying, selling, lettings, surveys | Buy / Sell / Lettings / Surveys tiles and their pages |
| 5 | Featured properties | Live residential sales listings (September 2026) |
| 6 | Testimonials carousel | Customer reviews published on the Surveys page |
| 7 | Why choose Paul Fox (glass cards) | "Why choose Paul Fox?" icons + The Guild page |
| 8 | Team ticker | Our Staff profiles |
| 9 | FAQ | Answers drawn from the service pages |
| 10 | Contact form + footer | Contact page, office list, footer links |

The contact form is front-end only (idle → pending → sent). Links other
than `/` (`/about-us`, `/sell`, `/property/<slug>` …) mirror the live
site's URL structure and are plain anchors that will 404 until those pages
exist here.

## Verified

Production build, ESLint and `tsc --noEmit` pass. Headless Chromium checks
at 1440 / 1024 / 390: type scale switches at 1200 and 810, nav caption
inverts over dark sections, service cards stick at 100px (third at 120px on
phone), FAQ is single-open, testimonials advance every 7s, ticker loops at
50px/s with an exact seam, form reaches "Message sent", no horizontal
scroll, no console errors.
