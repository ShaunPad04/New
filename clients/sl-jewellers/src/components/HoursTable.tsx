"use client";

import { useEffect, useState } from "react";
import { hasTimes, type DayHours, type DayKey } from "@/lib/content";
import { DAYS, DAY_LABEL, localParts } from "@/lib/hours";

export default function HoursTable({ week, timeZone }: { week: Record<DayKey, DayHours>; timeZone: string }) {
  const [today, setToday] = useState<DayKey | null>(null);
  useEffect(() => {
    setToday(localParts(new Date(), timeZone).day);
  }, [timeZone]);

  return (
    <table className="hours mt-3 tnum">
      <caption className="sr-only">Opening hours</caption>
      <tbody>
        {DAYS.map((d) => {
          const h = week[d];
          const isToday = d === today;
          return (
            <tr key={d} className={isToday ? "today" : ""}>
              <td>
                {DAY_LABEL[d]}
                {isToday && <span className="sr-only"> (today)</span>}
              </td>
              <td className="text-right">{hasTimes(h) ? `${h.open} – ${h.close}` : h ? "By appointment" : "Closed"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
