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
| `/` | Homepage — full-bleed film hero (nothing overlaid and no scrim: the client's film carries its own titling, and GSAP ScrollTrigger pins it and scrubs it to the scrollbar), agency figures, scroll statement, three sticky featured listings, services, latest listings, the pool-house film tile that zooms to full screen, reviews, FAQ, closing CTA |
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
and chosen in script (`src/lib/use-mobile.ts`), because Chromium ignores the
`media` attribute on a `<video>`'s `<source>`:

| | Desktop | Phones |
| --- | --- | --- |
| Hero, 1920×1080, 10s, 30fps, scrubbed by scroll | `hero-scrub.mp4` H.264 12.8MB | `hero-scrub-m.mp4` H.264 1440×810 5.1MB |
| Pool house, 1920×1080, 10s, autoplay loop | `highlight-hevc.mp4` 10.7MB (Safari / iPhone / Mac), `highlight.mp4` H.264 12.3MB | `highlight-m.mp4` H.264 2.3MB |

Every encode is scored against its source with VMAF before it ships (anything
above 97 is visually transparent). The hero scores **97.9** against the ideal
1080p rendition of its master; the pool-house encodes sit between 98.4 and
99.8. Encodes use `-preset veryslow -tune film` (x264) and `-preset slow`
(x265) at a fixed CRF: the slower preset buys bytes, the CRF fixes quality.

**Always encode the hero from the 4K master** (`Real Estate video, 4k.mp4`,
3840×2160 at 24.2 Mb/s), never from a "web" export. A run of 1080p web
exports of a different film — 1.7 to 2.2 Mb/s, a tenth of the master's data
rate — was the entire reason the hero once looked soft: the delivery encode
was spending 2.5× the master's bitrate and scoring 99.9 against it, so there
was nothing left to recover. Downscaling 4K to 1080p with lanczos
supersamples, and is visibly sharper than any native 1080p export of the same
shot. The master carries no range tag, so it is already limited range and
needs no full-range conversion — which also removes the tonal round-trip the
web exports required.

The homepage header hides while the film owns the screen and returns when
the reader reaches for it (pointer into the top band, keyboard focus, or the
page rising). Smooth scroll is Lenis, loaded after paint on pointer devices
that have not asked for reduced motion, driven from the GSAP ticker so there
is one rAF loop and the scrub cannot drift behind the page.

**The hero is H.264 only, and carries a keyframe every twelve frames**
(`-g 12`, no B-frames). It is scrubbed by `currentTime` on scroll, and two things make
that smooth: a keyframe never far away, and one seek in flight at a time
(`seekTo` in `hero.tsx`) so scroll ticks never queue up and land in bursts.
Twelve frames is the widest spacing that holds that; six frames costs ~2MB
more for no measurable gain now that seeks are gated. `FPS` in `hero.tsx`
quantises seeks and **must match the shipped film** — it is 30 for the
current master. HEVC is deliberately not offered here — hardware HEVC
decoders flush their pipeline on every seek and the scroll stutters.

`hero-scrub.webm` is the fallback for browsers without H.264, and it is
**1920×1080, the same resolution as the mp4** — a lower-resolution fallback
is a silent downgrade. This matters for verification as much as for visitors:
the preinstalled Chromium has no H.264 at all (`canPlayType('avc1.640028')`
returns empty), so every Playwright screenshot and Lighthouse run measures
the WebM, not the mp4.

## Going live

1. Set `NEXT_PUBLIC_SITE_URL` to the final domain and `NEXT_PUBLIC_SITE_INDEXABLE=true` **only** on the production deployment. `robots.txt`, the `noindex` meta and the sitemap all key off these.
2. Set `ENQUIRY_WEBHOOK_URL` so the four forms deliver. Until then they show the telephone/email routes.
3. Replace the listing snapshot with the agency's feed (`src/lib/properties.ts`).
4. Supply a vector logo (the footer inverts the PNG) and the privacy policy / complaints procedure PDFs — both currently return 404 on the agency's own server.
5. Vercel: new project with root directory `clients/new-home-agents`.
