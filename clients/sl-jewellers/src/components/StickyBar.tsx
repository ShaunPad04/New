import { BUSINESS, WHATSAPP_ON, whatsappUrl } from "@/lib/content";

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6.3 3.8h3l1.5 3.7-1.9 1.2a11 11 0 0 0 4.4 4.4l1.2-1.9 3.7 1.5v3a1.7 1.7 0 0 1-1.9 1.7A14.4 14.4 0 0 1 4.6 5.7 1.7 1.7 0 0 1 6.3 3.8Z" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.1.6a2.7 2.7 0 0 0 1.8-1.2c.2-.6.2-1.1.1-1.2l-.5-.3Z" />
  </svg>
);
const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3.2" y="5.4" width="17.6" height="13.2" rx="2" />
    <path d="m3.6 6.6 8.4 6 8.4-6" />
  </svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10Z" />
    <circle cx="12" cy="11" r="2.2" />
  </svg>
);

export default function StickyBar({ phone }: { phone: string }) {
  return (
    <nav className="sticky-bar" aria-label="Quick contact">
      <a href={`tel:${phone}`}>
        <PhoneIcon /> Call
      </a>
      {WHATSAPP_ON ? (
        <a href={whatsappUrl()} target="_blank" rel="noopener">
          <WhatsAppIcon /> WhatsApp
        </a>
      ) : (
        <a href={`mailto:${BUSINESS.email}`}>
          <MailIcon /> Email
        </a>
      )}
      <a href={BUSINESS.social.google.directionsUrl} target="_blank" rel="noopener">
        <PinIcon /> Directions
      </a>
    </nav>
  );
}
