import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { getAllProperties } from "@/lib/properties";
import { Appear } from "@/components/appear";
import { EnquiryForm } from "@/components/enquiry-form";
import { ClosingCta } from "@/components/closing-cta";
import { mortgages, site, valuationOptions } from "@/lib/content";

export const metadata: Metadata = {
  title: "Mortgages — New Home Mortgages",
  description: "Mortgage and protection advice seven days a week from New Home Mortgages, a trading name of Fairstone Mortgage Solutions Ltd, for new homes, first time buyers, buy to let and re-mortgages.",
  alternates: { canonical: "/mortgages" },
};

export default function MortgagesPage() {
  const ctaPhoto = getAllProperties().find((x) => x.images.length >= 3 && x.isNewHome);
  return (
    <main id="main">
      <PageHero eyebrow="Mortgages" title={mortgages.title} description={mortgages.strapline} />
      <section className="pb-20">
        <div className="container grid gap-10 lg:grid-cols-[minmax(0,1fr)_480px] lg:gap-16">
          <div className="flex flex-col gap-8">
            <Appear className="flex flex-col gap-4 text-lg text-slate">
              {mortgages.paragraphs.map((p) => <p key={p}>{p}</p>)}
            </Appear>
            <Appear>
              <h2 className="h-sub">Expert advice on all aspects of</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                {mortgages.expertise.map((e) => (
                  <li key={e.label} className="rounded-[15px] bg-mist p-5">
                    <p className="font-medium">{e.label}</p>
                    <p className="mt-2 text-sm text-slate">{e.detail}</p>
                  </li>
                ))}
              </ul>
            </Appear>
            <Appear>
              <p className="rounded-[12px] border border-hairline p-5 text-sm leading-relaxed text-slate">{mortgages.regulatory}</p>
              <p className="mt-3 text-xs text-slate">Your home may be repossessed if you do not keep up repayments on your mortgage. Advice is provided by New Home Mortgages, not by New Home Agents.</p>
            </Appear>
          </div>
          <Appear delay={0.1}>
            <EnquiryForm
              kind="enquiry"
              context={{ topic: "Mortgage enquiry" }}
              submitLabel="Ask about a mortgage"
              intro={`Ask for a call back from the mortgage team, or call ${site.phone}.`}
              fields={[
                { name: "name", label: "Full name", required: true, autoComplete: "name" },
                { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
                { name: "phone", label: "Telephone", type: "tel", required: true, autoComplete: "tel" },
                { name: "contactMethod", label: "Preferred method of contact", type: "select", options: valuationOptions.contactMethod },
                { name: "message", label: "What do you need help with?", type: "textarea", placeholder: "First time buyer, moving home, buy to let, re-mortgage…" },
              ]}
            />
          </Appear>
        </div>
      </section>
      <ClosingCta photo={ctaPhoto} />
    </main>
  );
}
