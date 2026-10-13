/** Instagram, Facebook, TikTok, WhatsApp and phone glyphs (24px grid, currentColor), shared by the
 *  header strip, the menu, the footer and the reels' Instagram link. */
export const ICONS = {
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
  // Google's "G", one colour (13 Oct 2026, for the reviews links)
  google: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M21.6 12.2c0-.7-.06-1.37-.18-2.02H12v3.83h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.32 2.98-7.33Z" />
      <path d="M12 21.6c2.7 0 4.97-.9 6.62-2.43l-3.24-2.5c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.75-5.59-4.11H3.06v2.58A10 10 0 0 0 12 21.6Z" />
      <path d="M6.41 13.52a6 6 0 0 1 0-3.84V7.1H3.06a10 10 0 0 0 0 9l3.35-2.58Z" />
      <path d="M12 6.37c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.98 9.98 0 0 0 12 2.4a10 10 0 0 0-8.94 5.5l3.35 2.58C7.2 8.12 9.4 6.37 12 6.37Z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M16.6 3c.3 2.3 1.6 3.7 3.9 3.9v3.2c-1.4.1-2.7-.3-3.9-1.1v6.3c0 3.1-2.4 5.7-5.6 5.7A5.6 5.6 0 0 1 5.5 15.4c0-3.4 2.9-6 6.3-5.5v3.3a2.4 2.4 0 0 0-3 2.3 2.4 2.4 0 0 0 2.4 2.4c1.4 0 2.3-1 2.3-2.5V3h3.1z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.1.6a2.7 2.7 0 0 0 1.8-1.2c.2-.6.2-1.1.1-1.2l-.5-.3Z" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.6 3.5h3l1.5 3.8-1.9 1.1a12.5 12.5 0 0 0 5.4 5.4l1.1-1.9 3.8 1.5v3a1.6 1.6 0 0 1-1.7 1.6A15.8 15.8 0 0 1 5 5.2 1.6 1.6 0 0 1 6.6 3.5Z" />
    </svg>
  ),
};
