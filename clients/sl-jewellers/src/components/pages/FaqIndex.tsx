"use client";

import { useState } from "react";
import Link from "next/link";
import { FAQ, FAQ_TOPICS, LAUNCH, type FaqItem, type FaqTopic } from "@/lib/content";

const byTopic = (t: FaqTopic) => FAQ.filter((f) => f.topic === t);
const num = (i: number) => String(i + 1).padStart(2, "0");
const Todo = ({ f }: { f: FaqItem }) => (f.todo && !LAUNCH ? <span className="todo">{f.todo}</span> : null);

/**
 * The FAQ page's body, "Index" (Shaun's pick B of three on 8 Oct 2026, over A Topics and C At
 * the counter): every question as a short numbered index on the left, in its three topics, and
 * the chosen answer set large on the right like a page of a catalogue, with previous and next.
 * Phones get the index with the answer under the chosen question. The page's heading is in
 * app/faq/page.tsx; the nine questions are content/faq.json.
 */
export default function FaqIndex() {
  const [at, setAt] = useState(0);
  // a phone shows the answer under its question; tapping that question again folds it away
  const [shut, setShut] = useState(false);
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
                    <button
                      type="button"
                      className="faqB-q"
                      aria-pressed={i === at}
                      aria-controls="faqB-answer"
                      data-open={i === at && !shut}
                      onClick={() => {
                        setShut(i === at ? !shut : false);
                        setAt(i);
                      }}
                    >
                      <span className="faqB-n tnum" aria-hidden="true">{num(i)}</span>
                      <span>{f.q}</span>
                    </button>
                    <div className="faqB-inline" hidden={i !== at || shut}>
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
