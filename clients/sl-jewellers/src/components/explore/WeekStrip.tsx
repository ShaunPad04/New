"use client";

import { useEffect, useState } from "react";
import { BUSINESS, hasTimes, type DayKey } from "@/lib/content";
import { DAYS, DAY_LABEL, localParts } from "@/lib/hours";

/** The week as seven cells, today's marked once the page knows the shop's local day (Visit C, round 4). */
export default function WeekStrip() {
  const [today, setToday] = useState<DayKey | null>(null);
  useEffect(() => setToday(localParts(new Date(), BUSINESS.hours.timezone).day), []);
  const week = BUSINESS.hours.week;
  return (
    <ol className="wk tnum" aria-label="Opening hours">
      {DAYS.map((d) => {
        const h = week[d];
        return (
          <li key={d} className={d === today ? "is-today" : ""} aria-current={d === today ? "date" : undefined}>
            <span className="wk-day" aria-hidden="true">{d.slice(0, 3)}</span>
            <span className="sr-only">{DAY_LABEL[d]} </span>
            {hasTimes(h) ? (
              <span className="wk-time">
                <span>{h.open}</span>
                <span className="sr-only"> to </span>
                <span>{h.close}</span>
              </span>
            ) : (
              <span className="wk-time wk-appt">{h ? "By appt." : "Closed"}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
