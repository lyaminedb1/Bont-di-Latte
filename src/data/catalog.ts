/**
 * Catalogue : fiches produits détaillées et recettes (FR + AR).
 * Les informations à compléter (formats, photos, ingrédients) restent dans src/config/site.ts.
 * Règle : ne jamais écrire « italienne », « italiana » ni « Made in Italy ».
 */
import type { Lang } from '../i18n';

type Bi = { fr: string; ar: string };
type BiList = { fr: string[]; ar: string[] };

export type FoodArtKind = 'caprese' | 'pizza' | 'bruschetta' | 'pates' | 'chakchouka' | 'salade';
export type ProductId = 'fior-di-latte' | 'bocconcini' | 'pizza';
export type CategoryId = 'entrees' | 'salades' | 'pates' | 'pizza' | 'plats';

/* ---------------------------------------------------------------- Produits */

export const productDetails: Record<ProductId, {
  tagline: Bi;
  short: Bi;
  long: Bi;
  audience: Bi;
  uses: BiList;
  alt: Bi;
}> = {
  'fior-di-latte': {
    tagline: { fr: 'La boule classique', ar: 'الكرة الكلاسيكية' },
    short: {
      fr: 'Fondante au cœur, légèrement lactée : la mozzarella fresca de tous les jours.',
      ar: 'طريّة القلب بطعم حليبي خفيف: الموزاريلا الطازجة لكل يوم.',
    },
    long: {
      fr: 'Filée à la main puis façonnée en boule, la Fior di latte garde dans sa saumure toute la fraîcheur du lait. Sa texture souple et son cœur fondant en font la reine des salades, des tartines et des assiettes à partager.',
      ar: 'تُمَدّ باليد ثم تُشكَّل كرةً، وتحتفظ Fior di latte في محلولها الملحي بكل نضارة الحليب. قوامها الليّن وقلبها الطريّ يجعلانها ملكة السلطات والخبز المحمّص وأطباق المشاركة.',
    },
    audience: { fr: 'Particuliers · Épiceries fines', ar: 'العائلات · محلات المنتجات الراقية' },
    uses: {
      fr: ['Salades et caprese', 'Tartines et bruschetta', 'À déguster nature, avec un filet d’huile d’olive'],
      ar: ['السلطات والكابريزي', 'الخبز المحمّص والبروسكيتا', 'تُؤكل طبيعية مع رشّة زيت زيتون'],
    },
    alt: { fr: 'Illustration d’une boule de mozzarella fior di latte', ar: 'رسم لكرة موزاريلا fior di latte' },
  },
  bocconcini: {
    tagline: { fr: 'Petites bouchées', ar: 'لقيمات صغيرة' },
    short: {
      fr: 'De petites billes à partager, idéales pour les salades et l’apéritif.',
      ar: 'كُرات صغيرة للمشاركة، مثالية للسلطات والمقبّلات.',
    },
    long: {
      fr: 'Les bocconcini sont de petites bouchées de mozzarella fresca, faciles à piquer, à couper en deux ou à glisser dans une salade de pâtes. Une pâte filée identique à notre boule, dans un format pratique.',
      ar: 'الـ bocconcini لقيمات صغيرة من الموزاريلا الطازجة، سهلة الأكل بالشوكة أو القطع نصفين أو الإضافة إلى سلطة المعكرونة. العجينة الممدودة نفسها، بحجم عملي.',
    },
    audience: { fr: 'Particuliers · Traiteurs · Hôtels', ar: 'العائلات · المموّنون · الفنادق' },
    uses: {
      fr: ['Salades de pâtes', 'Brochettes et apéritifs', 'Buffets et petits-déjeuners d’hôtel'],
      ar: ['سلطات المعكرونة', 'الأسياخ والمقبّلات', 'البوفيهات وفطور الفنادق'],
    },
    alt: { fr: 'Illustration de petites billes de mozzarella bocconcini', ar: 'رسم لكُرات موزاريلا bocconcini صغيرة' },
  },
  pizza: {
    tagline: { fr: 'Pensée pour le four', ar: 'مصمّمة للفرن' },
    short: {
      fr: 'Une pâte plus ferme qui se râpe, fond de façon homogène et file sans rendre d’eau.',
      ar: 'عجينة أكثر تماسكًا تُبشَر، تذوب بتجانس وتمتدّ دون أن تُخرج ماءً.',
    },
    long: {
      fr: 'Moins humide que la boule, notre mozzarella pizza se tranche ou se râpe facilement. Au four, elle fond de manière régulière, dore joliment et file sans détremper la pâte : le choix des pizzerias et des cuisines professionnelles.',
      ar: 'أقل رطوبة من الكرة، تُقطَّع موزاريلا البيتزا أو تُبشَر بسهولة. في الفرن تذوب بانتظام وتتحمّر بشكل جميل وتمتدّ دون أن تُبلّل العجينة: خيار محلات البيتزا والمطابخ المهنية.',
    },
    audience: { fr: 'Pizzerias · Restaurants', ar: 'محلات البيتزا · المطاعم' },
    uses: {
      fr: ['Pizzas au feu de bois ou au four électrique', 'Gratins et pâtes au four', 'Paninis et sandwiches chauds'],
      ar: ['البيتزا في فرن الحطب أو الفرن الكهربائي', 'الغراتان والمعكرونة في الفرن', 'البانيني والسندويشات الساخنة'],
    },
    alt: { fr: 'Illustration d’un pain de mozzarella pour pizza', ar: 'رسم لقالب موزاريلا للبيتزا' },
  },
};

/* ---------------------------------------------------------------- Recettes */

export const categories: { id: CategoryId; label: Bi }[] = [
  { id: 'entrees', label: { fr: 'Entrées', ar: 'المقبّلات' } },
  { id: 'salades', label: { fr: 'Salades', ar: 'السلطات' } },
  { id: 'pates', label: { fr: 'Pâtes', ar: 'المعكرونة' } },
  { id: 'pizza', label: { fr: 'Pizzas', ar: 'البيتزا' } },
  { id: 'plats', label: { fr: 'Plats', ar: 'الأطباق' } },
];

export type Recipe = {
  slug: string;
  art: FoodArtKind;
  category: CategoryId;
  product: ProductId;
  minutes: number;
  servings: number;
  level: 'facile' | 'moyen';
  title: Bi;
  intro: Bi;
  ingredients: BiList;
  steps: BiList;
};

export const recipes: Recipe[] = [
  {
    slug: 'caprese',
    art: 'caprese',
    category: 'salades',
    product: 'fior-di-latte',
    minutes: 10,
    servings: 2,
    level: 'facile',
    title: { fr: 'Caprese aux tomates de saison', ar: 'كابريزي بطماطم الموسم' },
    intro: {
      fr: 'Le plus simple des plats, et peut-être le meilleur : des tomates mûres, une mozzarella fresca et du basilic.',
      ar: 'أبسط الأطباق، وربما أفضلها: طماطم ناضجة، موزاريلا طازجة وحبق.',
    },
    ingredients: {
      fr: ['1 boule de Fior di latte (250 g)', '3 tomates bien mûres', 'Quelques feuilles de basilic', '3 c. à soupe d’huile d’olive', 'Sel, poivre'],
      ar: ['كرة Fior di latte واحدة (250 غ)', '3 حبات طماطم ناضجة', 'بضع أوراق حبق', '3 ملاعق كبيرة زيت زيتون', 'ملح وفلفل'],
    },
    steps: {
      fr: [
        'Sortez la mozzarella du réfrigérateur 20 minutes avant, pour qu’elle révèle tout son goût.',
        'Coupez les tomates et la mozzarella en tranches d’épaisseur égale.',
        'Alternez-les sur un plat, glissez le basilic, salez, poivrez et arrosez d’huile d’olive.',
      ],
      ar: [
        'أخرج الموزاريلا من الثلاجة قبل 20 دقيقة لتكشف عن كامل طعمها.',
        'قطّع الطماطم والموزاريلا شرائح متساوية السُّمك.',
        'رتّبها بالتناوب في طبق، أضف الحبق، رشّ الملح والفلفل وزيت الزيتون.',
      ],
    },
  },
  {
    slug: 'pizza-margherita',
    art: 'pizza',
    category: 'pizza',
    product: 'pizza',
    minutes: 35,
    servings: 2,
    level: 'moyen',
    title: { fr: 'Pizza margherita maison', ar: 'بيتزا مارغريتا منزلية' },
    intro: {
      fr: 'Une pâte fine, une sauce tomate simple et une mozzarella qui file : la pizza que tout le monde aime.',
      ar: 'عجينة رقيقة، صلصة طماطم بسيطة وموزاريلا تمتدّ: البيتزا التي يحبّها الجميع.',
    },
    ingredients: {
      fr: ['1 pâte à pizza (250 g)', '150 g de mozzarella pizza', '200 g de coulis de tomate', '1 c. à soupe d’huile d’olive', 'Basilic frais', 'Sel'],
      ar: ['عجينة بيتزا واحدة (250 غ)', '150 غ موزاريلا البيتزا', '200 غ صلصة طماطم', 'ملعقة كبيرة زيت زيتون', 'حبق طازج', 'ملح'],
    },
    steps: {
      fr: [
        'Préchauffez le four au maximum (250 °C au moins) avec la plaque à l’intérieur.',
        'Étalez la pâte, nappez de coulis de tomate salé, sans aller jusqu’au bord.',
        'Ajoutez la mozzarella râpée ou en tranches, un filet d’huile, puis enfournez 8 à 10 minutes.',
        'Parsemez de basilic frais à la sortie du four.',
      ],
      ar: [
        'سخّن الفرن على أقصى درجة (250 درجة على الأقل) مع الصينية بداخله.',
        'افرد العجينة وغطّها بصلصة الطماطم المملّحة دون الوصول إلى الحواف.',
        'أضف الموزاريلا مبشورة أو شرائح، ورشّة زيت، ثم أدخلها الفرن 8 إلى 10 دقائق.',
        'وزّع الحبق الطازج عند إخراجها من الفرن.',
      ],
    },
  },
  {
    slug: 'bruschetta',
    art: 'bruschetta',
    category: 'entrees',
    product: 'fior-di-latte',
    minutes: 15,
    servings: 4,
    level: 'facile',
    title: { fr: 'Bruschetta tomates et mozzarella', ar: 'بروسكيتا بالطماطم والموزاريلا' },
    intro: {
      fr: 'Du pain grillé, frotté à l’ail, et une garniture fraîche : parfait pour l’apéritif ou un dîner léger.',
      ar: 'خبز محمّص مدهون بالثوم وحشوة طازجة: مثالية للمقبّلات أو عشاء خفيف.',
    },
    ingredients: {
      fr: ['8 tranches de pain de campagne', '1 boule de Fior di latte', '4 tomates', '1 gousse d’ail', 'Basilic, huile d’olive, sel'],
      ar: ['8 شرائح خبز ريفي', 'كرة Fior di latte واحدة', '4 حبات طماطم', 'فص ثوم', 'حبق، زيت زيتون، ملح'],
    },
    steps: {
      fr: [
        'Coupez les tomates et la mozzarella en petits dés, assaisonnez d’huile, de sel et de basilic.',
        'Faites griller le pain puis frottez-le avec la gousse d’ail coupée en deux.',
        'Garnissez au dernier moment pour que le pain reste croustillant.',
      ],
      ar: [
        'قطّع الطماطم والموزاريلا مكعبات صغيرة، وتبّلها بالزيت والملح والحبق.',
        'حمّص الخبز ثم ادهنه بفص الثوم المقطوع نصفين.',
        'ضع الحشوة في آخر لحظة ليبقى الخبز مقرمشًا.',
      ],
    },
  },
  {
    slug: 'pates-au-four',
    art: 'pates',
    category: 'pates',
    product: 'pizza',
    minutes: 40,
    servings: 4,
    level: 'facile',
    title: { fr: 'Pâtes au four, cœur fondant', ar: 'معكرونة في الفرن بقلب ذائب' },
    intro: {
      fr: 'Un plat familial généreux : des pâtes, une sauce tomate mijotée et une couche de mozzarella gratinée.',
      ar: 'طبق عائلي سخيّ: معكرونة، صلصة طماطم مطهوّة على مهل وطبقة موزاريلا محمّرة.',
    },
    ingredients: {
      fr: ['400 g de pâtes courtes (penne)', '250 g de mozzarella pizza', '500 g de sauce tomate', '1 oignon', 'Huile d’olive, sel, poivre'],
      ar: ['400 غ معكرونة قصيرة (بيني)', '250 غ موزاريلا البيتزا', '500 غ صلصة طماطم', 'بصلة واحدة', 'زيت زيتون، ملح، فلفل'],
    },
    steps: {
      fr: [
        'Faites revenir l’oignon émincé dans l’huile, ajoutez la sauce tomate et laissez mijoter 15 minutes.',
        'Cuisez les pâtes 2 minutes de moins qu’indiqué, égouttez et mélangez-les à la sauce.',
        'Versez dans un plat, couvrez de mozzarella et faites gratiner 15 minutes à 200 °C.',
      ],
      ar: [
        'شوّح البصل المفروم في الزيت، أضف صلصة الطماطم واتركها تُطهى 15 دقيقة.',
        'اسلق المعكرونة أقل بدقيقتين من المدة المشار إليها، صفّها واخلطها بالصلصة.',
        'ضعها في طبق، غطّها بالموزاريلا وحمّرها 15 دقيقة على 200 درجة.',
      ],
    },
  },
  {
    slug: 'chakchouka-mozzarella',
    art: 'chakchouka',
    category: 'plats',
    product: 'fior-di-latte',
    minutes: 30,
    servings: 3,
    level: 'facile',
    title: { fr: 'Chakchouka à la mozzarella', ar: 'شكشوكة بالموزاريلا' },
    intro: {
      fr: 'La chakchouka de toujours, poivrons et tomates mijotés, avec des morceaux de mozzarella qui fondent entre les œufs.',
      ar: 'الشكشوكة التي نعرفها، فلفل وطماطم مطهوّة على مهل، مع قطع موزاريلا تذوب بين البيض.',
    },
    ingredients: {
      fr: ['2 poivrons', '4 tomates', '1 oignon, 2 gousses d’ail', '4 œufs', '1 boule de Fior di latte', 'Cumin, paprika, huile d’olive, sel'],
      ar: ['حبتا فلفل', '4 حبات طماطم', 'بصلة وفصّا ثوم', '4 بيضات', 'كرة Fior di latte واحدة', 'كمّون، فلفل أحمر حلو، زيت زيتون، ملح'],
    },
    steps: {
      fr: [
        'Faites revenir l’oignon, l’ail et les poivrons en lanières dans l’huile d’olive.',
        'Ajoutez les tomates en dés et les épices, laissez compoter 15 minutes à feu doux.',
        'Creusez quatre puits, cassez-y les œufs, ajoutez la mozzarella en morceaux et couvrez 5 à 6 minutes.',
      ],
      ar: [
        'شوّح البصل والثوم وشرائح الفلفل في زيت الزيتون.',
        'أضف مكعبات الطماطم والتوابل، واتركها تُطهى 15 دقيقة على نار هادئة.',
        'احفر أربع حفر واكسر فيها البيض، أضف قطع الموزاريلا وغطّ القدر 5 إلى 6 دقائق.',
      ],
    },
  },
  {
    slug: 'salade-de-pates-bocconcini',
    art: 'salade',
    category: 'salades',
    product: 'bocconcini',
    minutes: 20,
    servings: 4,
    level: 'facile',
    title: { fr: 'Salade de pâtes aux bocconcini', ar: 'سلطة معكرونة بالـ bocconcini' },
    intro: {
      fr: 'Une salade fraîche à préparer à l’avance : idéale pour les pique-niques et les déjeuners d’été.',
      ar: 'سلطة منعشة تُحضَّر مسبقًا: مثالية للنزهات وغداء الصيف.',
    },
    ingredients: {
      fr: ['300 g de pâtes (fusilli)', '200 g de bocconcini', '250 g de tomates cerises', '1 poignée d’olives', 'Basilic, huile d’olive, jus de citron, sel'],
      ar: ['300 غ معكرونة (فوزيلي)', '200 غ bocconcini', '250 غ طماطم كرزية', 'حفنة زيتون', 'حبق، زيت زيتون، عصير ليمون، ملح'],
    },
    steps: {
      fr: [
        'Cuisez les pâtes al dente, rincez-les à l’eau froide et égouttez-les bien.',
        'Coupez les tomates cerises et les bocconcini en deux.',
        'Mélangez le tout avec les olives, le basilic, l’huile et le citron. Servez bien frais.',
      ],
      ar: [
        'اسلق المعكرونة al dente، اشطفها بالماء البارد وصفّها جيدًا.',
        'قطّع الطماطم الكرزية والـ bocconcini نصفين.',
        'اخلط الكل مع الزيتون والحبق والزيت والليمون. قدّمها باردة.',
      ],
    },
  },
];

export const levelLabel = (lang: Lang, level: Recipe['level']) =>
  ({ facile: { fr: 'Facile', ar: 'سهلة' }, moyen: { fr: 'Moyen', ar: 'متوسطة' } })[level][lang];
export const categoryLabel = (lang: Lang, id: CategoryId) => categories.find((c) => c.id === id)!.label[lang];
