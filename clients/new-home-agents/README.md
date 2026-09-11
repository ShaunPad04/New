# New Home Agents — website preview

A complete preview site for [New Home Agents](https://www.newhomeagents.co.uk/)
(nationwide new homes, part exchange and assisted move), recreating the
composition, typography, motion and interaction of the **Homy** Framer
reference (homy.framer.media) in maintainable code.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Motion · pnpm

## Run

```bash
pnpm install
cp .env.example .env.local
pnpm dev            # http://localhost:3000
pnpm build && pnpm start
pnpm verify         # the full gate: data → build → typecheck → lint → Playwright → Lighthouse
```

## Pages

| Route | What it is |
| --- | --- |
| `/` | Homepage — full-bleed film hero (the agency name fades in word by word over the client's film, which GSAP ScrollTrigger pins and scrubs to the scrollbar), agency figures, scroll statement, three sticky featured listings, services, latest listings, the pool-house film tile that zooms to full screen, reviews, FAQ, closing CTA |
| `/properties` | Search and results; filters live in the URL (`?q=&location=&type=&min=&max=&beds=&sort=`) |
| `/properties/[slug]` | Property detail — gallery + lightbox, price, rooms, features, description, floorplan, viewing request, related homes |
| `/new-homes` | New build listings only |
| `/selling` | House to sell — valuation request |
| `/part-exchange-assisted-move` | The two house-builder schemes explained |
| `/mortgages` | New Home Mortgages (verbatim client copy + regulatory line) |
| `/about`, `/register`, `/contact`, `/cookie-policy`, `not-found` | |
| `/api/enquiry` | POST. Returns **501** until `ENQUIRY_WEBHOOK_URL` is set — never fakes success |

## Where things live

- **Business copy** — `src/lib/content.ts` (every fact sourced from newhomeagents.co.uk; source page noted per block)
- **Property data** — `src/data/properties.json`, built from the dated snapshot in `src/data/scrape/` by `pnpm data:build`. See `src/data/README.md` for refreshing and for moving to a live feed.
- **Photography** — `public/images/properties/<id>/` (mirrored from the agency's listing media host by the capture workflow). **The agency's site only links 800–1024px files**, so anything shown wider than that (the hero, the featured stack) is upscaled and reads soft. Re-encoding is already at the quality ceiling (q86); the fix is original photography from the agency or a larger feed. `homepagePicks` in `src/lib/content.ts` chooses which listings appear on the homepage.
- **Brand** — `public/images/brand/` (logo and membership marks as published by the agency)
- **Design reference** — `reference/homy/` (screenshots at 390/768/1440, computed styles, `motion.txt` timings). Not shipped.
- **Capture tooling** — `tools/capture/` + `.github/workflows/nha-capture.yml`

## Films

Both homepage films are the client's own uploads, committed to `public/video/`
in four encodes each and chosen in script (`src/lib/use-mobile.ts`), because
Chromium ignores the `media` attribute on a `<video>`'s `<source>`:

| | HEVC (`hvc1`, Safari / iPhone / Mac) | H.264 | Phones |
| --- | --- | --- | --- |
| Hero, 1920×1080, 15s | `hero-scrub-hevc.mp4` 6.3MB | `hero-scrub.mp4` 9.3MB | `hero-scrub-m-hevc.mp4` 3.0MB / `hero-scrub-m.mp4` 3.6MB |
| Pool house, 1920×1080, 10s | `highlight-hevc.mp4` 10.7MB | `highlight.mp4` 12.3MB | `highlight-m.mp4` 2.3MB |

Every encode is scored against its source with VMAF before it ships; the
table above all sit between 98.4 and 99.8 (anything above 97 is visually
transparent). The hero is scrubbed by scroll, so it carries a keyframe every
12 frames (`-g 12`, no B-frames) for instant seeking — that is most of its
weight. `hero-scrub.webm` is the fallback for browsers without H.264.
Encodes were made with `-preset veryslow -tune film` (x264) and `-preset slow`
(x265) at a fixed CRF: the slower preset buys bytes, the CRF fixes quality.

## Going live

1. Set `NEXT_PUBLIC_SITE_URL` to the final domain and `NEXT_PUBLIC_SITE_INDEXABLE=true` **only** on the production deployment. `robots.txt`, the `noindex` meta and the sitemap all key off these.
2. Set `ENQUIRY_WEBHOOK_URL` so the four forms deliver. Until then they show the telephone/email routes.
3. Replace the listing snapshot with the agency's feed (`src/lib/properties.ts`).
4. Supply a vector logo (the footer inverts the PNG) and the privacy policy / complaints procedure PDFs — both currently return 404 on the agency's own server.
5. Vercel: new project with root directory `clients/new-home-agents`.
