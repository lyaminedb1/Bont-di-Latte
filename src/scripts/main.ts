// Script unique du site : apparitions, menu, carrousels, recherche de recettes,
// défilement horizontal, vidéos différées et bouton WhatsApp. Aucune librairie.

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

/* ---------- 2. Bouton WhatsApp flottant : visible après un peu de défilement ---------- */
const fab = document.querySelector<HTMLElement>('[data-fab]');
if (fab) {
  const onScroll = () => fab.toggleAttribute('data-hidden', window.scrollY < 500);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- En-tête : tiroir mobile et sous-menus ---------- */
const menuBtn = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
const subButtons = document.querySelectorAll<HTMLButtonElement>('[data-sub] > button');
const closeSubs = (except?: HTMLButtonElement) =>
  subButtons.forEach((b) => b !== except && b.setAttribute('aria-expanded', 'false'));
const setMenu = (open: boolean) => {
  if (!menuBtn || !menu) return;
  menuBtn.setAttribute('aria-expanded', String(open));
  menu.toggleAttribute('data-open', open);
  const label = menuBtn.querySelector('[data-menu-label]');
  if (label) label.textContent = (open ? menuBtn.dataset.labelClose : menuBtn.dataset.labelOpen) ?? '';
  document.documentElement.style.overflow = open ? 'hidden' : '';
  if (open) menu.querySelector<HTMLElement>('a, button')?.focus();
};
menuBtn?.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
subButtons.forEach((b) =>
  b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') !== 'true';
    closeSubs(b);
    b.setAttribute('aria-expanded', String(open));
  }),
);
document.addEventListener('click', (e) => {
  if (!(e.target as HTMLElement).closest('[data-sub]')) closeSubs();
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const openSub = [...subButtons].find((b) => b.getAttribute('aria-expanded') === 'true');
  if (openSub) { closeSubs(); openSub.focus(); return; }
  if (menuBtn?.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); }
});
window.matchMedia('(min-width: 1100px)').addEventListener('change', () => setMenu(false));

/* ---------- Carrousels : flèches + état des boutons ---------- */
const isRtl = document.documentElement.dir === 'rtl';
document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((c) => {
  const track = c.querySelector<HTMLElement>('[data-track]');
  const prev = c.querySelector<HTMLButtonElement>('[data-dir="prev"]');
  const next = c.querySelector<HTMLButtonElement>('[data-dir="next"]');
  if (!track || !prev || !next) return;
  const step = () => {
    const first = track.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return first ? first.offsetWidth + gap : track.clientWidth * 0.8;
  };
  const sync = () => {
    const max = track.scrollWidth - track.clientWidth;
    const pos = Math.abs(track.scrollLeft); // négatif en RTL
    prev.disabled = pos <= 2;
    next.disabled = pos >= max - 2;
    c.toggleAttribute('data-static', max <= 2);
  };
  const go = (dir: 1 | -1) =>
    track.scrollBy({ left: dir * (isRtl ? -1 : 1) * step(), behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
  window.addEventListener('resize', sync);
  sync();
});

/* ---------- Carrousel du héros : points de navigation ---------- */
const hc = document.querySelector<HTMLElement>('[data-hc]');
const hcTrack = hc?.querySelector<HTMLElement>('[data-hc-track]');
if (hc && hcTrack) {
  const slides = [...hcTrack.children] as HTMLElement[];
  const dots = [...hc.querySelectorAll<HTMLButtonElement>('[data-hc-dot]')];
  const setActive = (i: number) => {
    dots.forEach((d, k) => (k === i ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
    // Seuls les liens de la diapositive visible sont atteignables au clavier
    slides.forEach((s, k) => {
      s.querySelectorAll<HTMLElement>('[data-hc-link]').forEach((a) => (k === i ? a.removeAttribute('tabindex') : a.setAttribute('tabindex', '-1')));
      s.toggleAttribute('inert', k !== i);
    });
  };
  dots.forEach((d, i) =>
    d.addEventListener('click', () =>
      hcTrack.scrollTo({ left: (isRtl ? -1 : 1) * i * hcTrack.clientWidth, behavior: reduceMotion.matches ? 'auto' : 'smooth' }),
    ),
  );
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(slides.indexOf(e.target as HTMLElement))),
      { root: hcTrack, threshold: 0.6 },
    );
    slides.forEach((s) => io.observe(s));
  }
  setActive(0);
}

/* ---------- Page Recettes : recherche et filtres (les paramètres ?q= et ?cat= sont lus) ---------- */
const rf = document.querySelector<HTMLElement>('[data-recipes-filter]');
if (rf) {
  const q = rf.querySelector<HTMLInputElement>('[data-rf-q]')!;
  const chips = [...rf.querySelectorAll<HTMLButtonElement>('[data-rf-cat]')];
  const items = [...rf.querySelectorAll<HTMLElement>('[data-rf-item]')];
  const count = rf.querySelector('[data-rf-count]')!;
  const empty = rf.querySelector<HTMLElement>('[data-rf-empty]')!;
  const params = new URLSearchParams(location.search);
  let cat = params.get('cat') ?? '';
  q.value = params.get('q') ?? '';
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const apply = () => {
    const terms = norm(q.value.trim()).split(/\s+/).filter(Boolean);
    let n = 0;
    items.forEach((li) => {
      const card = li.querySelector<HTMLElement>('[data-recipe]')!;
      const hay = norm(card.dataset.search ?? '');
      const ok = (!cat || card.dataset.cat === cat) && terms.every((t) => hay.includes(t));
      li.hidden = !ok;
      if (ok) n++;
    });
    chips.forEach((c) => c.setAttribute('aria-pressed', String((c.dataset.rfCat ?? '') === cat)));
    count.textContent = String(n);
    empty.hidden = n > 0;
    const url = new URL(location.href);
    q.value ? url.searchParams.set('q', q.value) : url.searchParams.delete('q');
    cat ? url.searchParams.set('cat', cat) : url.searchParams.delete('cat');
    history.replaceState(null, '', url);
  };
  q.addEventListener('input', apply);
  q.form?.addEventListener('submit', (e) => { e.preventDefault(); apply(); });
  chips.forEach((c) => c.addEventListener('click', () => { cat = c.dataset.rfCat ?? ''; apply(); }));
  apply();
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
  const setPoster = (v: HTMLVideoElement) => {
    if (v.dataset.poster && !v.poster) v.poster = v.dataset.poster;
  };
  const loadVideo = (v: HTMLVideoElement) => {
    setPoster(v);
    if (!allowMotion || v.dataset.loaded) return;
    v.querySelectorAll<HTMLSourceElement>('source[data-src]').forEach((s) => (s.src = s.dataset.src!));
    v.dataset.loaded = '1';
    v.load();
  };
  if ('IntersectionObserver' in window) {
    // Poster + vidéo chargés un peu avant l'arrivée à l'écran
    const near = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && loadVideo(e.target as HTMLVideoElement)),
      { rootMargin: '400px 0px' },
    );
    // Lecture / pause selon la visibilité réelle
    const visible = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const v = e.target as HTMLVideoElement;
          if (!allowMotion) return;
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
  } else {
    lazyVideos.forEach(setPoster); // navigateur ancien : poster seul
  }
  // Mouvement réduit / économie de données : seul le poster s'affiche.
}

/* ---------- 5. Vidéo du héros : pause hors écran pour économiser la batterie ---------- */
const heroVideo = document.querySelector<HTMLVideoElement>('[data-hero-video]');
const hero = heroVideo?.closest<HTMLElement>('.hc-slide');
if (heroVideo && !heroVideo.hidden && hero && 'IntersectionObserver' in window) {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) heroVideo.play().catch(() => {});
    else heroVideo.pause();
  }).observe(hero);
}
