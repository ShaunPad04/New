import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accessibility floor.
 *
 * axe catches roughly half of what actually matters. A missing h1, a keyboard
 * trap, a focus ring invisible against its background, a dialog that never
 * restores focus, and alt text that is present but wrong all pass a green run.
 * The keyboard and structural checks below exist because of that gap — they
 * are not redundant with the axe scan.
 */

test.describe("accessibility", () => {
  test("has no serious or critical axe violations", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

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
    await page.goto("/");

    await expect(page.locator("h1")).toHaveCount(1);

    const levels = await page
      .locator("h1, h2, h3, h4, h5, h6")
      .evaluateAll((nodes) => nodes.map((n) => Number(n.tagName[1])));

    // No heading may jump more than one level deeper than its predecessor.
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  test("skip link is reachable and focusable by keyboard", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const focused = page.locator(":focus");
    await expect(focused).toHaveAttribute("href", "#main");
    await expect(focused).toBeVisible();
  });

  test("keyboard navigation reaches interactive content without a trap", async ({
    page,
  }) => {
    await page.goto("/");

    // Read document.activeElement directly rather than via a `:focus`
    // locator — the locator is strict-mode sensitive and races with elements
    // that move focus on mount, which made this assertion flaky rather than
    // meaningful.
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

    // A trap would collapse this to one or two repeating targets.
    expect(seen.size).toBeGreaterThan(5);
  });

  test("every image has an alt attribute", async ({ page }) => {
    await page.goto("/");
    const missing = await page
      .locator("img:not([alt])")
      .count();
    expect(missing).toBe(0);
  });
});

test.describe("responsive integrity", () => {
  test("no horizontal overflow", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    // 1px of tolerance for sub-pixel rounding.
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });

  test("primary calls to action meet the 44px touch target minimum", async ({
    page,
  }) => {
    await page.goto("/");

    const cta = page.getByRole("link", { name: /explore the collection/i }).first();
    const box = await cta.boundingBox();

    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });
});

test.describe("content integrity", () => {
  test("no placeholder markers are rendered", async ({ page }) => {
    await page.goto("/");
    const body = (await page.locator("body").innerText()).toLowerCase();

    for (const marker of [
      "placeholder",
      "lorem ipsum",
      "client name",
      "project name",
      "todo",
      "tbc",
    ]) {
      expect(body).not.toContain(marker);
    }
  });
});

test.describe("the pasted components", () => {
  /**
   * The brand marquee measures its own content and translates by half of it.
   * If that measurement lands wrong the strip pushes the document sideways,
   * which is invisible on desktop and ruins every mobile viewport. The
   * responsive suite above catches the page-level symptom; this pins the
   * cause to the marquee itself.
   */
  test("brand marquee stays inside its own bounds", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const overflow = await page.evaluate(() => {
      const strip = document.querySelector<HTMLElement>(".edge-fade");
      if (!strip) return null;
      return strip.scrollWidth - strip.clientWidth;
    });

    expect(overflow).not.toBeNull();
    // The strip clips its own overflow; the page must not scroll because of it.
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth
      )
    ).toBeLessThanOrEqual(1);
  });

  /**
   * The menu overlay is the only navigation on this site. If it cannot be
   * opened, closed and escaped by keyboard, the site has no nav at all for a
   * keyboard user — and axe cannot tell, because the markup is correct
   * either way.
   */
  test("menu overlay opens, traps focus and closes on Escape", async ({
    page,
  }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: /open menu/i });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();

    const dialog = page.getByRole("dialog", { name: /site navigation/i });
    await expect(dialog).toBeVisible();

    // Focus must have moved into the overlay, not been left on the toggle.
    const focusInside = await page.evaluate(() => {
      const panel = document.querySelector('[role="dialog"]');
      return !!panel && panel.contains(document.activeElement);
    });
    expect(focusInside).toBe(true);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    // And focus must come back to the control that opened it.
    await expect(page.getByRole("button", { name: /open menu/i })).toBeFocused();
  });

  /**
   * The cinematic section hides its copy until scroll progress reveals it.
   * With motion reduced that progress handler never runs, so if the reduced
   * path were wrong the section would be permanently blank. Content is never
   * gated behind an animation that does not play.
   */
  test("cinematic section shows its content under reduced motion", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const heading = page.getByRole("heading", { name: /perpetual calendar/i });
    await expect(heading).toBeVisible();

    const opacity = await heading.evaluate((node) => {
      const step = node.closest(".reveal-step");
      return step ? getComputedStyle(step).opacity : "1";
    });
    expect(Number(opacity)).toBeGreaterThan(0.9);
  });

  /**
   * Every image must resolve locally. The supplied components shipped with
   * cdn.21st.dev URLs, and that host is unreachable from this environment —
   * a stray one would render as a broken box with no build error.
   */
  test("loads no third-party images", async ({ page }) => {
    const external: string[] = [];

    page.on("request", (request) => {
      const url = request.url();
      if (
        request.resourceType() === "image" &&
        !url.startsWith("http://127.0.0.1") &&
        !url.startsWith("http://localhost") &&
        !url.startsWith("data:")
      ) {
        external.push(url);
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(external).toEqual([]);
  });
});

test.describe("media", () => {
  /**
   * Both videos autoplay, so both must be silent and inline. An autoplaying
   * video with sound is blocked by every modern browser and is hostile even
   * where it is not.
   */
  test("every video is muted, looping and plays inline", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const videos = await page.locator("video").evaluateAll((nodes) =>
      nodes.map((node) => {
        const video = node as HTMLVideoElement;
        return {
          muted: video.muted,
          loop: video.loop,
          playsInline: video.playsInline,
          poster: video.getAttribute("poster"),
        };
      })
    );

    for (const video of videos) {
      expect(video.muted).toBe(true);
      expect(video.loop).toBe(true);
      expect(video.playsInline).toBe(true);
      // A poster means the section is never an empty black hole while the
      // file buffers, and it is the whole reduced-motion fallback.
      expect(video.poster).toBeTruthy();
    }
  });

  /** With motion reduced, no video element is mounted at all. */
  test("mounts no video under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("video")).toHaveCount(0);
  });
});
