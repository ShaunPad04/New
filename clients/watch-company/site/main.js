/* ========================================================================== 
   THE WATCH CLUB — Rolex Day-Date 36, Ref. 118238, Stock No. 16496
   ========================================================================== */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const FRAME_COUNT = 152;
const framePath = (i) => `/assets/photo/v3/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;

/* -------------------------------------------------------------------------
   Smooth scroll — skipped entirely under prefers-reduced-motion.
   ------------------------------------------------------------------------- */
let lenis = null;

function initSmoothScroll() {
  if (reduceMotion) return;

  lenis = new Lenis({
    lerp: 0.1,
    wheelMultiplier: 1,
    infinite: false,
    gestureOrientation: 'vertical',
    normalizeWheel: true,
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

/* -------------------------------------------------------------------------
   Media fallbacks.

   No client photography exists yet. Rather than ship broken image boxes, any
   asset that fails to load is removed and its container is flagged so the
   designed CSS plate underneath shows instead. Drop the real files into
   public/assets/photo/ and every one of these upgrades with no code change.
   ------------------------------------------------------------------------- */
function initMediaFallbacks() {
  document.querySelectorAll('img[data-fallback]').forEach((img) => {
    const fail = () => {
      img.hidden = true;
      img.parentElement?.classList.add('media-missing');
    };
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener('error', fail);
  });

  const video = document.querySelector('.bg-video');
  if (video) {
    // A missing <source> fires error on the source element, not the video.
    video.querySelector('source')?.addEventListener('error', () => { video.hidden = true; });
    video.addEventListener('error', () => { video.hidden = true; });
  }
}

/* -------------------------------------------------------------------------
   Hero
   ------------------------------------------------------------------------- */
function initHeroAnimations() {
  const video = document.querySelector('.bg-video');
  const bgText = document.querySelector('.hero-text-bg');
  const title = document.querySelector('.hero-title');
  const subtitle = document.querySelector('.hero-subtitle');
  const cta = document.querySelector('.hero-cta-group');
  const nav = document.querySelector('.nav');

  if (reduceMotion) {
    gsap.set([title, subtitle, cta, nav, bgText], { clearProps: 'all' });
    return;
  }

  gsap.set(video, { scale: 1.2, opacity: 0 });
  gsap.set(bgText, { scale: 0.5, opacity: 0 });
  gsap.set([title, subtitle, cta], { y: 40, opacity: 0 });
  gsap.set(nav, { y: -100, opacity: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.to(video, { scale: 1.05, opacity: 1, duration: 2.5, ease: 'power2.out' })
    .to(bgText, { scale: 1, opacity: 1, duration: 2 }, '-=1.5')
    .to(title, { y: 0, opacity: 1, duration: 1.2 }, '-=1.4')
    .to(subtitle, { y: 0, opacity: 1, duration: 1.1 }, '-=0.95')
    .to(cta, { y: 0, opacity: 1, duration: 1 }, '-=0.85')
    .to(nav, { y: 0, opacity: 1, duration: 1 }, '-=0.8');

  gsap.to(video, {
    scale: 1,
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('.hero-details', {
    y: -150,
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to(bgText, {
    y: -250,
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
  });
}

/* -------------------------------------------------------------------------
   Product reveal
   ------------------------------------------------------------------------- */
function initProductRevealAnimations() {
  const section = document.querySelector('.product-reveal');
  if (!section) return;

  const watch = section.querySelector('.product-reveal-watch-container');
  const title = section.querySelector('.product-reveal-title');
  const subtitle = section.querySelector('.product-reveal-subtitle');
  const cta = section.querySelector('.product-reveal-cta-group');

  if (reduceMotion) return;

  gsap.set(watch, { y: 50, opacity: 0, rotation: -5 });
  gsap.set([title, subtitle, cta], { y: 40, opacity: 0 });

  const trigger = { trigger: section, start: 'top 60%', toggleActions: 'play none none reverse' };

  gsap.to(watch, { y: 0, opacity: 1, rotation: 0, duration: 1.4, ease: 'power4.out', scrollTrigger: trigger });
  gsap.to(title, { y: 0, opacity: 1, duration: 1.1, ease: 'power4.out', delay: 0.15, scrollTrigger: trigger });
  gsap.to(subtitle, { y: 0, opacity: 1, duration: 1.1, ease: 'power4.out', delay: 0.3, scrollTrigger: trigger });
  gsap.to(cta, { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.45, scrollTrigger: trigger });

  gsap.to(watch, {
    rotation: 20,
    scale: 1.3,
    scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 1.5 },
  });
  gsap.to('.product-reveal-details', {
    y: -150,
    scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('.product-reveal-text-bg', {
    y: -250,
    scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 1.2 },
  });
}

/* -------------------------------------------------------------------------
   Specification & provenance — a still section. Fade up, nothing else.
   ------------------------------------------------------------------------- */
function initSpecAnimations() {
  const section = document.querySelector('.spec');
  if (!section || reduceMotion) return;

  const items = [
    section.querySelector('.spec-head'),
    ...section.querySelectorAll('.spec-grid > div'),
    section.querySelector('.spec-provenance'),
    section.querySelector('.spec-value'),
  ].filter(Boolean);

  gsap.set(items, { y: 30, opacity: 0 });
  gsap.to(items, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.04,
    scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none reverse' },
  });
}

/* -------------------------------------------------------------------------
   The Piece — two chapters of one watch
   ------------------------------------------------------------------------- */
function initEthosAnimations() {
  const section = document.querySelector('.ethos');
  if (!section) return;

  if (!reduceMotion) {
    gsap.to('.ethos-bg-img', {
      scale: 1.1,
      yPercent: 10,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }

  // Under reduced motion both chapters are stacked and always visible (CSS),
  // so the switcher is neither shown nor wired up.
  if (reduceMotion) return;

  let animating = false;

  section.querySelectorAll('.ethos-next-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (animating) return;
      animating = true;

      const target = btn.dataset.target;
      const current = section.querySelector('.ethos-main.active');
      const next = section.querySelector(`.ethos-main.variant-${target}`);
      if (!current || !next || current === next) { animating = false; return; }

      const currentText = current.querySelector('.ethos-text-side');
      const currentWatch = current.querySelector('.ethos-product-center');
      const nextText = next.querySelector('.ethos-text-side');
      const nextWatch = next.querySelector('.ethos-product-center');

      const tl = gsap.timeline({ onComplete: () => { animating = false; } });

      tl.to(currentText, { x: -100, opacity: 0, duration: 0.5, ease: 'power2.in' })
        .to(currentWatch, { x: -150, opacity: 0, duration: 0.5, ease: 'power2.in' }, '<')
        .add(() => {
          current.classList.remove('active');
          next.classList.add('active');
          section.querySelectorAll('.ethos-bg-img').forEach((img) => img.classList.remove('active'));
          section.querySelector(`.ethos-bg-${target}`)?.classList.add('active');
          gsap.set(currentText, { x: 0, opacity: 1 });
          gsap.set(currentWatch, { x: 0, opacity: 1 });
        })
        .fromTo(nextText, { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
        .fromTo(nextWatch, { x: 150, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '<')
        .add(() => { nextText.querySelector('.ethos-next-btn')?.focus(); });
    });
  });
}

/* -------------------------------------------------------------------------
   The Movement — scroll-scrubbed frame sequence.

   The 152-frame sequence has not been shot yet. We probe the first frame; if
   it is not there, the section drops its 300vh scroll runway and shows a
   designed plate instead of three empty screens of scrolling.
   ------------------------------------------------------------------------- */
function initDismantleAnimations() {
  const section = document.querySelector('.dismantle');
  const canvas = document.getElementById('dismantle-canvas');
  if (!section || !canvas) return;

  const container = section.querySelector('.dismantle-container');
  const header = section.querySelector('.dismantle-header');

  const disableSequence = () => {
    section.classList.add('no-sequence');
    canvas.hidden = true;
    container.classList.add('media-missing');
    ScrollTrigger.refresh();
  };

  const probe = new Image();
  probe.onerror = disableSequence;
  probe.onload = () => {
    const ctx = canvas.getContext('2d');
    const images = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      images.push(img);
    }

    const state = { frame: 0 };
    const render = () => {
      const img = images[state.frame];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    images[0].onload = render;
    render();

    if (reduceMotion) return;

    gsap.to(state, {
      frame: FRAME_COUNT - 1,
      snap: 'frame',
      ease: 'none',
      onUpdate: render,
      scrollTrigger: { trigger: section, start: 'top 40%', end: 'bottom bottom', scrub: 0.5 },
    });

    gsap.to(header, {
      x: -150,
      opacity: 0,
      ease: 'power2.in',
      scrollTrigger: { trigger: section, start: 'top 45%', end: 'top 10%', scrub: 1 },
    });
  };
  probe.src = framePath(1);
}

/* -------------------------------------------------------------------------
   Nav — hide on scroll down, reveal on scroll up
   ------------------------------------------------------------------------- */
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  let last = window.scrollY;

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    if (y > last && y > 160) nav.classList.add('is-hidden');
    else nav.classList.remove('is-hidden');
    last = y;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* -------------------------------------------------------------------------
   Enquiry modal + anchor scrolling + form submission
   ------------------------------------------------------------------------- */
function initModal() {
  const overlay = document.getElementById('reserve-modal');
  const modal = overlay?.querySelector('.modal');
  const closeBtn = document.getElementById('modal-close');
  const form = document.getElementById('reserve-form');
  const status = document.getElementById('form-status');
  if (!overlay || !modal) return;

  let lastFocused = null;

  const focusables = () => modal.querySelectorAll(
    'a[href], button:not([disabled]), input:not([type="hidden"]), select, textarea'
  );

  const open = () => {
    lastFocused = document.activeElement;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lenis?.stop();
    focusables()[0]?.focus();
  };

  const close = () => {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lenis?.start();
    lastFocused?.focus();
  };

  document.querySelectorAll('.open-reserve-modal').forEach((btn) => {
    btn.addEventListener('click', open);
  });
  closeBtn?.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;

    const items = focusables();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Anchor links — routed through Lenis when it is running.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -80 });
      else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* On Vercel the form posts to our serverless endpoint. The endpoint only
     returns success after a configured delivery channel accepts the enquiry;
     otherwise the UI falls back to the published phone/email details. */
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('.form-submit-btn');
    status.className = 'form-status';
    status.textContent = 'Sending…';
    submitBtn.disabled = true;

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok || !result.ok) throw new Error(result.error || String(res.status));
      status.className = 'form-status is-success';
      status.textContent = 'Thank you — your enquiry has been sent. A specialist will be in touch.';
      form.reset();
    } catch {
      status.className = 'form-status is-error';
      status.innerHTML = 'The form could not be submitted from here. Please call '
        + '<a href="tel:+442074954882">+44 (0)20 7495 4882</a> or email '
        + '<a href="mailto:info@watchclub.com?subject=Enquiry%20-%20Stock%20No.%2016496">info@watchclub.com</a>.';
    } finally {
      submitBtn.disabled = false;
    }
  });
}

/* ------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  initMediaFallbacks();
  initSmoothScroll();
  initHeroAnimations();
  initProductRevealAnimations();
  initSpecAnimations();
  initEthosAnimations();
  initDismantleAnimations();
  initNavScroll();
  initModal();
});
