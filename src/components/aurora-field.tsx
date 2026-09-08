/**
 * A slow monochrome light behind a section.
 *
 * Two soft radial fields drifting on long, deliberately mismatched cycles, so
 * the pair never falls into step and the loop is never visible. Purely
 * decorative and `aria-hidden`; all of the behaviour lives in `.aurora` in
 * globals.css, which means the global reduced-motion rule already stops it
 * without this component knowing anything about that.
 *
 * The host section needs `relative` and `overflow-hidden`, and its content
 * needs to sit above this — see where it is used.
 */
export function AuroraField() {
  return (
    <div aria-hidden="true" className="aurora">
      <span className="aurora-a" />
      <span className="aurora-b" />
    </div>
  );
}
