"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DEPARTMENT_LABEL, district, locality, priceNumber, type Department, type Property } from "@/lib/properties";
import { PropertyCard } from "./property-card";
import { Appear } from "./appear";

const SALE_PRICES = [100000, 150000, 200000, 250000, 300000, 400000, 500000, 750000, 1000000];
const RENT_PRICES = [500, 600, 700, 800, 900, 1000, 1250, 1500];

const money = (n: number) => `£${n.toLocaleString("en-GB")}`;

const SELECT =
  "mono h-10 w-full appearance-none rounded-[4px] border border-ink-200 bg-white px-3 text-[14px] text-ink-900 outline-none focus:border-ink-900";

type Sort = "price-desc" | "price-asc" | "newest";

export function PropertySearch({ properties }: { properties: Property[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const department: Department = params.get("department") === "residential-lettings" ? "residential-lettings" : "residential-sales";
  const [q, setQ] = useState(params.get("q") ?? "");
  const [minPrice, setMin] = useState(params.get("min") ?? "");
  const [maxPrice, setMax] = useState(params.get("max") ?? "");
  const [beds, setBeds] = useState(params.get("beds") ?? "");
  const [sort, setSort] = useState<Sort>("newest");

  const setDepartment = (d: Department) => {
    const next = new URLSearchParams(params.toString());
    next.set("department", d);
    router.replace(`/search-results?${next.toString()}`, { scroll: false });
    setMin("");
    setMax("");
  };

  const prices = department === "residential-sales" ? SALE_PRICES : RENT_PRICES;

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = properties.filter((p) => p.department === department);
    if (term) list = list.filter((p) => `${p.title} ${locality(p)} ${district(p)} ${p.type}`.toLowerCase().includes(term));
    if (minPrice) list = list.filter((p) => priceNumber(p) >= Number(minPrice));
    if (maxPrice) list = list.filter((p) => priceNumber(p) <= Number(maxPrice));
    if (beds) list = list.filter((p) => Number(p.beds) >= Number(beds));
    if (sort === "price-desc") list = [...list].sort((a, b) => priceNumber(b) - priceNumber(a));
    if (sort === "price-asc") list = [...list].sort((a, b) => priceNumber(a) - priceNumber(b));
    return list;
  }, [properties, department, q, minPrice, maxPrice, beds, sort]);

  return (
    <div className="flex flex-col gap-10">
      <Appear className="flex flex-col gap-5 rounded-lg bg-ink-50 p-5">
        <div className="flex gap-1.5" role="tablist" aria-label="Department">
          {(Object.keys(DEPARTMENT_LABEL) as Department[]).map((d) => (
            <button
              key={d}
              type="button"
              role="tab"
              aria-selected={department === d}
              onClick={() => setDepartment(d)}
              className={`caption2 h-8 rounded-[4px] px-3 transition-colors duration-300 ${department === d ? "bg-ink-900 !text-ink-50" : "bg-white !text-ink-900 hover:bg-ink-200"}`}
            >
              {DEPARTMENT_LABEL[d]}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-3 tablet:grid-cols-5">
          <label className="flex flex-col gap-1 tablet:col-span-2">
            <span className="caption2">Location or postcode</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. Brigg, DN15, bungalow"
              className={SELECT}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="caption2">Min price</span>
            <select value={minPrice} onChange={(e) => setMin(e.target.value)} className={SELECT}>
              <option value="">No min</option>
              {prices.map((p) => (
                <option key={p} value={p}>
                  {money(p)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="caption2">Max price</span>
            <select value={maxPrice} onChange={(e) => setMax(e.target.value)} className={SELECT}>
              <option value="">No max</option>
              {prices.map((p) => (
                <option key={p} value={p}>
                  {money(p)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="caption2">Bedrooms</span>
            <select value={beds} onChange={(e) => setBeds(e.target.value)} className={SELECT}>
              <option value="">Any</option>
              {[1, 2, 3, 4, 5].map((b) => (
                <option key={b} value={b}>
                  {b}+
                </option>
              ))}
            </select>
          </label>
        </div>
      </Appear>

      <div className="flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
        <p className="body-sm" aria-live="polite">
          {results.length} {results.length === 1 ? "property" : "properties"} {DEPARTMENT_LABEL[department].toLowerCase()}
        </p>
        <label className="flex items-center gap-2">
          <span className="caption2">Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={`${SELECT} w-auto`}>
            <option value="newest">Most recent</option>
            <option value="price-desc">Price: high to low</option>
            <option value="price-asc">Price: low to high</option>
          </select>
        </label>
      </div>

      {results.length === 0 ? (
        <div className="rounded-lg bg-ink-50 p-10 text-center">
          <p className="h5">no properties match</p>
          <p className="body-sm mt-2">Try widening the price range, or call your local branch — new instructions arrive every week.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2 desktop:grid-cols-3">
          {results.map((p, i) => (
            <PropertyCard key={p.slug} property={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
