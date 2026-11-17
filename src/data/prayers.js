// ─────────────────────────────────────────────────────────────────────────────
// Prières, mystères du Rosaire, Chapelet de la Divine Miséricorde et neuvaine.
// Textes de prières traditionnelles (domaine public). Les méditations, clausules,
// intentions et petites prières d'accompagnement sont rédigées pour l'appli.
// ─────────────────────────────────────────────────────────────────────────────

export const SIGNE_DE_CROIX = `Au nom du Père, et du Fils, et du Saint-Esprit. Amen.`

export const NOTRE_PERE = `Notre Père, qui es aux cieux, que ton nom soit sanctifié, que ton règne vienne, que ta volonté soit faite sur la terre comme au ciel. Donne-nous aujourd'hui notre pain de ce jour. Pardonne-nous nos offenses, comme nous pardonnons aussi à ceux qui nous ont offensés. Et ne nous laisse pas entrer en tentation, mais délivre-nous du mal. Amen.`

export const JE_VOUS_SALUE = `Je vous salue Marie, pleine de grâce ; le Seigneur est avec vous. Vous êtes bénie entre toutes les femmes, et Jésus, le fruit de vos entrailles, est béni. Sainte Marie, Mère de Dieu, priez pour nous, pauvres pécheurs, maintenant et à l'heure de notre mort. Amen.`

/** Je vous salue Marie avec clausule (petite phrase méditative après « Jésus ») */
export const aveAvecClausule = (clausule) =>
  `Je vous salue Marie, pleine de grâce ; le Seigneur est avec vous. Vous êtes bénie entre toutes les femmes, et Jésus, le fruit de vos entrailles, est béni — Jésus ${clausule}. Sainte Marie, Mère de Dieu, priez pour nous, pauvres pécheurs, maintenant et à l'heure de notre mort. Amen.`

export const GLOIRE_AU_PERE = `Gloire au Père, et au Fils, et au Saint-Esprit, comme il était au commencement, maintenant et toujours, et pour les siècles des siècles. Amen.`

export const O_MON_JESUS = `Ô mon Jésus, pardonnez-nous nos péchés, préservez-nous du feu de l'enfer, et conduisez au ciel toutes les âmes, spécialement celles qui ont le plus besoin de votre miséricorde. Amen.`

export const JE_CROIS = `Je crois en Dieu, le Père tout-puissant, créateur du ciel et de la terre. Et en Jésus-Christ, son Fils unique, notre Seigneur, qui a été conçu du Saint-Esprit, est né de la Vierge Marie, a souffert sous Ponce Pilate, a été crucifié, est mort et a été enseveli, est descendu aux enfers, le troisième jour est ressuscité des morts, est monté aux cieux, est assis à la droite de Dieu le Père tout-puissant, d'où il viendra juger les vivants et les morts. Je crois en l'Esprit-Saint, à la sainte Église catholique, à la communion des saints, à la rémission des péchés, à la résurrection de la chair, à la vie éternelle. Amen.`

export const SALVE_REGINA = `Salut, ô Reine, Mère de miséricorde, notre vie, notre douceur, notre espérance, salut ! Enfants d'Ève, exilés, nous crions vers vous ; vers vous nous soupirons, gémissant et pleurant dans cette vallée de larmes. Ô vous, notre avocate, tournez vers nous vos regards miséricordieux. Et, après cet exil, montrez-nous Jésus, le fruit béni de vos entrailles. Ô clémente, ô miséricordieuse, ô douce Vierge Marie !
— Priez pour nous, sainte Mère de Dieu.
— Afin que nous soyons rendus dignes des promesses du Christ.`

export const SOUS_L_ABRI = `Sous l'abri de ta miséricorde, nous nous réfugions, sainte Mère de Dieu. Ne méprise pas nos prières quand nous sommes dans l'épreuve, mais de tous les dangers délivre-nous toujours, Vierge glorieuse et bénie.`

export const SAINT_MICHEL = `Saint Michel Archange, défendez-nous dans le combat ; soyez notre secours contre la malice et les embûches du démon. Que Dieu lui fasse sentir son empire, nous vous en supplions ; et vous, Prince de la milice céleste, par la force divine, repoussez en enfer Satan et les autres esprits mauvais qui rôdent dans le monde pour la perte des âmes. Amen.`

export const OFFRANDE_ROSAIRE = `Seigneur Jésus, je t'offre ce chapelet que je vais prier en méditant les mystères de ta vie, de ta mort et de ta résurrection. Avec Marie, ta Mère et la mienne, je te confie mes intentions et celles du monde entier. Donne-moi de prier avec un cœur simple, attentif et confiant. Amen.`

export const PRIERE_FINALE_ROSAIRE = `Ô Dieu, dont le Fils unique, par sa vie, sa mort et sa résurrection, nous a obtenu les récompenses du salut éternel, accorde-nous, en méditant ces mystères du très saint Rosaire de la bienheureuse Vierge Marie, d'imiter ce qu'ils contiennent et d'obtenir ce qu'ils promettent. Par le Christ notre Seigneur. Amen.`

// ─── Litanies de la Vierge Marie (Lorette) ────────────────────────────────────
const PRIEZ = 'priez pour nous.'
export const LITANIES_LORETTE = [
  ['Seigneur, prends pitié.', 'Seigneur, prends pitié.'],
  ['Ô Christ, prends pitié.', 'Ô Christ, prends pitié.'],
  ['Seigneur, prends pitié.', 'Seigneur, prends pitié.'],
  ['Ô Christ, écoute-nous.', 'Ô Christ, écoute-nous.'],
  ['Ô Christ, exauce-nous.', 'Ô Christ, exauce-nous.'],
  ['Père céleste, qui es Dieu,', 'aie pitié de nous.'],
  ['Fils, Rédempteur du monde, qui es Dieu,', 'aie pitié de nous.'],
  ['Esprit-Saint, qui es Dieu,', 'aie pitié de nous.'],
  ['Trinité sainte, qui es un seul Dieu,', 'aie pitié de nous.'],
  ...[
    'Sainte Marie', 'Sainte Mère de Dieu', 'Sainte Vierge des vierges', 'Mère du Christ', "Mère de l'Église",
    'Mère de la miséricorde', 'Mère de la divine grâce', "Mère de l'espérance", 'Mère très pure', 'Mère très chaste',
    'Mère toujours vierge', 'Mère sans tache', 'Mère aimable', 'Mère admirable', 'Mère du bon conseil',
    'Mère du Créateur', 'Mère du Sauveur', 'Vierge très prudente', 'Vierge vénérable', 'Vierge digne de louange',
    'Vierge puissante', 'Vierge clémente', 'Vierge fidèle', 'Miroir de justice', 'Trône de la sagesse',
    'Cause de notre joie', "Temple de l'Esprit-Saint", 'Tabernacle de la gloire éternelle', 'Demeure consacrée à Dieu',
    'Rose mystique', 'Tour de David', "Tour d'ivoire", "Maison d'or", "Arche d'alliance", 'Porte du ciel',
    'Étoile du matin', 'Salut des malades', 'Refuge des pécheurs', 'Réconfort des migrants', 'Consolatrice des affligés',
    'Secours des chrétiens', 'Reine des anges', 'Reine des patriarches', 'Reine des prophètes', 'Reine des apôtres',
    'Reine des martyrs', 'Reine des confesseurs', 'Reine des vierges', 'Reine de tous les saints',
    'Reine conçue sans le péché originel', 'Reine élevée au ciel', 'Reine du très saint Rosaire',
    'Reine de la famille', 'Reine de la paix',
  ].map(inv => [inv + ',', PRIEZ]),
  ['Agneau de Dieu, qui enlèves les péchés du monde,', 'pardonne-nous, Seigneur.'],
  ['Agneau de Dieu, qui enlèves les péchés du monde,', 'exauce-nous, Seigneur.'],
  ['Agneau de Dieu, qui enlèves les péchés du monde,', 'prends pitié de nous.'],
  ['Priez pour nous, sainte Mère de Dieu,', 'afin que nous devenions dignes des promesses du Christ.'],
]
export const LITANIES_ORAISON = `Prions. Seigneur notre Dieu, accorde à tes serviteurs de jouir toujours de la santé de l'âme et du corps ; et par la glorieuse intercession de la bienheureuse Marie toujours vierge, délivre-nous des tristesses de ce temps et donne-nous les joies de l'éternité. Par le Christ notre Seigneur. Amen.`

// ─── Les 20 mystères du Rosaire ───────────────────────────────────────────────
// fruit : la grâce demandée · clausule : petite phrase dans chaque Je vous salue
// intention : une intention suggérée · priere : petite prière d'accompagnement
export const MYSTERIES = {
  joyeux: {
    label: 'Mystères joyeux', short: 'Joyeux', days: 'Lundi & samedi', icon: 'sunrise',
    accent: 'text-amber-300', ring: 'border-amber-400/25', bg: 'from-amber-500/10',
    list: [
      { title: "L'Annonciation", ref: 'Lc 1, 26-38', fruit: "l'humilité", clausule: "qui s'incarne en vous",
        meditation: "L'ange Gabriel annonce à Marie qu'elle sera la Mère du Sauveur. Marie répond : « Voici la servante du Seigneur ; que tout m'advienne selon ta parole. » Contemplons son « oui » total à Dieu.",
        intention: 'Pour les mamans qui attendent un enfant, et pour ceux qui cherchent leur vocation.',
        priere: "Marie, apprends-moi à dire « oui » à Dieu, même quand je ne comprends pas tout." },
      { title: 'La Visitation', ref: 'Lc 1, 39-56', fruit: 'la charité envers le prochain', clausule: 'que vous portez à Élisabeth',
        meditation: "Marie part en hâte servir sa cousine Élisabeth. À sa salutation, Jean-Baptiste tressaille de joie. Contemplons la joie de porter le Christ aux autres.",
        intention: 'Pour les personnes âgées et isolées, et pour ceux qui les visitent.',
        priere: 'Seigneur, rends-moi attentif à ceux qui ont besoin de moi aujourd’hui.' },
      { title: 'La Nativité', ref: 'Lc 2, 1-20', fruit: "l'esprit de pauvreté", clausule: 'qui naît à Bethléem',
        meditation: "Le Fils de Dieu naît pauvre, dans une mangeoire. Les bergers, les plus petits, sont les premiers à l'adorer. Contemplons Dieu qui se fait petit pour nous rejoindre.",
        intention: 'Pour les familles sans logement et les enfants qui souffrent.',
        priere: 'Jésus, viens naître dans mon cœur, aussi pauvre soit-il.' },
      { title: 'La Présentation au Temple', ref: 'Lc 2, 22-40', fruit: "l'obéissance et la pureté du cœur", clausule: 'présenté au Temple',
        meditation: "Marie et Joseph présentent Jésus au Temple. Le vieillard Syméon le prend dans ses bras : « Mes yeux ont vu ton salut. » Contemplons l'offrande de toute une vie à Dieu.",
        intention: 'Pour les prêtres, les consacrés et ceux qui servent l’Église.',
        priere: "Père, je t'offre ma journée, mes joies et mes peines." },
      { title: 'Le Recouvrement de Jésus au Temple', ref: 'Lc 2, 41-52', fruit: 'la recherche de Dieu en toutes choses', clausule: 'retrouvé au Temple',
        meditation: "Après trois jours d'angoisse, Marie et Joseph retrouvent Jésus au Temple : « Ne saviez-vous pas qu'il me faut être chez mon Père ? » Contemplons ceux qui cherchent Dieu.",
        intention: 'Pour ceux qui se sont éloignés de Dieu et pour ceux qui le cherchent.',
        priere: "Seigneur, quand je t'ai perdu de vue, aide-moi à te retrouver." },
    ],
  },
  lumineux: {
    label: 'Mystères lumineux', short: 'Lumineux', days: 'Jeudi', icon: 'bulb',
    accent: 'text-sky-300', ring: 'border-sky-400/25', bg: 'from-sky-500/10',
    list: [
      { title: 'Le Baptême de Jésus', ref: 'Mt 3, 13-17', fruit: 'la fidélité à notre baptême', clausule: 'baptisé dans le Jourdain',
        meditation: "Jésus descend dans les eaux du Jourdain. Le ciel s'ouvre et le Père dit : « Celui-ci est mon Fils bien-aimé. » Contemplons que, par le baptême, nous sommes nous aussi enfants bien-aimés.",
        intention: 'Pour les catéchumènes et les nouveaux baptisés.',
        priere: 'Père, aide-moi à vivre comme ton enfant bien-aimé.' },
      { title: 'Les Noces de Cana', ref: 'Jn 2, 1-12', fruit: 'la confiance en Marie', clausule: 'qui se manifeste à Cana',
        meditation: "Marie remarque que le vin manque et dit aux serviteurs : « Tout ce qu'il vous dira, faites-le. » Jésus change l'eau en vin. Contemplons Marie qui voit nos manques avant nous.",
        intention: 'Pour les couples et les familles.',
        priere: 'Marie, présente à Jésus ce qui manque dans ma vie.' },
      { title: "L'Annonce du Royaume", ref: 'Mc 1, 14-15', fruit: 'la conversion du cœur', clausule: 'qui annonce le Royaume',
        meditation: "« Les temps sont accomplis : le règne de Dieu est tout proche. Convertissez-vous et croyez à l'Évangile. » Contemplons Jésus qui appelle chacun, sans exception.",
        intention: 'Pour ceux qui annoncent l’Évangile et pour ceux qui ont besoin de se convertir.',
        priere: 'Seigneur, je veux revenir à toi, un pas après l’autre.' },
      { title: 'La Transfiguration', ref: 'Mt 17, 1-8', fruit: 'le désir de sainteté', clausule: 'transfiguré sur la montagne',
        meditation: "Sur la montagne, le visage de Jésus devient brillant comme le soleil. « Écoutez-le ! » Contemplons la gloire de Dieu qui veut transformer nos vies.",
        intention: 'Pour ceux qui traversent la nuit de la foi.',
        priere: 'Jésus, montre-moi ta lumière quand tout me semble obscur.' },
      { title: "L'Institution de l'Eucharistie", ref: 'Mt 26, 26-29', fruit: "l'amour de l'Eucharistie", clausule: "qui se donne dans l'Eucharistie",
        meditation: "Au dernier repas, Jésus prend le pain : « Ceci est mon corps, donné pour vous. » Contemplons le Christ qui reste avec nous chaque jour.",
        intention: 'Pour ceux qui ne peuvent plus communier, et pour ceux qui reviennent à la messe.',
        priere: 'Seigneur, donne-moi faim de toi.' },
    ],
  },
  douloureux: {
    label: 'Mystères douloureux', short: 'Douloureux', days: 'Mardi & vendredi', icon: 'cross',
    accent: 'text-rose-300', ring: 'border-rose-400/25', bg: 'from-rose-500/10',
    list: [
      { title: "L'Agonie au jardin des Oliviers", ref: 'Lc 22, 39-46', fruit: 'la contrition et l’abandon à Dieu', clausule: 'en agonie au jardin',
        meditation: "Dans l'angoisse, Jésus prie : « Père, que ta volonté soit faite et non la mienne. » Contemplons Jésus qui connaît nos peurs de l'intérieur.",
        intention: "Pour ceux qui vivent l'angoisse, la dépression ou la solitude.",
        priere: 'Père, dans mes peurs, que ta volonté soit faite.' },
      { title: 'La Flagellation', ref: 'Jn 19, 1', fruit: 'la pureté et la maîtrise de soi', clausule: 'flagellé pour nous',
        meditation: "Jésus est frappé sans se défendre. Il porte dans sa chair nos violences. Contemplons l'amour qui ne rend pas le mal pour le mal.",
        intention: 'Pour les victimes de violence et pour ceux qui la commettent.',
        priere: 'Jésus, guéris mes blessures et celles que j’ai causées.' },
      { title: "Le Couronnement d'épines", ref: 'Mt 27, 27-31', fruit: "l'humilité et le courage", clausule: "couronné d'épines",
        meditation: "Les soldats se moquent de Jésus et le couronnent d'épines. Le vrai Roi se laisse humilier. Contemplons sa douceur face au mépris.",
        intention: 'Pour ceux qui sont moqués ou rejetés à cause de leur foi.',
        priere: "Seigneur, donne-moi d'oser témoigner de toi sans honte." },
      { title: 'Le Portement de la Croix', ref: 'Jn 19, 17', fruit: 'la patience dans les épreuves', clausule: 'qui porte sa croix',
        meditation: "Jésus porte sa croix jusqu'au Calvaire ; Simon de Cyrène l'aide. Contemplons Jésus qui marche avec nous dans nos épreuves.",
        intention: 'Pour les malades et ceux qui les soignent.',
        priere: 'Jésus, aide-moi à porter ma croix aujourd’hui, avec toi.' },
      { title: 'Le Crucifiement et la mort de Jésus', ref: 'Lc 23, 33-46', fruit: 'le pardon et le salut des âmes', clausule: 'crucifié pour nous',
        meditation: "« Père, pardonne-leur : ils ne savent pas ce qu'ils font. » Jésus donne sa vie par amour. Contemplons cet amour plus fort que tout péché.",
        intention: 'Pour les mourants et pour ceux qui ont du mal à pardonner.',
        priere: "Jésus, apprends-moi à pardonner comme tu m'as pardonné." },
    ],
  },
  glorieux: {
    label: 'Mystères glorieux', short: 'Glorieux', days: 'Mercredi & dimanche', icon: 'crown',
    accent: 'text-gold-300', ring: 'border-gold-400/25', bg: 'from-gold-500/10',
    list: [
      { title: 'La Résurrection', ref: 'Lc 24, 1-12', fruit: 'la foi', clausule: "ressuscité d'entre les morts",
        meditation: "« Pourquoi cherchez-vous le Vivant parmi les morts ? Il n'est pas ici, il est ressuscité. » Contemplons la victoire de la vie sur la mort.",
        intention: 'Pour ceux qui sont en deuil et ceux qui ont perdu espoir.',
        priere: 'Seigneur ressuscité, fais renaître en moi ce qui semblait mort.' },
      { title: "L'Ascension", ref: 'Lc 24, 50-53', fruit: "l'espérance et le désir du Ciel", clausule: 'monté au ciel',
        meditation: "Jésus bénit ses disciples et monte vers le Père. Il ne nous abandonne pas : il nous prépare une place. Contemplons notre destinée : la vie avec Dieu.",
        intention: 'Pour ceux qui doutent du sens de leur vie.',
        priere: "Jésus, garde mes yeux tournés vers toi." },
      { title: 'La Pentecôte', ref: 'Ac 2, 1-11', fruit: "les dons de l'Esprit Saint", clausule: "qui envoie l'Esprit Saint",
        meditation: "L'Esprit Saint descend sur Marie et les apôtres comme des langues de feu. Les peureux deviennent témoins. Contemplons l'Esprit qui rallume notre foi.",
        intention: "Pour l'Église et pour l'unité des chrétiens.",
        priere: 'Viens, Esprit Saint, rallume le feu de ma prière.' },
      { title: "L'Assomption de Marie", ref: 'Ap 12, 1', fruit: 'la grâce d’une sainte mort et la dévotion à Marie', clausule: 'qui vous élève au ciel',
        meditation: "Marie est élevée au ciel avec son âme et son corps. Là où elle est, nous sommes appelés. Contemplons notre Mère qui nous attend.",
        intention: 'Pour nos défunts et pour ceux qui vont mourir aujourd’hui.',
        priere: 'Marie, prends-moi par la main jusqu’au Ciel.' },
      { title: 'Le Couronnement de Marie', ref: 'Ap 12, 1', fruit: 'la persévérance et la confiance en Marie', clausule: 'qui vous couronne Reine du ciel',
        meditation: "Marie est couronnée Reine du ciel et de la terre. Reine qui sert, elle intercède pour chacun de ses enfants. Contemplons sa tendresse maternelle.",
        intention: 'Pour la paix dans le monde et dans nos familles.',
        priere: 'Marie, Reine de la paix, garde-moi fidèle jusqu’au bout.' },
    ],
  },
}
export const MYSTERY_ORDER = ['joyeux', 'lumineux', 'douloureux', 'glorieux']

// Lundi & samedi : joyeux · mardi & vendredi : douloureux · jeudi : lumineux · mercredi & dimanche : glorieux
export function getTodayMystery(date = new Date()) {
  const day = date.getDay()
  if (day === 1 || day === 6) return 'joyeux'
  if (day === 2 || day === 5) return 'douloureux'
  if (day === 4) return 'lumineux'
  return 'glorieux'
}

/**
 * Construit la liste linéaire des étapes du chapelet / rosaire.
 * @param {string[]} sets     ex. ['douloureux'] (chapelet) ou les 4 (rosaire complet)
 * @param {{clausules:boolean, litanies:boolean}} options
 */
export function buildRosarySteps(sets, { clausules = true, litanies = true } = {}) {
  const steps = []
  const push = (s) => steps.push({ section: 'ouverture', ...s })
  push({ title: 'Signe de la croix', prayer: SIGNE_DE_CROIX, icon: 'cross' })
  push({ title: "Prière d'offrande", prayer: OFFRANDE_ROSAIRE, icon: 'candle', note: 'Confiez à Dieu vos intentions pour ce chapelet.' })
  push({ title: 'Je crois en Dieu', prayer: JE_CROIS, note: 'Sur la croix du chapelet.' })
  push({ title: 'Notre Père', prayer: NOTRE_PERE, note: 'Sur le premier gros grain.' })
  ;['la foi', "l'espérance", 'la charité'].forEach((v, i) =>
    push({ title: `Je vous salue Marie — pour ${v}`, prayer: JE_VOUS_SALUE, bead: { count: i + 1, total: 3 } }))
  push({ title: 'Gloire au Père', prayer: GLOIRE_AU_PERE })

  const totalMysteries = sets.length * 5
  let n = 0
  sets.forEach(setKey => {
    const set = MYSTERIES[setKey]
    set.list.forEach((m, mi) => {
      n += 1
      const base = { section: 'mystere', setKey, mysteryIndex: mi, mysteryNumber: n, totalMysteries, mystery: m }
      steps.push({ ...base, kind: 'annonce', title: `${mi + 1}ᵉ mystère ${set.short.toLowerCase()} : ${m.title}` })
      steps.push({ ...base, title: 'Notre Père', prayer: NOTRE_PERE })
      for (let a = 1; a <= 10; a++) {
        steps.push({
          ...base, title: `Je vous salue Marie ${a}/10`,
          prayer: clausules ? aveAvecClausule(m.clausule) : JE_VOUS_SALUE,
          bead: { count: a, total: 10 },
        })
      }
      steps.push({ ...base, title: 'Gloire au Père', prayer: GLOIRE_AU_PERE })
      steps.push({ ...base, title: 'Ô mon Jésus', prayer: O_MON_JESUS, note: 'Prière enseignée par Notre-Dame à Fatima.' })
      steps.push({ ...base, kind: 'accompagnement', title: 'Petite prière', prayer: m.priere })
    })
  })

  const close = (s) => steps.push({ section: 'cloture', ...s })
  close({ title: 'Salut, ô Reine (Salve Regina)', prayer: SALVE_REGINA, icon: 'crown' })
  if (litanies) close({ kind: 'litanies', title: 'Litanies de la Vierge Marie', icon: 'rose' })
  close({ title: 'Prière finale du Rosaire', prayer: PRIERE_FINALE_ROSAIRE })
  close({ title: "Sous l'abri de ta miséricorde", prayer: SOUS_L_ABRI })
  close({ title: 'Prière à saint Michel Archange', prayer: SAINT_MICHEL })
  close({ title: 'Signe de la croix', prayer: SIGNE_DE_CROIX, icon: 'cross' })
  return steps
}

// ─── Chapelet de la Divine Miséricorde ────────────────────────────────────────
export const MISERICORDE = {
  ouverture1: `Tu as expiré, Jésus, mais la source de vie a jailli pour les âmes, et l'océan de la miséricorde s'est ouvert pour le monde entier. Ô Source de vie, insondable Miséricorde divine, enveloppe le monde entier et répands-toi sur nous.`,
  ouverture2: `Ô Sang et Eau, qui avez jailli du Cœur de Jésus comme une source de miséricorde pour nous, j'ai confiance en vous !`,
  grosGrain: `Père éternel, je t'offre le Corps et le Sang, l'Âme et la Divinité de ton Fils bien-aimé, notre Seigneur Jésus-Christ, en réparation de nos péchés et de ceux du monde entier.`,
  petitGrain: `Par sa douloureuse Passion, sois miséricordieux pour nous et pour le monde entier.`,
  final: `Dieu Saint, Dieu Fort, Dieu Immortel, prends pitié de nous et du monde entier.`,
  conclusion: `Ô Dieu éternel, dont la miséricorde est infinie et le trésor de compassion inépuisable, pose sur nous ton regard bienveillant et augmente en nous ta miséricorde, afin que, dans les moments difficiles, nous ne désespérions pas et ne perdions pas courage, mais que nous nous soumettions avec une grande confiance à ta sainte volonté, qui est l'Amour et la Miséricorde même. Amen.`,
  confiance: `Jésus, j'ai confiance en toi !`,
}

export function buildMercySteps() {
  const steps = []
  const o = (s) => steps.push({ section: 'ouverture', ...s })
  o({ title: 'Signe de la croix', prayer: SIGNE_DE_CROIX, icon: 'cross' })
  o({ title: 'Prière d’ouverture', prayer: MISERICORDE.ouverture1, icon: 'blood', note: 'Facultative.' })
  ;[1, 2, 3].forEach(i => o({ title: `Ô Sang et Eau (${i}/3)`, prayer: MISERICORDE.ouverture2, bead: { count: i, total: 3 }, note: i === 1 ? 'Facultative, à dire trois fois.' : undefined }))
  o({ title: 'Notre Père', prayer: NOTRE_PERE })
  o({ title: 'Je vous salue Marie', prayer: JE_VOUS_SALUE })
  o({ title: 'Je crois en Dieu', prayer: JE_CROIS })
  for (let d = 1; d <= 5; d++) {
    steps.push({ section: 'dizaine', decade: d, title: `${d}ᵉ dizaine — gros grain`, prayer: MISERICORDE.grosGrain })
    for (let b = 1; b <= 10; b++) {
      steps.push({ section: 'dizaine', decade: d, title: `${d}ᵉ dizaine — ${b}/10`, prayer: MISERICORDE.petitGrain, bead: { count: b, total: 10 } })
    }
  }
  ;[1, 2, 3].forEach(i => steps.push({ section: 'cloture', title: `Dieu Saint (${i}/3)`, prayer: MISERICORDE.final, bead: { count: i, total: 3 } }))
  steps.push({ section: 'cloture', title: 'Prière de conclusion', prayer: MISERICORDE.conclusion, note: 'Facultative.' })
  steps.push({ section: 'cloture', title: 'Jésus, j’ai confiance en toi', prayer: MISERICORDE.confiance, icon: 'heart' })
  steps.push({ section: 'cloture', title: 'Signe de la croix', prayer: SIGNE_DE_CROIX, icon: 'cross' })
  return steps
}

// ─── Neuvaine à la Divine Miséricorde ─────────────────────────────────────────
// Intentions confiées par Jésus à sainte Faustine ; prières rédigées pour l'appli.
export const NEUVAINE = [
  { intention: "Toute l'humanité, et particulièrement les pécheurs",
    priere: "Jésus miséricordieux, toi qui veux sauver tous les hommes, accueille dans ton Cœur toute l'humanité, et surtout ceux qui sont loin de toi. Que personne ne se croie trop loin pour revenir. Amen." },
  { intention: 'Les prêtres, les religieux et les religieuses',
    priere: "Seigneur, bénis ceux que tu as appelés à te servir. Garde-les fidèles et joyeux, afin qu'ils soient pour le monde des témoins de ta miséricorde. Amen." },
  { intention: 'Toutes les âmes pieuses et fidèles',
    priere: "Jésus, merci pour tous ceux qui te restent fidèles dans le silence. Soutiens-les dans les épreuves et fais d'eux une lumière pour leurs frères. Amen." },
  { intention: 'Ceux qui ne connaissent pas encore Dieu',
    priere: "Seigneur, que la lumière de ton amour atteigne ceux qui ne te connaissent pas encore. Qu'ils découvrent un jour la joie d'être aimés de toi. Amen." },
  { intention: "Les chrétiens séparés de l'unité de l'Église",
    priere: "Jésus, toi qui as prié pour que tous soient un, rassemble tes disciples dans une même foi et un même amour. Guéris nos divisions. Amen." },
  { intention: 'Les âmes douces et humbles, et les petits enfants',
    priere: "Seigneur, protège les petits et les humbles de cœur. Donne-moi leur simplicité et leur confiance. Amen." },
  { intention: 'Ceux qui vénèrent et glorifient la miséricorde de Dieu',
    priere: "Jésus, rends-nous témoins de ta miséricorde par nos paroles et nos actes. Que nos vies chantent ta bonté. Amen." },
  { intention: 'Les âmes du purgatoire',
    priere: "Père de miséricorde, accueille dans ta lumière nos défunts et toutes les âmes qui attendent de te voir face à face. Amen." },
  { intention: 'Les âmes tièdes',
    priere: "Jésus, réveille les cœurs devenus tièdes — et le mien le premier. Rallume en nous le feu de ton amour. Amen." },
]

/** Date de Pâques (calendrier grégorien) */
export function easterDate(year) {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

/** Prochain dimanche de la Miséricorde (2ᵉ dimanche de Pâques) et début de la neuvaine (Vendredi saint) */
export function nextDivineMercySunday(from = new Date()) {
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  for (const y of [from.getFullYear(), from.getFullYear() + 1]) {
    const easter = easterDate(y)
    const sunday = new Date(easter); sunday.setDate(easter.getDate() + 7)
    const goodFriday = new Date(easter); goodFriday.setDate(easter.getDate() - 2)
    if (sunday >= today) return { sunday, goodFriday }
  }
  return null
}

// ─── Prières guidées (onglet Prière et « Mon moment avec Dieu ») ──────────────
export const GUIDED_PRAYERS = [
  { title: 'Prière pour renouer avec Dieu', icon: 'dove',
    text: "Père, je reconnais m'être éloigné(e) de toi. Comme le fils prodigue, je reviens vers toi, avec ce que je suis. Tu as promis que si je m'approche de toi, tu t'approcheras de moi. Ravive en moi le désir de te prier, un peu chaque jour. Amen." },
  { title: 'Prière du matin', icon: 'sunrise',
    text: "Seigneur, merci pour ce nouveau jour. Je te l'offre tout entier : mes pensées, mes paroles, mes actes. Guide mes pas et remplis-moi de ton Esprit Saint, pour que ta volonté s'accomplisse aujourd'hui dans ma vie. Amen." },
  { title: 'Prière du soir', icon: 'candle',
    text: "Seigneur, merci pour cette journée. Pardonne-moi le mal que j'ai fait et le bien que j'ai négligé. Je remets entre tes mains ceux que j'aime, et je m'endors dans ta paix. Amen." },
  { title: 'Prière de repentance', icon: 'droplet',
    text: "Seigneur Jésus, je viens à toi avec un cœur contrit. Tu as dit que si nous confessons nos péchés, tu es fidèle et juste pour nous pardonner. Purifie-moi, et crée en moi un cœur nouveau. Merci pour ton amour qui ne change jamais. Amen." },
  { title: "Prière dans l'épreuve", icon: 'anchor',
    text: "Père, tu vois ma situation et tu connais ma peine. Tu es mon refuge et ma force. Je te confie ce fardeau. Donne-moi ta paix, qui dépasse tout ce qu'on peut comprendre, et la force de traverser cette épreuve avec toi. Amen." },
  { title: "Acte d'espérance", icon: 'star',
    text: "Mon Dieu, j'espère avec une ferme confiance que vous me donnerez, à cause des mérites de Jésus-Christ, votre grâce en ce monde et le bonheur éternel dans l'autre, parce que vous l'avez promis et que vous êtes fidèle dans vos promesses. Amen." },
]
