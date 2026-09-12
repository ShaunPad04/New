import type { Property } from "@/lib/properties";
import { SectionHeading } from "@/components/section-heading";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/button";
import { Appear } from "@/components/appear";

/** "Property listings" — heading with the "Explore All" button, then a 2×2 grid of 621×420 cards with 15px gaps. */
export function Listings({ properties, title = "Latest properties for sale", eyebrow = "Property listings", href = "/properties", cta = "Explore all" }: { properties: Property[]; title?: string; eyebrow?: string; href?: string; cta?: string }) {
  return (
    <section className="relative z-10 bg-white" aria-labelledby="listings-heading">
      <div className="container section">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description="A selection from the homes currently listed with New Home Agents. Search the full list by location, price and bedrooms."
          aside={<Button href={href}>{cta}</Button>}
        />
        <ul className="mt-16 grid gap-[15px] md:grid-cols-2">
          {properties.map((p, i) => (
            <Appear as="li" key={p.id} delay={(i % 2) * 0.1}><PropertyCard property={p} /></Appear>
          ))}
        </ul>
      </div>
    </section>
  );
}
