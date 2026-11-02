# Bontà di Latte · site vitrine

Site de la fromagerie artisanale **Bontà di Latte** : mozzarella fresca 100 % naturelle, *fatta a mano* en Algérie.
Bilingue français (`/`) et arabe (`/ar/`, mise en page miroir), statique, déployé sur Netlify.

- **Stack** : [Astro](https://astro.build) en sortie 100 % statique, CSS natif avec variables, ~2 Ko de JavaScript maison (aucune librairie côté client).
- **Polices** : Bodoni Moda (titres), Work Sans (texte), Noto Naskh Arabic (arabe), via Google Fonts, chargées sans bloquer l'affichage.
- **Mesures (Lighthouse mobile, en local)** : Performance 94–100 · Accessibilité 100 · Bonnes pratiques 100 · SEO 100, avec ou sans vidéos.

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
| Instagram / Facebook (vide = masqué) | `social` | vide |

Les **textes** (titres, descriptions, formulaire…) se trouvent dans `src/i18n/fr.ts` et `src/i18n/ar.ts`, qui ont la même structure.
Règle de contenu : ne jamais écrire « italienne », « italiana » ni « Made in Italy ». L'italien évoque le savoir-faire (*Caseificio*, *fatta a mano*, *mozzarella fresca*), pas l'origine.

**Photos de produits** : déposez un fichier `.webp` d'environ 1200 × 900 px dans `public/img/produits/`, puis indiquez son chemin, par exemple `photo: '/img/produits/fior-di-latte.webp'`.

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
3. Lancez `npm run build`. Le site **détecte automatiquement** les vidéos présentes, aucun code n'est à modifier. Sans vidéo, le héros affiche une animation CSS : une goutte tombe, l'onde se forme, puis le logo apparaît.
4. Commitez le dossier `public/video/`. Les sources de `assets/video/` peuvent rester hors du dépôt si elles sont lourdes.

Comportement intégré :
- le mobile reçoit la version verticale, l'ordinateur la version horizontale (`<source media>`) ;
- si l'utilisateur a demandé moins d'animations, ou si le mode économie de données est actif (`navigator.connection.saveData`), seul le poster s'affiche et aucune vidéo n'est téléchargée ;
- les vidéos `filage` et `produit` ne se chargent qu'à l'approche de l'écran et se mettent en pause hors écran ;
- le texte du héros n'est jamais posé sur le logo : la vidéo est au-dessus du texte sur mobile et à côté sur ordinateur, avec des bords fondus dans le bleu marine.

---

## 4. Déploiement Netlify

1. Sur Netlify : **Add new site → Import an existing project → GitHub**, puis choisissez ce dépôt.
2. Les réglages sont lus depuis `netlify.toml` : commande `npm run build`, dossier publié `dist`, Node 22.
3. **Formulaires** : le formulaire « demande-tarif » est présent dans le HTML statique de `/` et `/ar/`. Netlify le détecte automatiquement au déploiement, avec l'attribut `data-netlify` et le champ piège anti-spam `bot-field`.
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
  img/logo-ovale.webp, symbole.png   logos fournis (sources, ne pas modifier)
  img/og-image.png                   image de partage 1200×630 (générée)
  video/                             vidéos sources Higgsfield
public/
  img/                               déclinaisons web des logos (générées)
  video/                             vidéos compressées + posters (npm run videos)
  favicon.ico, icon-*.png, …         icônes (générées)
scripts/
  build-images.mjs                   npm run images : logos → webp, favicon, OG
  compress-videos.sh                 npm run videos : ffmpeg
src/
  config/site.ts                     ⚠ informations à compléter
  i18n/fr.ts, ar.ts                  tous les textes
  styles/global.css                  charte (tokens de couleur, polices, boutons)
  layouts/Base.astro                 <head> : meta, OG, hreflang, polices
  components/                        une section = un composant
  scripts/main.ts                    apparitions, défilement horizontal, vidéos
  pages/                             /, /ar/, /merci/, /ar/merci/, robots.txt
```

Si les logos changent, remplacez `assets/img/logo-ovale.webp` et `assets/img/symbole.png` par des versions de même cadrage (fond transparent), puis lancez :

```bash
npm run images
```

### Charte (rappel)

| Couleur | Hex | Usage |
| --- | --- | --- |
| Bleu marine | `#1C3F6E` | marque, boutons, titres de produits |
| Bleu foncé | `#142E52` | héros, section Professionnels, pied de page |
| Blanc lait | `#F7F0E6` | fond principal (jamais de blanc pur) |
| Crème | `#EFE3D0` | sections alternées |
| Encre | `#2B211B` | texte |
| Encre douce | `#6E5E50` | texte secondaire (contraste 5,5:1 sur blanc lait) |
| Vert / Rouge | `#1E7B4A` / `#C8322B` | filets fins uniquement |

Accessibilité : tous les textes respectent le contraste WCAG AA. Le site propose un lien d'évitement, des focus visibles, des libellés de formulaire et des textes alternatifs. La navigation au clavier est complète, et toutes les animations sont coupées si l'utilisateur a demandé moins de mouvement.
