(() => {
  'use strict';
  const dictionary = window.FATA_TRANSLATIONS;
  const nav = document.querySelector('#navigation');
  const toggle = document.querySelector('.menu-toggle');
  let language = 'uk';
  const names = {mare:'MARE',safeway:'SafeWay UA',maison:'Maison',target:'TARGET',metalpro:'MetalPro',athletique:'Athlétique',kuro:'Kuro Katana'};
  const labels = {
    uk: {nav:'Головна навігація',language:'Мова',viewwork:'Переглянути роботи',legalnav:'Інформація та умови',open:'Відкрити меню',close:'Закрити меню'},
    en: {nav:'Main navigation',language:'Language',viewwork:'View our work',legalnav:'Information and terms',open:'Open menu',close:'Close menu'}
  };
  const metadata = {
    uk: {home:['Fata Digital — дизайн і розробка сайтів для бізнесу','Створюємо сайти для бізнесу: стратегія, структура, дизайн, розробка та запуск. Перегляньте роботи Fata Digital.'],prices:['Ціни | Fata Digital','Вартість сайтів, брендингу та автоматизації заявок у Fata Digital.']},
    en: {home:['Fata Digital — Web Design & Development Studio','Websites that make your business clear, compelling and easy to choose. Strategy, design, development and launch by Fata Digital.'],prices:['Pricing | Fata Digital','Explore Fata Digital pricing for websites, brand identity, enquiry automation and CRM integration.']}
  };
  function setLanguage(next, persist = true) {
    language = next === 'en' ? 'en' : 'uk';
    document.documentElement.lang = language;
    document.querySelectorAll('[data-i18n]').forEach(el => {const text = dictionary[language][el.dataset.i18n]; if(text !== undefined) el.textContent = text;});
    document.querySelectorAll('[data-label]').forEach(el => el.setAttribute('aria-label',labels[language][el.dataset.label]));
    document.querySelectorAll('[data-project]').forEach(el => el.setAttribute('aria-label', language === 'uk' ? `Відкрити ${names[el.dataset.project]} — нова вкладка` : `View ${names[el.dataset.project]} — opens in a new tab`));
    document.querySelectorAll('[data-alt]').forEach(el => el.alt = `${language === 'uk' ? 'Сайт' : 'Website preview:'} ${names[el.dataset.alt]}`);
    document.querySelectorAll('[data-lang]').forEach(el => { if(el.dataset.lang === language) el.setAttribute('aria-current','page'); else el.removeAttribute('aria-current'); });
    toggle.setAttribute('aria-label',labels[language][toggle.getAttribute('aria-expanded') === 'true' ? 'close' : 'open']);
    const [title,description] = metadata[language][document.body.dataset.page] || [document.title, document.querySelector('meta[name="description"]').content];
    document.title = title;
    document.querySelector('meta[name="description"]').content = description;
    document.querySelector('meta[property="og:title"]').content = title;
    document.querySelector('meta[property="og:description"]').content = description;
    document.querySelector('meta[property="og:locale"]').content = language === 'uk' ? 'uk_UA' : 'en_US';

  }
  function setMenu(open, restoreFocus = false) {
    if(open) nav.style.setProperty('--menu-top', `${document.querySelector('.header').getBoundingClientRect().bottom}px`);
    nav.classList.toggle('is-open',open);
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',labels[language][open ? 'close' : 'open']);
    document.body.classList.toggle('menu-open',open);
    document.querySelector('main').inert = open;
    document.querySelector('footer').inert = open;
    if(open) nav.querySelector('a').focus();
    else if(restoreFocus) toggle.focus();
  }
  // Language links navigate to independently rendered, indexable pages.
  toggle.addEventListener('click',() => setMenu(toggle.getAttribute('aria-expanded') !== 'true',true));
  nav.querySelectorAll('a').forEach(el => el.addEventListener('click',() => {
    const wasOpen = toggle.getAttribute('aria-expanded') === 'true';
    setMenu(false);
    if (wasOpen && el.getAttribute('href').startsWith('#')) {
      const target = document.getElementById(el.hash.slice(1));
      if (target) {
        target.setAttribute('tabindex','-1');
        target.focus({preventScroll:true});
        target.addEventListener('blur',() => target.removeAttribute('tabindex'),{once:true});
      }
    }
  }));
  document.addEventListener('keydown',event => {
    if(toggle.getAttribute('aria-expanded') !== 'true') return;
    if(event.key === 'Escape') {event.preventDefault();setMenu(false,true);}
    if(event.key === 'Tab') {
      const focusable = [...document.querySelectorAll('.header a,.header button')].filter(el => el.getClientRects().length);
      const first=focusable[0],last=focusable[focusable.length-1];
      if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
      if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
    }
  });
  window.addEventListener('resize', () => { if(toggle.getAttribute('aria-expanded') === 'true') nav.style.setProperty('--menu-top', `${document.querySelector('.header').getBoundingClientRect().bottom}px`); });
  window.matchMedia('(min-width:801px)').addEventListener('change',event => {if(event.matches) setMenu(false);});
  setLanguage(document.documentElement.lang,false);
  document.querySelector('#year').textContent = new Date().getFullYear();
})();

// Equal groups keep the moving testimonials seamless; full reviews open in a dialog.
(() => {
  const section = document.querySelector('.reviews');
  if (!section) return;
  const track = section.querySelector('.reviews-track');
  const group = section.querySelector('.reviews-group');
  const viewport = section.querySelector('.reviews-viewport');
  const cards = [...group.querySelectorAll('.review-card')];
  const copy = window.FATA_TRANSLATIONS[document.documentElement.lang];
  const supportsDialog = typeof HTMLDialogElement !== 'undefined' && HTMLDialogElement.prototype.showModal;
  if (supportsDialog) {
    const dialog = document.createElement('dialog');
    dialog.className = 'review-dialog';
    dialog.setAttribute('aria-labelledby', 'review-dialog-title');
    const close = document.createElement('button');
    close.type = 'button'; close.className = 'review-dialog-close';
    close.setAttribute('aria-label', copy.reviewclose); close.textContent = '×';
    const country = document.createElement('p'); country.className = 'eyebrow';
    const title = document.createElement('h2'); title.id = 'review-dialog-title';
    const text = document.createElement('p'); text.className = 'review-dialog-text';
    dialog.append(close, country, title, text); document.body.append(dialog);
    cards.forEach((card, index) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'review-read-more';
      button.dataset.review = String(index); button.textContent = copy.reviewreadmore;
      button.setAttribute('aria-haspopup', 'dialog');
      card.insertBefore(button, card.querySelector('.review-source'));
    });
    section.classList.add('has-review-dialog');
    section.addEventListener('click', event => {
      const button = event.target.closest('.review-read-more');
      if (!button) return;
      const card = cards[Number(button.dataset.review)];
      title.textContent = card.querySelector('.review-card-top .eyebrow').textContent;
      country.textContent = card.querySelector('.review-source').textContent;
      text.textContent = card.querySelector('.review-copy').textContent;
      dialog.showModal(); dialog.scrollTop = 0;
      document.body.classList.add('review-dialog-open');
    });
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('review-dialog-open');
      viewport.focus({preventScroll:true});
    });
  }
  const clone = group.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  // Visual copies also open reviews with a pointer; keyboard users visit each original once.
  clone.querySelectorAll('button').forEach(button => button.tabIndex = -1);
  clone.addEventListener('pointerdown', event => {
    if (event.target.closest('button')) event.preventDefault();
  });
  track.append(clone);
  section.classList.add('is-ready');
})();

// One-time scroll reveals. Content remains visible without JS or animation support.
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const selectors = [
    '.section-heading', '.project', '.studio-intro > *', '.values article',
    '.feature-copy', '.feature-visual', '.process-list article',
    '.services-intro', '.services-list article', '.section-cta',
    '.reviews-viewport', '.faq-list details', '.contact > .eyebrow',
    '.contact-grid > *', '.footer-top', '.footer-bottom',
    '.pricing-hero > *', '.price-section > h2', '.price-list article',
    '.format-grid article', '.included > *', '.support > *'
  ].join(',');
  // Do not fade out anything already visible (including restored scroll positions).
  const elements = [...document.querySelectorAll(selectors)].filter(element => element.getBoundingClientRect().top >= window.innerHeight);
  elements.forEach(element => element.classList.add('reveal-pending'));
  const pending = new Set(elements);
  const active = new Map();
  const groupCounts = new Map();
  const delays = new WeakMap();
  elements.forEach(element => {
    const index = groupCounts.get(element.parentElement) || 0;
    delays.set(element, Math.min(index % 4, 2) * 80);
    groupCounts.set(element.parentElement, index + 1);
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      observer.unobserve(element);
      if (!pending.has(element)) return;
      pending.delete(element);
      if (reducedMotion.matches || element.contains(document.activeElement)) {
        element.classList.remove('reveal-pending');
        return;
      }
      const animation = element.animate([
        { opacity: 0, transform: `translateY(${window.innerWidth <= 560 ? 28 : 48}px)` },
        { opacity: 1, transform: 'translateY(0)' }
      ], {
        duration: 600, delay: delays.get(element),
        easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards'
      });
      // Start the hidden first frame before releasing the pending style.
      element.classList.remove('reveal-pending');
      active.set(element, animation);
      animation.finished.then(() => active.delete(element), () => active.delete(element));
    });
  }, { threshold: 0, rootMargin: '0px' });
  elements.forEach(element => observer.observe(element));
  // Focused links and controls are immediately readable and usable.
  document.addEventListener('focusin', event => {
    pending.forEach(element => {
      if (!element.contains(event.target)) return;
      observer.unobserve(element);
      element.classList.remove('reveal-pending');
      pending.delete(element);
    });
    active.forEach((animation, element) => { if (element.contains(event.target)) animation.finish(); });
  });
  const finishAll = () => {
    observer.disconnect();
    pending.forEach(element => element.classList.remove('reveal-pending'));
    pending.clear();
    active.forEach(animation => animation.finish());
    active.clear();
  };
  reducedMotion.addEventListener('change', event => { if (event.matches) finishAll(); });
  window.addEventListener('beforeprint', finishAll);
})();

(() => {
  'use strict';
  const KEY = 'fata_consent';
  const text = {
    en: {label:'Cookie consent', body:'We use cookies to measure how our ads perform. You can accept or decline.', accept:'Accept', decline:'Decline'},
    uk: {label:'Згода на cookies', body:'Ми використовуємо cookies, щоб вимірювати ефективність реклами. Ви можете погодитися або відмовитися.', accept:'Прийняти', decline:'Відхилити'}
  };
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved === 'granted' || saved === 'denied') return;
  const box = document.createElement('div');
  box.className = 'consent';
  box.setAttribute('role', 'dialog');
  box.innerHTML = '<span class="consent-cookie" aria-hidden="true"><svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><mask id="fata-bite"><rect width="64" height="64" fill="#fff"/><circle cx="55" cy="13" r="9"/><circle cx="46" cy="5" r="7"/><circle cx="60" cy="25" r="6"/></mask></defs><g mask="url(#fata-bite)"><circle cx="32" cy="32" r="30" fill="#d8a25f" stroke="#202522" stroke-width="2"/><ellipse cx="18" cy="15" rx="3.2" ry="2.6" fill="#202522"/><ellipse cx="33" cy="9" rx="3" ry="2.4" fill="#202522"/><ellipse cx="27" cy="24" rx="3.4" ry="2.7" fill="#202522"/><ellipse cx="11" cy="27" rx="2.8" ry="2.3" fill="#202522"/><ellipse cx="43" cy="26" rx="3" ry="2.5" fill="#202522"/></g></svg></span><p></p><div class="consent-actions"><button type="button" data-consent="denied"></button><button type="button" data-consent="granted"></button></div>';
  const paint = () => {
    const t = text[document.documentElement.lang === 'uk' ? 'uk' : 'en'];
    box.setAttribute('aria-label', t.label);
    box.querySelector('p').textContent = t.body;
    box.querySelector('[data-consent="denied"]').textContent = t.decline;
    box.querySelector('[data-consent="granted"]').textContent = t.accept;
  };
  paint();
  new MutationObserver(paint).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});
  box.addEventListener('click', event => {
    const button = event.target.closest('button[data-consent]');
    if (!button) return;
    const value = button.dataset.consent;
    try { localStorage.setItem(KEY, value); } catch (e) {}
    if (value === 'granted' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted'});
    }
    box.remove();
  });
  document.body.appendChild(box);
})();
