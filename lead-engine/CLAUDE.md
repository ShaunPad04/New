# BlackLine Lead Engine — project context

## What this is

An automated lead-generation and qualification engine. BlackLine Agency finds
organisations with a genuine accommodation requirement near Cleethorpes and
hands qualified opportunities to **Cambridge Mews Accommodation**.

**BlackLine is the middleman.** It does not provide accommodation, quote for
it, price it or book it. Nothing in this codebase may state a room, a rate or
an availability, or write as though BlackLine were Cambridge Mews.

## The rule that governs everything

Read `docs/INTEGRITY.md` before touching `src/lib/domain/`,
`src/lib/research/` or `src/lib/outreach/`. In short:

- Verified fact, inference and unknown are three separate categories. Never
  merge them.
- No score component earns points without evidence cited against it.
- The model extracts facts; the code computes scores, bands and tiers.
- Contact details are only ever copied from a source, never constructed.
- Commercial terms default to `unconfigured` and are never assumed.
- An unconfigured integration reports that it is unconfigured. It does not
  produce sample output.

## Architecture

| Path | Responsibility |
| --- | --- |
| `src/lib/domain/` | Types, scoring rubric, status machine, geography, dedupe. Pure functions, no I/O. |
| `src/lib/db/` | SQLite repository. The only place SQL lives. |
| `src/lib/clients/` | Per-client configuration. Cambridge Mews is the first. |
| `src/lib/discovery/` | Search providers and the run orchestration. |
| `src/lib/research/` | Polite fetching and evidence extraction via Claude. |
| `src/lib/outreach/`, `handoff/`, `revenue/`, `report/`, `notify/` | The stages after qualification. |
| `src/app/` | App Router pages, server actions and the API routes. |

## Conventions

- **Next 16, App Router, Turbopack.** `params` and `searchParams` are promises.
  Read `node_modules/next/dist/docs/` before writing framework code — this
  version differs from older training data.
- **Server actions used by `ActionForm` must take `(prevState, formData)`** so
  they can be passed from a Server Component without an inline wrapper.
- **Design follows the house standard**: double bezel (`.bezel` + `.bezel-core`
  with concentric radii), floating island nav, `cubic-bezier(0.32, 0.72, 0, 1)`
  easing, Geist for UI and Geist Mono for labels and numbers. Banned: Inter,
  Roboto, Arial, Open Sans, Helvetica; generic 1px grey borders; edge-to-edge
  navbars; `linear`/`ease-in-out`.
- **Colour is data, not decoration.** The palette is an ink scale plus signal
  colours that exist only to separate tiers and outcomes in a dense table.
- **Grid children need `min-w-0`** where they contain truncating text, or a
  long string pushes the track wider than a phone screen.

## Verification

`pnpm verify` — typecheck, lint, tests, production build.

`tests/journey.test.ts` is the product test: the full loop from discovery to a
booking with the fee calculated and the source attributed. If you change the
domain model, that test tells you whether the loop still works.

Check mobile after any layout change:

```bash
pnpm build && pnpm start -p 3210
# then confirm document.scrollWidth === clientWidth at 390px on every route
```

## Not yet done

- Discovery needs `SEARCH_PROVIDER`, `SEARCH_API_KEY` and `ANTHROPIC_API_KEY`;
  none are set in this repository.
- `CommercialModel` is `unconfigured` — BlackLine's fee with Cambridge Mews
  has not been agreed.
- `routing.handoffRecipients` is empty — nobody at Cambridge Mews has been
  recorded as the recipient, so packs are sent by hand.
- There is no authentication on the pages. See `docs/DEPLOYMENT.md`.
