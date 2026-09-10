import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { EnquiryForm } from "@/components/enquiry-form";
import { Appear } from "@/components/appear";
import { Faq } from "@/components/faq";
import { ClosingCta } from "@/components/closing-cta";
import { intro, site, valuationOptions, faqs } from "@/lib/content";
import { getAllProperties } from "@/lib/properties";

export const metadata: Metadata = {
  title: "Selling your home — request a valuation",
  description: "House to sell? Request a valuation from New Home Agents and take advantage of multi-agency marketing, professional photography and competitive selling fees.",
  alternates: { canonical: "/selling" },
};

export default function SellingPage() {
  // A home with the agency's own For Sale board outside it (Brad's ask), falling back to any resale listing.
  const all = getAllProperties();
  const photo = (all.find((p) => p.id === "12767229") ?? all.find((p) => !p.isNewHome && p.images.length >= 3))?.images[0];
  return (
    <main id="main">
      <PageHero
        eyebrow="House to sell?"
        title="Request a valuation of your property"
        description="If you are interested in one of our properties but have a house to sell, get in touch and take advantage of multi-agency marketing and competitive selling fees."
      />
      <section className="pb-20">
        <div className="container grid gap-8 lg:grid-cols-[620px_1fr] lg:gap-5">
          <Appear className="flex flex-col gap-6">
            <div className="flex flex-col gap-5 overflow-hidden rounded-[20px] bg-ink p-8 text-white">
              <span className="flex h-[45px] w-[45px] items-center justify-center rounded-[10px] bg-white text-ink"><HomeIcon /></span>
              <h2 className="h-label text-white">Selling with New Home Agents</h2>
              <ul className="flex flex-col gap-3 text-base text-cloud">
                {intro.points.map((p) => (
                  <li key={p} className="flex items-start gap-3"><span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-white" />{p}</li>
                ))}
              </ul>
              {photo ? (
                <div className="relative mt-2 aspect-[539/291] overflow-hidden rounded-[12px]">
                  <Image src={photo.src} alt={photo.alt} fill quality={85} sizes="(max-width: 1023px) 100vw, 560px" className="object-cover" />
                </div>
              ) : null}
            </div>
            <div className="rounded-[20px] bg-mist p-8">
              <h2 className="h-sub">Prefer to talk?</h2>
              <p className="mt-2 text-slate">Our team is available {site.openingHours}.</p>
              <p className="mt-4 text-xl font-medium"><a href={site.phoneHref} className="hover:underline">{site.phone}</a></p>
              <p className="mt-1 text-slate"><a href={`mailto:${site.email}`} className="break-all hover:underline">{site.email}</a></p>
            </div>
          </Appear>
          <Appear delay={0.1}>
            <EnquiryForm
              kind="valuation"
              submitLabel="Request a valuation"
              intro="Tell us about you and your property. A member of the team will be in touch to arrange your valuation."
              fields={[
                { name: "name", label: "Full name", required: true, autoComplete: "name", half: true },
                { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", half: true },
                { name: "phone", label: "Telephone", type: "tel", required: true, autoComplete: "tel", half: true },
                { name: "contactMethod", label: "Preferred method of contact", type: "select", options: valuationOptions.contactMethod, half: true },
                { name: "address", label: "Property address", required: true, autoComplete: "street-address" },
                { name: "postcode", label: "Postcode", required: true, autoComplete: "postal-code", half: true },
                { name: "timeframe", label: "When are you thinking of selling?", type: "select", options: valuationOptions.timeframe, half: true },
                { name: "propertyType", label: "Property type", type: "select", options: valuationOptions.propertyType, half: true },
                { name: "bedrooms", label: "Bedrooms", type: "select", options: ["1", "2", "3", "4", "5", "6+"], half: true },
                { name: "condition", label: "Decorative condition", type: "select", options: valuationOptions.condition, half: true },
                { name: "scheme", label: "Are you buying a new build?", type: "select", options: ["No", "Yes — considering part exchange", "Yes — considering assisted move", "Yes — not sure yet"], half: true },
                { name: "message", label: "Additional notes", type: "textarea" },
              ]}
            />
          </Appear>
        </div>
      </section>
      <Faq items={faqs.filter((f) => /sell|Part Exchange|Assisted/i.test(f.q))} />
      <ClosingCta />
    </main>
  );
}

function HomeIcon() { return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9z" /></svg>; }
