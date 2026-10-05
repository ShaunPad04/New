"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The header's <details> menu, closed by a tap anywhere outside it, by Escape,
 * or by choosing a link (an anchor on the same page would otherwise leave it
 * hanging open). The summary still toggles it as before.
 */
export default function MenuDetails({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const close = () => { d.open = false; };
    const onPointer = (e: PointerEvent) => { if (d.open && !d.contains(e.target as Node)) close(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && d.open) { close(); (d.querySelector("summary") as HTMLElement | null)?.focus(); } };
    const onClick = (e: MouseEvent) => { if ((e.target as HTMLElement).closest("a")) close(); };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    d.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
      d.removeEventListener("click", onClick);
    };
  }, []);
  return (
    <details ref={ref} className={className}>
      {children}
    </details>
  );
}
