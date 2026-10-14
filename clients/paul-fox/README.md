# Paul Fox Estate Agents — site rebuild

A rebuild of [paul-fox.com](https://www.paul-fox.com/) on the Marby
editorial layout: Next.js 16 (App Router) · React 19 · Tailwind v4 ·
Motion · Lenis. Homepage plus every inner page the live site links to.

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

The hero film and its poster were supplied by the client and live in
`public/assets/` (`hero.mp4`, 1920×958 H.264, 1.4MB, no audio). Every other
photograph belongs to Paul Fox Estate Agents and is loaded straight from
`paul-fox.com` (see `src/lib/assets.ts` — `asset()` for the homepage set,
`upload()` for the property, staff, office and blog images referenced by
path in `src/data/`). To serve them from this deployment instead:

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
| 10 | Contact form | Contact page |
| 11 | Find your nearest office (map, hours, Google rating) | Each office's Google Business Profile, captured 10 Sep 2026 (`src/lib/offices-map.ts`); rendered on every page above the footer |
| 12 | Footer | Office list, social links, footer links |

## Inner pages

Routes mirror the live site's URL structure so existing links keep working.

| Route | Content source |
| --- | --- |
| `/about-us` | About Us page, plus a timeline from Paul's profile |
| `/our-staff`, `/our-staff/[slug]` | 31 profiles from Our Staff (`src/data/staff.json`), filterable by office |
| `/office/[slug]` | scunthorpe · brigg · barton · epworth · gainsborough · lettings |
| `/search-results` | 60 sales + 12 lettings captured September 2026 (`src/data/properties-*.json`); client-side filters, `?department=residential-lettings` |
| `/property/[slug]` | full photo gallery as listed (2,022 photos across the 72 listings), specs, key features, description, enquiry form, similar homes |
| `/api/chat` | POST — streams the site assistant's reply (`@anthropic-ai/sdk`, prompt built from `src/lib/assistant.ts`). Returns 503 until `ANTHROPIC_API_KEY` is set, and the widget then shows the phone number instead |
| `/sell`, `/valuation-request` | Sell page + valuation form |
| `/letting-agents`, `/letting-agents/lettings-fees` | Lettings page and the full published fee schedule |
| `/rics-chartered-property-surveyors` (+ 15 sub-pages) | Survey department and each service page (`src/data/surveys.json`) |
| `/finest`, `/epcs`, `/mortgage-advice`, `/careers`, `/contact`, `/guild-of-property-professionals` | The matching live pages |
| `/blog`, `/blog/[slug]` | The eight published posts (`src/data/blog.json`); the Premium Conveyancing post links to the original for its final section |
| `/terms-conditions`, `/privacy-policy`, `/cookie-policy`, `/internal-complaints-procedure` | Legal pages verbatim (`src/data/legal.json`) |
| anything else | Branded 404 (`src/app/not-found.tsx`) |

Every form (contact, valuation, survey, mortgage, property enquiry) is
front-end only: idle → pending → sent, nothing is posted anywhere yet. The
live site uses Gravity Forms; an endpoint still needs wiring.

Property data is a snapshot, not a feed. The live site pulls listings from
the agency's CRM (Street.co.uk); replacing the JSON files with a fetch from
that feed is the next step before launch.

## Verified

Production build, ESLint and `tsc --noEmit` pass. Headless Chromium checks
at 1440 / 1024 / 390: type scale switches at 1200 and 810, nav caption
inverts over dark sections, service cards stick at 100px (third at 120px on
phone), FAQ is single-open, testimonials advance every 7s, ticker loops at
50px/s with an exact seam, form reaches "Message sent", no horizontal
scroll, no console errors. All 25 route shapes checked at 1440 and 390:
no horizontal scroll, no console errors, nav colour correct on light and
dark openers; search filters, department tabs, gallery, staff filter and
the enquiry form exercised headlessly. Unknown URLs return HTTP 404.
