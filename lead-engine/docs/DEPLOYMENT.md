# Deployment

## What the storage needs

The database is SQLite, through Node's built-in `node:sqlite` — no native
build step, no external service. It needs **a disk that survives between
requests**.

That rules out a plain serverless deployment. Vercel's Lambda filesystem is
ephemeral, so a Vercel deployment would lose every lead between invocations.
Pick one of:

- **A small VPS or container host with a volume** (Fly.io, Railway, Render, a
  Hetzner box). Mount a volume, point `DATABASE_FILE` at it, run
  `pnpm build && pnpm start`. This is the simplest correct option.
- **Vercel plus a hosted Postgres**, if Vercel is a hard requirement. The
  repository layer is deliberately confined to `src/lib/db/`; adding a
  Postgres driver means reimplementing that directory against `pg` and
  nothing else. The rest of the application talks to the functions in
  `leads.ts`, `runs.ts`, `notifications.ts` and `settings.ts`, not to SQL.

## Run it

```bash
pnpm install
cp .env.example .env
# fill in SEARCH_PROVIDER, SEARCH_API_KEY, ANTHROPIC_API_KEY, CRON_SECRET
pnpm db:migrate
pnpm build
pnpm start
```

## Backups

The whole database is one file. Copy it. With WAL enabled, take the copy with
`sqlite3 data/lead-engine.db ".backup /backups/lead-engine-$(date +%F).db"`
rather than `cp`, so you never catch it mid-write.

## Access

There is no authentication in this application. It is an internal tool and
assumes it sits behind something — a private network, an authenticating
reverse proxy, Cloudflare Access, or Vercel's deployment protection. Do not
put it on the open internet as-is. The `/api/*` endpoints are separately
protected by `CRON_SECRET`, but the pages are not.

## Node version

Node 22.6 or later, for `node:sqlite`. It prints an experimental-feature
warning on startup; that is expected.
