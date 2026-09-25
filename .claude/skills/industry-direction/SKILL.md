---
name: industry-direction
description: Give every client website its own visual world, derived from that client's niche, instead of a house style reused across builds. Use at the START of any client site, redesign or pitch build — "build a site for a golf club", "new client: luxury boutique", "concept site for an estate agent", "design direction for a restaurant" — and before choosing any font, colour, motion or layout for a client. Produces a written Direction Brief (palette, type, motion tempo, imagery, signature moment, components) that is checked for distinctness against previous builds before any code is written. Also use when a client build is starting to look like another client's, or like the agency's own site.
---

# Industry Direction

A luxury boutique and a golf club must not look like the same website with
different photos. This skill exists to stop that. Every client gets a visual
world derived from **their** subject — its materials, its customers, its
buying moment — and that world is written down and checked before a line of
code is written.

## The one rule

**The agency's own identity is never a client's identity.** Black Line's
monochrome ink scale, heavy uppercase grotesk, silver foil and black
double-bezel cards belong to Black Line. Reusing them on a client is the
single fastest way to make every build look the same. If a client direction
arrives at "black, white, heavy sans caps", stop and justify it from the
client's world — or change it.

The same goes for the previous client. A direction that could be swapped onto
the last build without anyone noticing is not a direction.

## Process — do these in order, and do not skip the brief

### 1. Read the business (before any aesthetic thought)

Answer in writing, from the client's own materials, site, socials, premises
and competitors — not from assumption:

- **What do they sell?** A product, a service, an experience, or a place.
  These want different sites: a product wants to be looked at, a service
  wants to be trusted, an experience wants to be felt, a place wants to be
  visited.
- **Price position.** Value, mid, premium or ultra. This sets tempo and
  density more than the niche does — a premium dentist and a premium hotel
  have more in common than a premium and a budget hotel.
- **Who buys, and at what moment?** A golf member renewing at 55 is not a
  bride booking a venue at 29. Write the buyer in one sentence.
- **Heritage or novelty?** Established 1890 and opened last month want
  opposite typographic signals.
- **Where?** Local, regional, national. A Cleethorpes boutique and a Mayfair
  one sell the same thing in different voices.
- **What do the three nearest competitors look like?** The direction must
  be visibly different from all three.

### 2. Derive the world from the subject's materials

Distinctive choices come from the subject, not from the category. List the
real physical and cultural material of this business, then take design
decisions from it:

| Business | Its materials | What that gives you |
|---|---|---|
| Golf club | turf, fairway, scorecards, yardage books, club crests, brass, oak lockers | heritage serif, fairway green + cream + brass, scorecard-grid layouts, numbered holes as structure |
| Luxury boutique | tissue paper, garment tags, fashion editorial, window displays | high-contrast Didone, near-white paper + one fabric colour, editorial asymmetry, slow image reveals |
| Estate agent | floorplans, keys, street signs, window cards | clean grotesk + figures, floorplan line-work, price/bed/bath as typographic system |

Then carry at least one **subject-specific detail as content, not ornament**
— the club's real hole count, the boutique's street, the agent's real
postcodes. That is the thing a template can never have.

### 3. Write the Direction Brief

Use `references/direction-brief.md` — every field. Palette as 5–6 named hex
values with roles and contrast checked; a type pairing with reasons and
licensing; a motion tempo; an imagery direction; exactly one signature
moment; the components that suit it; the copy voice; and the things this
brand must never do.

Start from the niche's archetype in `references/archetypes.md`, but treat
it as a starting point to argue with, not a template to fill. If the brief
reads like the archetype with the name changed, it is not finished.

### 4. Check distinctness — it must pass before code

Against the agency's own site and the **last three client builds**, the new
direction must differ on all of:

- [ ] display typeface
- [ ] dominant palette (not just the accent)
- [ ] signature moment
- [ ] motion tempo *or* layout grammar

And it must avoid the saturated AI-generated looks unless the client's world
genuinely demands one: cream + serif + terracotta; near-black + one acid
accent; purple-to-blue gradient on white; everything centred; Inter or Space
Grotesk as the "safe" face; `rounded-lg` cards everywhere. Say in the brief
which of these you considered and why you did or did not use it.

### 5. Record it, then build

Write the brief into the client repo as `DESIGN.md` (or the direction section
of its `CLAUDE.md`) so every later session builds inside the same world
instead of drifting back to defaults. Set it as tokens first — colour, type,
spacing, radius, easing — then components, then pages.

## Motion is part of the identity, not a layer on top

Tempo is set by price position and niche, and it differs per client:

| Register | Durations | Easing | Character |
|---|---|---|---|
| Ultra / luxury | 1.0–1.6s | long expo-out, no overshoot | slow, withheld, one thing moves at a time |
| Premium service (law, finance, medical) | 0.5–0.8s | quart/expo-out | precise, almost invisible, never playful |
| Hospitality, leisure, venues | 0.7–1.1s | soft expo-out | warm, image-led, gentle parallax |
| Sport, fitness, youth | 0.25–0.5s | snappy, slight overshoot allowed | energetic, velocity-reactive, bold |
| Trades, local services | 0.3–0.5s | standard ease-out | clear and quick; motion must never delay the phone number |

Scroll-driven kit components and where they fit (Black Line's kit in
`src/components/kit/` of the agency repo — port the pattern, restyle it to
the client's world, never lift its styling):

- **ScrollText** — editorial and luxury brands with something worth reading slowly.
- **Carousel3D** — anything sold visually: property, fashion, cars, venues, portfolios.
- **StackCards** — process-led services: "how we work", treatments, packages.
- **VelocityMarquee** — energetic brands. Wrong for law, medical, funeral, finance.
- **Tilt** — product and object brands. Sparingly.
- **TextRing** — a one-off signature moment. Never twice on a site.

Every client build keeps the non-negotiables: animate only transform,
opacity and filter; respect `prefers-reduced-motion`; never gate content on
motion; simplify pinned/scrubbed sections under 768px.

## Honesty rules for concept and pitch builds

Learned the hard way on real builds — carry them into every client project:

- A site built for a business that **has not engaged us** is a concept. It
  must be `noindex, nofollow` (robots.ts **and** page metadata — robots.txt
  alone does not stop a URL being listed from an inbound link), and any
  portfolio card for it carries a Concept badge.
- Never publish a real business's **named customer reviews** or photography
  on a public, indexable page without their permission.
- No invented metrics, awards, ratings or client names — not in copy, not
  in JSON-LD.
- Do not point a concept build's canonical or `og:url` at the client's real
  domain.

## References

- `references/archetypes.md` — starting directions for 16 common niches:
  type, palette, motion, imagery, signature moment, and the clichés to avoid.
- `references/direction-brief.md` — the brief template. Fill every field.
