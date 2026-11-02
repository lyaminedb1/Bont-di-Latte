/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  BONTÀ DI LATTE · CONFIGURATION UNIQUE DU SITE
 *  Toutes les informations pratiques sont ici. Les lignes marquées
 *  « ⚠ À COMPLÉTER » contiennent des valeurs provisoires à remplacer.
 *  Chercher « À COMPLÉTER » dans ce fichier pour toutes les retrouver.
 * ─────────────────────────────────────────────────────────────────────────────
 */

type Bilingue = { fr: string; ar: string };

export const site = {
  name: 'Bontà di Latte',

  // ⚠ À COMPLÉTER : adresse définitive du site (domaine Netlify ou nom de domaine).
  // Sert aux balises canoniques, hreflang, Open Graph et au sitemap.
  url: 'https://bontadilatte.netlify.app',

  contact: {
    // ⚠ À COMPLÉTER : numéro affiché et numéro au format international (sans espaces).
    phoneDisplay: '+213 (0) 00 00 00 00',
    phoneHref: '+213000000000',

    // ⚠ À COMPLÉTER : numéro WhatsApp au format international SANS « + » ni espaces.
    whatsapp: '213000000000',

    // ⚠ À COMPLÉTER : e-mail (laisser vide '' pour le masquer).
    email: '',

    // ⚠ À COMPLÉTER : adresse postale de la fromagerie.
    address: {
      fr: 'Rue à compléter, Commune, Wilaya, Algérie',
      ar: 'الشارع، البلدية، الولاية، الجزائر',
    } satisfies Bilingue,

    // ⚠ À COMPLÉTER : lien Google Maps (bouton « Partager » → « Copier le lien »).
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bont%C3%A0+di+Latte+Alg%C3%A9rie',

    // ⚠ À COMPLÉTER : horaires d'ouverture.
    hours: [
      { days: { fr: 'Samedi – Jeudi', ar: 'السبت – الخميس' }, time: { fr: '8 h – 18 h', ar: '8:00 – 18:00' } },
      { days: { fr: 'Vendredi', ar: 'الجمعة' }, time: { fr: 'Fermé', ar: 'مغلق' } },
    ] satisfies { days: Bilingue; time: Bilingue }[],
  },

  // ⚠ À COMPLÉTER : liste exacte des ingrédients telle qu'imprimée sur l'emballage.
  ingredients: {
    fr: ['Lait de vache frais', 'sel', 'ferments lactiques', 'présure'],
    ar: ['حليب بقر طازج', 'ملح', 'خمائر لبنية', 'منفحة'],
  },

  // Ce qu'il n'y a PAS dans la mozzarella (ligne barrée de « Notre promesse »).
  without: {
    fr: ['poudre de lait', 'amidon', 'conservateur'],
    ar: ['حليب مجفف', 'نشاء', 'مواد حافظة'],
  },

  // ⚠ À COMPLÉTER : conservation / DLC indiquées sur l'emballage.
  storage: { fr: 'Entre 0 et 4 °C', ar: 'بين 0 و4 درجات مئوية' } satisfies Bilingue,

  /**
   * Produits. Pour ajouter une photo : déposer le fichier dans public/img/produits/
   * (format .webp, 1200 px de large conseillé) et indiquer son chemin dans `photo`,
   * ex. photo: '/img/produits/fior-di-latte.webp'. Sans photo, l'illustration s'affiche.
   */
  products: [
    {
      id: 'fior-di-latte',
      illustration: 'boule' as const,
      photo: '', // ⚠ À COMPLÉTER (optionnel)
      name: 'Fior di latte',
      // ⚠ À COMPLÉTER : formats et poids réels.
      formats: { fr: ['Boule de 125 g', 'Boule de 250 g'], ar: ['كرة 125 غ', 'كرة 250 غ'] },
    },
    {
      id: 'bocconcini',
      illustration: 'billes' as const,
      photo: '', // ⚠ À COMPLÉTER (optionnel)
      name: 'Bocconcini',
      formats: { fr: ['Barquette de 200 g', 'Seau de 1 kg'], ar: ['علبة 200 غ', 'دلو 1 كغ'] },
    },
    {
      id: 'pizza',
      illustration: 'pain' as const,
      photo: '', // ⚠ À COMPLÉTER (optionnel)
      name: 'Mozzarella pizza',
      formats: { fr: ['Pain de 1 kg', 'Pain de 2,5 kg'], ar: ['قالب 1 كغ', 'قالب 2.5 كغ'] },
    },
  ],

  // Réseaux sociaux (laisser vide '' pour masquer). ⚠ À COMPLÉTER
  social: {
    instagram: '',
    facebook: '',
  },
} as const;

export const whatsappLink = (message: string) =>
  `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
