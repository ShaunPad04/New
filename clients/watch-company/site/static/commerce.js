/* Basket and accounts for the Watch Club concept preview.
 *
 * There is no back end here, so everything stays in this browser: the basket is
 * a localStorage list and an account is a name/email plus a PBKDF2 hash of the
 * password. Nothing is transmitted and no payment is taken — the basket exists
 * to gather a shortlist the visitor can hand to the boutique.
 */
(() => {
  const header = document.querySelector('.boutique-header');
  const actions = header && header.querySelector('.header-actions');
  if (!actions) return;

  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = n => (n ? '£' + Number(n).toLocaleString('en-GB') : 'Price on enquiry');
  const catalogue = typeof WATCHES !== 'undefined' ? WATCHES : [];

  const BASKET_KEY = 'wc.basket.v1', ACCOUNTS_KEY = 'wc.accounts.v1', SESSION_KEY = 'wc.session.v1';
  // Private browsing and blocked site data both throw here rather than returning null.
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const save = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable; session-only */ } };

  let basket = read(BASKET_KEY, []).filter(line => line && line.id);

  /* ---------------------------------------------------------------- icons */
  const ICON_BAG = '<svg viewBox="0 0 24 24" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round"><path d="M5.4 8h13.2l-1 12H6.4l-1-12Z"/><path d="M8.7 8V6.3a3.3 3.3 0 0 1 6.6 0V8"/></svg>';
  const ICON_USER = '<svg viewBox="0 0 24 24" aria-hidden="true" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8.4" r="3.6"/><path d="M4.8 20a7.2 7.2 0 0 1 14.4 0"/></svg>';

  /* -------------------------------------------------------------- controls */
  const accountBtn = document.createElement('button');
  accountBtn.type = 'button';
  accountBtn.className = 'wc-control';
  accountBtn.id = 'wc-account-button';
  accountBtn.setAttribute('aria-haspopup', 'dialog');
  accountBtn.innerHTML = ICON_USER + '<span>Sign in</span>';

  const basketBtn = document.createElement('button');
  basketBtn.type = 'button';
  basketBtn.className = 'wc-control';
  basketBtn.id = 'wc-basket-button';
  basketBtn.setAttribute('aria-haspopup', 'dialog');
  basketBtn.innerHTML = ICON_BAG + '<span>Basket</span><span class="wc-count" hidden><b>0</b></span>';
  actions.append(accountBtn, basketBtn);

  /* --------------------------------------------------------------- panels */
  const scrim = document.createElement('div');
  scrim.className = 'wc-scrim';
  scrim.hidden = true;

  const drawer = document.createElement('aside');
  drawer.className = 'wc-drawer';
  drawer.id = 'wc-basket';
  drawer.hidden = true;
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.setAttribute('aria-labelledby', 'wc-basket-title');
  drawer.innerHTML =
    '<div class="wc-head"><div><h2 id="wc-basket-title">Your basket</h2><p class="wc-basket-count">Empty</p></div>' +
    '<button type="button" class="wc-close" data-close aria-label="Close basket">✕</button></div>' +
    '<div class="wc-body"></div><div class="wc-foot"></div>';

  const modal = document.createElement('div');
  modal.className = 'wc-modal';
  modal.id = 'wc-account';
  modal.hidden = true;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Account');
  document.body.append(scrim, drawer, modal);

  /* ------------------------------------------------------- overlay plumbing */
  let openPanel = null, lastFocus = null;

  const focusables = panel => [...panel.querySelectorAll('a[href],button:not([disabled]),input,select,textarea')]
    .filter(el => el.offsetParent !== null || el === document.activeElement);

  function open(panel) {
    if (openPanel) close();
    lastFocus = document.activeElement;
    openPanel = panel;
    scrim.hidden = false;
    panel.hidden = false;
    document.body.style.overflow = 'hidden';
    void panel.offsetHeight; // flush the closed state so the transition has something to run from
    scrim.classList.add('is-open');
    panel.classList.add('is-open');
    const first = focusables(panel)[0];
    if (first) first.focus();
  }

  function close() {
    if (!openPanel) return;
    const panel = openPanel;
    openPanel = null;
    scrim.classList.remove('is-open');
    panel.classList.remove('is-open');
    document.body.style.overflow = '';
    // Match the CSS duration; a panel reopened in the meantime must not be hidden.
    const finish = () => { if (openPanel !== panel) panel.hidden = true; if (!openPanel) scrim.hidden = true; };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) finish();
    else setTimeout(finish, 550);
    // Never leave focus inside the panel we are hiding.
    if (lastFocus && lastFocus.isConnected && lastFocus !== document.body) lastFocus.focus();
    else if (panel.contains(document.activeElement)) document.activeElement.blur();
  }

  scrim.addEventListener('click', close);
  document.addEventListener('click', event => { if (event.target.closest('[data-close]')) close(); });
  document.addEventListener('keydown', event => {
    if (!openPanel) return;
    if (event.key === 'Escape') { event.stopPropagation(); close(); return; }
    if (event.key !== 'Tab') return;
    const items = focusables(openPanel);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  /* ---------------------------------------------------------------- basket */
  const count = () => basket.reduce((total, line) => total + line.qty, 0);
  const subtotal = () => basket.reduce((total, line) => total + (Number(line.price) || 0) * line.qty, 0);

  function paint() {
    const items = count();
    const badge = basketBtn.querySelector('.wc-count');
    badge.hidden = items === 0;
    badge.querySelector('b').textContent = items > 9 ? '9+' : String(items);
    basketBtn.setAttribute('aria-label', items ? `Basket, ${items} ${items === 1 ? 'watch' : 'watches'}` : 'Basket, empty');

    drawer.querySelector('.wc-basket-count').textContent = items ? `${items} ${items === 1 ? 'watch' : 'watches'}` : 'Empty';

    const body = drawer.querySelector('.wc-body');
    const foot = drawer.querySelector('.wc-foot');

    if (!items) {
      body.innerHTML = '<div class="wc-empty"><p>Your basket is empty.<br>Add a watch to build a shortlist for the boutique.</p>' +
        '<a class="cta-solid" href="/collection/">Browse the collection <span>↗</span></a></div>';
      foot.innerHTML = '';
      return;
    }

    body.innerHTML = basket.map(line => `<article class="wc-line">
      <img src="${esc(line.image)}" alt="" width="72" height="86" loading="lazy" decoding="async">
      <div>
        <p class="wc-line-brand">${esc(line.brand)}</p>
        <h3><a href="/watch/${encodeURIComponent(line.id)}/">${esc(line.name)}</a></h3>
        <p class="wc-line-ref">Ref. ${esc(line.ref)} · Stock ${esc(line.id)}</p>
        <div class="wc-line-foot">
          <span class="wc-qty">
            <button type="button" data-step="-1" data-id="${esc(line.id)}" aria-label="Reduce quantity of ${esc(line.brand + ' ' + line.name)}">−</button>
            <span>${line.qty}</span>
            <button type="button" data-step="1" data-id="${esc(line.id)}" aria-label="Increase quantity of ${esc(line.brand + ' ' + line.name)}">+</button>
          </span>
          <span class="wc-line-price">${money(line.price)}</span>
        </div>
        <button type="button" class="wc-remove" data-remove="${esc(line.id)}">Remove</button>
      </div>
    </article>`).join('');

    const onEnquiry = basket.some(line => !Number(line.price));
    const lines = basket.map(line => `${line.qty} × ${line.brand} ${line.name} (Ref. ${line.ref}, stock ${line.id}) — ${money(line.price)}`).join('\n');
    const mailto = 'mailto:info@watchclub.com?subject=' + encodeURIComponent('Watch enquiry — shortlist') +
      '&body=' + encodeURIComponent('Hello,\n\nI would like to enquire about the following watches:\n\n' + lines + '\n\nKind regards,\n');

    foot.innerHTML = `<p class="wc-total"><span>Indicative total</span><strong>${money(subtotal())}</strong></p>
      <p class="wc-note">${onEnquiry ? 'Excludes watches listed on enquiry. ' : ''}Concept preview — no payment is taken. Your basket is a shortlist you can send to the boutique, who will confirm price and availability.</p>
      <a class="cta-solid" href="${esc(mailto)}">Send this list to the boutique <span>↗</span></a>`;
  }

  const commit = () => { save(BASKET_KEY, basket); paint(); };

  drawer.addEventListener('click', event => {
    const step = event.target.closest('[data-step]');
    if (step) {
      const line = basket.find(item => String(item.id) === step.dataset.id);
      if (!line) return;
      line.qty = Math.max(0, line.qty + Number(step.dataset.step));
      basket = basket.filter(item => item.qty > 0);
      commit();
      return;
    }
    const remove = event.target.closest('[data-remove]');
    if (remove) { basket = basket.filter(item => String(item.id) !== remove.dataset.remove); commit(); }
  });

  basketBtn.addEventListener('click', () => open(drawer));

  function addToBasket(watch) {
    const existing = basket.find(line => String(line.id) === String(watch.id));
    if (existing) existing.qty += 1;
    else basket.push({ id: watch.id, brand: watch.brand, name: watch.name, ref: watch.ref, price: watch.price, image: watch.cardImage || watch.image, qty: 1 });
    commit();
    open(drawer);
  }

  /* --------------------------------------------------------------- account */
  const encoder = new TextEncoder();
  const toHex = buffer => [...new Uint8Array(buffer)].map(byte => byte.toString(16).padStart(2, '0')).join('');
  const subtle = window.crypto && window.crypto.subtle;

  // A demo account still deserves a real password hash: what lands in storage
  // must not be reusable if someone reads it.
  async function derive(password, saltHex) {
    const key = await subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
    const salt = Uint8Array.from(saltHex.match(/../g).map(pair => parseInt(pair, 16)));
    return toHex(await subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' }, key, 256));
  }

  const accounts = () => read(ACCOUNTS_KEY, {});
  const currentUser = () => {
    const email = read(SESSION_KEY, null);
    return email ? accounts()[email] || null : null;
  };

  function paintAccountButton() {
    const user = currentUser();
    const label = user ? user.name.split(' ')[0] : 'Sign in';
    accountBtn.innerHTML = ICON_USER + `<span>${esc(label)}</span>`;
    accountBtn.setAttribute('aria-label', user ? `Account — signed in as ${user.name}` : 'Sign in or create an account');
  }

  const AUTH_TABS = '<div class="wc-tabs" role="tablist">' +
    '<button type="button" role="tab" id="wc-tab-in" aria-selected="true" aria-controls="wc-form">Sign in</button>' +
    '<button type="button" role="tab" id="wc-tab-up" aria-selected="false" aria-controls="wc-form">Create account</button></div>';

  function renderAuth(mode) {
    const signup = mode === 'signup';
    modal.innerHTML = AUTH_TABS +
      `<form class="wc-form" id="wc-form" role="tabpanel" aria-labelledby="wc-tab-${signup ? 'up' : 'in'}" novalidate>
        <p class="wc-error" role="alert"></p>
        ${signup ? `<div class="wc-field"><label for="wc-name">Full name</label>
          <input id="wc-name" name="name" type="text" autocomplete="name" required></div>` : ''}
        <div class="wc-field"><label for="wc-email">Email</label>
          <input id="wc-email" name="email" type="email" autocomplete="email" required></div>
        <div class="wc-field"><label for="wc-password">Password</label>
          <input id="wc-password" name="password" type="password" autocomplete="${signup ? 'new-password' : 'current-password'}" required>
          ${signup ? '<p class="wc-hint">At least 8 characters.</p>' : ''}</div>
        <button type="submit" class="cta-solid">${signup ? 'Create account' : 'Sign in'} <span>↗</span></button>
        <p class="wc-privacy">Concept preview. Your details are stored only in this browser so the sign-in demo works — they are never sent to Watch Club or anywhere else, and no payment details are ever requested.</p>
      </form>`;

    modal.querySelector('#wc-tab-in').onclick = () => renderAuth('signin');
    modal.querySelector('#wc-tab-up').onclick = () => renderAuth('signup');
    modal.querySelector('#wc-tab-' + (signup ? 'up' : 'in')).setAttribute('aria-selected', 'true');
    modal.querySelector('#wc-tab-' + (signup ? 'in' : 'up')).setAttribute('aria-selected', 'false');
    modal.setAttribute('aria-label', signup ? 'Create an account' : 'Sign in');
    modal.querySelector('form').onsubmit = event => { event.preventDefault(); submitAuth(signup, event.target); };
  }

  async function submitAuth(signup, form) {
    const box = form.querySelector('.wc-error');
    // Keep what the visitor typed — only the message changes.
    const fail = (text, field) => { box.textContent = text; if (field) form[field].focus(); };
    box.textContent = '';
    const email = String(form.email.value || '').trim().toLowerCase();
    const password = String(form.password.value || '');
    const name = signup ? String(form.name.value || '').trim() : '';

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail('Enter a valid email address.', 'email');
    if (signup && name.length < 2) return fail('Enter your full name.', 'name');
    if (password.length < 8) return fail('Your password needs at least 8 characters.', 'password');
    if (!subtle) return fail('Accounts need a secure (https) connection. Open the site over https and try again.');

    const store = accounts();
    if (signup) {
      if (store[email]) return fail('An account already exists for that email on this device. Sign in instead.', 'email');
      const salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
      store[email] = { name, email, salt, hash: await derive(password, salt) };
      save(ACCOUNTS_KEY, store);
    } else {
      const account = store[email];
      // Same message either way — never reveal which accounts exist.
      if (!account || (await derive(password, account.salt)) !== account.hash) return fail('That email and password do not match an account on this device.', 'password');
    }
    save(SESSION_KEY, email);
    paintAccountButton();
    renderAccount();
  }

  function renderAccount() {
    const user = currentUser();
    modal.innerHTML = `<div class="wc-account-head">
        <h2 id="wc-account-title">Hello, ${esc(user.name.split(' ')[0])}.</h2>
        <p>${esc(user.email)}</p>
      </div>
      <div class="wc-account-links">
        <button type="button" id="wc-open-basket">Your basket (${count()})</button>
        <a href="/collection/">Browse the collection</a>
        <a href="/part-exchange/">Part-exchange a watch</a>
        <a href="/contact/">Arrange a viewing in Mayfair</a>
        <button type="button" id="wc-signout">Sign out</button>
      </div>`;
    modal.setAttribute('aria-label', 'Your account');
    modal.querySelector('#wc-open-basket').onclick = () => open(drawer);
    modal.querySelector('#wc-signout').onclick = () => { save(SESSION_KEY, null); paintAccountButton(); renderAuth('signin'); };
  }

  accountBtn.addEventListener('click', () => {
    if (currentUser()) renderAccount(); else renderAuth('signin');
    open(modal);
  });

  /* ---------------------------------------------------------- product page */
  const info = document.querySelector('.product-info');
  const stockId = (location.pathname.match(/\/watch\/(\d+)/) || [])[1];
  if (info && stockId) {
    const watch = catalogue.find(item => String(item.id) === stockId);
    if (watch) {
      const enquiry = info.querySelector('.enquiry-primary');
      const appointment = info.querySelector('.appointment-link');

      // Only a piece that can actually be bought gets a basket control.
      if (!watch.sold && !watch.reserved) {
        const add = document.createElement('button');
        add.type = 'button';
        add.className = 'wc-add';
        add.textContent = 'Add to basket';
        add.addEventListener('click', () => {
          addToBasket(watch);
          add.dataset.state = 'added';
          add.textContent = 'Added to basket';
          setTimeout(() => { delete add.dataset.state; add.textContent = 'Add to basket'; }, 2200);
        });
        if (enquiry) enquiry.before(add);
      }

      // Part-exchange is an enquiry about the visitor's own watch, so it stays
      // on every piece - the wording just stops implying you can buy this one.
      const exchange = document.createElement('a');
      exchange.className = 'wc-exchange-link';
      exchange.href = '/part-exchange/?' + new URLSearchParams({
        brand: watch.brand, ref: watch.ref, model: watch.name,
        price: (watch.sold || watch.reserved) ? '' : (watch.price || ''), stock: watch.id
      });
      exchange.textContent = (watch.sold || watch.reserved)
        ? 'Part-exchange your watch against something similar ↗'
        : 'Part-exchange your watch against this piece ↗';
      (appointment || enquiry || info).after(exchange);
    }
  }

  /* --------------------------------------------------- part-exchange form */
  const exchangeForm = document.querySelector('.exchange-form');
  if (exchangeForm) {
    const params = new URLSearchParams(location.search);
    const prefill = { buyBrand: 'brand', buyRef: 'ref', buyPrice: 'price', buyStock: 'stock' };
    for (const [field, param] of Object.entries(prefill)) {
      const value = params.get(param);
      if (!value) continue;
      // A price arrives as a plain number from the watch page.
      exchangeForm[field].value = field === 'buyPrice' ? money(value) : value;
    }
    if (params.get('model') && !params.get('ref')) exchangeForm.buyRef.value = params.get('model');

    const user = currentUser();
    if (user) { exchangeForm.name.value = user.name; exchangeForm.email.value = user.email; }

    const MAX_BYTES = 8 * 1024 * 1024;
    const input = exchangeForm.querySelector('#px-files');
    const dropzone = exchangeForm.querySelector('.exchange-drop');
    const list = exchangeForm.querySelector('.exchange-files');

    const listFiles = () => {
      const files = [...input.files];
      list.innerHTML = files.map(file => {
        const mb = (file.size / 1048576).toFixed(1);
        const over = file.size > MAX_BYTES;
        return `<li class="${over ? 'is-oversize' : ''}">${esc(file.name)}<span>${over ? mb + ' MB — too large' : mb + ' MB'}</span></li>`;
      }).join('');
    };
    input.addEventListener('change', listFiles);

    ['dragenter', 'dragover'].forEach(type => dropzone.addEventListener(type, event => {
      event.preventDefault();
      dropzone.classList.add('is-dragging');
    }));
    ['dragleave', 'drop'].forEach(type => dropzone.addEventListener(type, () => dropzone.classList.remove('is-dragging')));
    dropzone.addEventListener('drop', event => {
      event.preventDefault();
      input.files = event.dataTransfer.files;
      listFiles();
    });

    exchangeForm.addEventListener('submit', event => {
      event.preventDefault();
      const box = exchangeForm.querySelector('.wc-error');
      const fail = (text, field) => { box.textContent = text; if (field) exchangeForm[field].focus(); };
      box.textContent = '';

      const value = field => String(exchangeForm[field].value || '').trim();
      if (value('name').length < 2) return fail('Enter your name.', 'name');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value('email'))) return fail('Enter a valid email address.', 'email');
      if (!value('sellBrand')) return fail('Tell us the brand of the watch you would like to exchange.', 'sellBrand');
      if (!value('sellModel')) return fail('Tell us the model of the watch you would like to exchange.', 'sellModel');
      if ([...input.files].some(file => file.size > MAX_BYTES)) return fail('Remove the files over 8MB, then try again.');
      if (!exchangeForm.privacy.checked) return fail('Please confirm you have reviewed the privacy policy.', 'privacy');

      const accompaniments = [exchangeForm.box.checked && 'original box', exchangeForm.papers.checked && 'original papers']
        .filter(Boolean).join(' and ') || 'none confirmed';
      const buying = [value('buyBrand'), value('buyRef'), value('buyStock') && 'stock ' + value('buyStock'), value('buyPrice')]
        .filter(Boolean).join(', ');
      const files = [...input.files].map(file => file.name);

      const body = [
        'Hello,', '',
        'I would like a part-exchange offer.', '',
        'MY WATCH',
        'Brand: ' + value('sellBrand'),
        'Model: ' + value('sellModel'),
        'Year: ' + (value('sellYear') || 'not stated'),
        'Accompaniments: ' + accompaniments, '',
        buying ? 'LOOKING AT\n' + buying + '\n' : null,
        files.length ? 'I will attach ' + files.length + ' photograph' + (files.length === 1 ? '' : 's') + ': ' + files.join(', ') + '\n' : null,
        'Name: ' + value('name'),
        'Phone: ' + (value('phone') || 'not given'),
        'Email: ' + value('email'), '',
        'Kind regards,', value('name')
      ].filter(line => line !== null).join('\n');

      const mailto = 'mailto:info@watchclub.com?subject=' +
        encodeURIComponent('Part-exchange enquiry — ' + value('sellBrand') + ' ' + value('sellModel')) +
        '&body=' + encodeURIComponent(body);

      const done = document.createElement('div');
      done.className = 'exchange-done';
      done.innerHTML = `<h2>Your offer request is ready.</h2>
        <p>We have put your details into an email to the Mayfair boutique. Open it, attach your photographs, and send when you are happy with it.</p>
        <a class="cta-solid" href="${esc(mailto)}">Open the email <span>↗</span></a>
        <p class="wc-note">Concept preview — nothing was sent from this page. You can also call <a href="tel:+442074954882">+44 (0)20 7495 4882</a> or visit 4 &amp; 5 Royal Arcade, Mayfair.</p>`;
      exchangeForm.replaceWith(done);
      done.setAttribute('tabindex', '-1');
      done.focus();
      done.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
  }


  /* Boutique film: swap the facade for the Vimeo player only on demand. */
  const filmBtn=document.querySelector('.film-play');
  if(filmBtn){
    filmBtn.addEventListener('click',()=>{
      const frame=document.createElement('iframe');
      frame.src=filmBtn.dataset.vimeo;
      frame.title='The Watch Club boutique film';
      frame.allow='autoplay; fullscreen; picture-in-picture';
      frame.setAttribute('allowfullscreen','');
      frame.loading='lazy';
      filmBtn.replaceWith(frame);
      frame.focus();
    },{once:true});
  }

  /* --------------------------------------------------------- menu shortcut */
  const menuColumn = document.querySelector('nav .reference-menu-links section:last-child');
  if (menuColumn) {
    const link = document.createElement('button');
    link.type = 'button';
    link.className = 'wc-menu-account';
    link.textContent = 'Sign in / create account';
    link.onclick = () => accountBtn.click();
    menuColumn.append(link);
  }

  paintAccountButton();
  paint();
})();
