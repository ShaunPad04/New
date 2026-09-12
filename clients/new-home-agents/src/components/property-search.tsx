"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import type { Property, SearchParams, SortKey } from "@/lib/properties";
import { PRICE_STEPS, formatMoney, parseSearchParams, searchProperties } from "@/lib/properties";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";

/**
 * Search + results — reference "Property Listing" page: a #f6f6f6 filter
 * panel (15px radius, 20px padding) on the left with a "Filters / Clear
 * all" header and pill-style options, a two-column card grid on the right.
 *
 * State lives in the URL (?q=&location=&type=&min=&max=&beds=&sort=) so
 * searches can be shared and refreshed. Filtering runs client-side against
 * the snapshot dataset.
 */
export function PropertySearch({
  properties,
  locations,
  initial,
  lockedType,
}: {
  properties: Property[];
  locations: { name: string; count: number }[];
  initial: SearchParams;
  lockedType?: "new" | "resale";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [params, setParams] = useState<SearchParams>({ ...initial, type: lockedType ?? initial.type });
  const [mobileOpen, setMobileOpen] = useState(false);

  // Back/forward navigation is the one external source of URL state; the
  // component owns everything else, so only popstate re-reads the URL.
  useEffect(() => {
    const onPop = () => {
      const q = new URLSearchParams(window.location.search);
      setParams({ ...parseSearchParams(Object.fromEntries(q.entries())), type: lockedType ?? (parseSearchParams(Object.fromEntries(q.entries())).type) });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [lockedType]);

  const ids = useMemo(() => new Set(properties.map((p) => p.id)), [properties]);
  const results = useMemo(() => searchProperties({ ...params, type: lockedType ?? params.type }).filter((p) => ids.has(p.id)), [params, ids, lockedType]);

  function update(patch: Partial<SearchParams>) {
    const next = { ...params, ...patch };
    setParams(next);
    const q = new URLSearchParams(sp.toString());
    const set = (k: string, v: string | number | undefined) => { if (v === undefined || v === "" || v === 0 || v === "all" || v === "newest") q.delete(k); else q.set(k, String(v)); };
    set("q", next.q); set("location", next.location); set("type", lockedType ? undefined : next.type); set("min", next.minPrice); set("max", next.maxPrice); set("beds", next.beds); set("sort", next.sort);
    startTransition(() => router.replace(`${pathname}${q.toString() ? `?${q}` : ""}`, { scroll: false }));
  }

  const active = [params.q, params.location, !lockedType && params.type !== "all" ? params.type : "", params.minPrice, params.maxPrice, params.beds].filter(Boolean).length;
  const reset = () => update({ q: "", location: "", type: lockedType ?? "all", minPrice: undefined, maxPrice: undefined, beds: undefined, sort: "newest" });

  const panel = (
    <div className="flex flex-col gap-6 rounded-[15px] bg-mist p-5">
      <div className="flex items-center justify-between">
        <p className="text-[20px] font-medium text-graphite">Filters</p>
        <button type="button" onClick={reset} className="text-sm text-ink underline-offset-4 hover:underline disabled:opacity-40" disabled={active === 0}>Clear all</button>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="search-q" className="text-sm text-slate">Search</label>
        <input
          id="search-q"
          type="search"
          value={params.q ?? ""}
          onChange={(e) => update({ q: e.target.value })}
          placeholder="Street, area or town"
          className="w-full rounded-[12px] border border-transparent bg-white px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/60"
        />
      </div>

      {!lockedType ? (
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm text-slate">Property type</legend>
          <Pills value={params.type ?? "all"} onChange={(v) => update({ type: v as SearchParams["type"] })} options={[["all", "All"], ["new", "New homes"], ["resale", "Resale"]]} />
        </fieldset>
      ) : null}

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm text-slate">Location</legend>
        <Pills
          value={params.location || ""}
          onChange={(v) => update({ location: v })}
          options={[["", "All"], ...locations.slice(0, 12).map((l) => [l.name, `${l.name}`] as [string, string])]}
        />
        <select
          aria-label="More locations"
          value={params.location || ""}
          onChange={(e) => update({ location: e.target.value })}
          className="mt-1 w-full rounded-[12px] border border-transparent bg-white px-4 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/60"
        >
          <option value="">All locations ({properties.length})</option>
          {locations.map((l) => <option key={l.name} value={l.name}>{l.name} ({l.count})</option>)}
        </select>
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="search-min" className="text-sm text-slate">Min price</label>
          <select id="search-min" value={params.minPrice ?? ""} onChange={(e) => update({ minPrice: e.target.value ? Number(e.target.value) : undefined })} className="w-full rounded-[12px] bg-white px-3 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/60">
            <option value="">No min</option>
            {PRICE_STEPS.map((p) => <option key={p} value={p}>{formatMoney(p)}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="search-max" className="text-sm text-slate">Max price</label>
          <select id="search-max" value={params.maxPrice ?? ""} onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })} className="w-full rounded-[12px] bg-white px-3 py-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/60">
            <option value="">No max</option>
            {PRICE_STEPS.map((p) => <option key={p} value={p}>{formatMoney(p)}</option>)}
          </select>
        </div>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm text-slate">Bedrooms</legend>
        <Pills value={String(params.beds ?? "")} onChange={(v) => update({ beds: v ? Number(v) : undefined })} options={[["", "Any"], ["1", "1+"], ["2", "2+"], ["3", "3+"], ["4", "4+"], ["5", "5+"]]} />
      </fieldset>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[377px_1fr] lg:gap-[30px]">
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="search-filters"
          className="flex w-full items-center justify-between rounded-[12px] bg-mist px-5 py-4 text-base font-medium"
        >
          <span>Filters{active ? ` (${active})` : ""}</span>
          <span aria-hidden="true">{mobileOpen ? "−" : "+"}</span>
        </button>
        <div id="search-filters" className={cn("mt-3", mobileOpen ? "block" : "hidden")}>{panel}</div>
      </div>
      <aside className="hidden lg:block lg:self-start lg:sticky lg:top-[104px]" aria-label="Search filters">{panel}</aside>

      <div>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate" aria-live="polite">
            {pending ? "Updating…" : `${results.length} ${results.length === 1 ? "property" : "properties"}${active ? " match your filters" : ""}`}
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="search-sort" className="text-sm text-slate">Sort</label>
            <select id="search-sort" value={params.sort ?? "newest"} onChange={(e) => update({ sort: e.target.value as SortKey })} className="rounded-[12px] bg-mist px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/60">
              <option value="newest">Latest listed</option>
              <option value="price-desc">Price: high to low</option>
              <option value="price-asc">Price: low to high</option>
              <option value="beds-desc">Most bedrooms</option>
            </select>
          </div>
        </div>

        {results.length ? (
          <ul className="grid gap-[15px] md:grid-cols-2" aria-label="Search results">
            {results.map((p, i) => (
              <li key={p.id}><PropertyCard property={p} priority={i < 2} /></li>
            ))}
          </ul>
        ) : (
          <div className="rounded-[16px] bg-mist px-6 py-16 text-center">
            <p className="h-sub">No properties match those filters.</p>
            <p className="mx-auto mt-3 max-w-[420px] text-slate">Try widening the price range or location, or register with us and we will send you properties that fit as they come to market.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button onClick={reset} variant="secondary" arrow={false}>Reset filters</Button>
              <Button href="/register">Register with us</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Pills({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(([v, label]) => {
        const on = value === v;
        return (
          <button
            key={v || "all"}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(v)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm transition-colors duration-300",
              on ? "bg-ink text-white" : "bg-white text-slate hover:text-ink"
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
