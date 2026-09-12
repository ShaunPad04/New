import type { Metadata } from "next";
import { upload } from "@/lib/assets";
import { contactPage } from "@/lib/pages";
import { social } from "@/lib/content";
import { PageHeader } from "@/components/page-header";
import { Appear } from "@/components/appear";
import { Button } from "@/components/button";
import { EnquiryForm } from "@/components/enquiry-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description: contactPage.copy,
};

export default function ContactPage() {
  return (
    <main>
      <PageHeader eyebrow={contactPage.eyebrow} title={contactPage.title} copy={contactPage.copy} image={upload(contactPage.image)} compact />
      <section className="section">
        <div className="container flex flex-col gap-10 tablet:flex-row">
          <div className="flex flex-1 flex-col gap-5">
            <Appear>
              <p className="caption2">[ SEND A MESSAGE ]</p>
            </Appear>
            <Appear delay={0.1}>
              <h2 className="h2">how can we help?</h2>
            </Appear>
            <Appear delay={0.2}>
              <p className="body-sm">Fill in the form and the right person will call you back, or contact your local office directly below.</p>
            </Appear>
            <Appear delay={0.3} className="flex flex-wrap gap-2.5">
              {social.map((s) => (
                <Button key={s.href} label={s.label} href={s.href} external variant="secondary" />
              ))}
            </Appear>
          </div>
          <Appear delay={0.2} className="flex-1 tablet:max-w-[560px]">
            <EnquiryForm
              label="Contact form"
              fields={[
                { name: "name", label: "Name", required: true, autoComplete: "name" },
                { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
                { name: "phone", label: "Telephone", type: "tel", required: true, autoComplete: "tel" },
                { name: "message", label: "Message", type: "textarea" },
                { name: "source", label: "Where did you hear about us?", type: "select", options: ["Recommendation", "Rightmove", "Google", "Social media", "For Sale board", "Passing the office", "Other"] },
              ]}
              submit="Send message"
              sent="Message sent"
            />
          </Appear>
        </div>
      </section>

      <section className="section">
        <div className="container flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <Appear>
              <p className="caption2">[ OUR OFFICES ]</p>
            </Appear>
            <Appear delay={0.1}>
              <h2 className="h2">contact your local paul fox office</h2>
            </Appear>
          </div>
          <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2 desktop:grid-cols-4">
            {contactPage.offices.map((o, i) => (
              <Appear key={o.name} delay={0.1 + (i % 4) * 0.05}>
                <div className="flex h-full flex-col justify-between gap-8 plate p-5">
                  <div className="flex flex-col gap-3">
                    <p className="caption2 border-b border-ink-200 pb-3">[ {String(i + 1).padStart(2, "0")} ]</p>
                    <h3 className="h5">{o.name}</h3>
                    <address className="body-sm not-italic">
                      {o.lines.map((l) => (
                        <span key={l} className="block">
                          {l}
                        </span>
                      ))}
                    </address>
                  </div>
                  <div className="flex flex-col gap-3">
                    <a href={`tel:${o.phone.replace(/\s/g, "")}`} className="body-sm !text-ink-900">
                      Tel: {o.phone}
                    </a>
                    <Button label={o.href.startsWith("http") ? "Visit site" : "Contact"} href={o.href} external={o.href.startsWith("http")} variant="secondary" />
                  </div>
                </div>
              </Appear>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
