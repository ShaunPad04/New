# PRODUCT.md

Derived from `CLAUDE.md`, which is this project's source of truth and outranks
anything in this file. Written 2026-09-14 so the design skills have context to
load; it is a summary, not a second authority. Where the two disagree,
CLAUDE.md wins.

## Register

**brand** — this is a studio's own marketing site. The design IS the product.
It is the primary proof that the studio can do the work it sells.

## Product purpose

The public site for **Black Line Agency**, a two-person web design and build
studio. It exists to win enquiries from businesses evaluating an agency. It
does not go live until the founders have their first few clients.

Services sold: web design & build, UI/UX design, Google SEO management, GEO,
email marketing, SMS marketing, managed hosting, ongoing maintenance.

## Users

Business owners and marketing leads choosing a web studio. Two shapes:

- **Sole traders and new starts** evaluating whether a real studio is
  affordable. Price-sensitive, need to see the band quickly.
- **Established brands and e-commerce** evaluating whether a two-person studio
  is credible at £3k–£7.5k. They are looking for evidence, not adjectives.

Both arrive sceptical. The site's job is to be self-evidently better built
than the competition, because that is the only claim it can prove on sight.

## Brand

- **Founders:** Bradley Hoxha and Shaun Padley, both 22. Founder-led, no
  account layer — that is the positioning, not a limitation.
- **Identity:** black and white. The business card is silver foil on matte
  black.
- **Mark:** "™" (`BRAND_MARK`). Not "®" — the mark is unregistered and "®"
  would be a criminal offence in the UK.

## Tone

Plain, specific, and unhedged. Short declaratives. Claims are either measured
or absent. The copy never says "perfect", never says "secure", never claims
conformance where only a score exists, and never promises rankings or AI
citations, because those are third parties' decisions.

**The voice uses em dashes heavily and deliberately.** The generic skill law
banning them does NOT apply here; the client's approved copy is full of them
and rewriting it is out of scope for any design task.

## Anti-references

- `blacklineagencypreview.vercel.app` is the client's own portfolio and is
  explicitly **not** a design reference.
- Bootstrap-startup layouts, generic 1px grey borders, default Tailwind
  shadows and rounded-card grids.
- Inter, Roboto, Arial, Open Sans, Helvetica — banned outright, including in
  fallback stacks.
- Stock-photo hero layouts.
- Invented testimonials, client names, outcome figures or ratings. Illegal
  under UK CPUTR/DMCCA and the US FTC Act, and gated behind `*_VERIFIED`
  flags in code.

## Strategic principles

1. **Nothing unverified ships.** `pnpm verify` hard-fails an indexable build
   while any content-integrity flag is false.
2. **Measurements, not promises.** Where a number appears it was measured on
   this page and a prospect can reproduce it.
3. **The hero's quality is non-negotiable.** Client-set priority order:
   visual quality > scrub smoothness > loading > Lighthouse. Frames are never
   downscaled to buy a score. Performance is bought by changing WHEN bytes
   move, not WHICH.
4. **Zero cookies, zero storage, zero third-party requests.** Audited and
   asserted by the test suite. This is why there is no cookie banner.
5. **Desktop compositions the client has approved are not changed to solve a
   mobile problem.** Mobile fixes are scoped below the breakpoint.

## Conflicts with the generic design laws

These skill defaults are overridden by locked project decisions:

- "Never use #000 or #fff" — the monochrome `ink-0`→`ink-1000` scale is the
  entire palette and is locked. `ink-600` is pinned at `#808080`, the lowest
  value clearing WCAG AA on `ink-0`. Do not darken it.
- "No em dashes" — see Tone above.
- "Use OKLCH" — the palette predates this and is locked.
