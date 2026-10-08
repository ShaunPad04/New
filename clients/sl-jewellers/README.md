# S&L Jewellers — working copy

The Next.js site that is live at `sl-jewellers-next.vercel.app`, copied here on
5 October 2026 so it can be worked on without touching that deployment.

- **Where it came from:** branch `next-site` of `ShaunPad04/sl-jewellers`, a
  snapshot of the project folder on Shaun's Mac exactly as deployed that day.
  The source photography (`assets/source/`, 209 MB) and the screenshot and
  Lighthouse archives (`docs/screenshots/`, `docs/lighthouse/`) stayed on that
  branch; nothing in the build reads them.
- **Where it deploys:** Vercel project `sl-jewellers-v2` on the
  `black-line-agency` team, root directory `clients/sl-jewellers`. Vercel
  builds it on any push to this repo that changes this folder. `BPLabs` is the
  branch we work on, and this link follows it:
  https://sl-jewellers-v2-git-bplabs-black-line-agency.vercel.app
  It is a preview deployment, so Vercel sends `noindex` with every page and
  search engines will not treat it as a duplicate of the live site.
  The project's production address, https://sl-jewellers-v2.vercel.app, was
  brought up to the newest BPLabs build (37f24d3) on 8 October 2026 at Shaun's
  request ("push it to vercel project as newest S&L"), redeployed as a
  production build of that commit. Production builds get no `noindex`, so that
  address can be indexed; its pages' canonical link points at the BPLabs link
  above (`NEXT_PUBLIC_SITE_URL`). The pre-launch QA work (commits from
  159a7bb on) is on BPLabs and its preview only: production still serves
  37f24d3 until it is redeployed.
- **What it never touches:** the `sl-jewellers-next` project and its link. That
  one is deployed by hand from Shaun's machine with the Vercel CLI and is not
  connected to any repository.

`HANDOVER.md` is the site's own documentation: stack, content files, what it
depends on and how the shop looks after it. Read it before changing anything.

## Run

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build && pnpm start
pnpm typecheck
pnpm lint
```

Build, typecheck and lint all finish with no errors and no warnings (fixed in
the pre-launch QA of 8 October 2026; see "Pre-launch QA" in `HANDOVER.md` for
what was checked and how).

## Environment

Nothing secret is in this folder. The live site's keys are stored as
"sensitive" variables in Vercel, which cannot be read back by anyone, so the
copy starts without them and degrades the way the code intends: the enquiry
form tells the visitor to phone instead, the gold and silver table shows the
grades with "ask" in place of a price, and the Turnstile bot check is off.

To bring those up on `sl-jewellers-v2`, add in Vercel → Settings →
Environment Variables:

| Variable | Needed for | Note |
| --- | --- | --- |
| `RESEND_API_KEY`, `ENQUIRY_FROM_EMAIL`, `ENQUIRY_TO_EMAIL` | the enquiry form | Point `ENQUIRY_TO_EMAIL` at the studio, not the shop, so test enquiries from this copy never reach the client. |
| `METALS_API_KEY` | live gold and silver prices | goldapi.io's free tier is 100 calls a month and the live site uses about 60 of them. One key shared by two deployments would run out mid-month and blank the prices on the live site too. Use a second free key. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | bot check on the form | Optional. A Turnstile site key is bound to hostnames, so the new URL has to be added to the widget in Cloudflare first. |

`NEXT_PUBLIC_SITE_URL` is already set on the project to the link above.

Before launch on the shop's own domain:

- Set `NEXT_PUBLIC_SITE_URL` (Production) to that domain, e.g.
  `https://www.example.co.uk` with no trailing slash, and redeploy. Every
  canonical link, the sitemap, `robots.txt`, `llms.txt` and the share previews
  are built from it.
- Switch on Web Analytics in the Vercel project (Analytics → Enable). The code
  is in place; until it is enabled `/_vercel/insights/script.js` returns 404
  and nothing is counted.
- `HIDE_UNCONFIRMED` does not need setting: production builds already hide
  anything unconfirmed, and previews show it with a TODO badge.
