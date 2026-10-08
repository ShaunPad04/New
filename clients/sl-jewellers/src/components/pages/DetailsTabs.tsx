"use client";

import { useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { PieceDetails } from "@/lib/piece-details";
import { Ask, Figures, Notes, Rows, Source } from "./details-parts";

/**
 * The product page's details as tabs (Shaun's pick A of three in round 8, 7 Oct 2026, after
 * "it just doesn't look professional, there's just so much"). One group at a time under a tab bar
 * with a sliding underline; arrow keys, Home and End move between tabs, as the WAI tabs
 * pattern has it. Every panel is in the HTML, so the page reads in full without script.
 */
export default function DetailsTabs({ d, ask }: { d: PieceDetails; ask: string }) {
  const tabs: { id: string; label: string; short?: string; body: ReactNode }[] = [
    {
      id: "piece",
      label: "This piece",
      short: "Piece",
      body: (
        <>
          <Figures figures={d.figures} className="pdt-figs" />
          <Rows rows={d.piece} className="is-two" />
        </>
      ),
    },
    ...(d.spec
      ? [
          {
            id: "spec",
            label: "Specification",
            short: "Spec",
            body: (
              <>
                <p className="pdx-lede">{d.spec.lede}</p>
                <div className="pdt-groups">
                  {d.spec.groups.map((g) => (
                    <section key={g.id} aria-label={g.title}>
                      <h3 className="pdx-label">{g.title}</h3>
                      <Rows rows={g.rows} className="is-stacked" />
                    </section>
                  ))}
                </div>
                <Source d={d} />
              </>
            ),
          },
        ]
      : []),
    {
      id: "buying",
      label: "Buying",
      body: (
        <>
          <Rows rows={d.buying} className="is-two" />
          <Ask href={ask} />
        </>
      ),
    },
    { id: "pictures", label: "About the pictures", short: "Pictures", body: <Notes notes={d.notes} /> },
  ];

  const [on, setOn] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  // the underline slides to the selected tab
  useLayoutEffect(() => {
    const move = () => {
      const t = list.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[on];
      if (t && bar.current) bar.current.style.transform = `translateX(${t.offsetLeft}px) scaleX(${t.offsetWidth})`;
    };
    move();
    window.addEventListener("resize", move);
    return () => window.removeEventListener("resize", move);
  }, [on]);

  const key = (e: KeyboardEvent) => {
    const n = tabs.length;
    const next = e.key === "ArrowRight" ? (on + 1) % n : e.key === "ArrowLeft" ? (on - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    setOn(next);
    list.current?.querySelectorAll<HTMLButtonElement>("[role=tab]")[next]?.focus();
  };

  return (
    <div className="pdt">
      <div className="pdt-bar">
        <div ref={list} role="tablist" aria-label="Details" className="pdt-tabs" onKeyDown={key}>
          {tabs.map((t, i) => (
            <button
              key={t.id}
              id={`pdt-tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={i === on}
              aria-controls={`pdt-panel-${t.id}`}
              tabIndex={i === on ? 0 : -1}
              className="pdt-tab"
              onClick={() => setOn(i)}
              aria-label={t.short ? t.label : undefined}
            >
              {/* a phone shows the short name so all four tabs fit across the screen */}
              {t.short ? (
                <>
                  <span className="pdt-long" aria-hidden="true">{t.label}</span>
                  <span className="pdt-short" aria-hidden="true">{t.short}</span>
                </>
              ) : (
                t.label
              )}
            </button>
          ))}
          <span ref={bar} className="pdt-line" aria-hidden="true" />
        </div>
      </div>
      {tabs.map((t, i) => (
        <div key={t.id} id={`pdt-panel-${t.id}`} role="tabpanel" aria-labelledby={`pdt-tab-${t.id}`} hidden={i !== on} className="pdt-panel">
          {t.body}
        </div>
      ))}
    </div>
  );
}
