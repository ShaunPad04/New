import { Suspense } from "react";
import { BUSINESS, WHATSAPP_ON, whatsappUrl } from "@/lib/content";
import { ICONS } from "@/components/SocialLinks";
import EnquiryForm from "@/components/EnquiryForm";

const b = BUSINESS;
const MAIL = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4 6h16v12H4z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);
const PIN = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

/** The four ways to reach the shop besides the form, as tappable pills with their glyphs. */
export function ContactPills({ className = "" }: { className?: string }) {
  return (
    <ul className={`enq-pills ${className}`}>
      <li>
        <a href={`tel:${b.phone.e164}`} className="enq-pill">
          <span className="enq-pill-icon">{ICONS.phone}</span>
          <span>
            Call <span className="tnum">{b.phone.display}</span>
          </span>
        </a>
      </li>
      {WHATSAPP_ON && (
        <li>
          <a href={whatsappUrl()} target="_blank" rel="noopener" className="enq-pill">
            <span className="enq-pill-icon">{ICONS.whatsapp}</span>
            <span>WhatsApp the shop</span>
          </a>
        </li>
      )}
      <li>
        <a href={`mailto:${b.email}`} className="enq-pill">
          <span className="enq-pill-icon">{MAIL}</span>
          <span>{b.email}</span>
        </a>
      </li>
      <li>
        <a href={b.social.google.directionsUrl} target="_blank" rel="noopener" className="enq-pill">
          <span className="enq-pill-icon">{PIN}</span>
          <span>
            {b.address.street}, {b.address.town}
          </span>
        </a>
      </li>
    </ul>
  );
}

/** The enquiry form, unchanged in what it asks and sends, in the dark finish these layouts use. */
export function DarkForm({ className = "" }: { className?: string }) {
  return (
    <div className={`enq-dark ${className}`}>
      <Suspense fallback={null}>
        <EnquiryForm />
      </Suspense>
    </div>
  );
}
