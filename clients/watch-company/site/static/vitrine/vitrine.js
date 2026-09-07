/* Vitrine — shared behaviour for the home and collection pages.
   Reads the catalogue from /data.js, so this direction never forks the data. */
(() => {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const money = n => (n ? '£' + Number(n).toLocaleString('en-GB') : 'Price on enquiry');
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- navigation sheet + hamburger morph ---------- */
  const burger = $('#burger');
  const sheet = $('#sheet');
  if (burger && sheet) {
    const setOpen = open => {
      burger.dataset.open = String(open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
      sheet.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => setOpen(burger.dataset.open !== 'true'));
    sheet.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
    addEventListener('keydown', e => {
      if (e.key === 'Escape' && burger.dataset.open === 'true') { setOpen(false); burger.focus(); }
    });
  }

  /* ---------- scroll entry ---------- */
  const arm = root => {
    const els = $$('.rise', root).filter(el => !el.dataset.armed);
    if (!els.length) return;
    if (reduced.matches) { els.forEach(el => el.classList.add('shown')); return; }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const sibs = [...(el.parentElement ? el.parentElement.children : [])]
          .filter(n => n.classList.contains('rise'));
        el.style.transitionDelay = Math.min(sibs.indexOf(el), 5) * 70 + 'ms';
        el.classList.add('shown');
        obs.unobserve(el);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });
    els.forEach(el => { el.dataset.armed = '1'; io.observe(el); });
  };
  arm();

  /* An anchor jump or a fast flick can outrun the observer, and content must
     never stay invisible. Debounced, passive, detaches when nothing is left. */
  let sweepTimer = null;
  const sweep = () => {
    const pending = $$('.rise:not(.shown)');
    if (!pending.length) { removeEventListener('scroll', onScroll); return; }
    pending.forEach(el => { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('shown'); });
  };
  const onScroll = () => { clearTimeout(sweepTimer); sweepTimer = setTimeout(sweep, 180); };
  addEventListener('scroll', onScroll, { passive: true });
  reduced.addEventListener('change', () => {
    if (reduced.matches) $$('.rise').forEach(el => el.classList.add('shown'));
  });

  /* ---------- catalogue ---------- */
  /* data.js declares `const WATCHES` at the top level of a classic script, which
     creates a script-scoped binding rather than a property on window — so it has
     to be read as a bare identifier, not window.WATCHES. */
  const CATALOGUE = (typeof WATCHES !== 'undefined' && Array.isArray(WATCHES)) ? WATCHES : [];
  if (!CATALOGUE.length) { console.warn('[vitrine] catalogue not found; is /data.js loaded first?'); return; }

  const tile = w => `
    <a class="tile rise bezel bg-white/[.045] hairline block focus-visible:outline-none"
       href="/watch/${encodeURIComponent(w.id)}/">
      <div class="bezel-core inner-lip relative overflow-hidden bg-gradient-to-b from-[#141519] to-[#08080a] p-5">
        <div class="relative grid place-items-center py-4">
          <span class="tile-glow" aria-hidden="true"></span>
          <img src="${esc(w.cardImage || w.image)}" alt="${esc(w.brand + ' ' + w.name)}"
               width="410" height="512" loading="lazy" decoding="async"
               class="relative h-40 w-auto object-contain md:h-48">
        </div>
        <p class="mt-4 font-mono text-[10px] uppercase tracking-[.24em] text-steel">${esc(w.brand)}</p>
        <h3 class="mt-2 text-[15px] font-bold leading-tight tracking-[-.02em] text-ice">${esc(w.name)}</h3>
        <p class="mt-1.5 font-mono text-[10px] text-steel">${esc([w.size, w.year, w.ref && 'Ref. ' + w.ref].filter(Boolean).join(' · '))}</p>
        <p class="mt-3 border-t border-white/[.07] pt-3 font-mono text-[13px] tabular-nums text-ice">${esc(money(w.price))}</p>
      </div>
    </a>`;

  /* ---------- home: featured strip + live figures ---------- */
  const featured = $('#vitrine-featured');
  if (featured) {
    const latest = [...CATALOGUE].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 4);
    featured.innerHTML = latest.map(tile).join('');
    arm(featured);
  }
  const setText = (sel, v) => { const el = $(sel); if (el) el.textContent = v; };
  const prices = CATALOGUE.map(w => w.price).filter(Boolean).sort((a, b) => a - b);
  // one record carries a price pending confirmation; keep it out of the headline range
  const median = prices[Math.floor(prices.length / 2)] || 0;
  const sane = prices.filter(p => p <= median * 40);
  setText('#stat-count', String(CATALOGUE.length));
  setText('#stat-brands', String(new Set(CATALOGUE.map(w => w.brand)).size));
  if (sane.length) setText('#stat-range', money(sane[0]) + ' – ' + money(sane[sane.length - 1]));

  /* ---------- collection ---------- */
  const grid = $('#vitrine-grid');
  if (!grid) return;

  const search = $('#v-search');
  const brandSel = $('#v-brand');
  const sortSel = $('#v-sort');
  const more = $('#v-more');
  const count = $('#v-count');
  const empty = $('#v-empty');
  const STEP = 12;
  let limit = STEP;

  [...new Set(CATALOGUE.map(w => w.brand))].sort().forEach(b => {
    brandSel.insertAdjacentHTML('beforeend', `<option value="${esc(b)}">${esc(b)}</option>`);
  });

  /* Filters live in the URL so a filtered view can be linked and shared. */
  const params = new URLSearchParams(location.search);
  if (params.get('brand')) brandSel.value = params.get('brand');
  if (params.get('q')) search.value = params.get('q');
  if (params.get('sort')) sortSel.value = params.get('sort');

  const syncUrl = () => {
    const p = new URLSearchParams();
    if (search.value.trim()) p.set('q', search.value.trim());
    if (brandSel.value) p.set('brand', brandSel.value);
    if (sortSel.value !== 'recent') p.set('sort', sortSel.value);
    const qs = p.toString();
    history.replaceState(null, '', qs ? '?' + qs : location.pathname);
  };

  const render = () => {
    const q = search.value.trim().toLowerCase();
    let list = CATALOGUE.filter(w => {
      if (brandSel.value && w.brand !== brandSel.value) return false;
      if (!q) return true;
      return [w.brand, w.name, w.ref, w.material, w.year].join(' ').toLowerCase().includes(q);
    });
    const sort = sortSel.value;
    list.sort(
      sort === 'low' ? (a, b) => (a.price || Infinity) - (b.price || Infinity)
      : sort === 'high' ? (a, b) => (b.price || 0) - (a.price || 0)
      : (a, b) => (b.id || 0) - (a.id || 0)
    );

    grid.innerHTML = list.slice(0, limit).map(tile).join('');
    count.textContent = list.length === 1 ? '1 watch' : list.length + ' watches';
    empty.hidden = list.length > 0;
    more.hidden = limit >= list.length;
    more.querySelector('span').textContent =
      'Show ' + Math.min(STEP, list.length - limit) + ' more';
    arm(grid);
    if (reduced.matches) $$('.rise', grid).forEach(el => el.classList.add('shown'));
    else requestAnimationFrame(() => requestAnimationFrame(() => {
      // anything already in view on first paint should not wait for a scroll
      $$('.rise:not(.shown)', grid).forEach(el => {
        if (el.getBoundingClientRect().top < innerHeight) el.classList.add('shown');
      });
    }));
    syncUrl();
  };

  let debounce = null;
  search.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => { limit = STEP; render(); }, 160);
  });
  brandSel.addEventListener('change', () => { limit = STEP; render(); });
  sortSel.addEventListener('change', () => { limit = STEP; render(); });
  more.addEventListener('click', () => { limit += STEP; render(); });

  render();
})();
