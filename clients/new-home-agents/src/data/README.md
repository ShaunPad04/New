# Property data

`properties.json` is a **dated snapshot** of the listings shown on
www.newhomeagents.co.uk when the capture workflow last ran — see
`scrape/meta.json` for the timestamp. It is not a live feed and the site never
describes it as one.

- `scrape/index.json` — every listing card seen on `/latest-properties` and `/new-homes`
- `scrape/details.json` — each listing's detail page (features, description, photos, floorplans, room counts)
- `scrape/assets.json` — which photographs were mirrored into `public/images/properties/`
- `scrape/pages.json` — plain-text copy of the informational pages, kept for checking business copy
- `properties.json` — the normalised dataset the app reads (built by `pnpm data:build`)

## Refreshing

1. Run the **nha-capture** GitHub Actions workflow (Actions → nha-capture → Run
   workflow) on this branch, or run `tools/capture/scrape.py` and
   `tools/capture/download-assets.mjs` from a machine that can reach the site.
2. `pnpm data:build`

## Moving to a live feed

Every page reads listings through `src/lib/properties.ts`. Replace the loader
there with the agency's feed (the listings originate from an Expert Agent
CRM — media is hosted on `med04.expertagent.co.uk`) and keep the `Property`
shape; nothing else needs to change.
