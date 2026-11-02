// Script unique du site (~2 Ko) : apparitions, en-tête, défilement horizontal,
// vidéos de section différées et bouton WhatsApp. Aucune librairie.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
const saveData = Boolean(conn?.saveData);

/* ---------- 1. Apparition douce des sections ---------- */
const reveals = document.querySelectorAll<HTMLElement>('[data-reveal]');
if (reduceMotion.matches || !('IntersectionObserver' in window)) {
  reveals.forEach((el) => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  reveals.forEach((el) => io.observe(el));
}

/* ---------- 2. En-tête : transparent sur le héros, opaque ensuite ; bouton WhatsApp ---------- */
const header = document.querySelector<HTMLElement>('[data-header]');
const hero = document.querySelector<HTMLElement>('[data-hero]');
const fab = document.querySelector<HTMLElement>('[data-fab]');
if (hero && 'IntersectionObserver' in window) {
  new IntersectionObserver(
    ([e]) => {
      const past = !e.isIntersecting;
      if (header) header.dataset.state = past ? 'solid' : 'over';
      fab?.toggleAttribute('data-hidden', !past);
    },
    { rootMargin: '-64px 0px 0px 0px', threshold: 0.12 },
  ).observe(hero);
} else {
  fab?.removeAttribute('data-hidden');
}

/* Lien de navigation actif selon la section visible */
const navLinks = document.querySelectorAll<HTMLAnchorElement>('.main-nav a[href^="#"]');
if (navLinks.length && 'IntersectionObserver' in window) {
  const byId = new Map([...navLinks].map((a) => [a.hash.slice(1), a]));
  const spy = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        navLinks.forEach((a) => a.removeAttribute('aria-current'));
        byId.get(e.target.id)?.setAttribute('aria-current', 'true');
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  byId.forEach((_, id) => {
    const s = document.getElementById(id);
    if (s) spy.observe(s);
  });
}

/* ---------- 3. Savoir-faire : défilement horizontal piloté par le défilement vertical ---------- */
const craft = document.querySelector<HTMLElement>('[data-craft]');
const track = craft?.querySelector<HTMLElement>('[data-craft-track]');
const desktop = window.matchMedia('(min-width: 1024px)');
if (craft && track) {
  const rtl = document.documentElement.dir === 'rtl';
  let distance = 0;
  let ticking = false;

  const measure = () => {
    const enabled = desktop.matches && !reduceMotion.matches;
    craft.toggleAttribute('data-pinned', enabled);
    if (!enabled) {
      craft.style.removeProperty('--craft-h');
      track.style.removeProperty('--craft-x');
      return;
    }
    distance = Math.max(0, track.scrollWidth - window.innerWidth);
    craft.style.setProperty('--craft-h', `${window.innerHeight + distance}px`);
    update();
  };

  const update = () => {
    ticking = false;
    if (!craft.hasAttribute('data-pinned')) return;
    const top = craft.getBoundingClientRect().top;
    const p = Math.min(1, Math.max(0, -top / Math.max(1, distance)));
    track.style.setProperty('--craft-x', `${(rtl ? 1 : -1) * p * distance}px`);
    craft.style.setProperty('--craft-p', p.toFixed(3));
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  window.addEventListener('resize', measure);
  desktop.addEventListener('change', measure);
  reduceMotion.addEventListener('change', measure);
  document.fonts?.ready.then(measure);
  measure();

  // Navigation clavier : un élément focalisé dans la piste est ramené à l'écran.
  track.addEventListener('focusin', (e) => {
    if (!craft.hasAttribute('data-pinned')) return;
    const target = (e.target as HTMLElement).closest('li, .craft-intro, .craft-video') as HTMLElement | null;
    if (!target) return;
    const offset = rtl ? track.offsetWidth - target.offsetLeft - target.offsetWidth : target.offsetLeft;
    const p = Math.min(1, offset / Math.max(1, distance));
    window.scrollTo({ top: craft.offsetTop + p * distance, behavior: 'auto' });
  });
}

/* ---------- 4. Vidéos de section : chargées à l'approche, en pause hors écran ---------- */
const lazyVideos = document.querySelectorAll<HTMLVideoElement>('[data-lazy-video]');
if (lazyVideos.length) {
  const allowMotion = !reduceMotion.matches && !saveData;
  if (allowMotion && 'IntersectionObserver' in window) {
    const loadVideo = (v: HTMLVideoElement) => {
      if (v.dataset.loaded) return;
      v.querySelectorAll<HTMLSourceElement>('source[data-src]').forEach((s) => (s.src = s.dataset.src!));
      v.dataset.loaded = '1';
      v.load();
    };
    // Préchargement un peu avant l'arrivée à l'écran
    const near = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && loadVideo(e.target as HTMLVideoElement)),
      { rootMargin: '300px 0px' },
    );
    // Lecture / pause selon la visibilité réelle
    const visible = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting) {
            loadVideo(v);
            v.play().catch(() => {});
          } else v.pause();
        }),
      { threshold: 0.25 },
    );
    lazyVideos.forEach((v) => {
      near.observe(v);
      visible.observe(v);
    });
  }
  // Sinon : seul le poster reste affiché (aucune source chargée).
}

/* ---------- 5. Vidéo du héros : pause hors écran pour économiser la batterie ---------- */
const heroVideo = document.querySelector<HTMLVideoElement>('[data-hero-video]');
if (heroVideo && !heroVideo.hidden && hero && 'IntersectionObserver' in window) {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) heroVideo.play().catch(() => {});
    else heroVideo.pause();
  }).observe(hero);
}
