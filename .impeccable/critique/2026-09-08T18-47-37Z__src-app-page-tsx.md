---
target: the home page
total_score: 28
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 3
target_identity: "file:/home/user/New/src/app/page.tsx"
target_fingerprint: "sha256:46d273c70ba67b5b097350af010956205c0054857bad1815f6c84494b29fb981"
target_path: /home/user/New/src/app/page.tsx
timestamp: 2026-09-08T18-47-37Z
slug: src-app-page-tsx
---
Method: dual-agent (A: design review, isolated · B: detector + browser evidence, isolated). Note on ordering: Assessment B returned before Assessment A. The two never saw each other, so A's judgment is unanchored, but the parent context held B's evidence while A was still running.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Form status announced honestly; carousel has a real pause. But 26 viewport-heights on mobile with no progress signal, no indication the sticky stack holds six cards, no active nav state. |
| 2 | Match System / Real World | 3 | Plain British English throughout. "GEO" is sold in the pricing tiers ~2,000px before the band that explains what it is. |
| 3 | User Control and Freedom | 3 | Escape closes the menu, focus returns to trigger, nothing autoplays without a pause. The ~320vh pinned hero can only be escaped by scrolling it. |
| 4 | Consistency and Standards | 3 | High system discipline. Three defects: header surface fails over light grounds; "0.8s" appears twice meaning two different things; three closing-CTA idioms run back to back. |
| 5 | Error Prevention | 3 | Honeypot, no fake success, honest 501 path, budget bands matched to tiers. No inline validation — first error is a native browser bubble on an underline-only field. |
| 6 | Recognition Rather Than Recall | 2 | The builds/retainers toggle hides half the price list; "Everything in Care/Growth" forces recall of an off-screen list, and on mobile it is off-screen and a swipe away. |
| 7 | Flexibility and Efficiency | 2 | Real accelerators exist (direct email/phone, dedicated routes, budget presets), but a 21,990px mobile page offers no jump to pricing or the form; the skip link lands on the hero. |
| 8 | Aesthetic and Minimalist Design | 3 | Genuinely handsome and restrained. Docked for volume: Services alone is 3,711px at 1440, plus three dead bands of 290–500px. |
| 9 | Error Recovery | 3 | The failure path names the direct email rather than shrugging. Field-level failure is browser-native on a borderless input, so an invalid field barely changes appearance. |
| 10 | Help and Documentation | 3 | FAQ, four-step process, payment terms in plain words, privacy notice at point of collection. Strong for a marketing page. |
| **Total** | | **28/40** | **Good — solid foundation, real weak areas** |

Nothing scored n/a: on this surface both 7 and 10 have real, checkable answers.

## Design Specificity Verdict

**Partly authored.** Authored in the copy and the honesty apparatus; category-interchangeable in the composition and the imagery.

**Design review:** The writing is unmistakably this business — "Two founders. No account managers.", the `IN BUILD` and `CONCEPT` badges on the work cards, "we will tell you honestly if we are not the right studio for it", the "run PageSpeed yourself" panel. Almost no agency labels its own portfolio as unlaunched; doing it converts a weakness into proof of the character the copy claims.

The composition is not. The hero is a mountaineer on an alpine ridge — footage with no relationship to a two-person web studio in Britain. Put an outerwear brand, a watch brand or a crypto fund in that wordmark slot and nothing else would need to change. Below it the vocabulary is the current studio-site house kit: monochrome, heavy uppercase display, sticky service stack, double-bezel cards, raked marquee, curtain footer, circled arrow. Each is well executed and each is on a hundred other sites. The one motif that IS the brand — the black line — appears as a hairline in the hero and a divider in the wordmark, then never again in the 18,596px below. A studio named after a line should be drawing with it.

**Deterministic scan:** `detect.mjs` over `src/app` and `src/components` returned exit 2 with two `broken-image` warnings, both in `hero-sequence.tsx` (lines 511 and 519). **Both are false positives** — the matches are the literal string `<img>` inside a JSDoc comment, not markup. The file's only real `<img>` is line 563 with a resolved `src`, confirmed served 200. Net: zero real findings.

**Browser evidence** (production build, 1440x900 and 390x844, Chromium + axe-core): 0 console errors, 0 failed requests, 0 horizontal overflow, CLS 0.000 at both widths, 35 headings with no level skips and exactly one h1, every image carrying an alt attribute, nothing served above 2x its display box, 0 axe violations of any impact at either width, no content stranded invisible under reduced motion, and a visible 2px focus ring on all 15 controls tested. Page weight at 390 is 5.94MB across 126 requests, dominated by the portrait hero frames at ~80–87KB each.

axe returned 161 `incomplete` colour-contrast nodes it could not compute — backgrounds behind the grain pseudo-element, the foil gradient and the hero canvas. Those are undetermined, not passes.

**Visual overlays:** none produced. No browser is presented to a human in this environment, so an on-page overlay would be a claim nobody could verify. The CLI scan and the measurements above are the deterministic signal instead.

## Overall Impression

This is a well-built site with a credibility problem it created for itself, and one visual defect that undercuts the thing it is selling.

The engineering is not in question — the evidence pass found nothing broken at either width. What is in question is whether the page argues. It opens on borrowed footage, spends its longest section on six near-identical plates, promises "Proof, not promises" above two projects that have never launched, and then closes three times in a row, twice with almost the same sentence.

The single biggest opportunity is not more design. It is turning the studio's actual position — new, two people, radically honest about it — from something the page manages around into the argument the page makes.

## What's Working

1. **The honesty apparatus, and the fact that it is visible.** `IN BUILD` / `CONCEPT` status badges, `outcomeNote` on the case study, and the "Measured on this page — run PageSpeed yourself" panel that survives to production while the sample outcomes stay gated. This is the one thing a competitor cannot copy without actually being this careful, and it has real estate rather than a footnote.

2. **The testimonial plate.** One quote at a time, large, black on white — the only inversion on the page — with the others as a labelled topic selector. In a palette with no accent colour, using inversion as the emphasis mechanism is exactly right, and the topics turn four grey rectangles into four different things the studio is praised for.

3. **The curtain footer.** `clip-path` turning `fixed` into "fixed within this box" is a one-line mechanism for an effect most sites spend a scroll listener on. The stacked wordmark, the raked discipline marquee and the ghosted watermark compose into a real end-note rather than a link dump.

## Priority Issues

**[P0] "Proof, not promises." sits above two projects with no results.**
`work.tsx` sets that heading and a standfirst promising every project is "measured against what it was hired to do — enquiries, bookings, revenue". Directly beneath: B Boutique (`IN BUILD`) and The Watch Club (`CONCEPT`). Neither carries a number, because neither has launched.
*Why it matters:* a buyer comparing three studios reads the promise, scans for the number, finds none, and concludes you have no results or are hiding them — worse than the truth, which is "we're new and our first build is in progress".
*Fix:* while `PORTFOLIO_VERIFIED` is false, replace the standfirst with one that owns the stage the work is at, and let the status badges lead rather than fight the heading. Keep "Proof, not promises." for when there are results to print.
*Suggested command:* `/impeccable clarify`

**[P1] The header bleeds over the light sections — confirmed by screenshot.**
`header.tsx` paints the scrolled bar as `bg-ink-0/70 backdrop-blur-2xl`, designed for a black page. Over the three light sections it resolves to a translucent grey band and the section's own black display type shows straight through it. Captured at the Studio section: "TWO" and two lines of body copy read through the bar, and the "Pricing" and "Studio" nav links collide with the black text behind them.
*Why it matters:* it reads as a rendering bug across roughly 40% of the page, on a site whose pitch is craft. This is a regression introduced by today's light-section work.
*Fix:* invert the bar over light grounds — a light surface with dark links — or raise the dark surface to ~0.92 and drop the blur so nothing shows through.
*Suggested command:* `/impeccable polish`

**[P1] Three closes in a row, two of them nearly the same sentence.**
`lets-work.tsx` reveals "Tell us what you are building. We reply within one working day, and we will say honestly if we are not the right studio for it." One screen later `contact.tsx` opens with the heading "Tell us what you are building." and near-identical reassurance copy. Then the footer asks "Ready to begin?" with a third Book a call.
*Why it matters:* near-verbatim self-repetition at the conversion point reads as copy nobody proofread end to end — the worst impression for a studio selling attention to detail.
*Fix:* cut LetsWork's paragraph and email line; let it be the gesture and the arrow into the form. Let `contact.tsx` own the reassurance once. The footer's "Ready to begin?" then becomes a genuine last chance rather than the third ask.
*Suggested command:* `/impeccable clarify`

**[P1] The closing band's primary action has no affordance.**
In `lets-work.tsx` the trigger is the `<h2>` wrapped in a button, presenting as a headline plus a bare circled arrow. What it reveals — the actual "Book a call" — sits in a layer that is `inert` until then. Assessment B confirmed the hidden layer is genuinely removed from hit-testing.
*Why it matters:* a visitor sees a headline and a decorative-looking arrow and moves on; the band's whole purpose never fires.
*Fix:* show the revealed state by default and use the animation as an entrance, or label the circle so the control reads as a control on first sight.
*Suggested command:* `/impeccable clarify`

**[P2] Volume, and dead space inside it.**
18,596px at 1440; 21,990px at 390 — 26 viewport heights on a phone. Services alone is 3,711px for six cards whose content is ~455px against a 512px floor. Three bands carry nothing: ~350px under "Bespoke engagements", ~500px under "Send enquiry", ~290px above Testimonials.
*Why it matters:* the mobile visitor abandons before pricing, which is where the argument is strongest.
*Fix:* cut `py-40` to `py-28` on the light sections, drop the trailing spacers, and consider three service cards plus a link to `/services` rather than all six.
*Suggested command:* `/impeccable layout`

## Persona Red Flags

**Jordan (first-timer):** hits "Trusted by experts. Used by the leaders." over Nvidia, Shopify and React and forms a false model of the studio's size — every honest signal afterwards then reads as contradiction rather than virtue. Cannot tell the sticky stack holds six cards or when it ends. Does not know the `lets-work` headline is a button.

**Riley (stress tester):** notices "Most chosen" on Signature from a studio whose portfolio is one in-build site and one concept. Notices "0.8s Load time (down from 4.2s)" in the sample outcomes 400px above "0.8s Largest paint" in the real standards — verified: both strings exist in `content.ts` at lines 601 and 728 — and correctly concludes one is decorative. Sees black type bleeding through the nav bar on a site claiming 100 for best practices.

**Casey (mobile):** ~320vh of pinned hero before any argument begins, then 26 viewport heights. The skip link goes to `#main`, which is the hero, so it saves nothing. Cannot compare tiers without swiping and holding "Everything in Care" in memory. The direct email in the closing band is a 232x15px target.

**UK owner, £1k–£5k, comparing three studios:** leaves without the two things comparison needs — a live finished client site, and a price sheet that does not make him hold things in memory. He is also told Signature is "most chosen" by a studio he can see has no completed clients, which is the claim most likely to make a careful buyer discount everything else. What would win him — the honesty line, 50/50 payment terms, no minimum term, founders answering their own enquiries — is all present and all buried below the fold.

## Minor Observations

- **Ten interactive elements measure under 44x44 at 390.** The ones that matter: the closing-band email link at 232x15, the header wordmark at 214x16, and the three pricing carousel dots at 32x44 (the 44px claim holds on the vertical axis only). The 1x1 skip link, the honeypot input and the `inert` layer's button are correctly excluded.
- The logo marquee clips NVIDIA and Vercel mid-word at 1440. With the "the stack we build on" label removed, a half-cropped NVIDIA under "Used by the leaders" is the worst possible framing of that mark.
- "AGENCY" in the header wordmark is 9px at `rgb(154,154,154)` — around 2.9:1 on the scrolled bar, effectively invisible over bright hero frames.
- All four footer social marks render as glyphs, not links — verified: every `socials[].href` in `content.ts` is `""`. Four dead icons at the emotional peak.
- `heroDisciplines` lists four; `services` lists six. A desktop visitor reads four disciplines in the hero and "Six disciplines." 3,000px later.
- **CLAUDE.md is stale on two figures** — verified against `content.ts`: retainers are £99/£450/£950, not the £150/£600/£1,200 the doc records, and the GEO after-score is 100, not 89. The code is right; the doc needs reconciling before anyone quotes from memory.

## Questions to Consider

1. **What would this hero be if the black line were the only thing in it?** The footage is a rented mood; the name is a drawing instruction. A scroll-driven sequence in which a single hairline constructs the wordmark, rules a page, or resolves into a layout grid would be unstealable, would cost ~40KB instead of 25MB, and would say "we are the people who make the thing you are looking at" — which is the actual pitch.
2. **What if the site sold the honesty instead of managing around a portfolio it does not have yet?** Turned around — "We're new. Here is exactly what we have built, what it cost, and what we are measuring" — the shortage becomes the differentiator, and it is the one claim an established competitor would find awkward to match.
3. **Does a two-person studio's homepage need six services, three tiers, a toggle, a bespoke band, an FAQ and three closes — or one argument and one form?** What does this page look like at 6,000px?
