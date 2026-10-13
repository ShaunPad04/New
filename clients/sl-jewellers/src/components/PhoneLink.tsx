"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { BUSINESS } from "@/lib/business";

/**
 * The shop's phone number as a link (Shaun, 13 Oct 2026: "the contact number button is dead").
 * On a phone or tablet it is a plain tel: link and opens the dialler. On a computer a tel: link
 * mostly does nothing visible, so there a click copies the number to the clipboard and the link
 * says "Copied 07383 376663" for a moment (announced to screen readers too), then reads as before.
 * The href stays tel: throughout, so a computer with a softphone still gets its chance: the copy
 * only takes over when the pointer is a mouse or trackpad.
 */
export default function PhoneLink({ className, children, label }: { className?: string; children: ReactNode; label?: string }) {
  const b = BUSINESS;
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return; // a phone dials
    if (!navigator.clipboard?.writeText) return; // then let the browser try tel:
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(b.phone.display);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* no clipboard: nothing to do, the number is on the screen */
    }
  };

  return (
    <a href={`tel:${b.phone.e164}`} className={className} aria-label={label} onClick={onClick} data-copied={copied || undefined}>
      {copied ? (
        <span className="phone-copied" role="status">
          Copied {b.phone.display}
        </span>
      ) : (
        children
      )}
    </a>
  );
}
