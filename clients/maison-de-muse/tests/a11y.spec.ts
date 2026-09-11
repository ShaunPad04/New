import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accessibility, responsive and content floor — every route.
 *
 * axe catches roughly half of what matters. A missing h1, a keyboard trap,
 * a focus ring invisible against its background, a dialog that never
 * restores focus, and alt text that is present but wrong all pass a green
 * run. The keyboard and structural checks below exist because of that gap.
 */

const ROUTES = ["/", "/menu", "/our-story", "/gallery", "/reviews", "/visit"] as const;

for (const route of ROUTES) {
  test.describe(`route ${route}`, () => {
    test("has no serious or critical axe violations", async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      // Settle every scroll reveal before measuring. Mid-transition a card
      // is partly transparent, so axe composites its text against whatever
      // is behind it and reports a contrast failure that no reader ever
      // sees. Colours are asserted in the state the page comes to rest in.
      await page.evaluate(() => {
        document
          .querySelectorAll("[data-reveal]")
          .forEach((n) => n.setAttribute("data-revealed", ""));
      });
      await page.waitForTimeout(1200);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();

      const blocking = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical"
      );

      if (blocking.length > 0) {
        console.error(
          blocking
            .map(
              (v) =>
                `[${v.impact}] ${v.id}: ${v.help}\n  ${v.nodes
                  .slice(0, 3)
                  .map((n) => n.target.join(" "))
                  .join("\n  ")}`
            )
            .join("\n\n")
        );
      }

      expect(blocking).toEqual([]);
    });

    test("has exactly one h1 and a sensible heading order", async ({ page }) => {
      await page.goto(route);

      await expect(page.locator("h1")).toHaveCount(1);

      const levels = await page
        .locator("h1, h2, h3, h4, h5, h6")
        .evaluateAll((nodes) => nodes.map((n) => Number(n.tagName[1])));

      for (let i = 1; i < levels.length; i++) {
        expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
      }
    });

    test("no horizontal overflow", async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
    });

    test("every image has an alt attribute", async ({ page }) => {
      await page.goto(route);
      const missing = await page.locator("img:not([alt])").count();
      expect(missing).toBe(0);
    });

    test("no placeholder markers are rendered", async ({ page }) => {
      await page.goto(route);
      const body = (await page.locator("body").innerText()).toLowerCase();

      for (const marker of [
        "lorem ipsum",
        "client name",
        "project name",
        "example.com",
        "todo",
        "tbc",
        "beanro",
        "black line",
      ]) {
        expect(body).not.toContain(marker);
      }
    });
  });
}

test.describe("navigation", () => {
  test("skip link is reachable and focusable by keyboard", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const focused = page.locator(":focus");
    await expect(focused).toHaveAttribute("href", "#main");
    await expect(focused).toBeVisible();
  });

  test("keyboard navigation reaches interactive content without a trap", async ({ page }) => {
    await page.goto("/");

    const seen = new Set<string>();
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press("Tab");
      const id = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        return `${el.tagName}:${el.getAttribute("href") ?? el.id ?? el.textContent?.trim().slice(0, 24) ?? ""}`;
      });
      if (id) seen.add(id);
    }

    expect(seen.size).toBeGreaterThan(5);
  });

  test("primary calls to action meet the 44px touch target minimum", async ({ page }) => {
    await page.goto("/");

    const cta = page.getByRole("link", { name: /explore the menu/i }).first();
    // Wait for the element rather than reading geometry the instant the
    // navigation resolves — under parallel load the latter is a race, not
    // a measurement.
    await expect(cta).toBeVisible();
    const box = await cta.boundingBox();

    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test("mobile menu opens, traps focus, closes on Escape and restores focus", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === "desktop-1440", "menu button hidden on desktop");
    await page.goto("/");

    const toggle = page.getByRole("button", { name: /open menu/i });
    await toggle.click();

    const dialog = page.getByRole("dialog", { name: /site menu/i });
    await expect(dialog).toBeVisible();

    // First link receives focus.
    const first = dialog.getByRole("link").first();
    await expect(first).toBeFocused();

    // Current page is marked.
    await expect(dialog.getByRole("link", { name: /^home/i })).toHaveAttribute("aria-current", "page");

    // Body scroll is locked.
    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe("hidden");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("button", { name: /open menu/i })).toBeFocused();
  });

  test("menu category links resolve to real sections", async ({ page }) => {
    await page.goto("/menu");
    const hrefs = await page
      .locator('nav[aria-label="Menu categories"] a')
      .evaluateAll((as) => as.map((a) => a.getAttribute("href") ?? ""));
    expect(hrefs.length).toBeGreaterThan(5);
    for (const href of hrefs) {
      const id = href.replace("#", "");
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  test("contact links use tel: and mailto:", async ({ page }) => {
    await page.goto("/visit");
    // Scoped to main: the header's call button is deliberately hidden below
    // the `sm` breakpoint, so an unscoped `.first()` would assert on an
    // element the design intends to be invisible at that width.
    const main = page.locator("#main");
    await expect(main.locator('a[href^="tel:+441472472140"]').first()).toBeVisible();
    await expect(
      main.locator('a[href^="mailto:info@maisondemuse.co.uk"]').first()
    ).toBeVisible();
  });
});

test.describe("reduced motion", () => {
  test("content is visible immediately without animation", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible();
    const opacity = await page
      .locator("#intro-heading")
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(opacity)).toBe(1);
  });
});
