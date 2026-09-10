import { upload } from "@/lib/assets";
import { DEPARTMENT_LABEL, district, locality, type Property } from "@/lib/properties";
import { Button } from "./button";

export function PropertyCard({ property, index }: { property: Property; index?: number }) {
  const p = property;
  const price = p.qualifier ? `${p.qualifier} ${p.price}` : p.price;
  const specs = [
    { key: "TYPE", value: p.type || "Residential" },
    { key: "LOCATION", value: `${locality(p)}, ${district(p)}` },
    { key: "BEDROOMS", value: p.beds || "—" },
    { key: "PRICE", value: price },
  ];
  return (
    <a href={`/property/${p.slug}`} className="group flex flex-col gap-2">
      <div className="relative aspect-[1.24] overflow-clip rounded-lg bg-ink-50">
        <img
          src={upload(p.images[0])}
          alt={p.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[600ms] ease-[var(--ease-hover)] group-hover:scale-[1.03]"
        />
        <div className="absolute left-4 top-4 rounded-[4px] bg-ink-900/80 px-2 py-1">
          <span className="caption2 !text-ink-50">{p.availability || DEPARTMENT_LABEL[p.department]}</span>
        </div>
        <div className="hover-strip absolute inset-x-0 bottom-0 flex items-center justify-between p-5 opacity-0 transition-opacity duration-[400ms] ease-[var(--ease-hover)] group-hover:opacity-100">
          <span className="body-sm rounded-[4px] bg-ink-50 px-2 py-1 !text-ink-900">{DEPARTMENT_LABEL[p.department].toLowerCase()}</span>
          <Button as="span" variant="icon" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 rounded-lg bg-ink-50 px-5 py-2">
        <h3 className="h6 truncate lowercase">{p.title.replace(/,\s*(DN|LN)\d+.*$/, "")}</h3>
        {typeof index === "number" && <span className="caption shrink-0">[ {String(index + 1).padStart(2, "0")} ]</span>}
      </div>
      <div className="px-5">
        {specs.map((spec, i) => (
          <div
            key={spec.key}
            className={`flex items-center justify-between gap-4 pt-1 pb-2 ${i < specs.length - 1 ? "border-b border-ink-200" : ""}`}
          >
            <span className="caption2">{spec.key}</span>
            <span className="body-sm truncate !text-ink-900">{spec.value}</span>
          </div>
        ))}
      </div>
    </a>
  );
}
