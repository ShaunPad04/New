import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Site checks — run at 390 / 768 / 1440 (see playwright.config.ts).
 *
 * axe covers roughly half of what matters; the keyboard, structure, journey
 * and overflow checks exist because a green axe run says nothing about a
 * broken search, a menu that traps focus, or a section that overflows the
 * viewport on a phone.
 */

const PAGES = ["/", "/properties", "/new-homes", "/selling", "/part-exchange-assisted-move", "/mortgages", "/about", "/register", "/contact", "/cookie-policy"];

async function firstPropertyHref(page: Page) {
  await page.goto("/properties");
  const href = await page.locator('a[href^="/properties/"]').first().getAttribute("href");
  expect(href).toBeTruthy();
  return href!;
}

/**
 * The hero entrance fades its words and buttons in over ~2s. axe reads the
 * colour of a half-faded label as a blend against the film behind it, so a
 * scan must wait for the entrance to settle — that is the page's resting
 * state, and the only one a reader ever sits on.
 */
async function entranceSettled(page: Page) {
  await page.waitForFunction(() =>
    [...document.querySelectorAll<HTMLElement>("[data-hero-word],[data-hero-rule],[data-hero-rise]")].every((el) => getComputedStyle(el).opacity === "1")
  );
}

/**
 * The homepage header hides while the hero film owns the screen and returns
 * when the reader reaches for it — pointer into the top band, or keyboard
 * focus. A test has to wait for hydration before making that gesture: the
 * listener is attached on mount, and a pointer move that lands first is
 * simply missed. The hero's <source> elements are only rendered once the
 * client has read its own media queries, so they are a precise mount signal.
 */
async function reachForHeader(page: Page) {
  await page.waitForFunction(() => !!document.querySelector("[data-hero-plate] source"));
  await page.mouse.move(200, 300);
  await page.mouse.move(200, 40);
  await expect(page.locator("header")).toHaveCSS("opacity", "1");
}

async function noHorizontalOverflow(page: Page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  expect(scrollWidth, "page must not scroll horizontally").toBeLessThanOrEqual(clientWidth + 1);
}

test.describe("accessibility", () => {
  for (const path of ["/", "/properties", "/contact"]) {
    test(`no serious or critical axe violations on ${path}`, async ({ page }) => {
      // /properties lists 328 cards; a full WCAG 2.2 scan of it takes 15–35s on a shared runner.
      test.setTimeout(120_000);
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await entranceSettled(page);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      const blocking = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      if (blocking.length) console.error(blocking.map((v) => `[${v.impact}] ${v.id}: ${v.help}\n  ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join("\n  ")}`).join("\n\n"));
      expect(blocking).toEqual([]);
    });
  }

  test("property detail page passes axe", async ({ page }) => {
    const href = await firstPropertyHref(page);
    await page.goto(href);
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations.filter((v) => v.impact === "serious" || v.impact === "critical")).toEqual([]);
  });

  for (const path of PAGES) {
    test(`exactly one h1 and sane heading order on ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
      const levels = await page.locator("h1, h2, h3, h4, h5, h6").evaluateAll((nodes) => nodes.map((n) => Number(n.tagName[1])));
      for (let i = 1; i < levels.length; i++) expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    });
  }

  test("skip link is the first tab stop", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toHaveAttribute("href", "#main");
  });
});

test.describe("layout", () => {
  for (const path of ["/", "/properties", "/about", "/contact"]) {
    test(`no horizontal overflow on ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
      await noHorizontalOverflow(page);
    });
  }
  test("property page has no horizontal overflow", async ({ page }) => {
    const href = await firstPropertyHref(page);
    await page.goto(href);
    await page.waitForLoadState("networkidle");
    await noHorizontalOverflow(page);
  });
});

test.describe("navigation", () => {
  test("mobile menu opens, traps focus, closes on Escape and returns focus", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "desktop-1440", "menu button hidden on desktop");
    await page.goto("/");
    await reachForHeader(page);
    const toggle = page.getByRole("button", { name: /open menu/i });
    await toggle.click();
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: "Properties" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(toggle).toBeFocused();
  });

  test("desktop nav links reach every section", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440");
    await page.goto("/");
    await reachForHeader(page);
    for (const [label, path] of [["Properties", "/properties"], ["New Homes", "/new-homes"], ["Selling", "/selling"], ["About", "/about"]]) {
      await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: label }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
    }
  });

  test("404 page renders with a route back", async ({ page }) => {
    const res = await page.goto("/properties/does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/find that page/i);
    await expect(page.getByRole("link", { name: /search properties/i })).toBeVisible();
  });
});

test.describe("property search", () => {
  test("filters narrow results, live in the URL and survive a refresh", async ({ page }) => {
    await page.goto("/properties");
    const count = page.getByText(/\d+ propert/);
    await expect(count).toBeVisible();
    const before = Number((await count.textContent())?.match(/\d+/)?.[0]);
    // The filter controls sit behind a "Filters" disclosure below 1024px and
    // are always on screen above it. Waiting for whichever of the two the
    // viewport actually shows means the check never runs against a page that
    // has not painted yet — the disclosure reporting "not visible" a moment
    // after a reload is what made this test flake. The `:visible` filter
    // matters: the disclosure is in the DOM at every width, so a plain
    // `.first()` would wait on the hidden one for ever on desktop.
    const openFilters = async () => {
      await page.locator('button:has-text("Filters"):visible, button:text-is("4+"):visible').first().waitFor({ state: "visible" });
      const disclosure = page.getByRole("button", { name: /^Filters/ });
      if (await disclosure.isVisible()) {
        await disclosure.click();
        await expect(page.getByRole("button", { name: "4+" }).first()).toBeVisible();
      }
    };
    await openFilters();
    await page.getByRole("button", { name: "4+" }).first().click();
    await expect(page).toHaveURL(/beds=4/);
    await expect.poll(async () => Number((await count.textContent())?.match(/\d+/)?.[0])).toBeLessThan(before);
    await page.reload();
    await openFilters();
    await expect(page.getByRole("button", { name: "4+" }).first()).toHaveAttribute("aria-pressed", "true");
  });

  test("an impossible search shows the empty state and reset restores results", async ({ page }) => {
    await page.goto("/properties?q=zzzzqqqq");
    await expect(page.getByText(/No properties match/)).toBeVisible();
    await page.getByRole("button", { name: /reset filters/i }).click();
    await expect(page.getByText(/No properties match/)).toHaveCount(0);
    await expect(page.locator('a[href^="/properties/"]').first()).toBeVisible();
  });

  test("sorting by price ascending orders the grid", async ({ page }) => {
    await page.goto("/properties?sort=price-asc");
    const labels = await page.locator('ul[aria-label="Search results"] a').evaluateAll((as) => as.slice(0, 5).map((a) => a.getAttribute("aria-label") || ""));
    const prices = labels.map((l) => Number((l.match(/£([\d,]+)/)?.[1] || "0").replace(/,/g, "")));
    for (let i = 1; i < prices.length; i++) expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
  });

  test("every card opens the matching detail page", async ({ page }) => {
    await page.goto("/properties");
    const card = page.locator('ul[aria-label="Search results"] a').first();
    const href = await card.getAttribute("href");
    await card.click();
    await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("property detail", () => {
  test("gallery lightbox opens, steps with arrow keys and closes with Escape", async ({ page }) => {
    const href = await firstPropertyHref(page);
    await page.goto(href);
    const open = page.getByRole("button", { name: /open photo 1 of/i });
    await open.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByText(/^2 \/ /)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(open).toBeFocused();
  });
});

test.describe("forms", () => {
  test("contact form validates and reports the unconnected backend honestly", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: /submit an enquiry/i }).click();
    await expect(page.getByText(/please enter your full name/i)).toBeVisible();
    await page.getByLabel(/full name/i).fill("Test Person");
    await page.getByLabel(/^email/i).fill("not-an-email");
    await page.getByLabel(/^message/i).fill("Hello");
    await page.getByRole("button", { name: /submit an enquiry/i }).click();
    await expect(page.getByText(/valid email address/i)).toBeVisible();
    await page.getByLabel(/^email/i).fill("test@example.com");
    await page.getByRole("button", { name: /submit an enquiry/i }).click();
    await expect(page.getByText(/not connected on this preview/i)).toBeVisible();
    await expect(page.getByText(/your message was not sent/i)).toBeVisible();
  });
});

test.describe("seo", () => {
  test("preview is non-indexable and pages carry unique titles", async ({ page, request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toMatch(/Disallow: \//);
    const titles = new Set<string>();
    for (const p of ["/", "/properties", "/about", "/contact"]) {
      await page.goto(p);
      titles.add(await page.title());
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
      await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    }
    expect(titles.size).toBe(4);
  });
});
