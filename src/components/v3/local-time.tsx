"use client";

import { useEffect, useState } from "react";

/**
 * The studio's local time, Lurais-style ("NEW YORK / 10:38 PM") — here
 * Grimsby, in UK time whatever the visitor's zone. Renders a placeholder on
 * the server so hydration never disagrees with the clock.
 */
export function LocalTime({ className }: { className?: string }) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/London",
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className={className} suppressHydrationWarning>
      {now ?? "--:--"}
    </span>
  );
}
