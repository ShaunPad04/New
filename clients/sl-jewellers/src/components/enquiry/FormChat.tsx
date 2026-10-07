"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { typeLabel } from "@/lib/enquiry/schema";
import { useEnquiry, type Field, type Values } from "./useEnquiry";
import { Consent, Guards, PhotoDrop, REPLIES, SUBJECTS, SendButton, Sent, ServerError } from "./parts";
import type { BasketItem } from "@/lib/basket";

/**
 * Form C, "Chat with the counter" (Shaun's pick of three, 7 Oct 2026; after 21st's chat
 * composers): the shop asks one thing at a time in message bubbles, the answer goes in the
 * composer at the foot and appears as your own bubble; tap any earlier answer to change it.
 * Buying, a part-exchange or "something else" brings up the shop's own pieces to tap, so the
 * shop knows exactly which one is meant (Shaun: "let them click a specific product"); the
 * basket or a product page's "Ask about this piece" arrives with it already chosen. Under the
 * bubbles it is still one form with the same fields and the same checks.
 */
export type PickPiece = BasketItem;
const PICK_FOR = ["buying", "part-exchange", "other"];
const MAX_PICK = 12;

type Q = { key: Field; ask: string; kind: "choice" | "pieces" | "text" | "area" | "tel" | "email" | "photos" | "reply" | "send"; optional?: boolean };
const ALL: Q[] = [
  { key: "type", ask: "Hello, it's S&L. What can we help with?", kind: "choice" },
  { key: "item", ask: "Is it one of ours? Tap the piece, or carry on if it isn't on the site.", kind: "pieces", optional: true },
  { key: "message", ask: "Tell us about it: which piece, and what would you like to know?", kind: "area" },
  { key: "photos", ask: "Got a photo? It helps us give a straight answer.", kind: "photos", optional: true },
  { key: "name", ask: "Lovely. What's your name?", kind: "text" },
  { key: "phone", ask: "And the best number for you?", kind: "tel" },
  { key: "email", ask: "Your email, so we can send you a copy?", kind: "email" },
  { key: "contact", ask: "How should we get back to you?", kind: "reply" },
  { key: "consent", ask: "Last thing: happy for us to use these details to reply?", kind: "send" },
];

/** Plain words for an answer (also the edit button's label). */
const answerText = (q: Q, v: Values, files: File[], picked: PickPiece[]): string => {
  switch (q.kind) {
    case "choice": return typeLabel(v.type);
    case "pieces": return picked.length ? picked.map((x) => x.title).join("; ") : "Not one from the site";
    case "photos": return files.length ? `${files.length} photo${files.length > 1 ? "s" : ""} attached` : "No photos";
    case "reply": return REPLIES.find((r) => r.value === v.contact)?.label ?? "";
    case "send": return "";
    default: return String(v[q.key as keyof Values] ?? "");
  }
};

/** The shop's pieces as a searchable grid of photos to tap, one or several. */
function PiecePicker({ pieces, sel, setSel, onDone, onNone }: { pieces: PickPiece[]; sel: PickPiece[]; setSel: (s: PickPiece[]) => void; onDone: () => void; onNone: () => void }) {
  const [find, setFind] = useState("");
  const [cat, setCat] = useState("All");
  // whatever arrived already chosen leads the grid; order then stays put while tapping
  const [lead] = useState(() => new Set(sel.map((x) => x.id)));
  const ordered = useMemo(() => [...pieces.filter((p) => lead.has(p.id)), ...pieces.filter((p) => !lead.has(p.id))], [pieces, lead]);
  const cats = useMemo(() => ["All", ...Array.from(new Set(pieces.map((p) => p.category)))], [pieces]);
  const f = find.trim().toLowerCase();
  const list = ordered.filter((p) => (cat === "All" || p.category === cat) && (!f || `${p.title} ${p.category}`.toLowerCase().includes(f)));
  const on = (id: string) => sel.some((x) => x.id === id);
  const toggle = (p: PickPiece) => setSel(on(p.id) ? sel.filter((x) => x.id !== p.id) : sel.length < MAX_PICK ? [...sel, p] : sel);
  return (
    <div className="efc-pick">
      <div className="efc-pick-top">
        <label className="efc-find">
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M13.2 13.2L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          <span className="sr-only">Search the pieces</span>
          <input type="search" value={find} onChange={(ev) => setFind(ev.target.value)} placeholder="Search: Submariner, belcher, bangle…" />
        </label>
        <div className="efc-pick-cats" role="group" aria-label="Category">
          {cats.map((c) => (
            <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <ul className="efc-pick-grid" aria-label="Pieces on the site" data-lenis-prevent>
        {list.map((p) => (
          <li key={p.id}>
            <button type="button" className="efc-piece" aria-pressed={on(p.id)} onClick={() => toggle(p)}>
              <span className="efc-piece-img">
                <Image src={p.image} alt="" fill sizes="120px" />
                <span className="efc-piece-tick" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="12" height="12"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </span>
              <span className="efc-piece-name">{p.title}</span>
            </button>
          </li>
        ))}
        {!list.length && <li className="efc-pick-none">Nothing matches. Carry on and describe it instead.</li>}
      </ul>
      <div className="efc-pick-foot">
        <button type="button" className="efc-none" onClick={onNone}>
          It isn&rsquo;t on the site
        </button>
        <button type="button" className="ef-send efc-go" onClick={onDone} disabled={!sel.length}>
          <span>{sel.length ? `Continue with ${sel.length}` : "Tap a piece"}</span>
        </button>
      </div>
    </div>
  );
}

export default function FormChat({ pieces = [] }: { pieces?: PickPiece[] }) {
  const e = useEnquiry();
  const params = useSearchParams();
  const [at, setAt] = useState(0);
  const [typing, setTyping] = useState(false);
  const [sel, setSel] = useState<PickPiece[]>([]);
  const touched = useRef(false);
  const chosen = useRef(false);
  const thread = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const v = e.values;
  const QUESTIONS = useMemo(() => ALL.filter((x) => x.kind !== "pieces" || (pieces.length > 0 && PICK_FOR.includes(v.type))), [v.type, pieces.length]);
  const q = QUESTIONS[Math.min(at, QUESTIONS.length - 1)];

  // arriving with a piece already chosen (a product page's ?piece=, an old ?item= title, the basket)
  useEffect(() => {
    if (chosen.current) return;
    const id = params.get("piece");
    const title = params.get("item");
    const fromUrl = pieces.filter((p) => p.id === id || (!!title && p.title === title));
    const fromBasket = e.picked.map((b) => pieces.find((p) => p.id === b.id) ?? b);
    const all = [...fromBasket, ...fromUrl.filter((p) => !fromBasket.some((b) => b.id === p.id))].slice(0, MAX_PICK);
    if (all.length) setSel(all);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [e.picked, pieces]);

  // when the subject came with the link (?type=), start at the next question
  useEffect(() => {
    if (!touched.current && v.type && at === 0) setAt(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v.type]);

  // the shop "types" for a moment before each new question; reduced motion skips it
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setTyping(true);
    const t = setTimeout(() => setTyping(false), 520);
    return () => clearTimeout(t);
  }, [at]);
  useEffect(() => {
    const el = thread.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    if (!typing) input.current?.focus({ preventScroll: true });
  }, [at, typing]);

  // a server-side field error jumps back to the question that holds it
  useEffect(() => {
    if (e.status !== "error") return;
    const bad = QUESTIONS.findIndex((x) => e.errors[x.key]);
    if (bad >= 0 && bad < at) setAt(bad);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [e.status, e.errors]);

  if (e.status === "success") return <Sent e={e} />;

  const next = (ev?: FormEvent) => {
    ev?.preventDefault();
    if (q.kind === "send") return void e.submit();
    if (!q.optional && !e.check([q.key])) return;
    setAt(Math.min(at + 1, QUESTIONS.length - 1));
  };
  const pick = (k: keyof Values, val: string) => {
    touched.current = true;
    e.set(k, val as never);
    setTimeout(() => setAt((x) => x + 1), 220);
  };
  const choosePieces = (list: PickPiece[]) => {
    chosen.current = true;
    e.setPicked(list);
    e.set("item", list.map((x) => x.title).join("; ").slice(0, 600));
    setAt(at + 1);
  };
  const askOf = (x: Q) =>
    x.kind === "area" && e.picked.length ? `What would you like to know about ${e.picked.length > 1 ? "them" : "it"}?` : x.ask;

  return (
    <form className="efc" onSubmit={next} noValidate>
      <div className="efc-head">
        <span className="efc-avatar" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.svg" alt="" width="26" height="26" />
        </span>
        <span>
          <span className="efc-who">S&amp;L Jewellers</span>
          <span className="efc-status">Usually replies the same day</span>
        </span>
      </div>

      <div ref={thread} className="efc-thread" aria-live="polite" data-lenis-prevent>
        <p className="efc-day">Today</p>
        <div className="efc-row">
          <div className="efc-bubble">Ask about stock, prices, selling gold or a repair. Your message goes straight to the shop.</div>
        </div>
        {QUESTIONS.slice(0, at + 1).map((x, i) => {
          const done = i < at;
          const ans = done ? answerText(x, v, e.files, e.picked) : "";
          return (
            <div key={x.key}>
              {(done || !typing) && (
                <div className="efc-row">
                  <div className="efc-bubble">{askOf(x)}</div>
                </div>
              )}
              {done && ans && (
                <div className="efc-row is-me">
                  <button type="button" className="efc-bubble is-me efc-edit" onClick={() => setAt(i)} aria-label={`Change your answer: ${ans}`}>
                    {x.kind === "pieces" && e.picked.length ? (
                      <span className="efc-chosen">
                        {e.picked.map((p) => (
                          <span key={p.id} className="efc-chosen-row">
                            <span className="efc-chosen-img">
                              <Image src={p.image} alt="" fill sizes="44px" />
                            </span>
                            {p.title}
                          </span>
                        ))}
                      </span>
                    ) : (
                      ans
                    )}
                    <span className="efc-edit-word" aria-hidden="true">Edit</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {typing && (
          <div className="efc-row" aria-hidden="true">
            <div className="efc-bubble efc-typing"><span /><span /><span /></div>
          </div>
        )}
      </div>

      <div className="efc-composer">
        {q.kind === "choice" && (
          <div className="efc-chips" role="group" aria-label="What is it about?">
            {SUBJECTS.map((s) => (
              <button key={s.value} type="button" className={`efc-chip${v.type === s.value ? " is-on" : ""}`} onClick={() => pick("type", s.value)}>
                <span className="efc-chip-icon" aria-hidden="true">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        )}
        {q.kind === "pieces" && <PiecePicker pieces={pieces} sel={sel} setSel={setSel} onDone={() => choosePieces(sel)} onNone={() => { setSel([]); choosePieces([]); }} />}
        {q.kind === "reply" && (
          <div className="efc-chips" role="group" aria-label="How should we reply?">
            {REPLIES.map((r) => (
              <button key={r.value} type="button" className={`efc-chip${v.contact === r.value ? " is-on" : ""}`} onClick={() => pick("contact", r.value)}>
                <span className="efc-chip-icon" aria-hidden="true">{r.icon}</span>
                {r.label}
              </button>
            ))}
          </div>
        )}
        {q.kind === "photos" && (
          <div className="efc-photos">
            <PhotoDrop e={e} compact />
            <button type="submit" className="ef-send efc-go">
              <span>{e.files.length ? "Continue" : "Skip"}</span>
            </button>
          </div>
        )}
        {(q.kind === "text" || q.kind === "tel" || q.kind === "email" || q.kind === "area") && (
          <div className="efc-type">
            <label htmlFor="efc-input" className="sr-only">{askOf(q)}</label>
            {q.kind === "area" ? (
              <textarea
                ref={input}
                id="efc-input"
                rows={3}
                value={v.message}
                maxLength={3000}
                placeholder={e.picked.length ? "Is it still in? Can I see it on Saturday? (Enter to send)" : "Carat, weight, size, what's wrong with it… (Enter to send)"}
                onChange={(ev) => e.set("message", ev.target.value)}
                onKeyDown={(ev) => { if (ev.key === "Enter" && !ev.shiftKey) { ev.preventDefault(); next(); } }}
                aria-invalid={e.errors.message ? true : undefined}
              />
            ) : (
              <input
                ref={input}
                id="efc-input"
                type={q.kind === "text" ? "text" : q.kind}
                inputMode={q.kind === "tel" ? "tel" : q.kind === "email" ? "email" : undefined}
                autoComplete={q.kind === "text" ? "name" : q.kind}
                value={String(v[q.key as keyof Values] ?? "")}
                onChange={(ev) => e.set(q.key as keyof Values, ev.target.value as never)}
                aria-invalid={e.errors[q.key] ? true : undefined}
                placeholder={q.kind === "tel" ? "07XXX XXXXXX" : q.kind === "email" ? "you@example.com" : "Your name"}
              />
            )}
            <button type="submit" className="efc-send-btn" aria-label="Send answer">
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        )}
        {q.kind === "send" && (
          <div className="efc-final">
            <Consent e={e} />
            <Guards e={e} />
            <SendButton e={e} />
          </div>
        )}
        {e.errors[q.key] && q.kind !== "send" && <p className="ef-err">{e.errors[q.key]}</p>}
        <ServerError e={e} />
      </div>
    </form>
  );
}
