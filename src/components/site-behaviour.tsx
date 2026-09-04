"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Lenis from "lenis";

/**
 * Client-side behaviour for the whole site.
 *
 * This is a faithful port of the runtime that shipped inside the client's
 * single-file export (which itself re-implemented the real React components
 * — VerticalDialNav, the carousels, the reveal-on-scroll — in plain JS so the
 * offline preview matched). Here it runs once for site-wide wiring (Lenis,
 * header state, the mobile menu, link interception) and again on every route
 * change for the content-dependent pieces.
 *
 * The hash router of the export is replaced by real Next navigation: internal
 * links are intercepted and pushed through the App Router, so URLs are real
 * and the markup is still swapped without a full reload.
 */
export function SiteBehaviour() {
  const pathname = usePathname();
  const router = useRouter();

  // ---- Site-wide wiring: runs once. -------------------------------------
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("js");

    let lenis: Lenis | null = null;
    let rafId = 0;
    if (!reduce) {
      lenis = new Lenis({
        duration: 0.9,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1,
      });
      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
      const raf = (time: number) => {
        lenis!.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    // Header transparent-over-hero only on the home route.
    const syncHeader = () => {
      const header = document.querySelector("header[data-state]");
      if (!header) return;
      const overHero = location.pathname === "/";
      header.setAttribute(
        "data-state",
        window.scrollY > 24 || !overHero ? "stuck" : "top",
      );
    };
    addEventListener("scroll", syncHeader, { passive: true });
    syncHeader();

    // Mobile menu (elements live in the persistent layout).
    const trigger = document.querySelector<HTMLButtonElement>(
      'button[aria-controls="mobile-menu"]',
    );
    const panel = document.querySelector<HTMLElement>("#mobile-menu");
    const closeMenu = () => {
      if (!trigger || !panel) return;
      trigger.setAttribute("aria-expanded", "false");
      panel.setAttribute("data-open", "false");
      panel.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
    const onTrigger = () => {
      if (!trigger || !panel) return;
      const open = trigger.getAttribute("aria-expanded") !== "true";
      trigger.setAttribute("aria-expanded", String(open));
      panel.setAttribute("data-open", String(open));
      panel.setAttribute("aria-hidden", String(!open));
      document.body.style.overflow = open ? "hidden" : "";
      const links = panel.querySelectorAll<HTMLElement>("a");
      links.forEach((el, i) => {
        el.style.transitionDelay = open ? `${120 + i * 45}ms` : "0ms";
      });
    };
    if (trigger && panel) {
      panel.removeAttribute("inert");
      trigger.addEventListener("click", onTrigger);
    }

    // Intercept internal links for SPA navigation; smooth-scroll same-page
    // anchors. External / tel / mailto links fall through to the browser.
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.("a");
      if (!a) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      if (a.target && a.target !== "_self") return;
      const href = a.getAttribute("href") || "";

      // Same-page hash anchor.
      if (href.charAt(0) === "#" && href.length > 1) {
        const t = document.querySelector(href);
        if (!t) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(t as HTMLElement, { offset: -100 });
        else (t as HTMLElement).scrollIntoView({ behavior: "smooth" });
        return;
      }

      // Internal route (optionally with a hash), same origin.
      if (href.startsWith("/") && !href.startsWith("//")) {
        e.preventDefault();
        closeMenu();
        router.push(href);
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      removeEventListener("scroll", syncHeader);
      document.removeEventListener("click", onClick);
      trigger?.removeEventListener("click", onTrigger);
      if (rafId) cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
    // router is stable; run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Content-dependent wiring: runs on every route change. ------------
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const teardown: Array<() => void> = [];
    const raf = (fn: FrameRequestCallback) => {
      const id = requestAnimationFrame(fn);
      teardown.push(() => cancelAnimationFrame(id));
      return id;
    };

    // Header state for this route.
    const header = document.querySelector("header[data-state]");
    if (header)
      header.setAttribute("data-state", pathname === "/" && scrollY <= 24 ? "top" : "stuck");

    // Active nav link.
    document.querySelectorAll<HTMLAnchorElement>("a[data-route]").forEach((a) => {
      if (a.getAttribute("data-route") === pathname)
        a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });

    // Reveal on scroll.
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-reveal],[data-reveal-mask],[data-scale]",
      ),
    );
    const show = (el: HTMLElement) => {
      if (el.hasAttribute("data-reveal")) el.setAttribute("data-reveal", "in");
      if (el.hasAttribute("data-reveal-mask")) el.setAttribute("data-reveal-mask", "in");
      if (el.hasAttribute("data-scale")) el.setAttribute("data-scale", "in");
    };
    if (reduce || !("IntersectionObserver" in window)) {
      targets.forEach(show);
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            show(e.target as HTMLElement);
            io.unobserve(e.target);
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
      );
      targets.forEach((el) => io.observe(el));
      teardown.push(() => io.disconnect());
    }

    // Parallax (desktop, motion allowed).
    if (!reduce && innerWidth >= 900) {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>("[data-parallax]"),
      );
      if (nodes.length) {
        const vis: HTMLElement[] = [];
        const pio = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              const el = e.target as HTMLElement;
              const i = vis.indexOf(el);
              if (e.isIntersecting) {
                if (i === -1) vis.push(el);
              } else if (i > -1) vis.splice(i, 1);
            });
          },
          { rootMargin: "20% 0px" },
        );
        nodes.forEach((n) => pio.observe(n));
        teardown.push(() => pio.disconnect());
        const tick = () => {
          const vh = innerHeight;
          for (const el of vis) {
            const r = el.getBoundingClientRect();
            const pr = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
            const clamped = Math.max(-1, Math.min(1, pr));
            el.style.setProperty("--py", (clamped * r.height * 0.06).toFixed(2) + "px");
          }
          raf(tick);
        };
        raf(tick);
      }
    }

    // Treatments index: hovering a row swaps the preview image (desktop).
    const rows = document.querySelectorAll<HTMLAnchorElement>(
      "ul li h3 a[data-route='/treatments']",
    );
    const previews = document.querySelectorAll<HTMLElement>("[data-active]");
    if (rows.length && previews.length === rows.length) {
      rows.forEach((a, i) => {
        const row = a.closest("li");
        if (!row) return;
        const onEnter = () =>
          previews.forEach((p, j) => p.setAttribute("data-active", String(i === j)));
        row.addEventListener("mouseenter", onEnter);
        teardown.push(() => row.removeEventListener("mouseenter", onEnter));
      });
    }

    // Carousels: reviews + most-booked.
    const carousels = document.querySelectorAll<HTMLElement>(
      'ul[aria-label="Client reviews"], ul[aria-label="most booked treatments"]',
    );
    carousels.forEach((track) => {
      const label = track.getAttribute("aria-label");
      const scope =
        (track.parentElement && track.parentElement.closest("section")) ||
        document.body;
      const prev = scope.querySelector<HTMLButtonElement>('button[aria-label^="Previous"]');
      const next = scope.querySelector<HTMLButtonElement>('button[aria-label^="More"]');
      const thumb = scope.querySelector<HTMLElement>("[data-rail-thumb]");

      const step = (dir: number) => {
        const card = track.firstElementChild as HTMLElement | null;
        let gap = 24;
        if (card && card.nextElementSibling) {
          gap =
            (card.nextElementSibling as HTMLElement).offsetLeft -
            card.offsetLeft -
            card.offsetWidth;
        }
        const d = card ? card.offsetWidth + gap : track.clientWidth * 0.8;
        track.scrollBy({ left: d * dir, behavior: "smooth" });
      };
      const sync = () => {
        const max = track.scrollWidth - track.clientWidth;
        const atStart = track.scrollLeft < 8;
        const atEnd = track.scrollLeft >= max - 8;
        if (prev) prev.disabled = atStart;
        if (next) next.disabled = atEnd;
        if (label !== "Client reviews") {
          track.toggleAttribute("data-at-start", atStart);
          track.toggleAttribute("data-at-end", atEnd);
        }
        if (thumb && max > 0) {
          thumb.style.setProperty(
            "--size",
            (track.clientWidth / track.scrollWidth) * 100 + "%",
          );
          thumb.style.setProperty("--offset", String(track.scrollLeft / max));
        }
      };
      const onPrev = () => step(-1);
      const onNext = () => step(1);
      prev?.addEventListener("click", onPrev);
      next?.addEventListener("click", onNext);
      track.addEventListener("scroll", sync, { passive: true });
      addEventListener("resize", sync);
      teardown.push(() => {
        prev?.removeEventListener("click", onPrev);
        next?.removeEventListener("click", onNext);
        track.removeEventListener("scroll", sync);
        removeEventListener("resize", sync);
      });
      sync();

      // Slow auto-advance, held for hover/focus/drag/off-screen/hidden/pause.
      const playBtn = scope.querySelector<HTMLButtonElement>('button[aria-label*="carousel"]');
      const held = { hover: false, focus: false, drag: false, off: false };
      let paused = false;
      if (playBtn) {
        const onPlay = () => {
          paused = !paused;
          playBtn.setAttribute("aria-pressed", String(paused));
          playBtn.setAttribute(
            "aria-label",
            (paused ? "Play" : "Pause") + " the treatments carousel",
          );
          const g = playBtn.querySelector("span");
          if (g) g.textContent = paused ? "▶" : "❚❚";
        };
        playBtn.addEventListener("click", onPlay);
        teardown.push(() => playBtn.removeEventListener("click", onPlay));
      }
      if (!reduce) {
        const enter = () => (held.hover = true);
        const leave = () => (held.hover = false);
        const fin = () => (held.focus = true);
        const fout = () => (held.focus = false);
        track.addEventListener("pointerenter", enter);
        track.addEventListener("pointerleave", leave);
        track.addEventListener("focusin", fin);
        track.addEventListener("focusout", fout);
        const vis = new IntersectionObserver(
          (es) => (held.off = !es[0].isIntersecting),
          { threshold: 0.15 },
        );
        vis.observe(track);
        track.setAttribute("data-auto", "");
        let last = performance.now();
        let carry = 0;
        let rewinding = false;
        const drift = (now: number) => {
          const dt = Math.min(now - last, 64) / 1000;
          last = now;
          if (!paused && !held.hover && !held.focus && !held.drag && !held.off && !document.hidden) {
            const max = track.scrollWidth - track.clientWidth;
            if (rewinding) {
              if (track.scrollLeft < 4) rewinding = false;
            } else if (max > 0 && track.scrollLeft >= max - 1) {
              rewinding = true;
              track.scrollTo({ left: 0, behavior: "smooth" });
            } else {
              carry += 20 * dt;
              const whole = Math.floor(carry);
              if (whole) {
                carry -= whole;
                track.scrollLeft += whole;
              }
            }
          }
          raf(drift);
        };
        raf(drift);
        teardown.push(() => {
          track.removeEventListener("pointerenter", enter);
          track.removeEventListener("pointerleave", leave);
          track.removeEventListener("focusin", fin);
          track.removeEventListener("focusout", fout);
          vis.disconnect();
        });
      }

      // Drag to scroll, mouse only.
      let dragging = false;
      let moved = false;
      let startX = 0;
      let startLeft = 0;
      const down = (e: PointerEvent) => {
        if (e.pointerType !== "mouse" || e.button !== 0) return;
        dragging = true;
        moved = false;
        startX = e.clientX;
        startLeft = track.scrollLeft;
        held.drag = true;
      };
      const move = (e: PointerEvent) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        if (!moved && Math.abs(dx) > 4) {
          moved = true;
          track.setPointerCapture(e.pointerId);
          track.setAttribute("data-dragging", "");
        }
        if (moved) {
          e.preventDefault();
          track.scrollLeft = startLeft - dx;
        }
      };
      const up = (e: PointerEvent) => {
        if (!dragging) return;
        dragging = false;
        held.drag = false;
        track.removeAttribute("data-dragging");
        if (track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
      };
      const clickGuard = (e: MouseEvent) => {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
          moved = false;
        }
      };
      track.addEventListener("pointerdown", down);
      track.addEventListener("pointermove", move);
      addEventListener("pointerup", up);
      track.addEventListener("click", clickGuard, true);
      teardown.push(() => {
        track.removeEventListener("pointerdown", down);
        track.removeEventListener("pointermove", move);
        removeEventListener("pointerup", up);
        track.removeEventListener("click", clickGuard, true);
      });
    });

    // Hero scroll progression (the pin is CSS; this feeds it a number).
    const heroTrack = document.querySelector<HTMLElement>("[data-hero-track]");
    if (heroTrack && !reduce) {
      let lastP = -1;
      const heroTick = () => {
        const r = heroTrack.getBoundingClientRect();
        const travel = r.height - innerHeight;
        const p = travel > 0 ? Math.min(1, Math.max(0, -r.top / travel)) : 0;
        const q = Math.round(p * 100) / 100;
        if (q !== lastP) {
          heroTrack.style.setProperty("--p", String(q));
          lastP = q;
        }
        raf(heroTick);
      };
      raf(heroTick);
    }

    // Vertical dial nav.
    bootDial(teardown);

    // Contact enquiry form (progressive enhancement).
    wireContactForm(teardown);

    // Scroll handling on navigation: honour a hash, else go to top.
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    const hash = location.hash;
    if (hash && hash.length > 1) {
      requestAnimationFrame(() => {
        const t = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (t) {
          if (lenis) lenis.scrollTo(t, { offset: -90 });
          else t.scrollIntoView();
        }
      });
    } else {
      if (lenis) lenis.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    }

    return () => teardown.forEach((fn) => fn());
  }, [pathname]);

  return null;
}

/**
 * Progressive enhancement for the enquiry form. The original React component
 * owned this; here we intercept submit, post to /api/contact, and reflect the
 * result in an aria-live status region. The endpoint never fakes success, so a
 * 501 (delivery not configured) surfaces an honest "please call" message.
 */
function wireContactForm(teardown: Array<() => void>) {
  const form = document.querySelector<HTMLFormElement>(
    'form input[name="website"]',
  )?.closest("form") as HTMLFormElement | null;
  if (!form) return;
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');

  let status = form.querySelector<HTMLElement>("[data-form-status]");
  if (!status) {
    status = document.createElement("p");
    status.setAttribute("data-form-status", "");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.style.cssText = "margin:0.75rem 0 0;font-size:var(--fs-small)";
    form.appendChild(status);
  }
  const say = (msg: string, ok: boolean) => {
    status!.textContent = msg;
    status!.style.color = ok ? "var(--text)" : "#8a2b2b";
  };

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      message: String(data.get("message") || ""),
      website: String(data.get("website") || ""),
    };
    if (submit) {
      submit.disabled = true;
      submit.textContent = "Sending…";
    }
    say("", true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        form.reset();
        say("Thank you — your message has been sent. We’ll be in touch shortly.", true);
      } else {
        say(json.error || "Something went wrong. Please call 07873 220636.", false);
      }
    } catch {
      say("We couldn’t reach the server. Please call 07873 220636.", false);
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.textContent = "Send message";
      }
    }
  };
  form.addEventListener("submit", onSubmit);
  teardown.push(() => form.removeEventListener("submit", onSubmit));
}

/** Vertical dial nav — active dot follows the section nearest centre. */
function bootDial(teardown: Array<() => void>) {
  const nav = document.querySelector<HTMLElement>(
    'nav[aria-label="Sections of this page"]',
  );
  if (!nav) return;
  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>("a"));
  if (!links.length) return;
  const mark = nav.querySelector<HTMLElement>("span");
  const sections = links.map((a) =>
    document.getElementById((a.getAttribute("href") || "#").slice(1)),
  );
  if (!sections.filter(Boolean).length) return;

  let active = 0;
  let hovered: number | null = null;

  const paint = () => {
    const f = hovered === null ? active : hovered;
    links.forEach((a, i) => {
      a.style.setProperty("--d", String(Math.abs(i - f)));
      if (i === active) {
        a.setAttribute("data-active", "");
        a.setAttribute("aria-current", "true");
      } else {
        a.removeAttribute("data-active");
        a.removeAttribute("aria-current");
      }
    });
    if (mark) mark.style.setProperty("--i", String(active));
  };
  const settle = () => {
    let best = -1;
    let bestScore = Infinity;
    const vh = innerHeight;
    sections.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < vh * 0.45 || r.top > vh * 0.55) return;
      const score = Math.abs(r.top + r.height / 2 - vh / 2);
      if (score < bestScore) {
        bestScore = score;
        best = i;
      }
    });
    if (best > -1 && best !== active) {
      active = best;
      paint();
    }
  };
  const sampleDark = () => {
    const r = nav.getBoundingClientRect();
    const under = document.elementsFromPoint(
      Math.min(innerWidth - 8, r.right - 24),
      Math.max(2, Math.min(innerHeight - 2, r.top + r.height / 2)),
    );
    let dark = false;
    for (const n of under) {
      if (n === nav || nav.contains(n)) continue;
      if (n.classList.contains("darkSection") || n.tagName === "FOOTER") {
        dark = true;
        break;
      }
    }
    nav.toggleAttribute("data-on-dark", dark);
  };

  links.forEach((a, i) => {
    const enter = () => {
      hovered = i;
      paint();
    };
    const blur = () => {
      hovered = null;
      paint();
    };
    const click = () => {
      active = i;
      paint();
    };
    a.addEventListener("mouseenter", enter);
    a.addEventListener("focus", enter);
    a.addEventListener("blur", blur);
    a.addEventListener("click", click);
    teardown.push(() => {
      a.removeEventListener("mouseenter", enter);
      a.removeEventListener("focus", enter);
      a.removeEventListener("blur", blur);
      a.removeEventListener("click", click);
    });
  });
  const onLeave = () => {
    hovered = null;
    paint();
  };
  nav.addEventListener("mouseleave", onLeave);

  let frame = 0;
  const onScroll = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      settle();
      sampleDark();
    });
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll, { passive: true });
  teardown.push(() => {
    nav.removeEventListener("mouseleave", onLeave);
    removeEventListener("scroll", onScroll);
    removeEventListener("resize", onScroll);
    if (frame) cancelAnimationFrame(frame);
  });

  settle();
  sampleDark();
  paint();
  nav.setAttribute("data-ready", "");
}
