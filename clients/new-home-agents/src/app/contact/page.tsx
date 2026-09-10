import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { Appear } from "@/components/appear";
import { EnquiryForm } from "@/components/enquiry-form";
import { ClosingCta } from "@/components/closing-cta";
import { site, valuationOptions } from "@/lib/content";
import { getAllProperties } from "@/lib/properties";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact New Home Agents for more information on our services, to book a viewing or to request a valuation. Head office in Leeds, open seven days a week.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const photo = getAllProperties().find((p) => p.images.length >= 3)?.images[2];
  const mapQuery = encodeURIComponent(`Hepton Court, Leeds LS9 6PW`);
  return (
    <main id="main">
      <PageHero
        eyebrow="Contact us"
        title="Let's help you find the right home"
        description="Buying one of our properties, or selling through a house builder's part exchange or assisted sale scheme? Get in touch and a member of the team will be in touch."
      />
      <section className="pb-20">
        <div className="container grid gap-5 lg:grid-cols-[620px_1fr]">
          <Appear className="flex flex-col gap-6 overflow-hidden rounded-[20px] bg-ink p-8 text-white">
            <span className="flex h-[45px] w-[45px] items-center justify-center rounded-[10px] bg-white text-ink"><HouseIcon /></span>
            <div>
              <h2 className="h-label text-white">{site.headOffice.label}</h2>
              <address className="mt-2 not-italic text-base text-cloud">{site.headOffice.lines.join(", ")}</address>
            </div>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div><dt className="text-sm text-cloud/70">Telephone</dt><dd className="mt-1 text-lg"><a href={site.phoneHref} className="hover:underline">{site.phone}</a></dd></div>
              <div><dt className="text-sm text-cloud/70">Email</dt><dd className="mt-1 break-all text-lg"><a href={`mailto:${site.email}`} className="hover:underline">{site.email}</a></dd></div>
              <div><dt className="text-sm text-cloud/70">Opening hours</dt><dd className="mt-1 text-lg">{site.openingHours}</dd></div>
              <div><dt className="text-sm text-cloud/70">Directions</dt><dd className="mt-1 text-lg"><a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noopener noreferrer" className="hover:underline">Open in Google Maps ↗</a></dd></div>
            </dl>
            {photo ? (
              <div className="relative mt-auto aspect-[539/291] overflow-hidden rounded-[12px]">
                <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 1023px) 100vw, 560px" className="object-cover" />
              </div>
            ) : null}
          </Appear>
          <Appear delay={0.1}>
            <EnquiryForm
              kind="enquiry"
              submitLabel="Submit an enquiry"
              fields={[
                { name: "name", label: "Full name", required: true, autoComplete: "name", half: true },
                { name: "email", label: "Email", type: "email", required: true, autoComplete: "email", half: true },
                { name: "phone", label: "Telephone", type: "tel", autoComplete: "tel", half: true },
                { name: "contactMethod", label: "Preferred method of contact", type: "select", options: valuationOptions.contactMethod, half: true },
                { name: "subject", label: "Subject", placeholder: "Viewing, valuation, part exchange, mortgages…" },
                { name: "message", label: "Message", type: "textarea", required: true },
              ]}
            />
          </Appear>
        </div>
      </section>
      <section className="section bg-mist">
        <div className="container grid gap-8 md:grid-cols-2">
          <Appear>
            <h2 className="h-sub">Statutory company information</h2>
            <dl className="mt-4 flex flex-col gap-2 text-slate">
              <div><dt className="inline font-medium text-ink">Company name: </dt><dd className="inline">{site.name} is a trading style of {site.legalName}</dd></div>
              <div><dt className="inline font-medium text-ink">Registered address: </dt><dd className="inline">{site.registeredAddress}</dd></div>
              <div><dt className="inline font-medium text-ink">Company number: </dt><dd className="inline">{site.companyNumber}</dd></div>
              <div><dt className="inline font-medium text-ink">VAT number: </dt><dd className="inline">{site.vatNumber}</dd></div>
            </dl>
          </Appear>
          <Appear delay={0.1}>
            <h2 className="h-sub">Complaints</h2>
            <p className="mt-4 text-slate">New Home Agents publishes a complaints procedure and is a member of The Property Ombudsman. If you would like a copy of the procedure, please ask the team by telephone or email and it will be sent to you.</p>
          </Appear>
        </div>
      </section>
      <ClosingCta />
    </main>
  );
}

function HouseIcon() { return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9z" /></svg>; }
