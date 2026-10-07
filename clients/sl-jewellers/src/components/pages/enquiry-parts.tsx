import { BUSINESS, WHATSAPP_ON, whatsappUrl } from "@/lib/content";
import { ICONS } from "@/components/SocialLinks";

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

const ARROW = (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
    <path d="M4 12L12 4M6 4h6v6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** A · Ledger: hairline rows, a small label on the left and the detail set large on the right,
 *  no boxes. The way a dealer's letterhead lists itself. */
export function ContactLedger() {
  const rows = [
    { k: "Call", v: b.phone.display, href: `tel:${b.phone.e164}`, ext: false, num: true },
    ...(WHATSAPP_ON ? [{ k: "WhatsApp", v: "Message the shop", href: whatsappUrl(), ext: true, num: false }] : []),
    { k: "Email", v: b.email, href: `mailto:${b.email}`, ext: false, num: false },
    { k: "Visit", v: `${b.address.street}, ${b.address.town}`, href: b.social.google.directionsUrl, ext: true, num: false },
  ];
  return (
    <ul className="ctl">
      {rows.map((r) => (
        <li key={r.k}>
          <a href={r.href} {...(r.ext ? { target: "_blank", rel: "noopener" } : {})} className="ctl-row">
            <span className="ctl-k">{r.k}</span>
            <span className={`ctl-v${r.num ? " tnum" : ""}`}>{r.v}</span>
            <span className="ctl-go">{ARROW}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** B · The card: the details set like S&L's printed business card (mark, name, lines of type),
 *  with two square actions underneath. */
export function ContactCard() {
  return (
    <div className="ctc">
      <div className="ctc-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-mark.svg" alt="" width="44" height="44" className="ctc-mark" />
        <p className="ctc-name">S&amp;L Jewellers</p>
        <address className="ctc-lines">
          <span>
            {b.address.street}, {b.address.town} {b.address.postcode}
          </span>
          <a href={`tel:${b.phone.e164}`} className="tnum">
            {b.phone.display}
          </a>
          <a href={`mailto:${b.email}`}>{b.email}</a>
        </address>
      </div>
      <div className="ctc-actions">
        <a href={`tel:${b.phone.e164}`} className="ctc-btn is-solid">
          {ICONS.phone} Call
        </a>
        {WHATSAPP_ON ? (
          <a href={whatsappUrl()} target="_blank" rel="noopener" className="ctc-btn">
            {ICONS.whatsapp} WhatsApp
          </a>
        ) : (
          <a href={b.social.google.directionsUrl} target="_blank" rel="noopener" className="ctc-btn">
            {PIN} Directions
          </a>
        )}
      </div>
      {WHATSAPP_ON && (
        <a href={b.social.google.directionsUrl} target="_blank" rel="noopener" className="ctc-dir">
          Directions to the shop {ARROW}
        </a>
      )}
    </div>
  );
}

/** C · The number: the shop's phone number set large as the thing to tap, with the other
 *  three ways in a ruled row underneath. */
export function ContactNumber() {
  return (
    <div className="ctn">
      <p className="ctn-k">Call the counter</p>
      <a href={`tel:${b.phone.e164}`} className="ctn-num tnum">
        {b.phone.display}
      </a>
      <ul className="ctn-row">
        {WHATSAPP_ON && (
          <li>
            <a href={whatsappUrl()} target="_blank" rel="noopener">
              {ICONS.whatsapp}
              <span>WhatsApp</span>
            </a>
          </li>
        )}
        <li>
          <a href={`mailto:${b.email}`}>
            {MAIL}
            <span>Email</span>
          </a>
        </li>
        <li>
          <a href={b.social.google.directionsUrl} target="_blank" rel="noopener">
            {PIN}
            <span>Directions</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
