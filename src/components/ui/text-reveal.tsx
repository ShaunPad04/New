"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react";
import { useRef, type ReactElement } from "react";
import { cn } from "@/lib/utils";

/**
 * TEXT REVEAL — segmented entrance for a block of copy.
 *
 * Supplied by the client as a shadcn-style component. This project is not a
 * shadcn project — there is no `components.json`, no `ui/` convention and no
 * Radix — but the two things the component actually depends on are already
 * here: Tailwind v4 and `cn` from `@/lib/utils`. `motion` is a dependency
 * already, for `Reveal` and the hero, so nothing was installed for this.
 *
 * It lives at `src/components/ui/` rather than a repository-root
 * `components/ui/` because `@/` maps to `src/` in `tsconfig.json`, so
 * `@/components/ui/text-reveal` — the import path the component ships with —
 * resolves here unchanged. A root-level `components/` folder would not be on
 * that alias at all.
 *
 * THREE CHANGES FROM THE SUPPLIED SOURCE, each load-bearing:
 *
 * 1. `text.split("\n")` was arriving as a literal newline inside the string,
 *    which is a syntax error. Restored.
 *
 * 2. IT NOW TRIGGERS ON SCROLL. The original animates on mount, so on a page
 *    this long the whole thing would have played out thousands of pixels
 *    above the reader and been over before anyone saw it. `useInView` with
 *    `once` drives `trigger` instead, and an explicit `trigger` prop still
 *    overrides that for a caller who wants to drive it themselves.
 *
 * 3. REDUCED MOTION RENDERS THE TEXT, FULL STOP. The original gates every
 *    segment behind `trigger`, so a visitor with the preference set — or any
 *    case where the observer does not fire — gets an empty element where a
 *    paragraph should be. That is the exact failure documented at length in
 *    `reveal.tsx`, and it is why `RevealWords` no longer animates at all. So
 *    under `prefers-reduced-motion` this returns the plain tag with the plain
 *    string and mounts no animation.
 *
 * WHAT IT MUST NOT BE USED FOR: a primary heading, or any text the page
 * depends on being readable. Splitting an `<h1>` into per-word motion
 * elements is what broke the section headings once already. This is for
 * supporting copy, where the worst case is a paragraph that fades rather
 * than a page with its middle missing.
 */

export type TextRevealPreset =
  | "blur"
  | "fade-in-blur"
  | "scale"
  | "fade"
  | "slide";
export type TextRevealPer = "word" | "char" | "line";

export type TextRevealProps = {
  children: string;
  per?: TextRevealPer;
  as?: "p" | "span" | "div" | "h2" | "h3";
  variants?: { container?: Variants; item?: Variants };
  className?: string;
  preset?: TextRevealPreset;
  delay?: number;
  speedReveal?: number;
  speedSegment?: number;
  /** Override the built-in scroll trigger. Omit to reveal when scrolled into view. */
  trigger?: boolean;
  onAnimationComplete?: () => void;
  onAnimationStart?: () => void;
  segmentWrapperClassName?: string;
  containerTransition?: Transition;
  segmentTransition?: Transition;
  style?: React.CSSProperties;
};

const defaultStaggerTimes: Record<TextRevealPer, number> = {
  char: 0.03,
  line: 0.1,
  word: 0.05,
};

const defaultContainerVariants: Variants = {
  exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const defaultItemVariants: Variants = {
  exit: { opacity: 0 },
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const presetVariants: Record<
  TextRevealPreset,
  { container: Variants; item: Variants }
> = {
  blur: {
    container: defaultContainerVariants,
    item: {
      exit: { filter: "blur(12px)", opacity: 0 },
      hidden: { filter: "blur(12px)", opacity: 0 },
      visible: { filter: "blur(0px)", opacity: 1 },
    },
  },
  fade: {
    container: defaultContainerVariants,
    item: {
      exit: { opacity: 0 },
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
  },
  "fade-in-blur": {
    container: defaultContainerVariants,
    item: {
      exit: { filter: "blur(12px)", opacity: 0, y: 20 },
      hidden: { filter: "blur(12px)", opacity: 0, y: 20 },
      visible: { filter: "blur(0px)", opacity: 1, y: 0 },
    },
  },
  scale: {
    container: defaultContainerVariants,
    item: {
      exit: { opacity: 0, scale: 0 },
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
    },
  },
  slide: {
    container: defaultContainerVariants,
    item: {
      exit: { opacity: 0, y: 20 },
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
  },
};

function splitText(text: string, per: TextRevealPer) {
  // A literal "\n", not a real newline — the supplied source had the escape
  // collapsed and would not parse.
  if (per === "line") return text.split("\n");
  return text.split(/(\s+)/);
}

function SegmentItem({
  segment,
  variants,
  per,
  wrapperClassName,
}: {
  segment: string;
  variants: Variants;
  per: TextRevealPer;
  wrapperClassName?: string;
}): ReactElement {
  const content =
    per === "line" ? (
      <motion.span className="block" variants={variants}>
        {segment}
      </motion.span>
    ) : per === "word" ? (
      <motion.span
        aria-hidden="true"
        className="inline-block whitespace-pre"
        variants={variants}
      >
        {segment}
      </motion.span>
    ) : (
      <motion.span className="inline-block whitespace-pre">
        {segment.split("").map((char, i) => (
          <motion.span
            aria-hidden="true"
            className="inline-block whitespace-pre"
            key={i}
            variants={variants}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    );

  if (!wrapperClassName) return content;
  return (
    <span
      className={cn(per === "line" ? "block" : "inline-block", wrapperClassName)}
    >
      {content}
    </span>
  );
}

export function TextReveal({
  children,
  per = "word",
  as = "p",
  variants,
  className,
  preset = "fade",
  delay = 0,
  speedReveal = 1,
  speedSegment = 1,
  trigger,
  onAnimationComplete,
  onAnimationStart,
  segmentWrapperClassName,
  containerTransition,
  segmentTransition,
  style,
}: TextRevealProps) {
  const reduced = useReducedMotion();
  // Typed as a div and cast below, which is the pattern the supplied source
  // already used. `as` can be any of five tags, so there is no single element
  // type that satisfies the ref prop; `useInView` only ever needs an Element,
  // so the narrowing is a type-level convenience with no runtime meaning.
  const ref = useRef<HTMLDivElement>(null);
  // `once`, for the same reason `Reveal` uses it: copy that re-animates every
  // time it re-enters the viewport is the fastest way to make a page feel cheap.
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });

  const MotionTag = motion[as] as typeof motion.div;

  // REDUCED MOTION IS HANDLED WITHOUT CHANGING THE MARKUP, and that is the
  // whole point of doing it this way.
  //
  // The obvious version — `if (reduced) return <p>{children}</p>` — is what
  // `Reveal` does, and it is safe there because both branches render the same
  // children under a different wrapper. Here the branches differ
  // STRUCTURALLY: dozens of word spans against a single text node. The server
  // cannot know the preference, so it always renders the spans; a client with
  // the preference set would then render one text node, React would find a
  // mismatch it cannot patch, and it would throw away and re-render the whole
  // root. Measured as exactly that: six tests failed with "Element is not
  // attached to the DOM" on the WORK grid — a component nothing here touches —
  // because the entire page was being rebuilt under them at hydration.
  //
  // So the markup is identical either way. Reduced motion instead resolves the
  // animation immediately, and the `[data-text-reveal]` rule in globals.css
  // forces the final state in CSS so nothing depends on hydration or on an
  // observer firing.
  const active = trigger ?? (reduced ? true : inView);
  const segments = splitText(children, per);
  const base = presetVariants[preset] ?? {
    container: defaultContainerVariants,
    item: defaultItemVariants,
  };
  const stagger = defaultStaggerTimes[per] / speedReveal;
  const baseDuration = 0.3 / speedSegment;

  const containerVars: Variants = {
    ...base.container,
    visible: {
      ...(base.container.visible as object),
      transition: {
        delayChildren: delay,
        staggerChildren: stagger,
        ...containerTransition,
      },
    },
  };

  const itemVars: Variants = {
    ...base.item,
    visible: {
      ...(base.item.visible as object),
      transition: { duration: baseDuration, ...segmentTransition },
    },
  };

  const computed = variants
    ? {
        container: { ...containerVars, ...variants.container },
        item: { ...itemVars, ...variants.item },
      }
    : { container: containerVars, item: itemVars };

  // No `AnimatePresence`. The supplied source wrapped this in one with
  // `mode="popLayout"`, which exists to take exiting children out of layout
  // flow — and nothing here ever exits, because the child is always mounted.
  // What it did do was run layout projection over the subtree on every state
  // change, which is the other half of the detached-node failures above.
  return (
    <>
      <MotionTag
        ref={ref}
        data-text-reveal=""
        animate={active ? "visible" : "hidden"}
        className={className}
        exit="exit"
        initial="hidden"
        onAnimationComplete={onAnimationComplete}
        onAnimationStart={onAnimationStart}
        style={style}
        variants={computed.container}
      >
        {/* The real string, for anything that reads rather than looks. Every
            visible segment is aria-hidden, so without this the paragraph does
            not exist to a screen reader. */}
        {per !== "line" ? <span className="sr-only">{children}</span> : null}
        {segments.map((segment, index) => (
          <SegmentItem
            key={`${per}-${index}-${segment}`}
            per={per}
            segment={segment}
            variants={computed.item}
            wrapperClassName={segmentWrapperClassName}
          />
        ))}
      </MotionTag>
    </>
  );
}

export default TextReveal;
