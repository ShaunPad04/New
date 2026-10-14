import faq from "@content/faq.json";
import { LAUNCH } from "./business";

export type FaqTopic = "buy" | "sell" | "make";
export type FaqItem = { topic: FaqTopic; q: string; a: string; todo?: string };
/** The FAQ's three topics, in page order. */
export const FAQ_TOPICS: { id: FaqTopic; label: string; line: string }[] = [
  { id: "buy", label: "Buying", line: "What is in the case, and how it reaches you" },
  { id: "sell", label: "Selling", line: "What we buy, and how the price is worked out" },
  { id: "make", label: "Repairs & made to order", line: "Fixing, finding and making pieces" },
];
export const FAQ: FaqItem[] = (faq.items as FaqItem[]).filter((f) => !(LAUNCH && f.todo));
