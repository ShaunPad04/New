import { socials } from "@/lib/content";
import { LOGO_MARKS } from "@/lib/logo-marks";
import { cn } from "@/lib/utils";

/**
 * SOCIAL LINKS
 *
 * Each mark sits in its own ring. On hover the ring lifts and brightens and
 * the glyph goes to full white — the same button-in-button language the CTAs
 * use, at a smaller scale.
 *
 * An entry with no `href` yet renders as the mark alone rather than as a link.
 * A link to nowhere is worse than no link: it is a dead end for a visitor, a
 * focus stop that does nothing for a keyboard user, and a broken outbound
 * signal for a crawler. Give the entry a URL in content.ts and it becomes a
 * real anchor with no other change.
 */
export function SocialLinks({ className }: { className?: string }) {
  if (socials.length === 0) return null;

  return (
    <ul className={cn("flex items-center gap-3", className)}>
      {socials.map((s) => {
        const mark = LOGO_MARKS[s.mark];
        if (!mark) return null;

        const ring =
          "group flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]";
        const glyph =
          "h-4 w-4 fill-current text-ink-700 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:text-ink-1000";

        const icon = (
          <svg viewBox="0 0 24 24" aria-hidden="true" className={glyph}>
            <path d={mark.path} />
          </svg>
        );

        return (
          <li key={s.name}>
            {s.href ? (
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${s.name} — opens in a new tab`}
                className={cn(
                  ring,
                  "hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.08] active:scale-95 motion-reduce:hover:translate-y-0",
                )}
              >
                {icon}
              </a>
            ) : (
              // No URL yet, so not a link. Still shows the hover treatment so
              // the design can be reviewed.
              <span
                role="img"
                aria-label={s.name}
                className={cn(
                  ring,
                  "hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.08] motion-reduce:hover:translate-y-0",
                )}
              >
                {icon}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
