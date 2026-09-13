"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { assistant } from "@/lib/assistant";
import { APPEAR_EASE } from "./appear";
import { ArrowUpRight, Close } from "./icons";

type Turn = { role: "user" | "assistant"; content: string };
type Status = "idle" | "streaming" | "offline" | "error";

const STORAGE_KEY = "pf-chat";
const EASE = { duration: 0.35, ease: APPEAR_EASE } as const;

/** Turn "/path" and "https://…" references in a reply into links. */
function Linkify({ text }: { text: string }) {
  const parts = text.split(/(\bhttps?:\/\/[^\s)]+|(?<![\w/])\/[a-z0-9-]+(?:\/[a-z0-9-]+)*(?:\?[^\s)]*)?)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) return part;
        const external = part.startsWith("http");
        return (
          <a
            key={i}
            href={part}
            className="underline decoration-ink-400 underline-offset-2 hover:decoration-current"
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {part}
          </a>
        );
      })}
    </>
  );
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 4.5h12a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5H9l-4 3v-3H4A1.5 1.5 0 0 1 2.5 13V6A1.5 1.5 0 0 1 4 4.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M6.5 8.5h7M6.5 11h4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Floating assistant. Streams plain text from /api/chat; when the route says
 * it is offline (no API key configured) the panel shows the phone number
 * instead of a fake reply. The thread survives page changes via sessionStorage.
 */
export function ChatWidget() {
  const [open, setOpen] = useState(false);
  // The thread only renders inside the (initially closed) panel, so reading
  // sessionStorage in the initialiser cannot cause a hydration mismatch.
  const [turns, setTurns] = useState<Turn[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.sessionStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Turn[]) : [];
    } catch {
      return [];
    }
  });
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(turns.slice(-30)));
    } catch {
      /* ignore */
    }
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [turns]);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || status === "streaming") return;
      const thread: Turn[] = [...turns, { role: "user", content }];
      setTurns([...thread, { role: "assistant", content: "" }]);
      setDraft("");
      setStatus("streaming");

      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: thread }),
          signal: controller.signal,
        });
        if (res.status === 503) {
          setTurns(thread);
          setStatus("offline");
          return;
        }
        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let reply = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          reply += decoder.decode(value, { stream: true });
          const snapshot = reply;
          setTurns([...thread, { role: "assistant", content: snapshot }]);
        }
        setStatus("idle");
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          setStatus("idle");
          return;
        }
        setTurns(thread);
        setStatus("error");
      } finally {
        abortRef.current = null;
      }
    },
    [status, turns],
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void send(draft);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(draft);
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setTurns([]);
    setStatus("idle");
  };

  const busy = status === "streaming";
  const showSuggestions = turns.length === 0 && status === "idle";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.section
            key="panel"
            role="dialog"
            aria-label={assistant.name}
            className="fixed bottom-[88px] right-4 z-50 flex h-[min(560px,calc(100dvh-112px))] w-[calc(100vw-32px)] max-w-[380px] flex-col overflow-clip rounded-lg bg-white shadow-[0_24px_64px_-24px_rgba(20,27,52,0.45),inset_0_0_0_1px_rgba(27,27,40,0.12)] tablet:right-6"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={EASE}
          >
            <header className="flex items-center justify-between gap-3 bg-ink-900 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-50 text-ink-900">
                  <ChatIcon />
                </span>
                <div className="flex flex-col">
                  <span className="body-sm !text-ink-50">{assistant.name}</span>
                  <span className="caption !text-ink-300">Typically replies in seconds</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {turns.length > 0 && (
                  <button
                    type="button"
                    onClick={reset}
                    className="caption2 rounded-[4px] px-2 py-1 !text-ink-300 transition-colors duration-300 hover:bg-ink-800 hover:!text-ink-50"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="flex h-8 w-8 items-center justify-center rounded-[4px] text-ink-50 transition-colors duration-300 hover:bg-ink-800"
                >
                  <Close />
                </button>
              </div>
            </header>

            <div ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto bg-ink-50 p-4" data-lenis-prevent aria-live="polite">
              <Bubble role="assistant">{assistant.greeting}</Bubble>
              {turns.map((t, i) => (
                <Bubble key={i} role={t.role}>
                  {t.content ? (
                    <Linkify text={t.content} />
                  ) : (
                    <span className="flex items-center gap-1 py-1" aria-label="Thinking">
                      {[0, 1, 2].map((n) => (
                        <motion.span
                          key={n}
                          className="block h-1.5 w-1.5 rounded-full bg-ink-500"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: n * 0.18 }}
                        />
                      ))}
                    </span>
                  )}
                </Bubble>
              ))}
              {status === "offline" && (
                <Bubble role="assistant">
                  {assistant.offline}{" "}
                  <a href="tel:01724282868" className="underline underline-offset-2">
                    01724 282868
                  </a>{" "}
                  or <a href="/contact" className="underline underline-offset-2">contact us</a>.
                </Bubble>
              )}
              {status === "error" && <Bubble role="assistant">Something went wrong sending that. Please try again.</Bubble>}
              {showSuggestions && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {assistant.suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void send(s)}
                      className="caption2 rounded-full bg-white px-3 py-1.5 !text-ink-700 shadow-[inset_0_0_0_1px_rgba(27,27,40,0.12)] transition-colors duration-300 hover:bg-ink-900 hover:!text-ink-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-2 border-t border-ink-200 bg-white p-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={1}
                  maxLength={2000}
                  placeholder={assistant.placeholder}
                  aria-label="Your message"
                  disabled={status === "offline"}
                  className="body-sm max-h-[120px] min-h-[40px] flex-1 resize-none rounded-[6px] bg-ink-50 px-3 py-2.5 !text-ink-900 outline-none ring-1 ring-ink-200 transition-shadow duration-300 placeholder:text-ink-400 focus:ring-ink-900 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={busy || !draft.trim() || status === "offline"}
                  aria-label="Send"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] bg-ink-900 text-ink-50 transition-opacity duration-300 disabled:opacity-40"
                >
                  {busy ? <span className="spinner" /> : <ArrowUpRight />}
                </button>
              </div>
              <p className="caption !text-ink-500">{assistant.disclaimer}</p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Chat with us"}
        className="fixed bottom-4 right-4 z-50 flex h-14 items-center gap-2.5 rounded-full bg-ink-900 pl-4 pr-5 text-ink-50 shadow-[0_16px_40px_-16px_rgba(20,27,52,0.6)] tablet:right-6 tablet:bottom-6"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, mass: 0.6 }}
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          <AnimatePresence initial={false} mode="wait">
            {open ? (
              <motion.span key="x" className="absolute" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Close size={18} />
              </motion.span>
            ) : (
              <motion.span key="c" className="absolute" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <ChatIcon />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        <span className="caption2 !text-ink-50">{open ? "Close" : "Chat with us"}</span>
      </motion.button>
    </>
  );
}

function Bubble({ role, children }: { role: Turn["role"]; children: React.ReactNode }) {
  const mine = role === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`body-sm max-w-[85%] whitespace-pre-wrap rounded-lg px-3.5 py-2.5 leading-[1.4] ${
          mine ? "rounded-br-[4px] bg-ink-900 !text-ink-50" : "rounded-bl-[4px] bg-white !text-ink-900 shadow-[inset_0_0_0_1px_rgba(27,27,40,0.1)]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
