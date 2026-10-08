"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { BUSINESS, FAQ, FAQ_TOPICS, LAUNCH, type FaqItem, type FaqTopic } from "@/lib/content";

const b = BUSINESS;
const byTopic = (t: FaqTopic) => FAQ.filter((f) => f.topic === t);
const num = (i: number) => String(i + 1).padStart(2, "0");
const Todo = ({ f }: { f: FaqItem }) => (f.todo && !LAUNCH ? <span className="todo">{f.todo}</span> : null);

/**
 * The FAQ page, three ways while Shaun picks (?v=faq:a|b|c; 8 Oct 2026, "generic and extremely
 * long list"). The questions are nine in three topics now (content/faq.json), and the stray chain
 * photo is gone. The page's heading sits above all three (app/faq/page.tsx).
 *   A  Topics: the three topics as large numbered tabs; one topic's questions at a time, the
 *      first one open, with the ways to ask beside them.
 *   B  Index: every question as a short numbered index on the left; the chosen answer set large
 *      on the right, like a page of a catalogue. Phones get the index with the answer under
 *      each question.
 *   C  At the counter: the questions asked the way they are in the shop, as a conversation with
 *      S&L, like the enquiry chat; the visitor taps the next question and the answer appears.
 */
export default function FaqLayouts() {
  return (
    <>
      <div data-x="faq" data-x-dir="a">
        <FaqTopics />
      </div>
      <div data-x="faq" data-x-dir="b">
        <FaqIndex />
      </div>
      <div data-x="faq" data-x-dir="c">
        <FaqCounter />
      </div>
    </>
  );
}

/* A · Topics */
function FaqTopics() {
  const [topic, setTopic] = useState<FaqTopic>("buy");
  const list = byTopic(topic);
  return (
    <div className="wrap faqA">
      <div className="faqA-tabs" role="tablist" aria-label="Topics">
        {FAQ_TOPICS.map((t, i) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`faqA-tab-${t.id}`}
            aria-selected={topic === t.id}
            aria-controls="faqA-panel"
            className="faqA-tab"
            onClick={() => setTopic(t.id)}
          >
            <span className="faqA-tab-n tnum">{num(i)}</span>
            <span className="faqA-tab-w">{t.label}</span>
          </button>
        ))}
      </div>
      <div className="faqA-body">
        <div id="faqA-panel" role="tabpanel" aria-labelledby={`faqA-tab-${topic}`} className="faqA-list" key={topic}>
          <p className="faqA-line">{FAQ_TOPICS.find((t) => t.id === topic)?.line}</p>
          {list.map((f, i) => (
            <details key={f.q} name="faqA" open={i === 0} className="faqA-q" style={{ "--i": i } as CSSProperties}>
              <summary>
                <span>{f.q}</span>
                <span className="faqA-plus" aria-hidden="true" />
              </summary>
              <div className="faqA-a">
                <div>
                  <p>{f.a}</p>
                  <Todo f={f} />
                </div>
              </div>
            </details>
          ))}
        </div>
        <aside className="faqA-ask" aria-label="Ask the shop">
          <p className="faqA-ask-h">Not here?</p>
          <p className="faqA-ask-p">Ask the counter. We usually reply the same day.</p>
          <div className="faqA-ask-links">
            <Link href="/enquiry" className="ef-send faqA-cta">Ask a question</Link>
            <a href={`tel:${b.phone.e164}`} className="btn btn-metal tnum">{b.phone.display}</a>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* B · Index */
function FaqIndex() {
  const [at, setAt] = useState(0);
  const cur = FAQ[at];
  const topicOf = (f: FaqItem) => FAQ_TOPICS.find((t) => t.id === f.topic)?.label;
  return (
    <div className="wrap faqB">
      <nav className="faqB-index" aria-label="Questions">
        {FAQ_TOPICS.map((t) => (
          <div key={t.id} className="faqB-group">
            <p className="faqB-topic">{t.label}</p>
            <ul>
              {byTopic(t.id).map((f) => {
                const i = FAQ.indexOf(f);
                return (
                  <li key={f.q}>
                    <button type="button" className="faqB-q" aria-pressed={i === at} aria-controls="faqB-answer" onClick={() => setAt(i)}>
                      <span className="faqB-n tnum" aria-hidden="true">{num(i)}</span>
                      <span>{f.q}</span>
                    </button>
                    <div className="faqB-inline" hidden={i !== at}>
                      <p>{f.a}</p>
                      <Todo f={f} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div id="faqB-answer" className="faqB-answer" aria-live="polite">
        <div key={at} className="faqB-page">
          <p className="faqB-meta">
            <span className="tnum">{num(at)}</span> · {topicOf(cur)}
          </p>
          <p className="faqB-h">{cur.q}</p>
          <p className="faqB-a">{cur.a}</p>
          <Todo f={cur} />
          <div className="faqB-nav">
            <button type="button" className="faqB-step" onClick={() => setAt((at + FAQ.length - 1) % FAQ.length)} aria-label="Previous question">
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" className="faqB-step" onClick={() => setAt((at + 1) % FAQ.length)} aria-label="Next question">
              <span aria-hidden="true">→</span>
            </button>
            <Link href="/enquiry" className="faqB-ask">Ask something else</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* C · At the counter */
function FaqCounter() {
  const [asked, setAsked] = useState<number[]>([0]);
  const [topic, setTopic] = useState<FaqTopic | "all">("all");
  const left = FAQ.map((f, i) => i).filter((i) => !asked.includes(i) && (topic === "all" || FAQ[i].topic === topic));
  return (
    <div className="wrap faqC">
      <div className="faqC-card">
        <div className="faqC-head">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.svg" alt="" width={30} height={30} className="faqC-avatar" />
          <p>
            <span className="faqC-who">S&amp;L Jewellers</span>
            <span className="faqC-status">The questions we get asked most at the counter</span>
          </p>
        </div>
        <ol className="faqC-thread" aria-live="polite">
          {asked.map((i) => (
            <li key={i} className="faqC-pair">
              <p className="faqC-bub is-me">{FAQ[i].q}</p>
              <div className="faqC-bub">
                <p>{FAQ[i].a}</p>
                <Todo f={FAQ[i]} />
              </div>
            </li>
          ))}
        </ol>
        <div className="faqC-next">
          <div className="faqC-topics" role="group" aria-label="Topic">
            {[{ id: "all" as const, label: "All" }, ...FAQ_TOPICS].map((t) => (
              <button key={t.id} type="button" className="faqC-chip is-topic" aria-pressed={topic === t.id} onClick={() => setTopic(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
          {left.length ? (
            <ul className="faqC-asks" aria-label="Ask">
              {left.map((i) => (
                <li key={i}>
                  <button type="button" className="faqC-chip" onClick={() => setAsked((a) => [...a, i])}>
                    {FAQ[i].q}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="faqC-done">
              That is everything we get asked. <Link href="/enquiry">Ask us something else</Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
