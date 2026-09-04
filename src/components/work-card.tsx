import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/content";
import { resolveWorkImage } from "@/lib/work-image";

/**
 * WORK CARD
 *
 * A soft-cornered card, not a square tile — the shape the client asked for.
 * The media sits in its own rounded well inside the card, so the image has a
 * concentric radius rather than being clipped by the card's own corner, which
 * is the same double-bezel logic the rest of the site uses.
 *
 * Hovering scales the image very slightly (1.04) inside the fixed well. The
 * well clips, so the card does not move or reflow — only the picture inside it
 * grows. Anything more than a few percent reads as a bug rather than a
 * response.
 *
 * Server component: the cover is resolved from disk at build time, so a
 * missing screenshot renders a designed plate instead of a broken image.
 */
export function WorkCard({ project }: { project: Project }) {
  const image = resolveWorkImage(project.id);

  const inner = (
    <>
      <div className="relative aspect-[16/11] overflow-hidden rounded-[1.25rem] bg-ink-200">
        {image ? (
          <Image
            src={image}
            alt={`${project.title} — homepage`}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            // `motion-reduce:scale-100`, not `transform-none`. Tailwind v4
            // compiles `scale-*` to the standalone CSS `scale` property rather
            // than to `transform`, so a `transform: none` override does not
            // cancel it — the zoom still ran for anyone who asks for reduced
            // motion. Verified: scale reads 1.04 on hover, 1 under reduce.
            className="object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04] motion-reduce:scale-100!"
          />
        ) : (
          // No screenshot supplied yet. A designed plate rather than an empty
          // box or a 404'd <img>.
          <span className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(120%_100%_at_50%_0%,rgba(255,255,255,0.10),transparent_60%)]">
            <span className="display text-display-sm text-ink-500">
              {project.title}
            </span>
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-6 px-1 pb-1 pt-6">
        <div>
          <h3 className="display text-2xl text-ink-1000">{project.title}</h3>
          <p className="mt-2 text-sm text-ink-700">
            {project.sector} — {project.year}
          </p>
        </div>

        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-ink-800 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:border-white/30 group-hover:text-ink-1000 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        >
          ↗
        </span>
      </div>

      <ul className="flex flex-wrap gap-x-2 gap-y-2 px-1 pt-5">
        {project.scope.map((s) => (
          <li
            key={s}
            className="rounded-full border border-white/12 px-3 py-1 text-xs tracking-tight text-ink-700"
          >
            {s}
          </li>
        ))}
      </ul>
    </>
  );

  const shell =
    "bezel group block h-full transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 motion-reduce:hover:translate-y-0";

  return (
    <div className={shell}>
      <div className="bezel-core p-3">
        {project.href ? (
          <Link
            href={project.href}
            target="_blank"
            rel="noreferrer noopener"
            className="block"
          >
            {inner}
            <span className="sr-only"> — opens in a new tab</span>
          </Link>
        ) : (
          inner
        )}
      </div>
    </div>
  );
}
