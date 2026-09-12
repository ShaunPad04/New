# Photography

Every photograph on the site is resolved at build time from this folder by
`src/lib/images.ts`. If a file is present it is rendered with `next/image`;
if it is absent the section falls back to a designed plate. Dropping a
correctly named file in here upgrades the page — no code change needed.

Use the café's own photography (the images on maisondemuse.co.uk are the
client's and are authorised). Never hotlink Instagram or Facebook.

`template-placeholder/` holds two recoloured drink cutouts from the Beanro
template that stand in for the closing CTA's plates on preview builds only.
They are artwork, not photographs of this café — see that folder's README.
A real file named below takes precedence the moment it is added, and
`npm run verify` blocks any indexable build that still relies on them.

## Named roles

| File | Used by | Shape |
| --- | --- | --- |
| `maison-de-muse-counter.jpg` | Home hero (behind the drink, low opacity) | landscape, ≥1920px |
| `maison-de-muse-interior.jpg` | Home intro, Our Story | square, ≥1080px |
| `maison-de-muse-about.jpg` | Our Story lead | square, ≥1080px |
| `maison-de-muse-coffee.jpg` | Closing CTA, left plate | square |
| `maison-de-muse-evening.jpg` | Closing CTA, right plate | square |
| `maison-de-muse-brunch.jpg` | reserved for menu cards | square |
| `maison-de-muse-frontage.jpg` | Visit page plate | portrait |

## Gallery

`maison-de-muse-gallery-01.jpg` … `maison-de-muse-gallery-16.jpg`, square,
≥1080px. Missing numbers are skipped. Add alt text for each in
`GALLERY_ALT` in `src/lib/images.ts` — an empty entry is treated as
decorative.

## Format

JPEG or PNG sources are fine: Next's image optimiser serves AVIF/WebP at
the rendered size. Prefer sources under 1 MB each so the repository stays
sane. Do not crop or stretch food photography; the components use
`object-cover` inside fixed aspect plates.
