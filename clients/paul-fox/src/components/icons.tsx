type IconProps = { size?: number; className?: string };

export function ArrowUpRight({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MapPin({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M8 14.5s4.5-4.1 4.5-7.5A4.5 4.5 0 0 0 3.5 7c0 3.4 4.5 7.5 4.5 7.5Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
      <circle cx="8" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export function Plus({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Hamburger({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M2 5.5h12M2 10.5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Close({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* Brand marks, drawn on the same 16-grid as the UI icons. */

export function Facebook({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M9.3 15V9.1h2l.3-2.3H9.3V5.3c0-.7.2-1.1 1.1-1.1h1.2v-2C11.4 2.1 10.7 2 9.9 2 8.2 2 7 3.1 7 5v1.8H5v2.3h2V15h2.3Z" />
    </svg>
  );
}

export function Instagram({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <rect x="2" y="2" width="12" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="8" r="2.75" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="11.4" cy="4.6" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function LinkedIn({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M3.6 2a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2ZM2.3 6.2h2.7V14H2.3V6.2Zm4.3 0h2.6v1.1c.4-.7 1.3-1.3 2.6-1.3 2.7 0 3.2 1.8 3.2 4.1V14h-2.7v-3.5c0-.8 0-1.9-1.2-1.9s-1.4.9-1.4 1.9V14H6.6V6.2Z" />
    </svg>
  );
}
