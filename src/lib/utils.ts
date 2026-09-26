import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** A content line with its `**bold**` markers removed, for text outputs
    (llms.txt, JSON-LD, meta descriptions). */
export function plainText(text: string) {
  return text.replace(/\*\*(.+?)\*\*/g, "$1");
}
