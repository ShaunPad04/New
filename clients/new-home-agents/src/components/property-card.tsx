import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/properties";
import { formatPrice } from "@/lib/properties";
import { ArrowIcon } from "@/components/button";
import { cn } from "@/lib/utils";

/**
 * Listing card — reference "Property card": a 3:2 image with 16px radius
 * and 25px inner padding, a white status pill top-left, a soft dark
 * gradient rising from the bottom, the address at 16px, the price at 28px
 * and the room counts underneath. A 45px arrow disc fades in over 800ms on
 * hover. The whole card is one link.
 */
export function PropertyCard({ property, priority = false, className }: { property: Property; priority?: boolean; className?: string }) {
  const img = property.images[0];
  const price = formatPrice(property);
  return (
    <Link
      href={`/properties/${property.slug}`}
      className={cn("group relative block aspect-[621/420] w-full overflow-hidden rounded-[16px] bg-mist text-white", className)}
      aria-label={`${property.title} — ${price.qualifier ? `${price.qualifier} ` : ""}${price.amount}`}
    >
      {img ? (
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes="(max-width: 809px) 100vw, (max-width: 1199px) 50vw, 621px"
          priority={priority}
          className="object-cover transition-transform duration-[1200ms] ease-out-soft group-hover:scale-[1.04]"
        />
      ) : null}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[54%] bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

      <div className="absolute left-[25px] top-[25px] flex gap-2">
        <span className="rounded-full bg-white px-3 py-1 text-sm text-ink">{property.isNewHome ? "New home" : property.status}</span>
        {property.isNewListing ? <span className="rounded-full bg-ink/70 px-3 py-1 text-sm text-white backdrop-blur-sm">New listing</span> : null}
      </div>

      <span
        aria-hidden="true"
        className="absolute right-[25px] top-[25px] flex h-[45px] w-[45px] items-center justify-center rounded-full bg-white text-ink opacity-0 transition-opacity duration-[800ms] ease-out-soft group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <ArrowIcon className="h-4 w-4" />
      </span>

      <div className="absolute inset-x-[25px] bottom-[25px] flex flex-col gap-1">
        <p className="text-base text-cloud">{property.title}</p>
        <p className="h-sub text-white">
          {price.qualifier ? <span className="mr-2 text-base font-normal text-cloud">{price.qualifier}</span> : null}
          {price.amount}
        </p>
        <Rooms property={property} className="mt-1 text-cloud" />
      </div>
    </Link>
  );
}

export function Rooms({ property, className, dark = false }: { property: Property; className?: string; dark?: boolean }) {
  const items = [
    property.beds != null ? { icon: <BedIcon />, value: property.beds, label: "bedrooms" } : null,
    property.baths != null ? { icon: <BathIcon />, value: property.baths, label: "bathrooms" } : null,
    property.receptions != null ? { icon: <SofaIcon />, value: property.receptions, label: "reception rooms" } : null,
  ].filter(Boolean) as { icon: React.ReactNode; value: number; label: string }[];
  if (!items.length) return null;
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-base", dark && "text-ink", className)}>
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-1.5">
          <span aria-hidden="true" className="opacity-80">{it.icon}</span>
          <span>{it.value}</span>
          <span className="sr-only">{it.label}</span>
        </li>
      ))}
    </ul>
  );
}

export function BedIcon() { return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 15h18M6 9V6a1 1 0 0 1 1-1h4v4M13 9V5h4a1 1 0 0 1 1 1v3" /></svg>; }
export function BathIcon() { return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 12h16v2a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-2zM6 12V5a2 2 0 0 1 4 0M7 19l-1 2M17 19l1 2" /></svg>; }
export function SofaIcon() { return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3M3 13a2 2 0 0 1 2-2 2 2 0 0 1 2 2v2h10v-2a2 2 0 0 1 4 0v4H3v-4zM5 17v2M19 17v2" /></svg>; }
