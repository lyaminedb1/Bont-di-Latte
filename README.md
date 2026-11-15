# Bontà di Latte · site vitrine

Site de la fromagerie artisanale **Bontà di Latte** : mozzarella fresca 100 % naturelle, *fatta a mano* en Algérie.
Bilingue français (`/`) et arabe (`/ar/`, mise en page miroir), statique, déployé sur Netlify.

- **Stack** : [Astro](https://astro.build) en sortie 100 % statique, CSS natif avec variables, ~2 Ko de JavaScript maison (aucune librairie côté client).
- **Polices** : Fraunces (titres), Work Sans (texte), Noto Naskh Arabic (arabe), via Google Fonts, chargées sans bloquer l'affichage.
- **Mesures (Lighthouse mobile, en local)** : Performance 99–100 · Accessibilité 100 · Bonnes pratiques 100 · SEO 100.

### Structure du site (FR à `/`, AR à `/ar/`)

Organisation inspirée des grands sites de marques fromagères : en-tête avec logo en médaillon et menus déroulants, recherche de recettes, carrousels et grand pied de page de liens. Textes, illustrations et identité sont propres à Bontà di Latte.

| Page | Contenu |
| --- | --- |
| `/` | Recherche « Besoin d’inspiration ? », carrousel du héros (vidéo du logo, pros, recettes), encart pro rouge, carrousel de recettes, carrousel de produits, engagements, bande paysage + pied de page |
| `/recettes/` | Recherche + filtres par catégorie (`?q=` et `?cat=` dans l’adresse) |
| `/recettes/<recette>/` | Ingrédients, étapes, mozzarella utilisée, autres recettes (données structurées `Recipe`) |
| `/produits/` et `/produits/<produit>/` | Gamme, fiche détaillée, recettes associées, boutons tarif pro et WhatsApp |
| `/notre-histoire/` | Promesse (étiquette retournée) + savoir-faire en 4 étapes |
| `/professionnels/` | Arguments + formulaire Netlify « demande-tarif » |
| `/contact/`, `/mentions-legales/`, `/merci/` | Coordonnées, mentions légales, confirmation d’envoi |

---

## 1. Installation

Prérequis : **Node.js 22.12 ou plus récent** (la version installée par Netlify est réglée dans `netlify.toml`) et **ffmpeg** pour les vidéos.

```bash
npm install
```

```bash
npm run dev       # site de développement sur http://localhost:4321
```

```bash
npm run build     # génère le site final dans dist/
```

```bash
npm run preview   # sert dist/ pour vérifier le résultat
```

---

## 2. Éléments à compléter (un seul fichier)

Toutes les informations pratiques sont dans **`src/config/site.ts`**. Cherchez **« À COMPLÉTER »** dans ce fichier :

| Élément | Clé dans `site.ts` | Valeur actuelle (provisoire) |
| --- | --- | --- |
| Adresse du site (domaine) | `url` | `https://bontadilatte.netlify.app` |
| Téléphone affiché + lien | `contact.phoneDisplay`, `contact.phoneHref` | `+213 (0) 00 00 00 00` |
| Numéro WhatsApp (international, sans `+`) | `contact.whatsapp` | `213000000000` |
| E-mail (vide = masqué) | `contact.email` | vide |
| Adresse postale FR / AR | `contact.address` | adresse fictive |
| Lien Google Maps | `contact.mapsUrl` | recherche générique |
| Horaires FR / AR | `contact.hours` | sam.–jeu. 8 h–18 h, vendredi fermé |
| Liste exacte des ingrédients FR / AR | `ingredients` | lait de vache frais, sel, ferments lactiques, présure |
| Conservation | `storage` | 0–4 °C |
| Formats et poids des 3 produits | `products[].formats` | 125/250 g, 200 g / 1 kg, 1 kg / 2,5 kg |
| Photos des produits (optionnel) | `products[].photo` | vide : illustrations dessinées |
| Photos des recettes (optionnel) | `recipePhotos` | vide : illustrations dessinées |
| Mentions légales (raison sociale, RC, NIF, responsable) | `legal` | valeurs fictives |
| Instagram, Facebook, TikTok, YouTube (vide = masqué) | `social` | vide |

Les **textes** se trouvent dans `src/i18n/fr.ts` / `src/i18n/ar.ts` (sections promesse, savoir-faire, formulaire, contact) et dans `src/i18n/ui.ts` (en-tête, carrousels, pages). Les **recettes et fiches produits** (FR + AR) sont dans `src/data/catalog.ts` : pour ajouter une recette, copiez un bloc du tableau `recipes`. La page, la carte, le menu et le pied de page se mettent à jour tout seuls.
Règle de contenu : ne jamais écrire « italienne », « italiana » ni « Made in Italy ». L'italien évoque le savoir-faire (*Caseificio*, *fatta a mano*, *mozzarella fresca*), pas l'origine.

**Photos** : déposez un fichier `.webp` d'environ 1200 × 900 px dans `public/img/produits/` ou `public/img/recettes/`, puis indiquez son chemin dans `site.ts`, par exemple `photo: '/img/produits/fior-di-latte.webp'`. Tant qu'aucune photo n'est fournie, le site affiche des illustrations dessinées « vue de dessus ».

---

## 3. Ajouter les vidéos Higgsfield

1. Déposez les fichiers sources dans **`assets/video/`** avec exactement ces noms :
   - `hero-16x9.mp4` : animation du logo (goutte → couronne → logo), version ordinateur ;
   - `hero-9x16.mp4` : la même animation en vertical, version mobile ;
   - `filage.mp4` *(optionnel)* : boucle pour la section Savoir-faire ;
   - `produit.mp4` *(optionnel)* : boucle pour la section Nos mozzarellas.
2. Lancez la compression :
   ```bash
   npm run videos
   ```
   Le script `scripts/compress-videos.sh` produit dans `public/video/`, pour chaque vidéo :
   - un MP4 H.264 et un WebM VP9, sans piste audio, 1080p maximum ;
   - un débit d'environ 1,4 Mb/s pour le héros, soit environ 1,8 Mo pour 10 s (cible : moins de 2,5 Mo) ;
   - une image poster `.webp` tirée de la **dernière image** de la vidéo (le logo final).

   Pour ajuster le poids :
   ```bash
   HERO_KBPS=1100 npm run videos
   ```
3. Lancez `npm run build`. Le site **détecte automatiquement** les vidéos présentes, aucun code n'est à modifier. La vidéo du logo s'affiche dans la première diapositive du carrousel d'accueil. Sans vidéo, cette diapositive montre une animation CSS : une goutte tombe, l'onde se forme, puis le logo apparaît. `filage.mp4` s'affiche sur `/notre-histoire/`.
4. Commitez le dossier `public/video/`. Les sources de `assets/video/` peuvent rester hors du dépôt si elles sont lourdes.

Comportement intégré :
- le mobile reçoit la version verticale, l'ordinateur la version horizontale (`<source media>`) ;
- si l'utilisateur a demandé moins d'animations, ou si le mode économie de données est actif (`navigator.connection.saveData`), seul le poster s'affiche et aucune vidéo n'est téléchargée ;
- les vidéos `filage` et `produit` ne se chargent qu'à l'approche de l'écran et se mettent en pause hors écran ;
- le texte n'est jamais posé sur la vidéo : elle occupe la moitié image de la diapositive, le texte est dans le panneau bleu.

---

## 4. Déploiement Netlify

1. Sur Netlify : **Add new site → Import an existing project → GitHub**, puis choisissez ce dépôt.
2. Les réglages sont lus depuis `netlify.toml` : commande `npm run build`, dossier publié `dist`, Node 22.
3. **Formulaires** : le formulaire « demande-tarif » est présent dans le HTML statique de `/professionnels/` et `/ar/professionnels/`. Netlify le détecte automatiquement au déploiement, avec l'attribut `data-netlify` et le champ piège anti-spam `bot-field`.
   - Activez la détection dans *Site configuration → Forms*, si elle ne l'est pas déjà.
   - Ajoutez une notification par e-mail dans *Forms → Form notifications*.
   - Après envoi, le visiteur arrive sur `/merci/` ou `/ar/merci/`, deux pages non indexées.
   - Les réponses françaises et arabes arrivent dans le même formulaire. Le champ `langue` vaut `fr` ou `ar`, et les choix des listes sont toujours envoyés en français.
4. **Domaine** : après avoir branché un domaine, mettez-le dans `url` de `src/config/site.ts`, puis redéployez. Les balises canoniques, hreflang, Open Graph et le sitemap utilisent cette adresse.

Générés automatiquement à chaque build : `sitemap-index.xml` (avec hreflang FR/AR), `robots.txt`, balises Open Graph (`og-image.png`), données structurées `LocalBusiness`.

---

## 5. Organisation du code

```
assets/
  img/logo-ovale-original.jpg        logo fourni (source, ne pas modifier)
  img/logo-ovale.png                 logo détouré (fond transparent)
  img/symbole.png                    symbole rond tiré de l'emblème du logo
  img/og-image.png                   image de partage 1200×630 (générée)
  video/                             vidéos sources Higgsfield
public/
  img/                               déclinaisons web des logos (générées)
  video/                             vidéos compressées + posters (npm run videos)
scripts/
  build-images.mjs                   npm run images : logos → webp, favicon, OG
  compress-videos.sh                 npm run videos : ffmpeg
src/
  config/site.ts                     ⚠ informations à compléter
  data/catalog.ts                    recettes et fiches produits (FR + AR)
  i18n/fr.ts, ar.ts, ui.ts           textes
  styles/global.css                  charte (tokens de couleur, polices, boutons)
  styles/brand.css                   cartes, pilules, carrousels, bandeaux
  layouts/Base.astro, Page.astro     <head> (meta, OG, hreflang) + gabarit commun
  components/                        en-tête, carrousels, cartes, sections, illustrations
  views/                             une vue par type de page (partagée FR/AR)
  pages/                             routes FR et AR (fichiers très courts)
  scripts/main.ts                    menu, carrousels, recherche, apparitions, vidéos
```

Si le logo change, remplacez `assets/img/logo-ovale-original.jpg`, puis lancez dans l'ordre les trois commandes ci-dessous. Elles détourent le fond blanc, refont le symbole rond (favicon), puis régénèrent les déclinaisons web, les favicons et l'image Open Graph.

```bash
python3 scripts/cutout-logo.py assets/img/logo-ovale-original.jpg assets/img/logo-ovale.png
```

```bash
python3 scripts/make-symbol.py assets/img/logo-ovale.png assets/img/symbole.png
```

```bash
npm run images
```

```bash
npm run images
```

### Charte (rappel)

| Couleur | Hex | Usage |
| --- | --- | --- |
| Bleu marine | `#0B2E6B` | marque (aligné sur le logo), boutons, titres |
| Bleu foncé | `#071E47` | pied de page, bandeaux de pages, section Professionnels |
| Bleu ciel | `#1F5FBF` | surtitres et petits accents |
| Blanc lait | `#F5F8FC` | fond principal (blanc froid, jamais de blanc pur en fond) |
| Bleu pâle | `#E6EEF9` | sections alternées, fonds d'illustration |
| Encre | `#16203A` | texte |
| Encre douce | `#4F5B74` | texte secondaire (contraste 6,4:1 sur blanc lait) |
| Rouge | `#D42A2F` | boutons principaux, mot clé des titres, filets |
| Vert | `#1E7B4A` | filets, coches, bouton WhatsApp |

Accessibilité : tous les textes respectent le contraste WCAG AA. Le site propose un lien d'évitement, des focus visibles, des libellés de formulaire et des textes alternatifs. La navigation au clavier est complète, et toutes les animations sont coupées si l'utilisateur a demandé moins de mouvement.
