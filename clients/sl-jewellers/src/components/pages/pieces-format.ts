/** One card per category for the /pieces options: the photo that fronts it (S&L's own first
 *  piece, or the illustrated cover while nothing is listed), and how many are in. */
export type CategoryCard = { slug: string; title: string; blurb: string; count: number; image?: string; focus?: string };

export const countLine = (n: number) => (n ? `${n} in the case` : "Ask what is in");
export const num2 = (i: number) => String(i + 1).padStart(2, "0");
