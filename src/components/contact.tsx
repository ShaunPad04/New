import { site } from "@/lib/content";
import { ContactForm } from "./contact-form";

/** The contact section's server half: hands the form only what it shows. */
export function Contact() {
  return (
    <ContactForm
      site={{ email: site.email, phone: site.phone, phoneHref: site.phoneHref, currencySymbol: site.currencySymbol }}
    />
  );
}
