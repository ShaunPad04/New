import type { Metadata } from "next";
import { upload } from "@/lib/assets";
import { surveysPage } from "@/lib/pages";
import { surveyServices } from "@/lib/pages-data";
import { PageHeader } from "@/components/page-header";
import { Appear } from "@/components/appear";
import { Button } from "@/components/button";
import { EnquiryForm } from "@/components/enquiry-form";
import { TeamRow } from "@/components/team-row";
import { Testimonials } from "@/components/testimonials";

export const metadata: Metadata = {
  title: "RICS Chartered Property Surveyors",
  description: surveysPage.copy[0],
};

export default function SurveysPage() {
  return (
    <main>
      <PageHeader
        eyebrow={surveysPage.eyebrow}
        title={surveysPage.title}
        copy={surveysPage.copy[0]}
        image={upload(surveysPage.image)}
        ctas={[{ label: "Request a survey", href: "#request" }]}
      />

      <section className="section">
        <div className="container flex flex-col gap-10 tablet:flex-row">
          <div className="flex flex-1 flex-col gap-5">
            <Appear>
              <p className="caption2">[ NATIONAL COVERAGE, LOCAL KNOWLEDGE ]</p>
            </Appear>
            <Appear delay={0.1}>
              <h2 className="h2">over 35 years of survey and valuation work</h2>
            </Appear>
            <Appear delay={0.2} className="plate p-5">
              <blockquote className="flex flex-col gap-3">
                <p className="body-lg !text-ink-900">“{surveysPage.quote.text}”</p>
                <cite className="caption2 not-italic">
                  {surveysPage.quote.name} — {surveysPage.quote.role}
                </cite>
              </blockquote>
            </Appear>
          </div>
          <div className="flex flex-1 flex-col gap-4 tablet:max-w-[560px]">
            {surveysPage.copy.slice(1).map((p, i) => (
              <Appear key={i} delay={0.2 + i * 0.1}>
                <p className="body">{p}</p>
              </Appear>
            ))}
            <Appear delay={0.5}>
              <p className="body">
                Please contact our Survey Department today to discuss your individual needs. We are happy to advise on which survey will best suit your
                requirements — call{" "}
                <a href={`tel:${surveysPage.contact.phone.replace(/\s/g, "")}`} className="underline underline-offset-4">
                  {surveysPage.contact.phone}
                </a>{" "}
                or email{" "}
                <a href={`mailto:${surveysPage.contact.email}`} className="underline underline-offset-4">
                  {surveysPage.contact.email}
                </a>
                .
              </p>
            </Appear>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <Appear>
              <p className="caption2">[ SERVICES ]</p>
            </Appear>
            <Appear delay={0.1}>
              <h2 className="h2">the surveys we offer</h2>
            </Appear>
          </div>
          <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2 desktop:grid-cols-3">
            {surveyServices.map((s, i) => (
              <Appear key={s.slug} delay={0.1 + (i % 6) * 0.05}>
                <a href={`/rics-chartered-property-surveyors/${s.slug}`} className="group flex h-full flex-col justify-between gap-10 plate p-5 transition-colors duration-300 hover:bg-ink-200">
                  <p className="caption2 border-b border-ink-200 pb-5">[ {String(i + 1).padStart(2, "0")} ]</p>
                  <div className="flex items-end justify-between gap-3">
                    <h3 className="h6">{s.title}</h3>
                    <Button as="span" variant="icon" />
                  </div>
                </a>
              </Appear>
            ))}
          </div>
        </div>
      </section>

      <section id="request" className="section scroll-mt-24">
        <div className="container flex flex-col gap-10 tablet:flex-row">
          <div className="flex flex-1 flex-col gap-3">
            <Appear>
              <p className="caption2">[ REQUEST A SURVEY ]</p>
            </Appear>
            <Appear delay={0.1}>
              <h2 className="h2">how can we help you?</h2>
            </Appear>
            <Appear delay={0.2}>
              <p className="body-sm">Tell us about the property and the report you need and a member of the Survey Department will call you back with a quote.</p>
            </Appear>
          </div>
          <Appear delay={0.2} className="flex-1 tablet:max-w-[560px]">
            <EnquiryForm
              label="Survey request form"
              fields={[
                { name: "name", label: "Name", required: true, autoComplete: "name" },
                { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
                { name: "phone", label: "Telephone", type: "tel", required: true, autoComplete: "tel" },
                { name: "address", label: "Property address", required: true },
                { name: "survey", label: "Survey type", type: "select", required: true, options: surveyServices.map((s) => s.title) },
                { name: "message", label: "Message", type: "textarea" },
              ]}
              submit="Request a survey"
              sent="Request sent"
            />
          </Appear>
        </div>
      </section>

      <Testimonials />
      <TeamRow eyebrow="[ SURVEY STAFF ]" title="the survey department" slugs={surveysPage.team} />
    </main>
  );
}
