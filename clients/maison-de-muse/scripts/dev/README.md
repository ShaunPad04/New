# Verification helpers

Ad-hoc checks used alongside `pnpm verify`. Each expects a production
server already running on port 3000 (`pnpm build && pnpm start`).

| Script | What it answers |
| --- | --- |
| `node scripts/dev/axe.mjs "<routes>" [width]` | axe violations per route, with the offending element and the measured contrast ratio. Wider than the Playwright suite because it prints every impact level. |
| `node scripts/dev/overflow.mjs` | Which element causes horizontal overflow, skipping anything inside a clipping ancestor. |
| `node scripts/dev/nojs.mjs` | Renders key routes with JavaScript disabled and reports any text left invisible. The reveal system must never hide content. |
| `node scripts/dev/shots.mjs "<routes>" "<widths>" [full\|viewport] [reduced]` | Full-page screenshots plus console errors, overflow and page height. Pass `reduced` to settle all scroll reveals so the final layout is captured. |
| `node scripts/dev/jpg.mjs` | The same captures as compressed JPEGs, for sending to the client. |
| `node scripts/dev/lcp.mjs [throttle]` | The real LCP element, its timing and the heaviest resources, in a real browser rather than Lighthouse's simulation. Pass `throttle` for 4× CPU. |
| `node scripts/dev/lh-detail.mjs` | Lighthouse's own LCP breakdown, render-blocking and font-display insights, for when a score needs explaining rather than guessing at. |

These are development tools and are not part of the shipped bundle.
