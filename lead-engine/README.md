# BlackLine Lead Engine

Automated qualified-lead generation for **Cambridge Mews Accommodation**.

## The business model, first

BlackLine Agency is the lead-generation partner. **BlackLine does not provide
the accommodation.** Availability, pricing, quotes, customer communication
after handoff, booking and fulfilment are all Cambridge Mews' side of the
arrangement.

BlackLine's job is to find organisations with a genuine reason to need
somewhere for their people to stay near Cleethorpes, prove it with sources,
and hand Cambridge Mews an opportunity worth their time.

So this is not a CRM, and it is not an accommodation website. It is a
discovery and qualification engine with a review gate and a handoff.

## The loop

```
DISCOVER → RESEARCH → DETECT SIGNAL → QUALIFY → ENRICH → SCORE
    → PREPARE OUTREACH → [BlackLine reviews and contacts]
    → SEND TO CAMBRIDGE MEWS → [they close] → BOOKING → REVENUE
```

The automation runs everything up to the review gate. A person approves,
contacts, and decides what goes over. Nothing reaches Cambridge Mews without
that.

## What it looks for

Not "businesses in Grimsby" — situations that create a need for a bed:

| Source | Example signal |
| --- | --- |
| **Projects** | A contract awarded for work at Immingham |
| **Job signals** | Six-month contract engineering roles at a Humber site |
| **Recruitment** | An agency that repeatedly places workers into the area |
| **Expansion** | A new facility, a major contract, local investment |
| **Public demand** | Someone publicly looking for contractor accommodation |
| **Out-of-region** | A Manchester firm with eight engineers on a Humber job |

That last one is deliberate and is a large part of the strategy. A company
based 150 miles away with work in Immingham is a *better* prospect than a
local one, because its people cannot go home at night.

## The score

100 points, six components, every one of them explainable:

| Component | Max |
| --- | --- |
| Accommodation evidence | 30 |
| Timing | 20 |
| Potential group size | 15 |
| Duration / recurring potential | 15 |
| Geographic relevance | 10 |
| Contactability | 10 |

**A component with no evidence cited against it scores zero.** The score is a
pure function of typed, reviewable inputs — not a number a model felt like
returning. Tiers: 🔥 high intent, 🟡 potential, ⚪ prospect, ❌ disqualified,
with hard gates so nothing reaches high intent without a real workforce signal
and a location near Cleethorpes.

## Honesty rules

The whole system is only worth something if the leads are real. Facts,
inferences and unknowns are kept in three separate categories and never mixed;
contact details are never constructed; commercial terms are never assumed; and
an unconfigured integration says so rather than producing plausible output.

**[docs/INTEGRITY.md](docs/INTEGRITY.md) is the important document in this
repository.** Read it before changing anything in `src/lib/domain/` or
`src/lib/research/`.

## Getting started

```bash
pnpm install
cp .env.example .env     # fill in the keys you have
pnpm db:migrate
pnpm dev
```

Discovery needs `SEARCH_PROVIDER` + `SEARCH_API_KEY` (serper, brave or tavily)
and `ANTHROPIC_API_KEY`. Without them the app runs, tells you exactly what is
missing, and refuses to invent leads to fill the gap. You can still add leads
by hand, score them, draft outreach from the templates, and run the whole
handoff and booking flow.

To see the interface populated before any real discovery has run:

```bash
ALLOW_DEMO_SEED=1 DATABASE_FILE=data/demo.db pnpm demo:seed
DATABASE_FILE=data/demo.db pnpm dev
```

Every seeded record is prefixed `[EXAMPLE]` and cites `example.com`. It
refuses to run against a database that already holds leads.

## Verifying

```bash
pnpm verify      # typecheck → lint → tests → production build
```

`tests/journey.test.ts` runs the full product test end to end against a
temporary database: a discovered opportunity is scored, drafted, contacted,
confirmed, packed, handed over, booked, costed, and attributed back to the
source that found it.

## Screens

| Route | What it is for |
| --- | --- |
| `/` | Metrics, pipeline, review queue, alerts, source performance |
| `/leads` | The lead database, filterable by tier, source, score, status |
| `/leads/[id]` | Evidence, score breakdown, outreach, approval, handoff, booking |
| `/leads/new` | Manual entry, scored on the same rubric |
| `/discovery` | Run discovery, see the queries, read the run history |
| `/handoff` | The Cambridge Mews pack, ready to send |
| `/reports` | The BlackLine lead report for any period |
| `/settings` | Capability status, commercial terms, client configuration |

## API

All of these require `CRON_SECRET`.

| Endpoint | Purpose |
| --- | --- |
| `POST /api/cron/morning` \| `afternoon` \| `weekly` | Scheduled work — see [docs/SCHEDULING.md](docs/SCHEDULING.md) |
| `GET /api/leads` | Read-only export |
| `GET /api/reports/weekly?format=text` | The report as JSON or plain text |

## Stack

Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind v4, and
SQLite through Node's built-in `node:sqlite` — no native modules, no external
database service. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for what the
storage needs.

## Adding a second client

`src/lib/clients/` holds the configuration: ideal customer profiles, target
areas and industries, discovery queries, qualification thresholds, routing,
outreach identity and commercial model. A second client is a second config
object. Nothing multi-tenant has been built ahead of need — the Cambridge Mews
workflow comes first.
