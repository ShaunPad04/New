import { BUSINESS, referenceSpec, type Collection, type Piece } from "@/lib/content";

/**
 * Everything the product page says under the stage, sorted into groups (Shaun, 7 Oct 2026: "it
 * just doesn't look professional, there's just so much, if we can categorise it"). One source
 * for the three layouts in components/pages/ProductDetails.tsx. Nothing new is claimed: the
 * figures are read out of S&L's own title or the maker's specification already on the page.
 */
export type Row = [string, string];
export type Group = { id: string; title: string; rows: Row[] };
export type Figure = { label: string; value: string; unit?: string };
export type PieceDetails = {
  figures: Figure[];
  piece: Row[];
  spec?: { title: string; lede: string; groups: Group[]; source: { name: string; url: string } };
  buying: Row[];
  notes: string[];
};

// the maker's rows, sorted into the three things a watch buyer reads them as
const SPEC_GROUPS: [string, string, string[]][] = [
  ["case", "Case", ["Model case", "Material", "Bezel", "Crystal", "Winding crown", "Water-resistance"]],
  ["movement", "Movement", ["Movement", "Calibre", "Power reserve", "Certification"]],
  ["bracelet", "Bracelet", ["Bracelet", "Bracelet material", "Clasp"]],
];

const pick = (rows: Row[], key: string, re: RegExp) => rows.find(([k]) => k === key)?.[1].match(re)?.[1];

export function pieceDetails(c: Collection, p: Piece, detail: string): PieceDetails {
  const b = BUSINESS;
  const s = p.reference ? referenceSpec(p.reference) : undefined;
  const figures: Figure[] = [];

  let spec: PieceDetails["spec"];
  if (s && p.reference) {
    const rows = s.rows as Row[];
    const size = pick(rows, "Model case", /(\d+(?:\.\d+)?)\s*mm/);
    const calibre = pick(rows, "Calibre", /^(\d{3,4})/);
    const reserve = pick(rows, "Power reserve", /(\d+)\s*hours/);
    const water = pick(rows, "Water-resistance", /(\d+)\s*metres/);
    if (size) figures.push({ label: "Case", value: size, unit: "mm" });
    if (calibre) figures.push({ label: "Calibre", value: calibre });
    if (reserve) figures.push({ label: "Power reserve", value: reserve, unit: "h" });
    if (water) figures.push({ label: "Water-resistant", value: water, unit: "m" });
    const used = new Set<string>();
    const groups = SPEC_GROUPS.map(([id, title, keys]) => {
      const g = rows.filter(([k]) => keys.includes(k));
      g.forEach(([k]) => used.add(k));
      return { id, title, rows: g };
    });
    const rest = rows.filter(([k]) => !used.has(k));
    if (rest.length) groups[0].rows.push(...rest);
    spec = {
      title: `${s.maker} ${s.model} ${p.reference}`,
      lede: `${s.maker}'s own specification for the reference, as made.`,
      groups: groups.filter((g) => g.rows.length),
      source: s.source,
    };
  } else {
    // S&L's titles carry weight, length and year where they know them: "42.8 g, 9 in"
    const text = `${p.title} ${p.note ?? ""}`;
    const w = text.match(/(\d+(?:\.\d+)?)\s*(g|oz)\b/);
    const l = text.match(/(\d+(?:\.\d+)?)\s*in\b/);
    const y = text.match(/\b((?:19|20)\d{2})\b/);
    if (w) figures.push({ label: "Weight", value: w[1], unit: w[2] });
    if (l) figures.push({ label: "Length", value: l[1], unit: "in" });
    if (y) figures.push({ label: "Year", value: y[1] });
  }

  // S&L's listing after the name, one labelled row per part ("Steel & Yellow Gold, Roman
  // Numeral Dial, Jubilee Bracelet"); parts already shown as a figure or the reference drop out
  const piece: Row[] = [];
  const add = (k: string, v: string) => {
    const r = piece.find(([x]) => x === k);
    if (r) r[1] += `, ${v}`;
    else piece.push([k, v]);
  };
  for (const part of detail.split(",").map((x) => x.trim()).filter(Boolean)) {
    if (p.reference && part === p.reference) continue;
    if (/^\d+(?:\.\d+)?\s*(g|oz|in)$/i.test(part) || /^(19|20)\d{2}$/.test(part)) continue;
    if (/full set|box|papers|booklet|card|certificate/i.test(part)) add("Comes with", part);
    else if (/dial/i.test(part)) add("Dial", part.replace(/\s*dial$/i, ""));
    else if (/bezel/i.test(part)) add("Bezel", part.replace(/\s*bezel$/i, ""));
    else if (/bracelet|strap/i.test(part)) add("Bracelet", part.replace(/\s*bracelet$/i, ""));
    else if (/steel|gold|platinum|silver|everose|rolesor|titanium|ceramic|two-tone/i.test(part)) add("Metal", part);
    else if (/^(set of|pair)/i.test(part)) add("Quantity", part);
    else if (/sealed|graded/i.test(part)) add("Condition", part);
    else if (/^\d{4,6}[A-Z]*$/.test(part)) add("Reference", part);
    else add("Details", part);
  }
  if (p.reference) piece.unshift(["Reference", p.reference]);
  if (p.note) piece.push(["Note", p.note]);
  if (!piece.length) piece.push(["Category", c.title]);

  const buying: Row[] = [
    ["Price", "On request: priced on the counter, or by message"],
    ["Availability", "Stock moves daily, so ask us to check it is still in"],
    ["See it", `${b.address.street}, ${b.address.town}`],
  ];

  const notes = [
    p.studio === true && "The picture is a studio image of this exact model, made for us from the maker’s own images of the reference. Ask us for photos of this watch itself.",
    p.studio === "own" && "The picture is a studio image made from our own photo of this piece. Ask us for photos of it as it is.",
    p.back && (c.slug === "watches"
      ? "The back on its card is a studio image of how this model looks from behind, made from the maker’s and other dealers’ photographs, not a photo of this piece. Ask us for photos of its own back."
      : "The back on its card is a studio image made from our own photo of the front and of how pieces like it look from behind, not a photo of this piece’s back. Ask us for photos of it turned over."),
    p.model && "The 360° view is our own model of the reference as it leaves the maker.",
    spec && "The specification is the maker’s catalogue wording. It describes the reference as made; for this watch’s condition, service history and papers, ask us.",
    "Not affiliated with the brands we sell.",
  ].filter(Boolean) as string[];

  return { figures, piece, spec, buying, notes };
}
