# One-Shot Luxury Watch Website — Complete Build Prompt
## THE WATCH CLUB · ROLEX GOLDEN DAY-DATE · Ref. 118238 · Stock No. 16496

> **Purpose:** This prompt generates a fully functional, production-ready single-page website for
> **The Watch Club** (Mayfair, London), built around one specific piece of stock:
> **Stock No. 16496 — Rolex Oyster Perpetual Day-Date 36, Ref. 118238, Year 2012, 18ct Gold, 36mm.**
>
> **IMPORTANT — READ BEFORE BUILDING:** This is **not** a limited edition and **not** a brand
> campaign. The Watch Club is a **vintage and pre-owned specialist retailer**, and this is a
> **single, unique, one-of-one piece of stock**. Every reference to "limited edition", "numbered
> edition", "No. 01 / 88" or "one of 88" from generic watch templates MUST be replaced with the
> single-stock language specified below. The conversion goal is an **enquiry / reservation on this
> exact watch**, not a pre-order.

---

## BRAND CONFIGURATION

```
# --- RETAILER ---
BRAND_NAME            = "The Watch Club"
BRAND_SHORT           = "Watch Club"
BRAND_DESCRIPTOR      = "Vintage & Pre-Owned Watch Specialists · Mayfair, London"
BRAND_FOUNDED         = "1996"
BRAND_FOUNDER         = "Danny Pizzigoni"
BRAND_CITY            = "London"
BRAND_COUNTRY         = "United Kingdom"
BRAND_ADDRESS         = "4 & 5 Royal Arcade, 28 Old Bond Street, Mayfair, London W1S 4SD"
BRAND_PHONE           = "+44 (0)20 7495 4882"
BRAND_HOURS           = "Monday – Saturday, 10:00 – 17:30"
BRAND_EMAIL           = "info@watchclub.com"
BRAND_WEBSITE         = "https://www.watchclub.com"
BRAND_INSTAGRAM       = "https://www.instagram.com/thewatchclub_uk/"
BRAND_FACEBOOK        = "https://www.facebook.com/WatchClubLondon/"
BRAND_YOUTUBE         = "https://www.youtube.com/channel/UCBjnQb5UfdwYy_LX7UV6qrQ"

# --- THE PIECE ---
WATCH_MAKER           = "Rolex"
PRODUCT_LINE          = "Oyster Perpetual Day-Date 36"
EDITION_NAME          = "The Golden Day-Date"
EDITION_TAGLINE       = "Reference 118238. Solid 18ct gold, an elegant black dial with diamond baguette hour markers, freshly serviced at Rolex UK. One piece, in the Royal Arcade."
STOCK_NUMBER          = "16496"
REFERENCE             = "118238"
YEAR                  = "2012"
MATERIAL              = "18ct Yellow Gold"
CASE_SIZE             = "36mm"
BRACELET              = "18ct Yellow Gold Rolex President, concealed clasp, newer heavy-link solid construction"
BEZEL                 = "18ct Yellow Gold Fluted"
DIAL                  = "Black, set with diamond baguette hour markers"
DIAMOND_DETAIL        = "LOCKED PHRASE: 'diamond baguette hour markers'. This is The Watch Club's own
                        wording on the live listing and it is the ONLY description of the markers used
                        anywhere on this site — hero, collection, spec grid, meta description, alt
                        text. Do not paraphrase it into 'ten diamonds', 'round brilliants',
                        'octagonal settings', 'pavé' or 'diamond-set bezel' (the bezel is fluted gold
                        and carries no stones). Photography must support it: the dial macro should be
                        framed on the baguettes at 6 and 9."
COMPLICATIONS         = "Instantaneous day in full at 12, Cyclops-magnified date at 3"
MOVEMENT              = "Rolex Calibre 3155, self-winding"
MOVEMENT_DETAIL       = "Automatic · 48-hour power reserve · double quick-set date"   [all three confirmed on the listing]
WATER_RESISTANCE      = "100m"
CRYSTAL               = "Sapphire glass with Cyclops lens"

# --- PRICE & PROVENANCE (all taken verbatim from the live listing — do not embellish) ---
PRICE                 = "£23,500"
PRICE_DISPLAY         = "£23,500"          # exact; no "from", no "circa", no rounding
RRP_COMPARISON        = "Rolex's current gold 36mm Day-Date (ref. 128238) retails for £40,950"
                        # The Watch Club's own stated comparison. ALWAYS attribute it to the current
                        # ref. 128238 and never present £40,950 as this watch's price or as a
                        # "was" price — it is a different, current-production reference.
SERVICE               = "Just serviced at Rolex UK"
WARRANTY              = "Under Rolex international service warranty for two years"
WARRANTY_EXPIRY       = "Official Rolex service warranty card valid to September 2028"
                        # Render the DATE, never a live countdown or "2 years remaining" — that
                        # sentence goes stale the day after it is written.
ACCESSORIES           = "Presented with the green leather Rolex travel pouch"
CONDITION             = "Beautiful crisp condition"    # The Watch Club's own words — do not upgrade
                                                        # to "mint", "unworn", "as new" or "flawless".
COMMERCE              = "The live listing sells via ADD TO CART, with a PART EXCHANGE option
                        alongside it. This site does not take payment — every purchase CTA links
                        out to the listing; part-exchange and viewing requests go through the modal."
EDITION_LIMIT         = "1"          # NOT an edition. One piece of stock.
STOCK_BADGE           = "Stock No. 16496 · 2012"    # replaces "No. 01 / 88" everywhere
PRODUCT_URL           = "https://www.watchclub.com/rolex/day-date/day-date-ref-118238-year-2012"
                        # CONFIRMED live listing for Stock No. 16496. Every "View This Watch" and
                        # "Full Specification" link points here, target="_blank".

# --- PALETTE (gold on black — no pink, no blue) ---
PRIMARY_COLOR         = "#c9a55c"   (18ct gold — primary accent, CTAs, highlight text)
ACCENT_COLOR_CHAMPAGNE= "#e6d6ab"   (pale champagne — secondary headings, dividers, footer)
ACCENT_COLOR_GREEN    = "#0b3d2e"   (Rolex box green — used ONLY as a rare tertiary tint, never as a fill)
BG_COLOR              = "#080808"   (near-black)
TEXT_COLOR            = "#ffffff"

# --- TYPE ---
FONT_SERIF            = "Playfair Display"   (dramatic headings)
FONT_SANS             = "Inter"              (body)
FONT_ACCENT           = "Outfit"             (labels, buttons, UI)

# --- COLLECTION SLIDER (two chapters of ONE watch, not two product variants) ---
COLLECTION_VARIANT_1_NAME   = "DIAL"
COLLECTION_VARIANT_1_LABEL  = "The Black Lacquer Dial"
COLLECTION_VARIANT_1_REF    = "Ref. 118238 · Stock No. 16496"
COLLECTION_VARIANT_1_COPY   = "An elegant black dial set with diamond baguette hour markers, each stone held in gold. The day spelled out in full at twelve, the date magnified beneath the Cyclops at three. Applied gold text, a gold coronet, and nothing else."

COLLECTION_VARIANT_2_NAME   = "GOLD"
COLLECTION_VARIANT_2_LABEL  = "The President Bracelet & Fluted Bezel"
COLLECTION_VARIANT_2_REF    = "Ref. 118238 · Stock No. 16496"
COLLECTION_VARIANT_2_COPY   = "Solid 18ct yellow gold throughout — a 36mm Oyster case, a hand-machined fluted bezel, and the semi-circular three-piece President bracelet closed by a concealed Crownclasp. The bracelet Rolex reserves for the Day-Date alone."

# --- SECTION COPY ---
HERO_HEADLINE         = "The Golden\nDay-Date"
HERO_BG_TEXT          = "DAY-DATE"
PRODUCT_HEADLINE      = "Solid Gold,\nInside And Out"
PRODUCT_SPEC_COPY     = "36mm of solid 18ct yellow gold. The automatic calibre 3155 with double quick-set date and a 48-hour power reserve, behind sapphire glass and waterproof to 100m. Just serviced at Rolex UK and covered by their international service warranty to September 2028."
HERITAGE_HEADLINE     = "Thirty Years in\nthe Royal Arcade"
HERITAGE_COPY_1       = "Danny Pizzigoni opened in the Royal Arcade in 1996 — London's oldest shopping arcade, running between Old Bond Street and Albemarle Street in the heart of Mayfair. What began as Royal Arcade Watches became The Watch Club."
HERITAGE_COPY_2       = "Three decades on, we still do one thing: buy, sell and part-exchange the finest vintage and pre-owned watches in Europe. Every piece is bought with our own eyes, and sold from the same two units we started in."
SHOWCASE_EYEBROW      = "One Piece · Stock No. 16496 · £23,500"
SHOWCASE_HEADLINE     = "Quietly\nExtraordinary."
SHOWCASE_COPY         = "A fluted gold bezel, a black dial, and diamonds that only announce themselves when the light finds them. The current gold 36mm Day-Date, reference 128238, retails at £40,950. This one is £23,500, serviced by Rolex, and here now."
CRAFTSMANSHIP_HEADLINE= "THE ARCHITECTURE OF CALIBRE 3155"
CRAFTSMANSHIP_COPY    = "Rolex's Calibre 3155 — self-winding, chronometer-certified, and the movement that introduced Double Quickset, letting day and date be set independently from the crown. Every bridge, jewel and wheel assembled to a standard that has not moved in decades."
FRAME_COUNT           = 152
```

---

## REQUIRED ASSETS

Place all assets in `public/` (Vite serves them at root). **Every image must be of Stock No. 16496
itself** — the actual 18ct gold, black diamond-dial Day-Date — not a stock photo of another
reference, and not another dial colour.

| Asset Path | Description |
|---|---|
| `public/hero-video.mp4` | Full-screen looping hero video. Cinematic, dark, warm-gold key light. The gold Day-Date turning slowly, light travelling across the fluted bezel and igniting the diamond markers. No audio. |
| `public/assets/photo/logo.webp` | The Watch Club wordmark, transparent background (inverted to white via CSS). |
| `public/assets/photo/bg1.png` | Product reveal background — dark macro of the fluted 18ct gold bezel or the President bracelet links. |
| `public/assets/photo/watch.png` | Full front-facing cut-out of the watch, transparent background — case, black dial, President bracelet. |
| `public/assets/photo/ethos-bg.png` | Collection chapter 1 background — extreme macro of the black dial framed on the diamond baguette hour markers at 6 and 9. This image is what the copy is describing, so it must show the baguettes clearly. |
| `public/assets/photo/ethos-bg-rs.png` | Collection chapter 2 background — extreme macro of the fluted gold bezel / President bracelet links. |
| `public/assets/photo/ethos-watch.png` | Cut-out, dial-forward three-quarter angle (chapter 1). |
| `public/assets/photo/ethos-watch-rs.png` | Cut-out, side-profile showing case flank, fluted crown and bracelet (chapter 2). |
| `public/assets/photo/q1.png` | Heritage background — the piece shot moodily, or the Royal Arcade shopfront. Dark edges. |
| `public/assets/photo/z1.png` | Showcase hero — the single best full-bleed frame of the watch. Gold and diamonds against black. |
| `public/assets/photo/v3/ezgif-frame-001.jpg` … `ezgif-frame-152.jpg` | 152 sequential JPEGs (1920×1080) of the watch rotating on its axis / the caseback opening onto Calibre 3155 — scroll-scrubbed canvas sequence. |

> **Note:** the reference photograph supplied by the client (gold Day-Date on its side, green Rolex
> box behind, textured off-white ground) is a **product listing shot**. For the site, all imagery
> must be re-lit or re-graded onto black — the site is dark-first end to end. Do not use the
> off-white listing background anywhere.

---

## TECH STACK

- **Vite** — build tool + dev server
- **GSAP** + **ScrollTrigger** — all scroll-driven animation, entrance timelines, parallax
- **Lenis** — smooth inertia scrolling
- **Vanilla JS** — no framework. Single `main.js`.
- **CSS** — single `style.css`, CSS custom properties for theming.
- **Netlify** — deployment target with built-in form handling

---

## PROJECT STRUCTURE

```
project-root/
├── index.html
├── main.js
├── style.css
├── package.json
└── public/
    ├── hero-video.mp4
    └── assets/photo/
        ├── logo.webp
        ├── bg1.png
        ├── watch.png
        ├── ethos-bg.png
        ├── ethos-bg-rs.png
        ├── ethos-watch.png
        ├── ethos-watch-rs.png
        ├── q1.png
        ├── z1.png
        └── v3/ezgif-frame-001.jpg … ezgif-frame-152.jpg
```

---

## FILE 1: `package.json`

```json
{
  "name": "watchclub-daydate-118238",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^8.0.1"
  },
  "dependencies": {
    "gsap": "^3.14.2",
    "lenis": "^1.3.21"
  }
}
```

Run `npm install` after creating.

---

## FILE 2: `index.html`

### 2.1 — `<head>`

- Charset UTF-8, viewport meta, favicon
- Google Fonts preconnect + load: **Inter** (300, 400, 500, 600), **Playfair Display** (regular, bold, italic), **Outfit** (300, 400, 600)
- Link to `./style.css`
- `<title>` — `Rolex Day-Date 36 · Ref. 118238 · 18ct Gold · The Watch Club`
- Meta description — `A 2012 Rolex Oyster Perpetual Day-Date 36 in solid 18ct yellow gold with a factory black diamond dial. Stock No. 16496, at The Watch Club, Royal Arcade, Mayfair.`

### 2.2 — `<nav class="nav">` (Fixed Navigation)

3-column flex — left (links), centre (logo), right (CTA).

```
nav.nav
├── div.nav-left
│   └── div.nav-links
│       ├── a[href="#collection"]     → "The Piece"
│       ├── a[href="#specification"]  → "Specification"
│       ├── a[href="#heritage"]       → "Our Heritage"
│       └── a[href="#craftsmanship"]  → "The Movement"
├── div.nav-center
│   └── div.nav-logo-container
│       └── img.nav-logo-img [src="/assets/photo/logo.webp", alt="The Watch Club"]
└── div.nav-right
    └── button.nav-cta.open-reserve-modal → "Enquire"
```

- `position: fixed`, full-width, `z-index: 1000`.
- Background `rgba(0,0,0,0)` with `backdrop-filter: blur(10px)`, 1px bottom border `rgba(255,255,255,0.05)`.
- Hides on scroll-down, reveals on scroll-up (JS, `transform: translateY(-100%)`).
- Logo inverted to white via `filter: brightness(0) invert(1)`.
- **CTA label is "Enquire", not "Reserve Now"** — this is a single pre-owned piece, and the client
  is being invited to enquire on it. Class stays `open-reserve-modal` so the JS is unchanged.

### 2.3 — Hero Section (`section.hero`)

```
section.hero
├── div.hero-bg
│   ├── video.bg-video [autoplay, loop, muted, playsinline]
│   │   └── source [src="/hero-video.mp4", type="video/mp4"]
│   └── div.hero-overlay
└── div.hero-content
    ├── div.hero-text-bg → "DAY-DATE"
    └── div.hero-details
        ├── h1.hero-title    → "The Golden <br> <span class='accent'>Day-Date</span>"
        ├── p.hero-subtitle  → "Reference 118238. Solid 18ct gold, an elegant black dial with diamond baguette hour markers, freshly serviced at Rolex UK. One piece, in the Royal Arcade."
        └── div.hero-cta-group
            ├── span.limited-edition → "Stock No. 16496 · 2012 · £23,500"
            └── a.primary-btn [href=PRODUCT_URL, target=_blank] → "View This Watch"
```

**Behaviour:**
- `position: sticky; top: 0`, `100vh` — pins while later sections scroll over it.
- Video `object-fit: cover`.
- Overlay: `linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.8) 100%)`.
- `"DAY-DATE"` watermark at `font-size: 20vw; color: rgba(255,255,255,0.03)`.
- `.hero-details` — `absolute; bottom: 10%; left: 5%; width: 40%`.
- `.limited-edition` keeps its `::before` horizontal rule — **in gold (`--primary-color`)**, and the
  class now carries the stock number, not an edition number. Rename to `.stock-tag` if you prefer;
  keep the CSS identical.
- `.primary-btn` → the live Watch Club listing for Stock No. 16496, new tab. **The price sits in the
  badge, not the button** — the button is the journey to the real Add to Cart, and duplicating
  "£23,500" in both reads like a discount banner.

**GSAP Entrance (on DOMContentLoaded):** unchanged from spec —
1. Video scale 1.2 + opacity 0; title/subtitle/CTA offset + hidden; nav `y: -100`.
2. Video fades in and scales to 1.05 (2.5s) → bg text scales 0.5→1 → title up → subtitle up → CTA up → nav down, each overlapping (`-=1.5` etc.).
3. Scroll-driven: video 1.05→1 (scrub); `.hero-details` `y: -150`; `.hero-text-bg` `y: -250` (scrub 1.2).

### 2.4 — Product Reveal (`section.product-reveal`)

```
section.product-reveal
├── div.product-reveal-bg
│   ├── img.product-reveal-bg-img [src="/assets/photo/bg1.png"]
│   └── div.product-reveal-overlay
└── div.product-reveal-content
    ├── div.product-reveal-text-bg → "18CT"
    ├── div.product-reveal-watch-container
    │   └── img.product-reveal-watch [src="/assets/photo/watch.png"]
    └── div.product-reveal-details
        ├── h2.product-reveal-title    → "Solid Gold, <br> <span class='accent-gold'>Inside And Out</span>"
        ├── p.product-reveal-subtitle  → PRODUCT_SPEC_COPY
        └── div.product-reveal-cta-group
            ├── span.edition-tag → "Ref. 118238 · 36mm · 18ct Gold"
            └── a.secondary-btn [href=PRODUCT_URL, target=_blank] → "Full Specification"
```

**Behaviour:** `100vh`, `z-index: 5`. Overlay
`linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.85) 100%)`.
Watch centred with a heavy drop shadow — **warm the shadow slightly (`rgba(0,0,0,0.9)` with a faint
gold rim) so the cut-out gold does not read as flat against pure black.**
`.accent-gold` is `--accent-champagne` (`#e6d6ab`). `.edition-tag` keeps the `::before` rule in
champagne. `.secondary-btn` is hollow — transparent, 1px white border, slight fill on hover.

**GSAP:** identical to spec — entrance on `top 55-60%` with `toggleActions: 'play none none reverse'`
(watch `y: 50→0`, `opacity 0→1`, `rotation -5→0`; title, subtitle, CTA slide up); scroll-driven watch
`rotation 0→20`, `scale 1→1.3`; details `y: -150`; bg text `y: -250`.

### 2.4b — Specification & Provenance (`section.spec#specification`)  **[NEW — not in the generic template]**

> Added because this is a single piece of real stock with a real price and a real service history.
> Those three facts are what actually sell it, and the generic template has nowhere to put them.
> A dark, quiet, typographic band between the product reveal and the heritage section — no imagery,
> no motion beyond a staggered fade-up. It is the one place on the page that behaves like a document
> rather than a campaign, and that contrast is the point.

```
section.spec#specification
└── div.spec-inner (max-width: 1200px, centred, padding: 12vh 5%)
    ├── div.spec-head
    │   ├── p.spec-eyebrow  → "Specification & Provenance"
    │   └── h2.spec-price   → "£23,500"
    │       └── span.spec-price-note → "Stock No. 16496 · view and purchase at watchclub.com"
    ├── dl.spec-grid (3 columns desktop → 2 → 1)
    │   ├── Stock No.        · 16496
    │   ├── Year             · 2012
    │   ├── Reference        · 118238
    │   ├── Material         · 18ct Gold
    │   ├── Size             · 36mm
    │   ├── Bezel            · Fluted 18ct gold
    │   ├── Dial             · Black, diamond baguette hour markers
    │   ├── Bracelet         · President, concealed clasp, heavy solid link
    │   ├── Movement         · Automatic calibre 3155
    │   ├── Power Reserve    · 48 hours
    │   ├── Date             · Double quick-set
    │   ├── Glass            · Sapphire
    │   └── Water Resistance · 100m
    ├── div.spec-provenance (bordered panel, 1px rgba(255,255,255,0.08), gold left rule 2px)
    │   ├── h3.spec-prov-title → "Serviced by Rolex"
    │   └── p.spec-prov-body   → "Just serviced at Rolex UK and covered by their international
    │                             service warranty for two years — official Rolex service warranty
    │                             card valid to September 2028. Presented with the green leather
    │                             Rolex travel pouch, in beautiful crisp condition."
    └── div.spec-value (small, dim, sits under the panel)
        └── p → "Rolex's current gold 36mm Day-Date, reference 128238, retails for £40,950."
```

**Behaviour & styling:**
- `background: var(--bg-color)`, `z-index: 10`. Height is content-driven — this is the one section
  that is **not** forced to `100vh`. Let it breathe and end.
- `.spec-price` in Playfair Display, `clamp(3rem, 6vw, 5rem)`, in `--primary-color` gold.
- `.spec-grid` — `display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem 4rem`. Each row
  is a `<dt>` (Outfit, 0.7rem, uppercase, `0.25em` tracking, `rgba(255,255,255,0.35)`) above a `<dd>`
  (Inter, 1rem, white). Hairline `1px rgba(255,255,255,0.06)` bottom border per cell.
- `.spec-provenance` uses `--accent-green` (`#0b3d2e`) at low opacity as its panel fill — the one
  place the Rolex green earns its place on the page, because the pouch it refers to is green.
- `.spec-value` at `rgba(255,255,255,0.4)`, `0.85rem`. **The £40,950 figure must always appear with
  "reference 128238" in the same sentence.** Never strike it through, never label it "RRP" or "was".

**GSAP:** `ScrollTrigger` on `.spec`, `start: 'top 75%'`, `toggleActions: 'play none none reverse'`.
Stagger `.spec-head`, then `.spec-grid > div` at `stagger: 0.04`, then `.spec-provenance`, each
`y: 30 → 0`, `opacity: 0 → 1`, `duration: 0.8`, `ease: 'power3.out'`. No scrub, no parallax — this
section holds still on purpose.

### 2.5 — Heritage (`section.heritage#heritage`)

```
section.heritage#heritage
├── div.heritage-bg
│   ├── img.heritage-bg-img [src="/assets/photo/q1.png"]
│   └── div.heritage-overlay
└── div.heritage-content
    ├── div.heritage-text (right-aligned)
    │   ├── p.heritage-eyebrow → "Est. 1996 · Royal Arcade, Mayfair"
    │   ├── h2.heritage-title  → "Thirty Years<br>in the <em>Royal Arcade</em>"
    │   ├── div.heritage-divider (60px gold line)
    │   ├── p.heritage-body × 2 → HERITAGE_COPY_1, HERITAGE_COPY_2
    │   └── a.heritage-link [href="https://www.watchclub.com/our-heritage"] → "Our Heritage →"
    └── div.heritage-stats
        ├── div.heritage-stat → "1996"  / "Opened in the Royal Arcade"
        ├── div.heritage-stat → "30"    / "Years Buying & Selling"
        └── div.heritage-stat → "1"     / "Address. Mayfair, London."
```

> **Stats changed deliberately.** The generic template's "1,200+ Calibres Created" and
> "40+ Global Boutiques" are manufacturer claims — they are false for a single-boutique retailer.
> Use only the three verifiable facts above. Do not invent stock counts, sales figures or client
> numbers.

**Behaviour:** `100vh`, `z-index: 10`. Overlay right-to-left:
`linear-gradient(to left, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.1) 75%, transparent 100%)`.
Content `flex; align-items: flex-end`. `.heritage-eyebrow` `::after` rule in gold.
`.heritage-title em` italic, champagne. Stats are large italic serif numerals with small uppercase
labels. Mobile: left-aligned, uniform dark overlay.

### 2.6 — The Piece (`section.ethos#collection`)

> **Structural change:** the template's two *product variants* become **two chapters of the same
> watch**. There is only one piece. Both slides carry the same reference and stock number; only the
> subject of the photograph and the copy change. The slider code, classes and GSAP timeline are
> unchanged — `variant-bl` → chapter 1 (DIAL), `variant-rs` → chapter 2 (GOLD).

```
section.ethos#collection
├── div.ethos-header
│   └── h2.ethos-section-title → "THE PIECE"
├── div.ethos-dynamic-bg
│   ├── img.ethos-bg-img.ethos-bg-bl.active [dial macro]
│   └── img.ethos-bg-img.ethos-bg-rs        [gold macro]
└── div.ethos-slider-container
    ├── div.ethos-main.variant-bl.active
    │   ├── div.ethos-text-side
    │   │   ├── h2.ethos-alt-title    → "ROLEX <br> DAY-DATE 36"
    │   │   ├── p.ethos-alt-subtitle  → "THE BLACK LACQUER DIAL"
    │   │   ├── div.ethos-description → COLLECTION_VARIANT_1_COPY
    │   │   └── div.ethos-next-btn[data-target="rs"] → arrow SVG
    │   └── div.ethos-product-center
    │       └── img.ethos-watch-img [/assets/photo/ethos-watch.png]
    └── div.ethos-main.variant-rs
        ├── div.ethos-text-side
        │   ├── h2.ethos-alt-title    → "ROLEX <br> DAY-DATE 36"
        │   ├── p.ethos-alt-subtitle  → "THE PRESIDENT BRACELET"
        │   ├── div.ethos-description → COLLECTION_VARIANT_2_COPY
        │   └── div.ethos-next-btn[data-target="bl"] → arrow SVG
        └── div.ethos-product-center
            └── img.ethos-watch-img [/assets/photo/ethos-watch-rs.png]
```

**Behaviour:** `100vh`, `z-index: 10`, black. One `.ethos-main` `.active` at a time (opacity 1 /
pointer-events all; inactive opacity 0 / pointer-events none, CSS transition). Backgrounds cross-fade
via `.active` on `.ethos-bg-img` at `opacity: 0.6`. Arrow triggers a GSAP timeline: current text/watch
out left (`x: -100 / -150`, opacity 0) → swap `.active` → new text/watch in from right
(`x: 100 / 150 → 0`, opacity 1). Backgrounds parallax (`scale: 1.1`, `yPercent: 10`, scrubbed).
Watch image `top: 50%; left: 5%; translateY(-50%); width: 95%` — massive, partially behind the text.
Text side `width: 40%`, left-anchored.

### 2.7 — The Movement (`section.dismantle#craftsmanship`)

```
section.dismantle#craftsmanship
└── div.dismantle-container
    ├── div.dismantle-header
    │   ├── h2.section-title    → "THE ARCHITECTURE OF <span class='accent'>CALIBRE 3155</span>"
    │   └── p.section-subtitle  → CRAFTSMANSHIP_COPY
    └── canvas#dismantle-canvas
```

**Behaviour:** outer section `height: 300vh`; `.dismantle-container` `position: sticky; top: 0;
height: 100vh`. Canvas 1920×1080 internally, `object-fit: contain`. Header `absolute; top: 10%;
left: 5%; z-index: 30`.

**GSAP:** preload 152 `Image()` objects; tween `{frame: 0} → {frame: 151}`, snapped to integer,
`ease: 'none'`, scrubbed `start: 'top 40%'`, `end: 'bottom bottom'`; on update clear canvas and draw
`images[currentFrame]`. Header slides out left (`x: -150`, `opacity: 0`) scrubbed
`start: 'top 45%'` → `end: 'top 10%'`.

### 2.8 — Showcase (`section.showcase`)

```
section.showcase
├── div.showcase-visual
│   ├── img.showcase-bg-img [src="/assets/photo/z1.png"]
│   └── div.showcase-gradient
└── div.showcase-text
    ├── p.showcase-eyebrow  → "One Piece · Stock No. 16496 · Available Now"
    ├── h2.showcase-headline→ "Quietly<br><em>Extraordinary.</em>"
    ├── p.showcase-body     → SHOWCASE_COPY
    └── a.showcase-ig-link [href=BRAND_INSTAGRAM] → Instagram SVG + "Follow @thewatchclub_uk"
```

**Behaviour:** `100vh`, `z-index: 20`, black. Image `object-fit: cover`. Gradient left-to-right:
`rgba(0,0,0,0.92)` → transparent. Text `max-width: 580px; padding: 0 5%`. `.showcase-eyebrow`
`::before` rule in gold. `.showcase-headline` `clamp(4rem, 8vw, 8rem)`, `<em>` gold, `display: block`.
Instagram link underlined uppercase with SVG icon.

### 2.9 — Footer (`footer.footer`)

```
footer.footer
├── div.footer-top-rule (1px gold gradient rule)
└── div.footer-inner (max-width: 1400px, centred)
    ├── div.footer-grid (5-column CSS Grid)
    │   ├── div.footer-brand-col
    │   │   ├── img.footer-logo
    │   │   ├── p.footer-tagline → "Mayfair, London · Est. 1996"
    │   │   ├── p.footer-address → "4 & 5 Royal Arcade, 28 Old Bond Street, London W1S 4SD"
    │   │   ├── p.footer-contact → "+44 (0)20 7495 4882 · Mon–Sat 10:00–17:30"
    │   │   ├── a.footer-email [href="mailto:info@watchclub.com?subject=Enquiry%20-%20Stock%20No.%2016496%20Rolex%20Day-Date%20Ref.%20118238"] → "info@watchclub.com"
    │   │   └── div.footer-socials → Instagram, Facebook, YouTube (circular SVG icons)
    │   ├── div.footer-col — "BRANDS"
    │   │   → Rolex, Patek Philippe, Panerai, Audemars Piguet   [links to watchclub.com brand pages]
    │   ├── div.footer-col — "THE CLUB"
    │   │   → Our Heritage (/our-heritage), Meet the Experts (/meet-experts),
    │   │     Our Services (/our-services), The Collection (/the-collection)
    │   ├── div.footer-col — "SERVICES"
    │   │   → Buy, Sell, Part-Exchange, Contact Us (/contact)
    │   └── div.footer-col.footer-col-reserve
    │       ├── h5.footer-col-title → "Stock No. 16496"
    │       ├── p.footer-col-desc   → "Rolex Day-Date 36, Ref. 118238, 2012. 18ct gold, black diamond dial. £23,500. Serviced at Rolex UK, warranty to September 2028. Available to view by appointment in the Royal Arcade."
    │       └── button.footer-reserve-btn.open-reserve-modal → "Enquire About This Watch"
    └── div.footer-bottom
        ├── p.footer-legal → "© 2026 The Watch Club. All rights reserved. Rolex, Oyster Perpetual, Day-Date and President are registered trademarks of Rolex SA. The Watch Club is an independent dealer and is not an authorised Rolex dealer, nor affiliated with Rolex SA."
        └── div.footer-bottom-links → Terms, Privacy, Contact
```

> **The trademark line is mandatory.** An independent pre-owned dealer must not imply authorised-dealer
> status. Do not shorten or remove that sentence. Confirm the exact wording with The Watch Club
> before launch — they will have their own approved form of words.

**Styling:** background `#050505`; `footer-top-rule` 1px transparent→gold→transparent gradient;
grid `1.4fr 1fr 1fr 1fr 1.4fr` → 3-col → 2-col; column titles tiny uppercase, `0.35em` letter-spacing,
1px bottom border; links 300-weight `rgba(255,255,255,0.55)` → white on hover; socials 40×40 circles,
1px border, gold tint on hover; reserve button transparent with 1px gold border and gold text, slight
gold fill on hover; bottom bar dim.

### 2.10 — Enquiry Modal

> Renamed from "Reservation" to **"Enquiry"** — you cannot reserve one of a numbered edition here,
> you are enquiring about a single watch that is either in stock or gone. Keep all class names
> (`#reserve-modal`, `.open-reserve-modal`, `#reserve-form`) so `main.js` is unchanged; change only
> the visible copy and the form fields listed below.

```
div.modal-overlay#reserve-modal[aria-hidden="true"]
└── div.modal (CSS Grid: 1fr 1.3fr)
    ├── button.modal-close#modal-close
    ├── div.modal-left
    │   ├── img.modal-watch-img [dramatic shot of Stock No. 16496]
    │   ├── div.modal-left-overlay
    │   └── div.modal-left-text
    │       ├── p.modal-left-tag   → "Stock No. 16496 · 2012"
    │       └── h3.modal-left-title→ "Rolex<br>Day-Date 36"
    └── div.modal-right
        ├── p.modal-eyebrow  → "Private Enquiry · £23,500"
        ├── h2.modal-title   → "Enquire About <em>This Watch</em>"
        ├── p.modal-subtitle → "Ref. 118238 in 18ct gold, one piece only. Tell us how to reach you and a specialist will respond personally — or call +44 (0)20 7495 4882, or email info@watchclub.com."
        └── form.modal-form#reserve-form[name="enquiry", method="POST", data-netlify="true"]
            ├── input[type="hidden", name="form-name", value="enquiry"]
            ├── input[type="hidden", name="stock-number", value="16496"]
            ├── div.form-row
            │   ├── div.form-group → "First Name"  + text input
            │   └── div.form-group → "Last Name"   + text input
            ├── div.form-group → "Email Address"     + email input
            ├── div.form-group → "Phone / WhatsApp"  + tel input
            ├── div.form-group → "Enquiry Type"      + select:
            │        • "Purchase this watch (£23,500)"
            │        • "Part-exchange against this watch"
            │        • "Book a viewing in the Royal Arcade"
            │        • "Question about the service history"
            ├── div.form-group → "Message" + textarea (3 rows)
            └── button.form-submit-btn → "Send Enquiry"
```

> The old "Preferred Variant" select (BL / RS) is **removed** — there is only one watch. It is
> replaced by "Enquiry Type", which maps onto what The Watch Club actually does: buying, selling and
> part-exchanging.

**Behaviour:** overlay `fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.85);
backdrop-filter: blur(8px)`; default `opacity: 0; pointer-events: none`, `.active` → `opacity: 1;
pointer-events: all`; modal `translateY(30px) → translateY(0)`. Close on button, overlay click,
Escape. `document.body.style.overflow = 'hidden'` on open. Inputs: `rgba(255,255,255,0.04)` fill,
1px subtle border, white text, **gold border on focus**. Submit button: **solid gold background,
near-black text**, uppercase. Single-column on mobile. `data-netlify="true"` + hidden `form-name`
enables Netlify capture under Forms → "enquiry".

---

## FILE 3: `style.css`

### 3.1 — Custom Properties

```css
:root {
  --primary-color: #c9a55c;      /* 18ct gold */
  --accent-champagne: #e6d6ab;   /* pale champagne */
  --accent-green: #0b3d2e;       /* Rolex box green — tertiary, sparing */
  --bg-color: #080808;
  --text-color: #ffffff;
  --font-serif: 'Playfair Display', serif;
  --font-sans: 'Inter', sans-serif;
  --font-accent: 'Outfit', sans-serif;
  --nav-bg: rgba(0, 0, 0, 0.4);
}
```

### 3.2 — Global Reset

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: var(--font-sans);
  overflow-x: hidden;
  cursor: default;
}
html.lenis { height: auto; }
.lenis.lenis-smooth { scroll-behavior: auto; }
```

### 3.3 — Patterns

- Backgrounds near-black (`#000`, `#050505`, `#080808`)
- Text hierarchy: white headings, `rgba(255,255,255,0.6)` body, `rgba(255,255,255,0.35)` labels
- Eyebrows: `0.7–0.75rem`, uppercase, `0.3–0.4em` letter-spacing
- Serif headings in Playfair Display at `clamp()` ranges
- Accents in `<em>`, `<span class="accent">`, borders and `::before` rules — **gold and champagne only**
- `transition: all 0.3s ease` on hover states
- Buttons uppercase, `0.1–0.2em` letter-spacing, 600–700 weight

**z-index:** hero 1 (sticky) → product-reveal 5 → spec/heritage/ethos/dismantle/showcase 10–20 → nav 1000 → modal 9999.

**Section heights:** every section is `100vh` **except `section.spec`**, which is content-height. It is
the only place the page stops holding its breath, and that is deliberate.

**Breakpoints:** `max-width: 1024px` (reduce heading sizes, adjust watch widths);
`max-width: 768px` (full-width text blocks, stacked CTA groups, collapsed footer grid).

---

## FILE 4: `main.js`

### 4.1 — Imports + Lenis

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  lerp: 0.1,
  wheelMultiplier: 1,
  infinite: false,
  gestureOrientation: 'vertical',
  normalizeWheel: true,
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
```

### 4.2 — Functions

1. `initHeroAnimations()` — entrance timeline + scroll parallax (video, text, bg-text)
2. `initProductRevealAnimations()` — scroll entrance + rotation/zoom/parallax
3. `initEthosAnimations()` — background parallax, chapter switcher timeline (out left → cross-fade bg → in from right)
4. `initSpecAnimations()` — staggered fade-up for the specification grid and provenance panel (no scrub)
5. `initDismantleAnimations()` — canvas setup, 152-frame preload, scrub, header slide-out
6. `initNavScroll()` — hide on scroll-down, show on scroll-up
7. `initModal()` — open/close (buttons, overlay, Escape), body overflow lock, smooth-scroll for `a[href^="#"]`

### 4.3 — DOMContentLoaded

```javascript
document.addEventListener('DOMContentLoaded', () => {
    initHeroAnimations();
    initProductRevealAnimations();
    initSpecAnimations();
    initEthosAnimations();
    initDismantleAnimations();
    initNavScroll();
    initModal();
});
```

---

## ANIMATION SPECIFICATIONS

| Element | Trigger | Start | End | Effect | Ease | Scrub |
|---|---|---|---|---|---|---|
| `.bg-video` (entrance) | DOMContentLoaded | — | — | scale 1.2→1.05, opacity 0→1 | power2.out | No |
| `.bg-video` (scroll) | `.hero` | top top | bottom top | scale 1.05→1 | — | Yes |
| `.hero-details` | `.hero` | top top | bottom top | y: 0→-150 | — | Yes |
| `.hero-text-bg` | `.hero` | top top | bottom top | y: 0→-250 | — | 1.2 |
| `.nav` (entrance) | DOMContentLoaded | — | — | y: -100→0, opacity 0→1 | power4.out | No |
| `.product-reveal-watch` (entrance) | `.product-reveal` | top 60% | — | y: 50→0, opacity 0→1, rotation -5→0 | power4.out | toggleActions |
| `.product-reveal-watch` (scroll) | `.product-reveal` | top top | bottom top | rotation 0→20, scale 1→1.3 | — | 1.5 |
| `.spec-head`, `.spec-grid > div`, `.spec-provenance` | `.spec` | top 75% | — | y: 30→0, opacity 0→1, stagger 0.04 | power3.out | toggleActions |
| `.ethos-bg-img` | `.ethos` | top bottom | bottom top | scale 1→1.1, yPercent 0→10 | none | Yes |
| Canvas frame | `.dismantle` | top 40% | bottom bottom | frame 0→151 | none | 0.5 |
| `.dismantle-header` | `.dismantle` | top 45% | top 10% | x: 0→-150, opacity 1→0 | power2.in | 1 |

---

## DEPLOYMENT

```bash
npm install -g netlify-cli
npm run build

# First deploy
NETLIFY_AUTH_TOKEN=YOUR_TOKEN netlify deploy --dir=dist --prod

# Subsequent
NETLIFY_AUTH_TOKEN=YOUR_TOKEN netlify deploy --dir=dist --prod --site=YOUR_SITE_ID
```

Netlify form handling: `data-netlify="true"` on the form + hidden `form-name` input.
Submissions land under Forms → **"enquiry"**.

---

## CONTENT INTEGRITY — DO NOT VIOLATE

1. **This is one watch, not an edition.** Never write "limited to X", "one of X", or "No. 01 / 88".
   The correct badge is `Stock No. 16496 · 2012`.
2. **Sold stock must come down.** If the piece sells, the site must not keep soliciting enquiries on
   it. Build the hero badge and CTA so a single flag (`IN_STOCK = true/false`) swaps them to
   "Sold — Stock No. 16496" and a link to `/the-collection`.
3. **Provenance is confirmed — and it is exactly this, no more.** Just serviced at Rolex UK; under
   Rolex international service warranty for two years; official Rolex service warranty card valid to
   September 2028; presented with the green leather Rolex travel pouch; condition described by The
   Watch Club as "beautiful crisp condition". Do **not** add original box, original papers, original
   receipt, single ownership, "unworn", "mint" or "full set" — none of those are stated. Render the
   warranty as the fixed date, never as a countdown.
4. **No invented figures.** No sales counts, client counts, calibre counts, boutique counts or
   review scores. The three heritage stats above are the only numbers on the page.
5. **No authorised-dealer implication.** The Rolex trademark disclaimer in the footer stays.
6. **Price is £23,500 and must stay in sync with the listing.** Never estimate, never round, never
   write "from £23,500". The £40,950 figure is the **current ref. 128238 retail price** as stated by
   The Watch Club — always name that reference beside it. Presenting £40,950 as a struck-through
   "was" price for this watch would be a misleading price comparison under the Digital Markets,
   Competition and Consumers Act 2024 and the CMA's pricing guidance. Do not do it.
8. **This site does not sell.** No cart, no checkout, no payment fields. Purchase CTAs link out to
   the listing, which carries the real Add to Cart and Part Exchange buttons.
7. **All photography must be of this actual watch.** No stock images of other references or other
   dial colours.
9. **One dial description, everywhere: "diamond baguette hour markers."** It is the dealer's own
   wording and it is what the customer will read on the listing they are sent to. Never invent stone
   counts, cuts or settings the listing does not state, and never imply the bezel is diamond-set —
   it is fluted 18ct gold.

---

## OPEN ITEMS — CONFIRM BEFORE BUILD

`watchclub.com` could not be read directly from this environment (network egress blocked). The email
address and the product URL below were confirmed directly by the client; the remaining rows came from
third-party sources and should be checked against the live site:

| Item | Current value | Status |
|---|---|---|
| Address | 4 & 5 Royal Arcade, 28 Old Bond Street, London W1S 4SD | Widely listed — verify |
| Phone | +44 (0)20 7495 4882 | Widely listed — verify |
| Founded | 1996 (as Royal Arcade Watches, by Danny Pizzigoni) | Press-sourced — verify |
| Hours | Mon–Sat 10:00–17:30 | Verify |
| Email | info@watchclub.com | **Confirmed by client** |
| Instagram | @thewatchclub_uk | Verify it is the boutique's account |
| YouTube | youtube.com/channel/UCBjnQb5UfdwYy_LX7UV6qrQ | Verify |
| Product URL for Stock 16496 | /rolex/day-date/day-date-ref-118238-year-2012 | **Confirmed by client** |
| Price | £23,500 | **Confirmed from listing** |
| RRP comparison | ref. 128238 retails £40,950 | **Confirmed from listing** — re-check before launch, retail prices move |
| Movement | Automatic cal. 3155, 48h reserve, double quick-set, 100m, sapphire | **Confirmed from listing** |
| Jewel count / beat rate | not stated on the listing | **Removed from the build — do not add** |
| Service & warranty | Rolex UK service, warranty card to Sept 2028 | **Confirmed from listing** |
| Accessories | Green leather Rolex travel pouch | **Confirmed from listing** |
| Dial description | "diamond baguette hour markers" | **Locked by client** — matches the live listing. Shoot the dial macro on the baguettes so image and copy agree. |
