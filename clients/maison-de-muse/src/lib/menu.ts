/**
 * MAISON DE MUSE — MENU DATA
 *
 * Transcribed from the five menu pages supplied with the brief. The printed
 * menu is the authority: nothing here has been "improved". Where the source
 * looked inconsistent the item carries a `review` note rather than a silent
 * correction — see the handoff for the full list.
 *
 * Prices are stored in pence-free GBP decimals and formatted by `gbp()`.
 */

export type Dietary = "v" | "vg";

export type MenuItem = {
  name: string;
  description?: string;
  /** Single price, in pounds. */
  price?: number;
  /** Wine by the glass and bottle. */
  wine?: { g175: number; g250: number; bottle: number };
  /** Sparkling wine sold by the glass and/or bottle only. */
  sparkling?: { glass?: number; bottle: number };
  /** Add-ons printed under the item. */
  extras?: string;
  dietary?: Dietary[];
  /** An apparent inconsistency in the source, flagged for the client. */
  review?: string;
};

export type MenuSection = {
  id: string;
  title: string;
  /** Short line printed under the section title. */
  note?: string;
  items: MenuItem[];
  /** Column headings for wine sections. */
  columns?: ["175ml", "250ml", "Bottle"];
};

export type MenuCategory = {
  id: string;
  label: string;
  /** Longer label for page headings. */
  title: string;
  intro: string;
  sections: MenuSection[];
};

export const DIETARY_KEY: Record<Dietary, string> = {
  v: "Vegetarian",
  vg: "Vegan",
};

export const ALLERGEN_STATEMENT =
  "Please inform a member of staff of any allergies or dietary requirements before placing your order. While we take great care in preparing your food, our kitchen handles nuts, gluten, dairy and other allergens. Cross-contamination cannot be completely ruled out.";

export const MENU_DISCLAIMER =
  "Menu items and prices may change. Please contact the café for current availability and allergen information.";

export const menu: MenuCategory[] = [
  {
    id: "food",
    label: "Food",
    title: "Brunch & lunch",
    intro:
      "Croissants, bagels, sourdough and flatbreads, served from 8am until 5pm every day.",
    sections: [
      {
        id: "croissants-bagels",
        title: "Croissants & Bagels",
        items: [
          {
            name: "À La Cheese Ploughman’s Croissant",
            description:
              "Rocket, chutney, red onions, sun-dried tomato and truffle mayo.",
            price: 7.5,
            dietary: ["v"],
            review:
              "Source shows a vegetarian marker and the name “À La Cheese” — confirm the wording.",
          },
          {
            name: "Grilled Cheese & Ham",
            description:
              "Croissant or bagel with truffle mayo and glazed balsamic vinegar.",
            price: 7.5,
            review:
              "Source appears to show a vegetarian marker despite containing ham. Marker withheld pending confirmation.",
          },
          { name: "Cream Cheese & Salmon Bagel", price: 8.5 },
          { name: "Chicken, Mozzarella & Pesto Grilled Bagel", price: 8.5 },
        ],
      },
      {
        id: "sourdough-flatbreads",
        title: "Sourdough & Flatbreads",
        note: "Vegetarian and vegan options are available.",
        items: [
          {
            name: "Goats’ Cheese & Peach on Toasted Sourdough",
            description: "With glazed balsamic vinegar.",
            price: 7.5,
            dietary: ["v"],
          },
          {
            name: "Açaí & Truffle-Honey Halloumi Flatbread",
            description:
              "Rocket, cherry tomatoes, red onion, cucumber and pomegranate.",
            price: 9,
            dietary: ["v"],
          },
          {
            name: "Greek Chicken & Mint Yoghurt Flatbread",
            description: "Cherry tomatoes, cucumber and red onion.",
            price: 9,
          },
        ],
      },
      {
        id: "maison-melts",
        title: "Maison Melts",
        items: [
          { name: "Cheese Melt", price: 5.5, dietary: ["v"] },
          { name: "Cheese & Chicken Melt", price: 6 },
        ],
      },
      {
        id: "maison-favourites",
        title: "Maison Favourites",
        items: [
          {
            name: "Soup of the Day",
            description: "Served with a freshly baked bread roll and butter.",
            price: 5.5,
          },
          {
            name: "Scrambled Eggs on Toasted Sourdough",
            price: 7.7,
            dietary: ["v"],
            extras: "Add avocado £2.50, salmon £2.50 or both £3.50.",
          },
          {
            name: "Maison Eggs",
            description:
              "Soft scrambled eggs on a warm butter croissant, topped with whipped feta, hot honey and chilli flakes.",
            price: 9,
            extras: "Add avocado £2.50, salmon £2.50 or both £3.50.",
          },
          {
            name: "Halloumi Salad",
            description:
              "Rocket, cherry tomatoes, cucumber, halloumi, strawberries, blueberries and honey.",
            price: 8.5,
            dietary: ["v"],
          },
        ],
      },
      {
        id: "sides",
        title: "Sides",
        items: [
          { name: "Halloumi Sticks", price: 4, dietary: ["v"] },
          {
            name: "Hummus with Toasted Pitta",
            price: 4,
            dietary: ["v"],
            review:
              "Priced £4.00 here and £5.50 on the evening menu — confirm both are intended.",
          },
        ],
      },
    ],
  },
  {
    id: "sweet",
    label: "Sweet",
    title: "Sweet",
    intro: "Filled croissants, pancakes and bowls for the sweeter start.",
    sections: [
      {
        id: "sweet-croissants",
        title: "Sweet Croissants",
        items: [
          {
            name: "Strawberries & Cream Croissant",
            description:
              "Fresh strawberries, whipped cream, white chocolate sauce and milk chocolate.",
            price: 7,
            dietary: ["v"],
          },
          {
            name: "Chocolate & Nut Croissant",
            description:
              "Filled with chocolate and topped with crushed nuts and chocolate sauce.",
            price: 7,
            dietary: ["v"],
          },
        ],
      },
      {
        id: "sweet-brunch",
        title: "Sweet Brunch",
        items: [
          {
            name: "Maison Smoothie Bowl",
            description:
              "Blended fruit topped with fresh fruit, granola, chia seeds and coconut flakes.",
            price: 7.5,
          },
          {
            name: "Buttermilk Pancakes with Chocolate",
            price: 7.5,
            dietary: ["v"],
          },
          {
            name: "Yoghurt with Granola & Fresh Fruit",
            price: 7,
            dietary: ["v"],
          },
          {
            name: "Chocolate & Peanut Butter Granola Bowl",
            price: 7,
            dietary: ["v"],
          },
        ],
      },
    ],
  },
  {
    id: "coffee",
    label: "Coffee & Hot Drinks",
    title: "Coffee & hot drinks",
    intro: "Espresso, matcha and Paris-style hot chocolate, from 7am.",
    sections: [
      {
        id: "hot-drinks",
        title: "Hot Drinks",
        items: [
          { name: "Espresso", price: 2.2 },
          { name: "Americano", price: 2.9 },
          { name: "Cortado", price: 2.9 },
          { name: "Flat White", price: 3.2 },
          { name: "Cappuccino", price: 3.4 },
          { name: "Latte", price: 3.4 },
          { name: "Matcha Latte", price: 4.5 },
          { name: "White Chocolate Matcha", price: 4.8 },
          { name: "Pistachio Latte", price: 4.8 },
          { name: "Chai Latte", price: 4 },
          { name: "Mocha", price: 3.8 },
          {
            name: "Chocolat Chaud",
            description:
              "Paris-style hot chocolate in a jug with whipped cream on the side.",
            price: 4.9,
          },
          { name: "Hot Chocolate", price: 3.8 },
          { name: "White Hot Chocolate", price: 3.8 },
          { name: "Puppuccino", price: 1 },
          {
            name: "Tea",
            description:
              "English Breakfast, Earl Grey, peppermint, lemon and ginger, camomile and green tea.",
            price: 2.7,
          },
          {
            name: "Alternative Milks",
            description: "Oat, soya, almond or coconut.",
            price: 0.5,
          },
          { name: "Flavoured Syrups", price: 0.5 },
        ],
      },
    ],
  },
  {
    id: "iced",
    label: "Iced Drinks",
    title: "Iced drinks",
    intro: "Iced lattes, matcha and peach iced tea.",
    sections: [
      {
        id: "iced-drinks",
        title: "Iced Drinks",
        items: [
          { name: "Iced Latte", price: 3.5 },
          { name: "Iced Matcha Latte", price: 4.5 },
          {
            name: "Flavoured Matcha",
            description: "White chocolate, strawberry or mango.",
            price: 5,
          },
          { name: "Iced Chai Latte", price: 4.5 },
          { name: "Peach Iced Tea", price: 4 },
        ],
      },
    ],
  },
  {
    id: "smoothies-soft",
    label: "Smoothies & Soft Drinks",
    title: "Smoothies & soft drinks",
    intro: "Blended fruit smoothies and chilled soft drinks.",
    sections: [
      {
        id: "smoothies",
        title: "Smoothies",
        items: [
          {
            name: "Super Green",
            description: "Kale, avocado, apple, lime, basil and spirulina.",
            price: 4.8,
          },
          {
            name: "Pineapple Sunset",
            description: "Pineapple, papaya and mango.",
            price: 4.8,
          },
          {
            name: "Strawberry Delight",
            description: "Strawberries, peach and papaya.",
            price: 4.8,
          },
        ],
      },
      {
        id: "soft-drinks",
        title: "Soft Drinks",
        items: [
          { name: "Still Water", price: 2.5 },
          { name: "Sparkling Water", price: 2.5 },
          { name: "Apple Juice", price: 2.5 },
          { name: "Orange Juice", price: 2.5 },
          { name: "Appletiser", price: 3.2 },
          { name: "Elderflower", price: 3.2 },
          { name: "Lemonade", price: 3.2 },
          { name: "Coke", price: 3.2 },
          { name: "Coke Zero", price: 3.2 },
          { name: "Ginger Beer", price: 3.2 },
        ],
      },
    ],
  },
  {
    id: "wine",
    label: "Wine, Beer & Cider",
    title: "Wine, beer & cider",
    intro:
      "Wines by the glass and bottle, with bottled beer and cider. Served from the bar on Friday and Saturday evenings.",
    sections: [
      {
        id: "beer-cider",
        title: "Bottled Beer & Cider",
        items: [
          { name: "Peroni 330ml", price: 4.2 },
          { name: "Peroni 0.0", price: 4 },
          { name: "Cider", price: 4 },
        ],
      },
      {
        id: "vin-blanc",
        title: "Vin Blanc",
        columns: ["175ml", "250ml", "Bottle"],
        items: [
          {
            name: "Sauvignon Blanc, Chile",
            description:
              "Fresh and crisp with grapefruit, lime and a clean citrus finish.",
            wine: { g175: 5.1, g250: 7, bottle: 18 },
          },
          {
            name: "Pinot Grigio, Italy",
            description:
              "Crisp and dry with refreshing citrus and orchard-fruit flavours.",
            wine: { g175: 6.5, g250: 8.5, bottle: 24 },
          },
          {
            name: "Sauvignon Blanc, New Zealand",
            description:
              "Zesty and vibrant with passionfruit, gooseberry and refreshing citrus.",
            wine: { g175: 10, g250: 12, bottle: 34 },
          },
        ],
      },
      {
        id: "vin-rose",
        title: "Vin Rosé",
        columns: ["175ml", "250ml", "Bottle"],
        items: [
          {
            name: "French Rosé, France",
            description:
              "Light and refreshing with strawberry, raspberry and a crisp finish.",
            wine: { g175: 6, g250: 8, bottle: 23 },
          },
          {
            name: "Provence Rosé, Provence, France",
            description:
              "Dry and elegant with red berries, peach and subtle citrus.",
            wine: { g175: 8, g250: 10, bottle: 29 },
          },
          {
            name: "Whispering Angel, Provence, France",
            description:
              "Delicate and refined with wild strawberry, melon and a crisp mineral finish.",
            wine: { g175: 12, g250: 14, bottle: 40 },
          },
        ],
      },
      {
        id: "vin-rouge",
        title: "Vin Rouge",
        columns: ["175ml", "250ml", "Bottle"],
        items: [
          {
            name: "Merlot, Chile",
            description:
              "Smooth and fruity with black cherry, plum and soft vanilla.",
            wine: { g175: 6.5, g250: 8.5, bottle: 24 },
          },
          {
            name: "Malbec, Argentina",
            description:
              "Rich blackberry and plum flavours with a smooth, velvety finish.",
            wine: { g175: 7, g250: 9, bottle: 26 },
          },
          {
            name: "Rioja Crianza, Spain",
            description: "Elegant with ripe cherries, gentle oak and warming spice.",
            wine: { g175: 9, g250: 12, bottle: 34 },
          },
        ],
      },
      {
        id: "vin-petillant",
        title: "Vin Pétillant",
        items: [
          {
            name: "Bottega Gold, Italy",
            description:
              "Elegant and crisp with pear, apple and a delicate, persistent sparkle.",
            sparkling: { bottle: 40 },
          },
          {
            name: "Prosecco, Italy",
            description:
              "Fresh and lively with green apple, pear and fine bubbles.",
            sparkling: { glass: 6, bottle: 29 },
          },
        ],
      },
    ],
  },
  {
    id: "evening",
    label: "Evening Menu",
    title: "Evening menu",
    intro:
      "Boards and bites to share with a glass of wine. Available from 4pm on Fridays and Saturdays.",
    sections: [
      {
        id: "evening-menu",
        title: "Evening Menu",
        note: "Available from 4:00pm on Fridays and Saturdays.",
        items: [
          { name: "Fresh Bread Board", price: 3, dietary: ["v"] },
          { name: "Cheese Board", price: 13, dietary: ["v"] },
          { name: "Olives", price: 3, dietary: ["v"] },
          {
            name: "Hummus with Toasted Pitta",
            price: 5.5,
            dietary: ["v"],
            review:
              "Priced £5.50 here and £4.00 under Sides — confirm both are intended.",
          },
        ],
      },
    ],
  },
];

/** "£7.50", "£18.00", "£0.50" — always two decimals, per the printed menu. */
export function gbp(value: number): string {
  return `£${value.toFixed(2)}`;
}

/** Items that appear in the home-page menu preview, by section and name. */
export const MENU_HIGHLIGHTS: Array<{
  tab: string;
  items: Array<{ section: string; name: string }>;
}> = [
  {
    tab: "Coffee & Matcha",
    items: [
      { section: "hot-drinks", name: "Flat White" },
      { section: "hot-drinks", name: "Matcha Latte" },
      { section: "iced-drinks", name: "Iced Matcha Latte" },
      { section: "hot-drinks", name: "Chocolat Chaud" },
      { section: "hot-drinks", name: "Pistachio Latte" },
      { section: "iced-drinks", name: "Flavoured Matcha" },
    ],
  },
  {
    tab: "Brunch",
    items: [
      { section: "maison-favourites", name: "Maison Eggs" },
      { section: "croissants-bagels", name: "Cream Cheese & Salmon Bagel" },
      { section: "sourdough-flatbreads", name: "Goats’ Cheese & Peach on Toasted Sourdough" },
      { section: "sourdough-flatbreads", name: "Açaí & Truffle-Honey Halloumi Flatbread" },
      { section: "maison-favourites", name: "Halloumi Salad" },
      { section: "croissants-bagels", name: "Chicken, Mozzarella & Pesto Grilled Bagel" },
    ],
  },
  {
    tab: "Sweet & Evening",
    items: [
      { section: "sweet-croissants", name: "Strawberries & Cream Croissant" },
      { section: "sweet-brunch", name: "Maison Smoothie Bowl" },
      { section: "sweet-brunch", name: "Buttermilk Pancakes with Chocolate" },
      { section: "evening-menu", name: "Cheese Board" },
      { section: "vin-rose", name: "Whispering Angel, Provence, France" },
      { section: "vin-petillant", name: "Prosecco, Italy" },
    ],
  },
];

export function findItem(sectionId: string, name: string) {
  for (const category of menu) {
    for (const section of category.sections) {
      if (section.id !== sectionId) continue;
      const item = section.items.find((i) => i.name === name);
      if (item) return { category, section, item };
    }
  }
  return null;
}

/** Compact price string for any item shape. */
export function priceLabel(item: MenuItem): string {
  if (item.price !== undefined) return gbp(item.price);
  if (item.wine) return `from ${gbp(item.wine.g175)}`;
  if (item.sparkling) {
    return item.sparkling.glass
      ? `from ${gbp(item.sparkling.glass)}`
      : `${gbp(item.sparkling.bottle)} bottle`;
  }
  return "";
}
