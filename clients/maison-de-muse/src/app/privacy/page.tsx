import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHeader } from "@/components/page-header";
import { BreadcrumbJsonLd } from "@/components/structured-data";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How the ${site.name} website handles your information.`,
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

/**
 * The site sets no cookies, runs no analytics and has no forms. This page
 * says so plainly, and names the café as the contact for anything else.
 * Add a cookie notice only if non-essential tracking is ever introduced.
 */
export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbJsonLd name="Privacy" path="/privacy" />
      <main id="main" className="flex-1">
        <PageHeader crumb="Privacy" eyebrow="The small print" title="Your" accent="privacy." />
        <section
          aria-label="Privacy notice"
          className="mx-auto w-full max-w-[1400px] px-6 pb-24 sm:px-10 lg:px-16 lg:pb-36"
        >
          <div className="max-w-[62ch] space-y-6 leading-relaxed text-espresso-soft">
            <p>
              This website does not set cookies, does not run analytics or
              advertising scripts, and does not include forms. Nothing you do
              on these pages is recorded by {site.name}.
            </p>
            <p>
              If you call, email or message the café, the details you share are
              used only to reply to you and to look after your visit. They are
              not sold or passed on.
            </p>
            <p>
              Links to Google Maps, Instagram, Facebook, Tripadvisor and the
              Food Standards Agency open those services, which have their own
              privacy notices.
            </p>
            <p>
              Questions about your information: email{" "}
              <a href={`mailto:${site.email}`} className="link-line text-espresso">
                {site.email}
              </a>{" "}
              or write to {site.name}, {site.address.street}, {site.address.town}{" "}
              {site.address.postcode}.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
