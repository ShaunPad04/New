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
| Hero — cliffside residence, 1920×1080, 15s, 24fps, scrubbed by scroll | `hero-scrub.mp4` H.264 10.5MB | `hero-scrub-m.mp4` H.264 1440×810 4.4MB |
| Tile — pool house, 1920×1080, 10s, 30fps, autoplay loop | `highlight-hevc.mp4` 8.4MB (Safari / iPhone / Mac), `highlight.mp4` H.264 8.4MB | `highlight-m.mp4` H.264 1440×810 4.7MB |

Every encode is scored against its source with VMAF before it ships (anything
above 97 is visually transparent). The hero scores **99.88** against its
master and **95.62** on phones; the tile scores 96.0 (H.264), 97.2 (HEVC) and
89.1 (phones) against the ideal 1080p rendition of the 4K master.

**Which film goes where.** There are two, and they are not interchangeable:

- **Hero — the cliffside residence** (`7317fb4f…mp4`, 1920×1080 at
  5.17 Mb/s): doors open, the camera travels through the house and out to the
  infinity pool. This is the **clean plate** — the client replaced an earlier
  2.24 Mb/s export that had "NEW HOME AGENTS" and section captions burned
  into the footage. Same camera move, 2.3× the bitrate, and tagged
  `tv`/`bt709` so it needs no full-range conversion and none of the tonal
  round-trip the web exports required.

  Because the film no longer carries titling **and** the header stays hidden
  until the reader scrolls or reaches for it, the opening screen shows no
  agency name at all. That is the client's stated preference, not an
  oversight — do not "fix" it by adding hero copy.
- **Tile — the pool house at dusk** (`Real Estate video, 4k.mp4`, 3840×2160 at
  24.2 Mb/s): a suburban house across a rectangular pool. Different footage,
  different property.

They were swapped once by mistake, so state it plainly: the 4K master is the
**tile's** source, not the hero's.

The hero ran on a 2.24 Mb/s export for several rounds, which was the real
ceiling on its sharpness — the delivery encode was already spending 2.5× the
master's bitrate and scoring 99.9 against it, so no encoding change could
recover detail the source did not carry. The 5.17 Mb/s export replaced it.
The lesson generalises: when a film looks soft, **check the master's data
rate before touching the encoder**. Encodes use `-preset veryslow -tune film` (x264) and `-preset slow`
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

## Measured baseline

Recorded 2026-09-12, preview build, 3 Lighthouse samples, after the hero was
rebuilt from the 4K master and the two films were swapped.

| | median | spread |
| --- | --- | --- |
| Performance | 83 | 83–83 |
| Accessibility | 100 | 100–100 |
| Best practices | 100 | 100–100 |
| SEO | 66 | 66–66 (deliberate `noindex` on preview) |
| FCP | 907ms | 906–912 |
| LCP | 4661ms | 4660–4668 |
| TBT | 55ms | 48–59 |
| CLS | 0 | 0–0 |

Playwright: 87 passed, 3 skipped, across 390/768/1440.

LCP is the hero poster under Lighthouse's 4× CPU and network throttling, and
it is the number to watch when a film changes: it moved 4.88s → 5.11s when the
hero gained real detail, then back to 4.66s when the tile's films dropped
~9MB. Run-to-run noise is roughly ±40ms on LCP and ±2 on Performance — never
call anything smaller a regression, and never compare a single run to this
table.

## Going live

1. Set `NEXT_PUBLIC_SITE_URL` to the final domain and `NEXT_PUBLIC_SITE_INDEXABLE=true` **only** on the production deployment. `robots.txt`, the `noindex` meta and the sitemap all key off these.
2. Set `ENQUIRY_WEBHOOK_URL` so the four forms deliver. Until then they show the telephone/email routes.
3. Replace the listing snapshot with the agency's feed (`src/lib/properties.ts`).
4. Supply a vector logo (the footer inverts the PNG) and the privacy policy / complaints procedure PDFs — both currently return 404 on the agency's own server.
5. Vercel: new project with root directory `clients/new-home-agents`.

## When a push does not deploy

Production is `new-home-agents.vercel.app`, built from `main` on the
standalone `ShaunPad04/new-home-agents` repo. The GitHub integration has
stalled at least once: commits land on GitHub, Vercel creates no deployment,
and the live site silently keeps serving the previous build. Nothing in the
push output says so, so **check the deployed artefact, not the push**, e.g.

    curl -sI https://new-home-agents.vercel.app/video/highlight.mp4 | grep -i content-length

against the local file size. To recover without waiting:

1. The branch alias `new-home-agents-git-main-black-line-agency.vercel.app`
   serves the newest build of `main` and updates even when production has
   not. Check there first — the build may exist and simply not be promoted.
2. A deployment can be forced through the Vercel API without a push. It
   lands as a **preview**, so it updates the branch alias only; promoting it
   to production is a dashboard action (Deployments → ⋯ → Promote).
3. The account is on the Hobby plan, which caps deployments at 100 per day
   across **all** its projects — five build off this account, so a day of
   heavy iteration exhausts it. The git integration then goes quiet rather
   than erroring; only the API says why:

       402 payment_required — "Resource is limited - try again in 24 hours
       (more than 100, code: api-deployments-free-per-day)"

   The window is **rolling**, not a clean daily reset: slots free up
   gradually as older deployments age out, so a retry 45 minutes later can
   succeed even though the error quotes 24 hours. Retry occasionally rather
   than waiting a full day, but do not poll — a rejected attempt is wasted
   work, not a freed slot.

**Production only updates from a git push.** The API route
(`create_git_project`) always produces a preview, whatever branch it builds,
so it can never move `new-home-agents.vercel.app` on its own. If production
is stale and the branch alias is correct, the build already exists and the
only remaining step is a human promoting it in the dashboard.
