# Scheduled discovery

The engine has no background runtime of its own. It exposes three endpoints
and expects the deployment's existing scheduler to call them. Every call needs
`CRON_SECRET`, sent as `Authorization: Bearer <secret>` or `X-Cron-Secret`.

| Endpoint | Suggested cadence | What it does |
| --- | --- | --- |
| `POST /api/cron/morning` | Weekdays, early | Searches projects, jobs, recruitment, expansion and public demand |
| `POST /api/cron/afternoon` | Weekdays, midday | Re-checks the fast-moving sources and raises follow-ups that are due |
| `POST /api/cron/weekly` | Monday morning | Builds the BlackLine lead report and raises it as an alert |

## Vercel

```json
{
  "crons": [
    { "path": "/api/cron/morning", "schedule": "0 7 * * 1-5" },
    { "path": "/api/cron/afternoon", "schedule": "0 13 * * 1-5" },
    { "path": "/api/cron/weekly", "schedule": "0 8 * * 1" }
  ]
}
```

Vercel cron sends `GET`, so add a `GET` export that delegates to `POST` if you
use it, and set `CRON_SECRET` as a project environment variable.

## Anything with cron

```
0 7 * * 1-5 curl -fsS -X POST -H "Authorization: Bearer $CRON_SECRET" https://lead-engine.internal/api/cron/morning
```

## GitHub Actions

```yaml
on:
  schedule:
    - cron: "0 7 * * 1-5"
jobs:
  discover:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -fsS -X POST \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            "${{ vars.LEAD_ENGINE_URL }}/api/cron/morning"
```

## Cost

Each run fetches and analyses up to `maxPages` pages (40 by default), one
Claude call per page. Lower `maxPages`, or narrow the source list, to cap the
spend on a run. The run history on `/discovery` records how many candidates
each run actually analysed.
