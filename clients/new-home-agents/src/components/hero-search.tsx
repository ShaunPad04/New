"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { PRICE_STEPS, formatMoney } from "@/lib/properties";

/**
 * Property discovery — a compact search bar folded into the hero without
 * disturbing the reference's centred composition. Submits to /properties
 * with the filters in the URL.
 */
export function HeroSearch() {
  const router = useRouter();
  const id = useId();
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [beds, setBeds] = useState("");
  const [max, setMax] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (type !== "all") p.set("type", type);
    if (beds) p.set("beds", beds);
    if (max) p.set("max", max);
    router.push(`/properties${p.toString() ? `?${p}` : ""}`);
  }

  const field = "h-11 w-full rounded-[10px] border-0 bg-white px-3 text-sm text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/60";

  return (
    <form onSubmit={onSubmit} role="search" aria-label="Search properties" className="grid gap-2 rounded-[14px] bg-white/60 p-2 backdrop-blur-md sm:grid-cols-[1.6fr_1fr_1fr_1fr_auto]">
      <label className="sr-only" htmlFor={`${id}-q`}>Location or street</label>
      <input id={`${id}-q`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Town, area or street" className={field} />
      <label className="sr-only" htmlFor={`${id}-type`}>Property type</label>
      <select id={`${id}-type`} value={type} onChange={(e) => setType(e.target.value)} className={field}>
        <option value="all">New homes & resale</option>
        <option value="new">New homes</option>
        <option value="resale">Resale</option>
      </select>
      <label className="sr-only" htmlFor={`${id}-beds`}>Minimum bedrooms</label>
      <select id={`${id}-beds`} value={beds} onChange={(e) => setBeds(e.target.value)} className={field}>
        <option value="">Any beds</option>
        {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+ beds</option>)}
      </select>
      <label className="sr-only" htmlFor={`${id}-max`}>Maximum price</label>
      <select id={`${id}-max`} value={max} onChange={(e) => setMax(e.target.value)} className={field}>
        <option value="">Any price</option>
        {PRICE_STEPS.map((p) => <option key={p} value={p}>Up to {formatMoney(p)}</option>)}
      </select>
      <button type="submit" className="h-11 rounded-[10px] bg-ink px-5 text-sm text-white transition-opacity duration-500 hover:opacity-85">Search</button>
    </form>
  );
}
