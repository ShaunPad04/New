import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Appear } from "@/components/appear";
import { EnquiryForm } from "@/components/enquiry-form";
import { PropertyCard } from "@/components/property-card";
import { ClosingCta } from "@/components/closing-cta";
import { site } from "@/lib/content";
import { getAllProperties, getLocations } from "@/lib/properties";

export const metadata: Metadata = {
  title: "Register your interest",
  description: "Register with New Home Agents to receive regular property updates matching the areas, property types and bedrooms you are looking for.",
  alternates: { canonical: "/register" },
};

export default function RegisterPage() {
  const ctaPhoto = getAllProperties().find((x) => x.images.length >= 3 && x.isNewHome);
  const picks = getAllProperties().filter((p) => p.isNewHome && p.images[0]?.local).slice(0, 3);
  const areas = getLocations().slice(0, 40).map((l) => l.name);
  return (
    <main id="main">
      <PageHero
        eyebrow="Register with us"
        title="Hear about the right properties first"
        description="Want to keep up to date with properties you might be interested in? Register with us to receive regular property updates."
      />
      <section className="pb-20">
        <div className="container grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-16">
          <Appear>
            <EnquiryForm
              kind="register"
              submitLabel="Register"
              intro="Tell us what you are looking for and how to reach you."
              fields={[
                { name: "title", label: "Title", type: "select", options: ["Mr", "Mrs", "Miss", "Ms", "Dr", "Mx"], half: true },
                { name: "name", label: "Full name", required: true, autoComplete: "name", half: true },
                { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", half: true },
                { name: "phone", label: "Telephone", type: "tel", autoComplete: "tel", half: true },
                { name: "area", label: "Preferred area", type: "select", options: ["Anywhere in the UK", ...areas], half: true },
                { name: "radius", label: "How wide an area?", type: "select", options: ["Local", "Surrounding", "Wide"], half: true },
                { name: "propertyType", label: "Looking for", type: "select", options: ["New build homes", "Resale homes", "Either"], half: true },
                { name: "minBeds", label: "Minimum bedrooms", type: "select", options: ["1", "2", "3", "4", "5+"], half: true },
                { name: "budget", label: "Budget", type: "text", placeholder: "e.g. up to £350,000", half: true },
                { name: "situation", label: "Do you have a property to sell?", type: "select", options: ["No", "Yes — not yet on the market", "Yes — already on the market", "Yes — sold subject to contract"], half: true },
                { name: "message", label: "Additional notes", type: "textarea" },
              ]}
            />
          </Appear>
          <div className="flex flex-col gap-5">
            <Appear delay={0.1} className="rounded-[20px] bg-ink p-8 text-white">
              <h2 className="h-sub text-white">What happens next</h2>
              <ul className="mt-4 flex flex-col gap-3 text-cloud">
                <li>We match your requirements against new instructions across the UK.</li>
                <li>You receive property updates by your preferred method.</li>
                <li>Call us any day, {site.openingHours}, on <a href={site.phoneHref} className="text-white underline">{site.phone}</a>.</li>
              </ul>
            </Appear>
            {picks.length ? (
              <Appear delay={0.2}>
                <p className="mb-3 text-sm text-slate">Check these out</p>
                <ul className="flex flex-col gap-[15px]">
                  {picks.map((p) => <li key={p.id}><PropertyCard property={p} /></li>)}
                </ul>
              </Appear>
            ) : null}
          </div>
        </div>
      </section>
      <ClosingCta photo={ctaPhoto} />
    </main>
  );
}
