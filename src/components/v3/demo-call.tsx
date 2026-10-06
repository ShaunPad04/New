"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * "Talk to our AI receptionist" — a live browser call to the studio's own
 * demo agent (2026-10-06, Brad chose a talk button over a phone number: no
 * number to pay for, no spam calls).
 *
 * NOTHING third-party loads until the visitor presses the button: the Retell
 * SDK is imported on click, so the page's "zero third-party requests" test
 * still holds for every visitor who does not start a call. The key is a
 * Retell PUBLIC key (made for browsers, locked to our domains in Retell's
 * dashboard), never the secret API key. The demo agent itself is capped at
 * a short call length in Retell, and auto-recharge is off on the account,
 * so a misused button can never spend more than the balance.
 */

type Phase = "idle" | "connecting" | "live" | "ended" | "error";
type Session = { end: () => Promise<void> };

const LABEL = "text-[0.75rem] font-bold uppercase tracking-[-0.02em]";
const WAVE = [0.35, 0.6, 0.9, 0.5, 0.75, 1, 0.65, 0.4, 0.8, 0.55, 0.95, 0.45, 0.7, 0.85, 0.5, 0.3, 0.6, 0.9, 0.4, 0.65, 0.5, 0.8];

export function DemoCall({ publicKey, agentId, maxMinutes }: { publicKey: string; agentId: string; maxMinutes: number }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [talking, setTalking] = useState(false);
  const [message, setMessage] = useState("");
  const session = useRef<Session | null>(null);

  // Hang up if the visitor leaves the page mid-call.
  useEffect(() => () => void session.current?.end().catch(() => {}), []);

  async function start() {
    setPhase("connecting");
    setMessage("");
    try {
      const { RetellClient } = await import("retell-client-js-sdk");
      const client = new RetellClient({ key: publicKey });
      session.current = client.createWebCall({
        agent_id: agentId,
        hooks: {
          onStatus: (s) => {
            if (s === "live") setPhase("live");
            if (s === "ended") setPhase((p) => (p === "error" ? p : "ended"));
          },
          onAgentStartTalking: () => setTalking(true),
          onAgentStopTalking: () => setTalking(false),
          onEnd: () => {
            setTalking(false);
            setPhase((p) => (p === "error" ? p : "ended"));
          },
          onError: (e) => {
            setTalking(false);
            setPhase("error");
            setMessage(
              /permission|notallowed/i.test(e.message)
                ? "Your browser blocked the microphone. Allow it for this site and try again."
                : "The demo couldn't connect just now. Try again in a minute, or call us instead.",
            );
          },
        },
      });
    } catch {
      setPhase("error");
      setMessage("The demo couldn't connect just now. Try again in a minute, or call us instead.");
    }
  }

  async function stop() {
    await session.current?.end().catch(() => {});
    session.current = null;
    setTalking(false);
    setPhase("ended");
  }

  const busy = phase === "connecting" || phase === "live";

  return (
    <div className="grid w-full max-w-[24rem] gap-5 text-left">
      <div className="rounded-[18px] border border-white/10 bg-[#0b0b0b] p-5">
        <div className="flex items-center justify-between gap-4">
          <p className={`${LABEL} text-ink-700`}>Black Line receptionist</p>
          <p className={`flex items-center gap-2 text-ink-700 ${LABEL}`}>
            <span aria-hidden="true" className={`size-1.5 rounded-full ${phase === "live" ? "bg-accent" : "bg-ink-600"}`} />
            {phase === "live" ? "Live" : phase === "connecting" ? "Connecting" : "Ready"}
          </p>
        </div>
        <div aria-hidden="true" className={`mt-6 flex h-14 items-center gap-[3px] text-ink-1000 ${phase === "live" && talking ? "ai-wave" : ""}`}>
          {WAVE.map((h, i) => (
            <span
              key={i}
              className="h-full flex-1 rounded-full bg-current transition-transform duration-500"
              style={{ "--h": h, "--i": i, transform: `scaleY(${phase === "live" ? (talking ? h : 0.12) : 0.06})`, opacity: 0.85 } as CSSProperties}
            />
          ))}
        </div>
        <p aria-live="polite" className="mt-4 min-h-[2.75rem] text-[0.875rem] leading-snug text-ink-800">
          {phase === "idle" && "Ask it anything about Black Line: what we build, prices, or how the receptionist would work for your business."}
          {phase === "connecting" && "Connecting. Allow the microphone if your browser asks."}
          {phase === "live" && (talking ? "Speaking…" : "Listening. Go ahead and talk.")}
          {phase === "ended" && "Call ended. That's what your callers would hear."}
          {phase === "error" && message}
        </p>
      </div>

      {busy ? (
        <button type="button" onClick={stop} className={`hero-cta hero-cta-light ${phase === "connecting" ? "pointer-events-none opacity-60" : ""}`}>
          <span className="hero-cta-label">End call</span>
        </button>
      ) : (
        <button type="button" onClick={start} className="hero-cta hero-cta-light">
          <span className="hero-cta-label">{phase === "idle" ? "Talk to our AI receptionist" : "Talk to it again"}</span>
          <svg aria-hidden="true" viewBox="0 0 20 20" className="hero-cta-plus">
            <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      )}
      <p className="text-[0.75rem] leading-relaxed text-ink-600">
        Uses your microphone. Calls end after {maxMinutes} minutes. How the call is handled is in our{" "}
        <Link href="/legal/privacy#who-sees-it" className="text-ink-800 underline underline-offset-4 hover:text-accent">
          privacy policy
        </Link>
        .
      </p>
    </div>
  );
}
