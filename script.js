(() => {
  'use strict';
  const dictionary = window.FATA_TRANSLATIONS;
  const nav = document.querySelector('#navigation');
  const toggle = document.querySelector('.menu-toggle');
  let language = 'uk';
  const names = {elite:'Elite Code',safeway:'SafeWay UA',nexora:'Nexora',aurelis:'AURELIS'};
  const labels = {
    uk: {nav:'Головна навігація',language:'Мова',viewwork:'Переглянути роботи',open:'Відкрити меню',close:'Закрити меню'},
    en: {nav:'Main navigation',language:'Language',viewwork:'View our work',open:'Open menu',close:'Close menu'}
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
    document.querySelectorAll('[data-lang]').forEach(el => el.setAttribute('aria-pressed',String(el.dataset.lang === language)));
    toggle.setAttribute('aria-label',labels[language][toggle.getAttribute('aria-expanded') === 'true' ? 'close' : 'open']);
    const [title,description] = metadata[language][document.body.dataset.page];
    document.title = title;
    document.querySelector('meta[name="description"]').content = description;
    document.querySelector('meta[property="og:title"]').content = title;
    document.querySelector('meta[property="og:description"]').content = description;
    document.querySelector('meta[property="og:locale"]').content = language === 'uk' ? 'uk_UA' : 'en_US';
    if(persist) try {localStorage.setItem('fata-language',language);} catch (_) { /* Storage may be disabled. */ }
  }
  function setMenu(open, restoreFocus = false) {
    nav.classList.toggle('is-open',open);
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',labels[language][open ? 'close' : 'open']);
    document.body.classList.toggle('menu-open',open);
    document.querySelector('main').inert = open;
    document.querySelector('footer').inert = open;
    if(open) nav.querySelector('a').focus();
    else if(restoreFocus) toggle.focus();
  }
  document.querySelectorAll('[data-lang]').forEach(el => el.addEventListener('click',() => setLanguage(el.dataset.lang)));
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
  window.matchMedia('(min-width:801px)').addEventListener('change',event => {if(event.matches) setMenu(false);});
  let saved = 'uk';
  try {saved=localStorage.getItem('fata-language') || 'uk';} catch (_) {}
  setLanguage(saved,false);
  document.querySelector('#year').textContent = new Date().getFullYear();
})();
