import type { ReactNode } from "react";
import { FINENESS, formatAsOf, type Metal, type PricesView } from "@/lib/metal-prices";

const gbp = (n: number) => "£" + n.toFixed(2);

/**
 * Gold and silver per gram, rendered on the server: the numbers are in the
 * HTML on first paint, so there is never a spinner, an ellipsis or a jump.
 * When the feed does not answer, the page simply is not revalidated, so the
 * last good render keeps being served with its own "prices as of" stamp. If a
 * figure has never been available the grades still show, with "ask" in place
 * of a number: never a spinner, never an ellipsis, never a guess.
 */
/** Percent of spot the shop pays for scrap, per metal (content/business.json → buying). */
export type Payout = Partial<Record<Metal, number>>;

export default function MetalPrices({ data, note, payout }: { data: PricesView; note?: ReactNode; payout?: Payout }) {
  const { metals, asOf, configured } = data;
  const asOfLabel = formatAsOf(asOf);
  const heading = metals ? "London spot" : "Gold and silver we buy";
  const stamp = metals && asOfLabel ? `Prices as of ${asOfLabel}` : configured ? "Call for today’s price" : "Live prices are switched off. Call for today’s price.";

  return (
    <div className="mp">
      <div className="mp-head">
        <p className="eyebrow">{heading}</p>
        <p className="mp-asof tnum">{stamp}</p>
      </div>
      <div className="mp-grid">
        {(["gold", "silver"] as Metal[]).map((m) => {
          const q = metals?.[m];
          const pct = payout?.[m];
          return (
            <div key={m} className={`mp-${m}`}>
              <h3>
                <span className="mp-metal">{m === "gold" ? "Gold" : "Silver"}</span>
                {q && <span className="mp-change tnum"> · {gbp(q.perOunce)} / troy oz</span>}
              </h3>
              <table>
                <caption className="sr-only">{m === "gold" ? "Gold" : "Silver"} value per gram by purity, and what the shop pays for scrap</caption>
                {pct && (
                  <thead>
                    <tr>
                      <th scope="col"><span className="sr-only">Purity</span></th>
                      <th scope="col" className="mp-col">Spot</th>
                      <th scope="col" className="mp-col">We pay <span className="tnum">{pct}%</span></th>
                    </tr>
                  </thead>
                )}
                <tbody>
                  {FINENESS[m].map(({ label, name }) => {
                    const g = q?.grades.find((x) => x.label === label);
                    return (
                      <tr key={label}>
                        <th scope="row">
                          {label}
                          <span>{name}</span>
                        </th>
                        {g ? (
                          <td>
                            {gbp(g.perGram)}
                            <small>/g</small>
                          </td>
                        ) : (
                          <td className="pending">ask</td>
                        )}
                        {pct && (g ? (
                          <td className="pay">
                            {gbp((g.perGram * pct) / 100)}
                            <small>/g</small>
                          </td>
                        ) : (
                          <td className="pending">ask</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
      <p className="mp-note">
        <strong className="mp-guide">These figures are a guide. The final price is set on the scale at the counter.</strong>{" "}
        {metals
          ? "Spot is the pure-metal value per gram on the London market. We pay is our scrap rate on that figure, before stones or workmanship."
          : "We price by purity and weight, on the scale in front of you. Bring it in, or send a photo and a rough weight for a guide."}
        {payout?.gold && ` Scrap gold is bought at ${payout.gold}% of spot`}
        {payout?.gold && payout?.silver && `, silver at ${payout.silver}%.`}
        {payout?.gold && " Wearable and desirable pieces are worth more than their metal: enquire for a price."}
      </p>
      {note}
    </div>
  );
}
