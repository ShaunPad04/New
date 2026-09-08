import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Wait until scroll-reveal entrances have finished before auditing.
 *
 * `networkidle` alone is not enough, and this bit: axe treats text that is
 * partially transparent as a contrast failure, and the Reveal entrances start
 * at `opacity: 0` and animate up over 900ms. Whether axe caught them mid-fade
 * used to depend on how long the hero's frame sequence kept the network busy —
 * so deferring that sequence made networkidle fire sooner and produced 170
 * phantom colour-contrast violations on a page with no contrast problem at
 * all. Reproduced by hand three seconds later: zero violations.
 *
 * Waiting on the actual condition removes the coupling. This does not weaken
 * the audit — a real contrast failure is still a failure once the animation
 * has landed, and anything still mid-flight after the timeout gets audited
 * anyway rather than being silently skipped.
 */
async function settled(page: import("@playwright/test").Page) {
  await page.waitForLoadState("networkidle");

  /*
   * Stop the testimonial carousel before auditing.
   *
   * It advances every 9 seconds and each advance remounts the panel with a
   * 700ms `rise` entrance. An axe scan at tablet width takes about 15s, so it
   * reliably overlaps one — and mid-entrance the quote is dark text on a
   * half-faded white plate, which axe reports as a serious contrast failure
   * (measured: 2.2:1, #070707 on #484848) on a panel that is 21:1 at rest.
   *
   * This is the carousel's own Pause control, the one WCAG 2.2.2 requires,
   * driven the way a reader would drive it — not a test-only escape hatch and
   * not a weakening of the audit. Everything is still scanned; it is scanned
   * in the state a reader actually reads it in.
   */
  const pause = page.getByRole("button", { name: /^pause$/i }).first();
  if (await pause.count()) {
    await pause.click().catch(() => {});
  }
  // Let any entrance already in flight land before measuring anything.
  await page
    .waitForFunction(
      () =>
        !document
          .getAnimations()
          .some(
            (a) =>
              a.playState === "running" &&
              (a as CSSAnimation).animationName === "rise",
          ),
      undefined,
      { timeout: 3000 },
    )
    .catch(() => {});
  await page
    .waitForFunction(
      () =>
        [...document.querySelectorAll("[data-reveal]")].every((el) => {
          const o = parseFloat(getComputedStyle(el).opacity);
          return o === 0 || o === 1;
        }),
      undefined,
      { timeout: 4000 },
    )
    .catch(() => {});
}


/** Wheel to the bottom of the page, the way a reader does. See the privacy
 *  link test for why a programmatic jump does not work on this page. */
async function scrollToBottom(page: import("@playwright/test").Page) {
  for (let i = 0; i < 140; i++) {
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(50);
    const done = await page.evaluate(
      () =>
        window.scrollY >=
        document.documentElement.scrollHeight - window.innerHeight - 5,
    );
    if (done) break;
  }
  await page.waitForTimeout(400);
}

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
    await settled(page);

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
    await settled(page);

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

    const cta = page.getByRole("link", { name: /start a project/i }).first();
    const box = await cta.boundingBox();

    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });
});

test.describe("scrolling", () => {
  /**
   * Regression: the page could not be scrolled to the bottom.
   *
   * Lenis caches the scroll limit when it starts. ScrollTrigger then pins the
   * hero and inserts a pin-spacer worth 320vh, making the document taller
   * AFTER that measurement. Lenis kept clamping to the stale limit, so
   * scrolling died partway down — exactly 320vh short. Nothing in the page
   * looked wrong; it simply stopped responding.
   */
  test("the page can be scrolled all the way to the footer", async ({
    page,
  }) => {
    await page.goto("/");
    await settled(page);
    await page.waitForTimeout(2500);

    for (let i = 0; i < 120; i++) {
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(60);
      const done = await page.evaluate(
        () =>
          window.scrollY >=
          document.documentElement.scrollHeight - window.innerHeight - 5,
      );
      if (done) break;
    }

    const { y, max } = await page.evaluate(() => ({
      y: Math.round(window.scrollY),
      max: Math.round(
        document.documentElement.scrollHeight - window.innerHeight,
      ),
    }));
    expect(max - y, `stuck ${max - y}px short of the bottom`).toBeLessThanOrEqual(5);

    await expect(page.locator("footer")).toBeInViewport();
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
      "example.com",
      "todo",
      "tbc",
    ]) {
      expect(body).not.toContain(marker);
    }
  });
});

/**
 * Every nav category is a real route, not a homepage fragment. A page that
 * only exists in the nav is exactly the kind of page that quietly regresses,
 * so each one is asserted directly: it must return 200, carry exactly one h1,
 * and clear the same axe floor as the homepage.
 */
const ROUTES = [
  { path: "/portfolio", label: "Portfolio" },
  { path: "/services", label: "Services" },
  { path: "/pricing", label: "Pricing" },
  { path: "/faq", label: "FAQ" },
  { path: "/studio", label: "Studio" },
] as const;

test.describe("category routes", () => {
  for (const { path, label } of ROUTES) {
    test(`${path} has no serious or critical axe violations`, async ({
      page,
    }) => {
      const res = await page.goto(path);
      expect(res?.status(), `${path} did not return 200`).toBe(200);
      await settled(page);

      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const serious = violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      if (serious.length) {
        throw new Error(
          `${serious.length} violation(s) on ${path}:\n` +
            serious
              .map((v) => `  [${v.impact}] ${v.id}: ${v.help}`)
              .join("\n"),
        );
      }
      expect(serious).toEqual([]);
    });

    test(`${path} has exactly one h1`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveCount(1);
    });

    test(`nav "${label}" actually navigates to ${path}`, async ({ page }) => {
      await page.goto("/");

      // Below the md breakpoint the primary nav is replaced by the overlay
      // menu, so the link has to be opened before it can be exercised.
      const narrow = (page.viewportSize()?.width ?? 0) < 768;
      if (narrow) {
        await page.getByRole("button", { name: /open menu/i }).click();
      }

      const link = page
        .getByRole("navigation", { name: narrow ? "Site" : "Primary" })
        .getByRole("link", { name: label, exact: true });
      await expect(link).toHaveAttribute("href", path);

      // The point of the check: clicking it must land on the route, not
      // scroll the homepage.
      await link.click();
      await page.waitForURL(`**${path}`);
      expect(new URL(page.url()).pathname).toBe(path);
    });
  }

  test("the menu opens at every breakpoint and traps focus", async ({
    page,
  }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: /open menu/i });
    await expect(toggle, "the menu button must exist on desktop too").toBeVisible();
    await toggle.click();

    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();

    // Tab all the way round: focus must never leave the dialog.
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(() =>
        document.getElementById("site-menu")?.contains(document.activeElement),
      );
      expect(inside, `focus escaped the menu on tab ${i + 1}`).toBe(true);
    }

    // Escape closes it and hands focus back to the button that opened it.
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("button", { name: /open menu/i })).toBeFocused();
  });

  test("the header call to action reaches the enquiry form", async ({
    page,
  }) => {
    await page.goto("/services");
    const cta = page.getByRole("link", { name: /book a call/i }).first();
    await expect(cta).toBeVisible();

    const box = await cta.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(40);

    await cta.click();
    await page.waitForURL("**/#contact");
    await expect(page.locator("#contact")).toBeVisible();
  });
});

/**
 * Case studies live one level deeper than the nav, at /portfolio/<slug>, so
 * they are not covered by the ROUTES loop above — that loop also asserts a nav
 * item exists, and a case study deliberately has none. They still carry the
 * argument a five-figure build is sold on, so they clear the same floor.
 */
test.describe("case studies", () => {
  test("/portfolio/b-boutique has no serious or critical axe violations", async ({
    page,
  }) => {
    const res = await page.goto("/portfolio/b-boutique");
    expect(res?.status(), "the case study did not return 200").toBe(200);
    await settled(page);

    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const serious = violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    if (serious.length) {
      throw new Error(
        `${serious.length} violation(s) on the case study:\n` +
          serious.map((v) => `  [${v.impact}] ${v.id}: ${v.help}`).join("\n"),
      );
    }
    expect(serious).toEqual([]);
  });

  test("the portfolio card opens the case study rather than the live site", async ({
    page,
  }) => {
    await page.goto("/portfolio");
    const card = page.getByRole("link", { name: /B Boutique/i }).first();
    await card.click();
    await page.waitForURL("**/portfolio/b-boutique");
    await expect(page.locator("h1")).toHaveText(/B Boutique/i);
  });
});

/**
 * The legal documents are reachable from every page and clear the same axe
 * floor as everything else. A privacy policy nobody can find, or one a screen
 * reader cannot navigate, does not do the job it exists to do.
 */
test.describe("legal", () => {
  for (const path of ["/legal/privacy", "/legal/terms"]) {
    test(`${path} has no serious or critical axe violations`, async ({
      page,
    }) => {
      const res = await page.goto(path);
      expect(res?.status(), `${path} did not return 200`).toBe(200);
      await settled(page);

      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const serious = violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      if (serious.length) {
        throw new Error(
          `${serious.length} violation(s) on ${path}:\n` +
            serious.map((v) => `  [${v.impact}] ${v.id}: ${v.help}`).join("\n"),
        );
      }
      expect(serious).toEqual([]);
    });
  }

  test("the footer links to the privacy policy from the homepage", async ({
    page,
  }) => {
    await page.goto("/");
    await settled(page);
    // Scroll the way a reader does — with the wheel — rather than with
    // `scrollIntoViewIfNeeded` or a programmatic jump. Two reasons, both of
    // them properties of this page rather than of the test:
    //
    //  - The footer is `position: fixed` inside a clipped wrapper (the curtain
    //    reveal), and "scroll this into view" has no meaning for a fixed
    //    element. Playwright judged it already in view and clicked at those
    //    coordinates on an unscrolled page, where the click landed on the hero.
    //  - Lenis owns the scroll position. A `window.scrollTo` is a jump it did
    //    not make and it eases back toward its own target, so the page was
    //    still travelling when the click was attempted.
    //
    // The assertion is unchanged: the link must navigate to the policy.
    await scrollToBottom(page);
    const link = page.getByRole("link", { name: /^privacy$/i }).first();
    await link.click();
    await page.waitForURL("**/legal/privacy");
    await expect(page.locator("h1")).toHaveText(/privacy policy/i);
  });

  test("the enquiry form states what happens to the data, and links to it", async ({
    page,
  }) => {
    await page.goto("/#contact");
    const form = page.locator("#contact form");
    await expect(form).toContainText(/reply to you/i);
    await expect(
      form.getByRole("link", { name: /how we handle your information/i }),
    ).toBeVisible();
  });

  /*
    The claim in the privacy policy is that this site sets no cookies and
    contacts nobody. That is only true until someone adds a script, so it is
    asserted here rather than trusted — if it ever fails, the policy has become
    a false statement and a consent mechanism is legally required.
  */
  test("no cookies, no web storage, no third-party requests", async ({
    page,
    context,
  }) => {
    const external: string[] = [];
    page.on("request", (r) => {
      const host = new URL(r.url()).host;
      if (!host.includes("localhost") && !host.includes("127.0.0.1")) {
        external.push(host);
      }
    });

    await page.goto("/");
    await settled(page);

    expect(external, `third-party hosts contacted: ${external.join(", ")}`)
      .toEqual([]);
    expect(await context.cookies()).toEqual([]);
    expect(
      await page.evaluate(() => ({
        local: Object.keys(localStorage),
        session: Object.keys(sessionStorage),
      })),
    ).toEqual({ local: [], session: [] });
  });
});

/**
 * The 404 exists to get a lost visitor somewhere useful, so it is held to the
 * same floor as a real page — and its links are asserted, because a 404 whose
 * own buttons go nowhere is the worst version of this page.
 */
test.describe("not found", () => {
  test("an unknown URL returns 404 and clears the axe floor", async ({
    page,
  }) => {
    const res = await page.goto("/this-page-does-not-exist");
    expect(res?.status()).toBe(404);
    await settled(page);

    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const serious = violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    if (serious.length) {
      throw new Error(
        `${serious.length} violation(s) on the 404:\n` +
          serious.map((v) => `  [${v.impact}] ${v.id}: ${v.help}`).join("\n"),
      );
    }
    expect(serious).toEqual([]);
  });

  test("the 404 offers a way out that actually resolves", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");
    await expect(page.locator("h1")).toHaveText(/does not exist/i);

    const home = page
      .getByRole("main")
      .getByRole("link", { name: /back to the homepage/i });
    await expect(home).toBeVisible();
    await home.click();
    await page.waitForURL((u) => new URL(u).pathname === "/");
  });
});

/**
 * Reduced motion must never cost a visitor the content.
 *
 * This regressed silently once: `Reveal` branches on `useReducedMotion()`,
 * but that is a client hook, so Motion's `initial` styles (`opacity: 0`)
 * could still be emitted inline and, if the entrance never ran afterwards,
 * the element stayed invisible. 24 blocks were affected — the whole services
 * list, both work cards, the results figures. Nothing in the suite caught it,
 * because every other test runs at the default motion preference.
 *
 * The fix is a CSS rule on `[data-reveal]`; this is what stops it coming
 * back. If it fails, do not relax it — find what is stranding the element.
 */
test.describe("reduced motion", () => {
  /**
   * The context is built here rather than with `test.use({ reducedMotion })`
   * — this project's Playwright types do not carry that option on the test
   * fixtures, and emulating it on the context is equivalent and explicit.
   */
  test("no content is left invisible with prefers-reduced-motion set", async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto(baseURL ?? "/");

    // Walk the page so every entrance has had its chance to run.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 40));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(600);

    const invisible = await page.evaluate(() =>
      [...document.querySelectorAll("body *")]
        .filter((el) => {
          const style = getComputedStyle(el);
          if (parseFloat(style.opacity) !== 0) return false;
          if ((el.textContent ?? "").trim().length < 8) return false;
          if (el.getBoundingClientRect().height <= 20) return false;
          // The closing band cross-fades two layers in the same box and the
          // inactive one is deliberately at opacity 0. That is a control's
          // other state, not withheld content, and it is marked `inert` so it
          // leaves the accessibility tree and the tab order with it. Anything
          // hidden WITHOUT that marking is the bug this test exists for.
          return !el.closest("[inert], [aria-hidden='true']");
        })
        .map(
          (el) =>
            `${el.tagName}.${String(el.className).slice(0, 30)} :: ` +
            `${(el.textContent ?? "").trim().slice(0, 40)}`,
        ),
    );

    await context.close();

    if (invisible.length) {
      throw new Error(
        `${invisible.length} block(s) invisible under reduced motion:\n` +
          invisible.map((s) => `  ${s}`).join("\n"),
      );
    }
    expect(invisible).toEqual([]);
  });

  test("the work grid and its portfolio link are visible and reachable", async ({
    browser,
    baseURL,
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto(baseURL ?? "/");
    const cards = page.locator("#work ul > li").first();
    await cards.scrollIntoViewIfNeeded();
    await expect(page.getByRole("heading", { name: "B Boutique" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "The Watch Club" }),
    ).toBeVisible();

    const link = page.getByRole("link", { name: /view the portfolio/i });
    await expect(link).toBeVisible();
    await link.click();
    await page.waitForURL((u) => new URL(u).pathname === "/portfolio");
    await context.close();
  });
});

/**
 * /llms.txt is a summary of the site written for machines, which makes it the
 * easiest place for an unverifiable claim to end up unnoticed — nobody reads
 * it in review. These assertions are the same discipline `checkContentIntegrity`
 * applies to the pages.
 */
test.describe("llms.txt", () => {
  test("is served as plain text and states nothing the site cannot", async ({
    request,
  }) => {
    const res = await request.get("/llms.txt");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("text/plain");

    const body = await res.text();

    // Identity and contact, which are confirmed facts.
    expect(body).toContain("Black Line Agency");
    expect(body).toContain("contact@BlackLineAgency.co.uk");

    // No prices. PRICING_CONFIRMED is false, and a figure copied here would
    // outlive any change to /pricing.
    expect(body).not.toMatch(/£\s?\d/);

    // No client outcome or GEO figures — all of them sit behind
    // RESULTS_VERIFIED and none may leak into a machine-readable summary.
    expect(body).not.toMatch(/\+\d+%/);
    expect(body).not.toMatch(/\bGEO score\b/i);
  });
});

/**
 * Links that go nowhere.
 *
 * Two shipped at once and neither was caught by anything here: a footer
 * "Contact" using a bare `#contact` on nine routes where no such element
 * exists, and every `/#contact` CTA landing thousands of pixels short because
 * the hero's pin-spacer grows the page after the browser has already jumped.
 * Both presented identically to the client — "the button doesn't do anything".
 */
test.describe("navigation targets", () => {
  test("no link points at an anchor that is not on the page it lands on", async ({
    page,
  }) => {
    const routes = [
      "/",
      "/services",
      "/pricing",
      "/faq",
      "/studio",
      "/portfolio",
      "/portfolio/b-boutique",
      "/legal/privacy",
      "/legal/terms",
    ];
    const broken: string[] = [];

    for (const route of routes) {
      await page.goto(route);
      const hrefs = await page.evaluate(() =>
        [...document.querySelectorAll("a")].map((a) => ({
          href: a.getAttribute("href") ?? "",
          text: (a.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 30),
        })),
      );

      for (const { href, text } of hrefs) {
        if (!href) broken.push(`${route}: "${text}" has no href`);
        else if (href === "#") broken.push(`${route}: "${text}" href="#"`);
        // A bare hash must resolve on the page it sits on. A rooted "/#id"
        // is a different promise and is covered by the test below.
        else if (href.startsWith("#")) {
          const id = href.slice(1);
          if (!(await page.locator(`#${id}`).count())) {
            broken.push(`${route}: "${text}" -> ${href} — not on this page`);
          }
        }
      }
    }

    if (broken.length) {
      throw new Error(`Dead links:\n  ${broken.join("\n  ")}`);
    }
    expect(broken).toEqual([]);
  });

  test("the enquiry CTA lands on the form when arriving from another page", async ({
    page,
  }) => {
    await page.goto("/pricing");
    const cta = page.getByRole("link", { name: /^enquire/i }).first();
    await cta.scrollIntoViewIfNeeded();
    await cta.click();

    await page.waitForURL((u) => u.hash === "#contact");

    // The form must actually be on screen — arriving at the right URL while
    // parked three thousand pixels above it is the bug, not the fix.
    await expect(page.locator("#contact")).toBeInViewport({ ratio: 0.1 });
  });
});

/**
 * The "Read more" pill is a phone affordance and must not reach the desktop.
 *
 * It was reaching it, and the reason is worth keeping: the pill borrows the
 * `.eyebrow` treatment, and `.eyebrow` is a plain rule in `globals.css`
 * declared after `@import "tailwindcss"`. That puts it OUTSIDE any cascade
 * layer, and unlayered CSS beats layered CSS whatever the specificity — so its
 * `display: inline-flex` quietly overrode `lg:hidden` and the control rendered
 * on a viewport where the paragraph it reveals is already fully visible.
 *
 * Asserting on the computed result rather than on the class list, because the
 * class was there the whole time and was losing. Same trap as `normal-case!`
 * on the figures in `results.tsx`; expect it again for any utility that fights
 * a component class in that file.
 */
test.describe("expandable service detail", () => {
  test("the Read more pill is a phone control only", async ({ page }, info) => {
    await page.goto("/");
    await settled(page);

    const pill = page.getByRole("button", { name: /read more/i }).first();
    const width = info.project.use.viewport?.width ?? 0;
    const desktop = width >= 1024;

    if (desktop) {
      await expect(pill).toBeHidden();
    } else {
      await expect(pill).toBeVisible();
    }
  });

  test("desktop shows the full paragraph, unclamped", async ({ page }, info) => {
    const width = info.project.use.viewport?.width ?? 0;
    test.skip(width < 1024, "The clamp is deliberate below lg.");

    await page.goto("/");
    await settled(page);

    // -webkit-line-clamp resolves to "none" when lifted. If it ever reports a
    // number here, desktop copy is being truncated with no way to reveal it —
    // the pill is hidden at this width.
    const clamped = await page
      .locator("[data-expandable]")
      .first()
      .evaluate((el) => getComputedStyle(el).webkitLineClamp);

    expect(clamped).toBe("none");
  });
});

/**
 * The stacked What we do section.
 *
 * Every card must be the same height. Not for tidiness: at the end of the
 * stack all six release together and their bottoms align on the list's bottom
 * edge, so a taller card extends further UP than the last one and stands above
 * it uncovered — 190px of the GEO/SEO card showed above the final card before
 * the floor was added, which the client saw before this test existed. Equal
 * heights make them coincide.
 *
 * The floor is a hardcoded `min-h` per breakpoint, so it is content-dependent
 * by construction. This is the thing that tells us a service has outgrown it.
 */
test.describe("services stack", () => {
  test("every card is the same height", async ({ page }) => {
    await page.goto("/");
    await settled(page);

    const heights = await page.evaluate(() =>
      [...document.querySelectorAll(".services-stack > li")].map((li) =>
        Math.round(li.getBoundingClientRect().height),
      ),
    );

    expect(heights.length).toBeGreaterThan(1);
    const tallest = Math.max(...heights);
    const shortest = Math.min(...heights);
    expect(
      tallest - shortest,
      `cards are ragged (${heights.join(", ")}) — a service has outgrown the min-h floor in services.tsx, and the tallest will stand above the last card when the stack releases`,
    ).toBeLessThanOrEqual(2);
  });

  test("no card is taller than the room beneath the sticking point", async ({
    page,
  }) => {
    await page.goto("/");
    await settled(page);

    // A sticky card taller than the space under its `top` offset traps its own
    // bottom off-screen: the reader can never reach the end of it.
    const worst = await page.evaluate(() => {
      const lis = [...document.querySelectorAll(".services-stack > li")];
      return Math.max(
        ...lis.map((li) => {
          const top = parseFloat(getComputedStyle(li).top) || 0;
          return li.getBoundingClientRect().height - (window.innerHeight - top);
        }),
      );
    });

    expect(worst, `tallest card overflows its viewport by ${worst}px`).toBeLessThan(0);
  });
});

/**
 * The wordmark is the way back to the top.
 *
 * It was a link to "/" and nothing else, so on the homepage — the one page
 * where a reader is most likely to use it — clicking it navigated to the route
 * it was already on, which the App Router treats as a no-op. The control
 * looked like a control and did nothing.
 */
test.describe("wordmark", () => {
  test("clicking it on the homepage returns to the hero", async ({ page }) => {
    await page.goto("/");
    await settled(page);
    await scrollToBottom(page);

    const before = await page.evaluate(() => Math.round(window.scrollY));
    expect(before, "the page did not scroll, so this proves nothing").toBeGreaterThan(2000);

    await page.getByRole("link", { name: /black ?line.*home/i }).first().click();

    // Smooth scroll, so give it time to travel rather than asserting instantly.
    await page.waitForFunction(() => window.scrollY < 5, undefined, { timeout: 6000 });
    expect(await page.evaluate(() => Math.round(window.scrollY))).toBeLessThan(5);
  });

  test("on another route it still navigates home", async ({ page }) => {
    await page.goto("/pricing");
    await settled(page);
    await page.getByRole("link", { name: /black ?line.*home/i }).first().click();
    await page.waitForURL((u) => u.pathname === "/");
  });
});

/**
 * The nav says which page you are on.
 *
 * It did not, which the design review flagged: five real routes and no active
 * state anywhere in the bar. Colour alone would not fix it either — a screen
 * reader cannot see that one item is whiter than the rest, so the state has to
 * be carried by `aria-current` as well.
 */
test.describe("nav active state", () => {
  for (const [path, label] of [
    ["/pricing", "Pricing"],
    ["/services", "Services"],
    ["/portfolio", "Portfolio"],
  ] as const) {
    test(`${path} marks ${label} as the current page`, async ({ page }) => {
      await page.goto(path);
      await settled(page);

      const current = await page.evaluate(() =>
        [...document.querySelectorAll('nav[aria-label="Primary"] a')]
          .filter((a) => a.getAttribute("aria-current") === "page")
          .map((a) => (a.textContent ?? "").trim()),
      );

      expect(current.length, "exactly one nav item may be current").toBe(1);
      expect(current[0]).toContain(label);
    });
  }

  test("a case study still marks Portfolio as current", async ({ page }) => {
    await page.goto("/portfolio/b-boutique");
    await settled(page);
    const current = await page.evaluate(() =>
      [...document.querySelectorAll('nav[aria-label="Primary"] a')]
        .filter((a) => a.getAttribute("aria-current") === "page")
        .map((a) => (a.textContent ?? "").trim()),
    );
    expect(current[0]).toContain("Portfolio");
  });

  test("the homepage marks nothing as current", async ({ page }) => {
    await page.goto("/");
    await settled(page);
    const count = await page.evaluate(
      () =>
        document.querySelectorAll(
          'nav[aria-label="Primary"] a[aria-current="page"]',
        ).length,
    );
    expect(count).toBe(0);
  });
});
