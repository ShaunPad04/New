import type { ReactNode } from "react";
import type { PieceDetails } from "@/lib/piece-details";
import DetailsTabs from "./DetailsTabs";
import { Ask, Figures, Notes, Rows, Source } from "./details-parts";

/**
 * The details under the product stage, three ways (round 8 on the preview switch, ?v=pdd:a|b|c),
 * after Shaun's "it just doesn't look professional, there's just so much": one list of rows
 * (category, listed as, price, stock, see it, then the maker's specification) becomes groups.
 *   A  Tabs: This piece / Specification / Buying / Pictures, one panel at a time.
 *   B  Spec sheet: everything showing, grouped, beside a sticky "at a glance" card.
 *   C  Accordion: numbered rows that open one group each, the figures above.
 * Data from lib/piece-details.ts.
 */
export type DetailsProps = { d: PieceDetails; ask: string };

/* A · Tabs (the panels are a client component for the keyboard and the sliding underline) */
export function DetailsA({ d, ask }: DetailsProps) {
  return <DetailsTabs d={d} ask={ask} />;
}

/* B · Spec sheet */
export function DetailsB({ d, ask }: DetailsProps) {
  return (
    <div className="pds">
      <aside className="pds-side" aria-labelledby="pds-glance">
        <p id="pds-glance" className="pdx-label">At a glance</p>
        <Figures figures={d.figures} className="pds-figs" />
        <Rows rows={d.buying} className="pds-buy" />
        <Ask href={ask} />
      </aside>
      <div className="pds-main">
        <section className="pds-sec" aria-labelledby="pds-piece">
          <h2 id="pds-piece" className="pdx-h">This piece</h2>
          <Rows rows={d.piece} />
        </section>
        {d.spec && (
          <section className="pds-sec" aria-labelledby="pds-spec">
            <h2 id="pds-spec" className="pdx-h">
              The reference <span className="tnum text-gold">{d.spec.title.split(" ").pop()}</span>
            </h2>
            <p className="pdx-lede">{d.spec.lede}</p>
            <div className="pds-groups">
              {d.spec.groups.map((g) => (
                <section key={g.id} className="pds-group" aria-label={g.title}>
                  <h3 className="pdx-label">{g.title}</h3>
                  <Rows rows={g.rows} className="is-stacked" />
                </section>
              ))}
            </div>
            <Source d={d} />
          </section>
        )}
        <Notes notes={d.notes} />
      </div>
    </div>
  );
}

/* C · Accordion */
export function DetailsC({ d, ask }: DetailsProps) {
  const items: { id: string; title: string; body: ReactNode; open?: boolean }[] = [
    { id: "piece", title: "This piece", body: <Rows rows={d.piece} />, open: true },
    ...(d.spec?.groups.map((g) => ({ id: g.id, title: g.title, body: <><Rows rows={g.rows} /><Source d={d} /></> })) ?? []),
    { id: "buying", title: "Buying and viewing", body: <><Rows rows={d.buying} /><Ask href={ask} /></> },
    { id: "pictures", title: "About the pictures", body: <Notes notes={d.notes} /> },
  ];
  return (
    <div className="pda">
      <div className="pda-head">
        <h2 className="pdx-h">The details</h2>
        <Figures figures={d.figures} className="pda-figs" />
      </div>
      <div className="pda-list">
        {items.map((it, i) => (
          <details key={it.id} className="pda-item" open={it.open}>
            <summary>
              <span className="pda-n tnum">{String(i + 1).padStart(2, "0")}</span>
              <span className="pda-t">{it.title}</span>
              <span className="pda-x" aria-hidden="true" />
            </summary>
            <div className="pda-body">{it.body}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
