"use client";

import { useEffect, useState } from "react";

/**
 * True below 768px, null until mounted. Chromium ignores the `media`
 * attribute on a <video>'s <source> children (the first source always wins),
 * so a lighter phone encode has to be chosen in script; rendering no source
 * until this resolves means nothing is fetched twice.
 */
export function useMobile(): boolean | null {
  const [mobile, setMobile] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return mobile;
}
