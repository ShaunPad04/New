/**
 * Stand-in for a watch photograph.
 *
 * There is no product photography for this pitch build, and inventing a
 * picture of a specific reference would be a worse lie than not having one:
 * the caption underneath names a real model, and an image that is not that
 * model misrepresents it.
 *
 * So this is a designed plate rather than a placeholder — a raked key light,
 * a counter-bounce and a hairline horizon over the same near-black ground the
 * photography uses, with the reference number set into it. It reads as an
 * intentional catalogue card, not a missing asset, and it costs nothing over
 * the wire.
 *
 * When real photography arrives, set `image` on the watch in content.ts and
 * the card renders the photograph instead. Nothing else changes.
 */
export function WatchPlate({
  reference,
  brand,
}: {
  reference: string;
  brand: string;
}) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-obsidian-raised"
    >
      {/* Raked key from upper right. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_78%_18%,rgba(244,241,236,0.16),transparent_58%)]" />
      {/* Cool counter-bounce from lower left, so the plate is not flat. */}
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_18%_92%,rgba(198,166,100,0.10),transparent_62%)]" />
      {/* The horizon the product would sit on. */}
      <div className="absolute inset-x-0 top-[62%] h-px bg-gradient-to-r from-transparent via-bone/20 to-transparent" />
      {/* Vignette. */}
      <div className="absolute inset-0 bg-[radial-gradient(100%_80%_at_50%_45%,transparent_35%,rgba(11,11,12,0.75)_100%)]" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.3em] text-bone-muted">
          {brand}
        </span>
        <span className="font-display text-3xl text-bone/45">{reference}</span>
      </div>
    </div>
  );
}
