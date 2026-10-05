import { BUSINESS } from "@/lib/content";

/**
 * Instagram, Facebook, TikTok and the phone, as icon buttons. `variant="menu"`
 * is a compact row for the header's Menu panel; `variant="footer"` adds the
 * label beside each icon. Both lift and go gold on hover (CSS .social-link).
 */
const ICONS = {
  instagram: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M14.5 21v-7.4h2.5l.4-2.9h-2.9V8.9c0-.84.23-1.41 1.44-1.41h1.54V4.89A20.6 20.6 0 0 0 15.24 4.8c-2.22 0-3.74 1.36-3.74 3.85v2.15H9v2.9h2.5V21h3z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M16.6 3c.3 2.3 1.6 3.7 3.9 3.9v3.2c-1.4.1-2.7-.3-3.9-1.1v6.3c0 3.1-2.4 5.7-5.6 5.7A5.6 5.6 0 0 1 5.5 15.4c0-3.4 2.9-6 6.3-5.5v3.3a2.4 2.4 0 0 0-3 2.3 2.4 2.4 0 0 0 2.4 2.4c1.4 0 2.3-1 2.3-2.5V3h3.1z" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.6 3.5h3l1.5 3.8-1.9 1.1a12.5 12.5 0 0 0 5.4 5.4l1.1-1.9 3.8 1.5v3a1.6 1.6 0 0 1-1.7 1.6A15.8 15.8 0 0 1 5 5.2 1.6 1.6 0 0 1 6.6 3.5Z" />
    </svg>
  ),
};

export default function SocialLinks({ variant = "footer", className = "" }: { variant?: "menu" | "footer"; className?: string }) {
  const b = BUSINESS;
  const items = [
    { key: "instagram", href: b.social.instagram.url, label: "Instagram", aria: `S&L Jewellers on Instagram, @${b.social.instagram.handle}` },
    { key: "facebook", href: b.social.facebook.url, label: "Facebook", aria: "S&L Jewellers on Facebook" },
    { key: "tiktok", href: b.social.tiktok.url, label: "TikTok", aria: `S&L Jewellers on TikTok, @${b.social.tiktok.handle}` },
  ] as const;
  return (
    <ul className={`social-links social-${variant} ${className}`} aria-label="Social media">
      {items.map((it) => (
        <li key={it.key}>
          <a href={it.href} target="_blank" rel="noopener" className="social-link" aria-label={variant === "menu" ? it.aria : undefined}>
            <span className="social-icon">{ICONS[it.key]}</span>
            {variant === "footer" && <span>{it.label}</span>}
          </a>
        </li>
      ))}
      {variant === "menu" && (
        <li>
          <a href={`tel:${b.phone.e164}`} className="social-link" aria-label={`Call S&L Jewellers on ${b.phone.display}`}>
            <span className="social-icon">{ICONS.phone}</span>
          </a>
        </li>
      )}
    </ul>
  );
}
