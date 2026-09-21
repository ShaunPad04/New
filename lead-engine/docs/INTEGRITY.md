# Data integrity rules

A lead-generation system is worth exactly what its leads are worth. A
fabricated contact, an invented project or a guessed phone number does not
just waste BlackLine's time — it damages the client relationship the moment
Cambridge Mews acts on it. These rules are enforced in code, not by
convention.

## 1. Three categories, never mixed

Every claim about the outside world is one of:

| Kind | Meaning | Where it appears |
| --- | --- | --- |
| **Verified** | A source states it. Carries a URL and a date. | `Evidence.kind === "verified"` |
| **Inference** | We concluded it from verified facts. Phrased as a possibility. | `Evidence.kind === "inference"` |
| **Unknown** | It matters, and nothing establishes it. | `Evidence.kind === "unknown"` |

The lead detail page and the handoff pack both render these as three separate
sections with three separate headings. An inference never quietly becomes a
fact on the way to the client.

## 2. No points without a source

`scoreLead()` gates every one of the six components on the evidence cited for
it. A component with an empty `evidenceIds` array scores **zero**, and the
reason shown to the reviewer says so. This is why the score is defensible:
you can click through from any number to the source that earned it.

See `src/lib/domain/scoring.ts` and the tests in `tests/scoring.test.ts`.

## 3. The model extracts; the code decides

The Claude call in `src/lib/research/analyse.ts` returns **facts and quotes**.
It does not return a score, a tier, a distance band, or a contactability
rating. Those are computed from the extracted facts by pure functions, so:

- the same evidence always produces the same score;
- changing the rubric re-scores everything consistently;
- nobody has to trust a model's opinion about commercial value.

The extraction prompt forbids constructing a contact detail that is not
literally in the page text — no building `firstname@company.com` from a name
and a domain.

## 4. Geography is computed, not guessed

`bandForLocation()` resolves a place name against a table of coordinates and
returns `unknown` when it recognises nothing. An unknown location scores zero
on geographic relevance rather than being charitably assumed to be nearby.

## 5. Outreach asks; it never asserts

BlackLine does not know that a prospect needs accommodation — that is the
question being asked. Drafts:

- are written as BlackLine, never as Cambridge Mews;
- never state a room, a rate or an availability, because BlackLine does not
  hold that information;
- never tell the prospect they need accommodation;
- always give them an easy way to say no.

`ClientConfig.outreach.forbiddenClaims` lists the phrasings that must not
appear. Any AI-written draft containing one is discarded in favour of the
honest template. Publishing misleading commercial claims is an offence under
the CPUTRs in the UK; this is not only a style rule.

## 6. Commercial terms are never assumed

`CommercialModel` defaults to `unconfigured`. Until someone records the
agreement, every fee and commission figure reads "Not available" with the
reason attached, rather than showing a number nobody agreed.

## 7. Unconfigured means unconfigured

No integration is stubbed with sample output. If `SEARCH_PROVIDER` is unset,
discovery records a run with status `unconfigured` and an explanation. The
dashboard shows which capabilities are missing. An engine that silently
cannot search is worse than one that says so.

## 8. Example data is labelled and refuses to hide

`scripts/demo-seed.ts` exists so the interface can be reviewed before real
discovery has run. It requires `ALLOW_DEMO_SEED=1`, refuses to touch a
database that already holds leads, prefixes every record with `[EXAMPLE]`,
cites `example.com`, and writes a note on each lead telling you to delete it.

## 9. Collection is polite and public-only

`src/lib/research/fetch.ts` reads `robots.txt` before every fetch, identifies
itself with a contact address, caps page size, and only accepts HTML. The
engine reads public business information. It does not authenticate, create
accounts, work around anti-bot measures, or collect personal data beyond the
business contact details a company publishes about itself.
