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
```

`pnpm lint` fails as of the snapshot: the `@rushstack/eslint-patch` in the
lockfile does not recognise the ESLint 9.39 that sits next to it. The live
site was built from the same lockfile, so this is inherited, not introduced
here. `next build` reports it as a warning and completes.

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
