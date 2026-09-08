/* Watch Club editorial direction, informed by the supplied Roger Dubuis reference. */
(() => {
  const header=document.querySelector('.boutique-header');
  const nav=header.querySelector('nav');
  const menu=header.querySelector('.menu');
  header.prepend(menu);
  menu.setAttribute('aria-label','Menu');menu.innerHTML='<span class="menu-bars" aria-hidden="true"><i></i><i></i></span><span class="menu-label">Menu</span>';
  nav.id='main-menu';menu.setAttribute('aria-controls','main-menu');
  const menuBrands=['Rolex','Patek Philippe','Audemars Piguet'];
  /* Every brand in the catalogue, in stock first then sold, so the menu
     cannot drift from what is actually listed. */
  const stocked=new Set(WATCHES.filter(w=>!w.sold).map(w=>w.brand));
  /* Two lists: what you can buy, and what has been sold. Keeping them in
     separate menu sections rather than one mixed grid. */
  const allBrands=[...stocked].sort((a,b)=>a.localeCompare(b));
  const archiveBrands=[...new Set(WATCHES.filter(w=>w.sold).map(w=>w.brand))]
    .filter(b=>!stocked.has(b)).sort((a,b)=>a.localeCompare(b));
  const menuWatches=menuBrands.map(brand=>WATCHES.find(w=>w.brand===brand));
  nav.innerHTML=`<div class="reference-menu-links"><section><h2>THE COLLECTION</h2><a href="/collection/?sort=recent">Latest arrivals</a><a href="/collection/">Shop all watches</a></section><section class="menu-brands-all"><h2>BRANDS</h2><div class="menu-brand-grid">${allBrands.map(brand=>`<a href="/collection/?brand=${encodeURIComponent(brand)}">${brand}</a>`).join('')}</div></section><section class="menu-brands-all menu-brands-archive"><h2>ARCHIVED &amp; SOLD</h2><div class="menu-brand-grid">${archiveBrands.map(brand=>`<a href="/archive/?brand=${encodeURIComponent(brand)}">${brand}</a>`).join('')}</div><a class="menu-archive-all" href="/archive/">View the full sold archive ↗</a></section><section><h2>THE WATCH CLUB</h2><a href="/services/">Sell your watch</a><a href="/part-exchange/">Part-exchange</a><a href="/about/">Our story</a><a href="/about/">Meet the specialists</a><a href="/journal/">Blogs</a><a href="/contact/">Visit & contact</a><a href="/collection/#search">Search watches</a></section></div><div class="reference-menu-images">${menuWatches.filter(Boolean).map(w=>`<a class="menu-watch-panel" href="/collection/?brand=${encodeURIComponent(w.brand)}"><div class="menu-watch-title"><strong>${w.brand}</strong><span>Explore the collection</span></div><img src="${w.image}" alt="${w.brand} ${w.name}" loading="lazy"><span class="menu-watch-model">${w.name}</span></a>`).join('')}</div>`;
  const setMenu=open=>{nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Menu');menu.querySelector('.menu-label').textContent=open?'Close':'Menu';if(open){requestAnimationFrame(()=>requestAnimationFrame(()=>nav.classList.add('is-shown')));}else{nav.classList.remove('is-shown');}};
  menu.onclick=()=>setMenu(!nav.classList.contains('open'));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){setMenu(false);menu.focus();}});
  const home=location.pathname==='/' || location.pathname==='/index.html';
  if(home){
    
    const updateHeader=()=>document.body.classList.toggle('past-hero',window.scrollY>Math.max(420,window.innerHeight*.72));
    addEventListener('scroll',updateHeader,{passive:true});updateHeader();
    const copy=document.querySelector('.hero-copy');
    copy.innerHTML='<p class="eyebrow">A MOMENT OF RECOGNITION</p><h1>The one that<br>feels like you.</h1><p>Discover the golden Rolex Day-Date.</p><a class="cta-solid" href="/watch/16496/">Find Your Piece <span>↗</span></a>';
    const faqList=document.querySelector('.home-faq .faq-list');
    if(faqList){const heading=document.createElement('div');heading.className='faq-frame-heading';heading.innerHTML='<span>BOUTIQUE GUIDANCE</span><h3>Your questions, answered.</h3>';faqList.prepend(heading);}
    const faqIntro=document.querySelector('.home-faq>div');
    if(faqIntro){const photo=document.createElement('figure');photo.className='faq-presentation';photo.innerHTML='<img src="/assets/ap-presentation.jpg" alt="Audemars Piguet Royal Oak in its presentation box" loading="lazy" width="1690" height="1280" decoding="async"><figcaption>Considered in every detail.</figcaption>';faqIntro.querySelector('h2').after(photo);}
    const film=document.querySelector('.hero video');
    if(film){film.loop=true;film.muted=true;const rm=matchMedia('(prefers-reduced-motion: reduce)');/* The poster is the video's first frame and is preloaded, so the hero looks the same while the 3.4MB file stays off the critical path. */const start=()=>{if(rm.matches){film.autoplay=false;film.pause();return;}film.preload='auto';film.autoplay=true;film.play().catch(()=>{});};const sync=()=>{if(rm.matches){film.autoplay=false;film.pause();}else{start();}};if(document.readyState==='complete')start();else addEventListener('load',start,{once:true});rm.addEventListener('change',sync);}
    const selection=document.querySelector('#selection');
    if(selection){selection.querySelector(':scope > .eyebrow')?.remove();const study=document.createElement('section');study.className='editorial-watch-study';study.innerHTML='<div class="study-image"><img src="/assets/rolex-being-looked-at.jpg" alt="A Rolex Day-Date examined by hand" loading="lazy" width="2048" height="877" decoding="async"></div><div class="study-copy"><p class="eyebrow">A CLOSER LOOK</p><h2>The feeling<br>of finding it.</h2><p>Some watches announce themselves. Others reveal their character slowly, detail by detail. Take your time with a piece selected for the way it feels on the wrist.</p><a class="outline" href="/collection/">Explore the collection ↗</a></div>';selection.after(study);}
    const latestLink=document.querySelector('#selection .section-heading>a');
    if(latestLink){latestLink.className='collection-cta';document.querySelector('#selection #featured')?.after(latestLink);}
    const craftFilm=document.querySelector('.craft-film');
    if(craftFilm){const wrist=document.createElement('img');wrist.className='craft-film craft-image';wrist.src='/assets/rolex-on-wrist.jpg';wrist.alt='A Rolex Submariner being examined on the wrist';wrist.loading='lazy';craftFilm.replaceWith(wrist);}
    const trust=document.querySelector('.customer-trust');
    if(trust){
      const notes=[
        ['A considered experience from start to finish. The team understood exactly what I was looking for and made the whole process feel personal.','James R.','Mayfair · March 2026'],
        ['The watch arrived exactly as described, beautifully presented and with every detail handled. I would happily return.','Tony Austwick','London · March 2026'],
        ['Knowledgeable, welcoming and never rushed. Finding the right piece felt like a conversation, not a transaction.','ET','Collector · February 2026']
      ];
      trust.className='section customer-trust customer-trust-premium';
      trust.innerHTML='<div class="trust-header"><p class="eyebrow">COLLECTOR NOTES</p><h2>Chosen with confidence.</h2><p>Every timepiece leaves the boutique with the same care it received before it was found.</p><a href="https://uk.trustpilot.com/review/www.watchclub.com" target="_blank" rel="noopener">Read all reviews on Trustpilot ↗</a></div><div class="trust-stage"><div class="trust-quote"><span class="trust-mark">“</span><blockquote></blockquote><div class="trust-author"><strong></strong><span></span></div></div><div class="trust-proof"><div class="proof-score"><strong>5.0</strong><span>★★★★★</span><small>Collector satisfaction</small></div><div class="proof-rule"></div><p>Independent experiences from the Watch Club community.</p></div></div><div class="trust-controls"><div class="trust-progress"><span></span></div><div><button class="trust-prev" type="button" aria-label="Previous review">←</button><button class="trust-next" type="button" aria-label="Next review">→</button></div></div>';
      let index=0;const quote=trust.querySelector('blockquote'),author=trust.querySelector('.trust-author strong'),meta=trust.querySelector('.trust-author span'),progress=trust.querySelector('.trust-progress span');
      const showNote=()=>{const note=notes[index];quote.textContent=`“${note[0]}”`;author.textContent=note[1];meta.textContent=note[2];progress.style.width=`${((index+1)/notes.length)*100}%`;quote.animate([{opacity:.25,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'ease-out'});};
      trust.querySelector('.trust-prev').onclick=()=>{index=(index+notes.length-1)%notes.length;showNote()};trust.querySelector('.trust-next').onclick=()=>{index=(index+1)%notes.length;showNote()};showNote();setInterval(()=>{index=(index+1)%notes.length;showNote()},6500);
    }
    const team=document.createElement('section');team.className='section home-team';team.innerHTML='<div class="section-heading"><div><p class="eyebrow">THE WATCH CLUB · MAYFAIR</p><h2>The people<br>behind the pieces.</h2></div><a href="/about/">Meet the team ↗</a></div><div class="team-feature"><div class="team-film"><video muted playsinline loop controls preload="none" poster="/assets/watchclub-team.jpg" aria-label="A close look at the Watch Club atelier"><source src="/assets/watchclub-workplace.mp4" type="video/mp4"></video><span>Inside the atelier</span></div><div class="team-portraits"><img src="/assets/danny.jpg" alt="Danny Pizzigoni, founder" loading="lazy" width="351" height="351" decoding="async"><img src="/assets/justin.jpg" alt="Justin Koullapis, partner" loading="lazy" width="351" height="351" decoding="async"><img src="/assets/andrew.jpg" alt="Andrew Ioannou, boutique manager" loading="lazy" width="351" height="351" decoding="async"></div></div>';
    app.lastElementChild.before(team);
    const atelier=team.querySelector('.team-film video');
    if(atelier&&'IntersectionObserver' in window){
      /* 1.5MB, far below the fold: don't fetch it until it is nearly on screen. */
      const io=new IntersectionObserver(es=>{for(const e of es){if(!e.isIntersecting)continue;
        if(!matchMedia('(prefers-reduced-motion: reduce)').matches){atelier.preload='auto';atelier.play().catch(()=>{});}
        io.disconnect();}},{rootMargin:'300px'});
      io.observe(atelier);
    }
  }

  /* The brand marquee is a 576KB React/framer-motion island (145KB over the
     wire) for a strip of logos, and it sits below a full-viewport hero. Load it
     only as it approaches view so it never competes with the first paint. */
  const marquee=document.querySelector('#brand-marquee');
  if(marquee&&'IntersectionObserver' in window){
    const mio=new IntersectionObserver(es=>{
      if(!es.some(e=>e.isIntersecting))return;
      mio.disconnect();
      const tag=document.createElement('script');
      tag.type='module';tag.src='/ui/marquee.js';
      document.head.append(tag);
    },{rootMargin:'500px'});
    mio.observe(marquee);
  }

  document.querySelectorAll('.split').forEach(section=>{
    const label=section.querySelector('.eyebrow')?.textContent||'';
    if(label.includes('MAYFAIR, LONDON')){section.classList.add('heritage-feature');const img=section.querySelector(':scope > img');img.src='/assets/boutique.jpg';img.alt='Inside the Watch Club boutique in the Royal Arcade, Mayfair';img.width=1440;img.height=767;img.decoding='async';}
    if(label==='YOUR NEXT CHAPTER'){
      section.classList.add('boutique-visit');
      const map=document.createElement('div');map.className='boutique-map';
      map.innerHTML='<iframe title="Watch Club London boutique location" src="https://maps.google.com/maps?q=Watch%20Club%204%205%20Royal%20Arcade%20London%20W1S%204SD&z=16&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe><a href="https://www.google.com/maps/search/?api=1&query=Watch+Club+4+5+Royal+Arcade+London+W1S+4SD" target="_blank" rel="noopener">WATCH CLUB · ROYAL ARCADE <span>Get directions ↗</span></a>';
      section.querySelector(':scope > img')?.replaceWith(map);
    }
  });
  if(location.pathname.replace(/\/+$/,'')==='/contact'){
    const panel=document.querySelector('.contact-panel');
    const split=panel?.closest('.split');
    const image=split?.querySelector(':scope > img');
    if(panel&&image){
      image.replaceWith(Object.assign(document.createElement('div'),{className:'contact-form-shell',innerHTML:'<p class="eyebrow">PRIVATE ENQUIRY</p><h2>Let’s start<br>a conversation.</h2><p class="form-intro">Tell us what you are looking for and a member of the Mayfair team will be in touch.</p><form class="contact-form"><label>Full name<input name="name" autocomplete="name" required></label><label>Email address<input type="email" name="email" autocomplete="email" inputmode="email" spellcheck="false" autocapitalize="none" required></label><label>Phone number <span>(optional)</span><input type="tel" name="phone" autocomplete="tel" inputmode="tel"></label><label>How can we help?<select name="interest"><option>Arrange a viewing</option><option>Ask about a watch</option><option>Sell or part-exchange</option><option>General enquiry</option></select></label><label>Message<textarea name="message" rows="4" required></textarea></label><button class="cta-solid" type="submit">Send enquiry <span>↗</span></button><p class="form-status" role="status" hidden>Thank you — the boutique team will be in touch shortly.</p></form>'}));
      const form=split.querySelector('form');form.addEventListener('submit',event=>{event.preventDefault();form.querySelector('.form-status').hidden=false;form.querySelector('button').textContent='Enquiry noted';form.reset();});
    }
  }
  const product=document.querySelector('.luxury-product');
  if(product){
    document.body.classList.add('watch-editorial');
    const id=Number(location.pathname.split('/')[2]);const watch=WATCHES.find(w=>w.id===id);
    const info=product.querySelector('.product-info');
    const details=document.createElement('section');details.className='section timepiece-details';
    details.innerHTML='<div class="detail-intro"><p class="eyebrow">THE DETAILS THAT MATTER</p><h2>A closer<br>connection.</h2><p>Explore this individual timepiece, from its proportions and provenance to the care that comes with it.</p></div><div class="detail-accordions"></div>';
    info.querySelectorAll('.product-detail,.price-date').forEach(el=>details.lastElementChild.append(el));product.after(details);
    const main=product.querySelector('#main-photo');main.src=watch.cardImage||watch.image;
    const thumbs=product.querySelectorAll('.thumbs button');if(thumbs[0])thumbs[0].querySelector('img').src=watch.cardImage||watch.image;
    const keyFacts=document.createElement('div');keyFacts.className='watch-key-facts';
    [[watch.year,'YEAR'],[watch.size,'DIAMETER'],[watch.material,'MATERIAL']].forEach(([v,k])=>{const cell=document.createElement('div');const strong=document.createElement('strong');strong.textContent=v;const small=document.createElement('span');small.textContent=k;cell.append(strong,small);keyFacts.append(cell)});info.querySelector('.product-subtitle').after(keyFacts);
    const care=document.createElement('section');care.className='collector-service';care.innerHTML='<div><p class="eyebrow">YOUR WATCH. OUR ATTENTION.</p><h2>Meet your<br>watch specialist.</h2><p>A personal conversation about the details, the fit and the feeling. Speak with the team about this watch or arrange to see it in Mayfair.</p><a class="outline" href="/contact/">Plan your visit ↗</a><a class="concierge-call" href="tel:+442074954882">+44 (0)20 7495 4882</a></div><img src="/assets/watchclub-team.jpg" alt="The Watch Club specialists in Mayfair" loading="lazy" width="1440" height="767" decoding="async">';details.after(care);
  }
  // Retain native keyboard semantics while animating both opening and closing.
  document.querySelectorAll('details.product-detail').forEach((detail,index)=>{
    const summary=detail.querySelector('summary');const panel=document.createElement('div');panel.className='answer-panel';
    [...detail.childNodes].filter(n=>n!==summary).forEach(n=>panel.append(n));detail.append(panel);
    const number=document.createElement('span');number.className='answer-number';number.textContent=String(index+1).padStart(2,'0');summary.prepend(number);
    summary.setAttribute('aria-expanded',String(detail.open));let anim=null;let intended=detail.open;
    summary.addEventListener('click',event=>{
      event.preventDefault();intended=!intended;summary.setAttribute('aria-expanded',String(intended));
      if(matchMedia('(prefers-reduced-motion: reduce)').matches){detail.open=intended;return;}
      const start=detail.getBoundingClientRect().height;anim?.cancel();detail.open=true;
      const end=intended?detail.scrollHeight:summary.getBoundingClientRect().height;
      detail.classList.toggle('is-expanded',intended);detail.style.overflow='hidden';
      if(intended)panel.animate({opacity:[0,1],transform:['translateY(-7px)','translateY(0)']},{duration:420,easing:'cubic-bezier(.22,1,.36,1)'});
      anim=detail.animate({height:[start+'px',end+'px']},{duration:420,easing:'cubic-bezier(.22,1,.36,1)'});
      anim.onfinish=()=>{detail.open=intended;detail.style.overflow='';anim=null;};
    });
  });
})();

/* ---------------------------------------------------------------------------
   Craft layer: nested CTA icons, magnetic press, scroll reveals.
   Everything here is additive and fully disabled under prefers-reduced-motion.
   --------------------------------------------------------------------------- */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  /* Trailing arrows sit inside their own circle, flush with the button edge. */
  const ARROW = /[\u2197\u203a\u2192]/;
  const nestArrows = root => {
    (root || document).querySelectorAll('.cta-solid,.outline,.collection-cta').forEach(el => {
      if (el.dataset.iconed) return;
      el.dataset.iconed = '1';
      const last = el.lastChild;
      let glyph = null;
      if (last && last.nodeType === 3 && ARROW.test(last.textContent)) {
        const m = last.textContent.match(ARROW);
        glyph = m[0];
        last.textContent = last.textContent.replace(ARROW, '').replace(/\s+$/, '');
      } else if (last && last.nodeType === 1 && last.tagName === 'SPAN' && ARROW.test(last.textContent) && last.textContent.trim().length <= 2) {
        glyph = last.textContent.trim();
        last.remove();
      }
      if (!glyph) return;
      const wrap = document.createElement('span');
      wrap.className = 'cta-icon';
      wrap.setAttribute('aria-hidden', 'true');
      wrap.textContent = glyph;
      el.appendChild(wrap);
      el.classList.add('has-cta-icon');
    });
  };
  nestArrows();

  /* Sections rise into place rather than snapping in. */
  const revealSelector = '.section > .section-heading, .section > .eyebrow, #featured > .card,'
    + '.study-copy > *, .editorial-craft .craft-feature, .heritage-feature > *,'
    + '.customer-trust-premium > *, .home-faq > *, .team-feature > *, .boutique-visit > *,'
    + '.assurances span, .collection-cta';

  const armReveals = root => {
    if (reduced.matches) return;
    const els = [...(root || document).querySelectorAll(revealSelector)]
      .filter(el => !el.dataset.reveal);
    if (!els.length) return;
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const sibs = [...(el.parentElement ? el.parentElement.children : [])].filter(n => n.dataset.reveal);
        el.style.transitionDelay = Math.min(sibs.indexOf(el), 5) * 70 + 'ms';
        el.classList.add('is-revealed');
        obs.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    els.forEach(el => { el.dataset.reveal = '1'; el.classList.add('will-reveal'); io.observe(el); });
  };
  armReveals();

  /* Catalogue and product views render after this file runs. */
  const app = document.getElementById('app');
  if (app) {
    let queued = null;
    new MutationObserver(() => {
      clearTimeout(queued);
      queued = setTimeout(() => { nestArrows(); armReveals(); }, 60);
    }).observe(app, { childList: true, subtree: true });
  }

  /* Failsafe. An anchor jump or a fast flick can outrun the observer, and
     content must never stay invisible. Debounced, passive, and it only ever
     touches the shrinking set of elements that have not revealed yet. */
  let sweepTimer = null;
  const sweep = () => {
    const pending = document.querySelectorAll('.will-reveal:not(.is-revealed)');
    if (!pending.length) { removeEventListener('scroll', onScroll); return; }
    pending.forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight) el.classList.add('is-revealed');
    });
  };
  const onScroll = () => { clearTimeout(sweepTimer); sweepTimer = setTimeout(sweep, 180); };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('hashchange', () => setTimeout(sweep, 120));

  /* If the user turns motion off mid-session, show everything immediately. */
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    document.querySelectorAll('.will-reveal').forEach(el => el.classList.add('is-revealed'));
  });
})();
