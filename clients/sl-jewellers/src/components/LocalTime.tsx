"use client";

import { useEffect, useState } from "react";

/** The time in Cleethorpes, ticking (footer option B, after Monolog's footer). Empty until it
 *  mounts, so the server and the first paint never disagree. */
export default function LocalTime() {
  const [t, setT] = useState("");
  useEffect(() => {
    const f = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const tick = () => setT(f.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="tnum" suppressHydrationWarning>{t || " "}</span>;
}
