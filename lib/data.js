// ============================================================
// DONNÉES DE DÉMONSTRATION
// ⚠️ Seuils, dates, frais et salaires = ORDRES DE GRANDEUR à vérifier
// et remplacer par vos données collectées et sourcées.
// Les avis sont des EXEMPLES fictifs, affichés comme tels dans l'interface.
// ============================================================

export const BAC_TYPES = [
  { code: "SM", fr: "Sciences Mathématiques", ar: "علوم رياضية" },
  { code: "PC", fr: "Sciences Physiques", ar: "علوم فيزيائية" },
  { code: "SVT", fr: "Sciences de la Vie et de la Terre", ar: "علوم الحياة والأرض" },
  { code: "ECO", fr: "Sciences Économiques", ar: "علوم اقتصادية" },
  { code: "LET", fr: "Lettres & Sciences Humaines", ar: "آداب وعلوم إنسانية" }
];

export const DOMAINS = [
  { slug: "sante", fr: "Santé", ar: "الصحة", riasec: ["I", "S"] },
  { slug: "ingenierie", fr: "Ingénierie & Tech", ar: "الهندسة والتكنولوجيا", riasec: ["R", "I"] },
  { slug: "commerce", fr: "Commerce & Gestion", ar: "التجارة والتسيير", riasec: ["E", "C"] },
  { slug: "communication", fr: "Journalisme & Com", ar: "الصحافة والتواصل", riasec: ["A", "S"] },
  { slug: "architecture", fr: "Architecture & Design", ar: "الهندسة المعمارية", riasec: ["A", "R"] },
  { slug: "droit", fr: "Droit & Sciences sociales", ar: "القانون والعلوم الاجتماعية", riasec: ["S", "E"] },
  { slug: "sciences", fr: "Sciences fondamentales", ar: "العلوم الأساسية", riasec: ["I", "C"] }
];

export const YEARS = [2022, 2023, 2024, 2025, 2026];

// weights = formule de calcul de la note de présélection
// (la plupart des écoles publiques sélectives : 75 % national + 25 % régional)
const W_PRESEL = { regional: 0.25, cc: 0, national: 0.75 };
const W_BAC = { regional: 0.25, cc: 0.25, national: 0.5 };

export const SCHOOLS = [
  {
    slug: "medecine", acronym: "FMP", domain: "sante",
    fr: "Facultés de Médecine et de Pharmacie", ar: "كليات الطب والصيدلة",
    cities: ["Rabat", "Casablanca", "Fès", "Marrakech", "Oujda", "Agadir", "Tanger"],
    type: "public", years: 7, diploma_fr: "Doctorat en médecine", diploma_ar: "دكتوراه في الطب",
    fees: 0, access: "seuil+concours", weights: W_PRESEL,
    thresholds: { SM: [16.4, 16.9, 15.8, 16.2, 16.5], PC: [16.6, 17.1, 16.0, 16.4, 16.7], SVT: [16.8, 17.2, 16.1, 16.5, 16.9] },
    careers: [
      { fr: "Médecin généraliste", ar: "طبيب عام", min: 9000, max: 15000 },
      { fr: "Médecin spécialiste", ar: "طبيب أخصائي", min: 20000, max: 45000 }
    ],
    reality_fr: "7 ans minimum, rythme très dense dès la 1ère année. L'emploi est quasi garanti, mais les postes publics sont souvent hors des grandes villes au début.",
    reality_ar: "7 سنوات على الأقل وإيقاع مكثف منذ السنة الأولى. الشغل شبه مضمون، لكن المناصب العمومية الأولى غالبًا خارج المدن الكبرى.",
    reviews: [
      { who: "Étudiante, 4ème année", stars: 4, fr: "Le concours se joue sur la vitesse. Entraîne-toi en conditions réelles dès mars.", ar: "المباراة تعتمد على السرعة. تدرب في ظروف حقيقية من شهر مارس." },
      { who: "Lauréat, interne", stars: 5, fr: "Dur mais passionnant. La solidarité entre étudiants fait la différence.", ar: "صعب لكنه ممتع. التضامن بين الطلبة يصنع الفرق." }
    ]
  },
  {
    slug: "medecine-dentaire", acronym: "FMD", domain: "sante",
    fr: "Facultés de Médecine Dentaire", ar: "كليات طب الأسنان",
    cities: ["Rabat", "Casablanca"], type: "public", years: 6,
    diploma_fr: "Doctorat en médecine dentaire", diploma_ar: "دكتوراه في طب الأسنان",
    fees: 0, access: "seuil+concours", weights: W_PRESEL,
    thresholds: { SM: [16.0, 16.5, 15.5, 15.9, 16.2], PC: [16.2, 16.7, 15.7, 16.1, 16.4], SVT: [16.4, 16.9, 15.9, 16.3, 16.6] },
    careers: [{ fr: "Chirurgien-dentiste", ar: "جراح أسنان", min: 10000, max: 30000 }],
    reality_fr: "Peu de places, beaucoup de pratique clinique. L'installation en cabinet demande un investissement important.",
    reality_ar: "مقاعد قليلة وتطبيق سريري كثير. فتح عيادة خاصة يتطلب استثمارًا مهمًا.",
    reviews: [{ who: "Étudiant, 3ème année", stars: 4, fr: "Formation très concrète, mais le matériel coûte cher.", ar: "تكوين عملي جدًا، لكن المعدات مكلفة." }]
  },
  {
    slug: "ensa", acronym: "ENSA", domain: "ingenierie",
    fr: "Écoles Nationales des Sciences Appliquées", ar: "المدارس الوطنية للعلوم التطبيقية",
    cities: ["Kénitra", "Agadir", "Tanger", "Marrakech", "Fès", "Oujda", "El Jadida", "Safi"],
    type: "public", years: 5, diploma_fr: "Diplôme d'ingénieur d'État", diploma_ar: "دبلوم مهندس الدولة",
    fees: 0, access: "seuil+concours", weights: W_PRESEL,
    thresholds: { SM: [14.8, 15.4, 14.6, 15.0, 15.3], PC: [15.2, 15.8, 15.0, 15.4, 15.7], SVT: [15.6, 16.1, 15.3, 15.7, 16.0] },
    careers: [
      { fr: "Ingénieur logiciel", ar: "مهندس برمجيات", min: 9000, max: 14000 },
      { fr: "Ingénieur industriel", ar: "مهندس صناعي", min: 8000, max: 12000 }
    ],
    reality_fr: "2 années de prépa intégrée exigeantes, puis spécialisation. Très bonne insertion, surtout en informatique et industrie.",
    reality_ar: "سنتان تحضيريتان مدمجتان صعبتان ثم التخصص. إدماج مهني جيد جدًا خاصة في المعلوميات والصناعة.",
    reviews: [
      { who: "Étudiant, Génie Info", stars: 5, fr: "Le classement à la fin du cycle prépa décide ta filière : ne lâche rien en 2ème année.", ar: "الترتيب في نهاية السلك التحضيري يحدد شعبتك: لا تتهاون في السنة الثانية." },
      { who: "Lauréate 2024", stars: 4, fr: "Le réseau d'anciens est un vrai atout pour le premier stage.", ar: "شبكة الخريجين نقطة قوة حقيقية للتدريب الأول." }
    ]
  },
  {
    slug: "ensam", acronym: "ENSAM", domain: "ingenierie",
    fr: "Écoles Nationales Supérieures d'Arts et Métiers", ar: "المدارس الوطنية العليا للفنون والمهن",
    cities: ["Meknès", "Casablanca", "Rabat"], type: "public", years: 5,
    diploma_fr: "Diplôme d'ingénieur d'État", diploma_ar: "دبلوم مهندس الدولة",
    fees: 0, access: "seuil+concours", weights: W_PRESEL,
    thresholds: { SM: [15.1, 15.6, 14.9, 15.3, 15.6], PC: [15.5, 16.0, 15.3, 15.7, 16.0] },
    careers: [{ fr: "Ingénieur mécanique / production", ar: "مهندس ميكانيك / إنتاج", min: 8500, max: 13000 }],
    reality_fr: "Très orientée industrie (automobile, aéronautique). Beaucoup d'ateliers et de projets concrets.",
    reality_ar: "موجهة نحو الصناعة (السيارات، الطيران). ورشات ومشاريع تطبيقية كثيرة.",
    reviews: [{ who: "Étudiant, 4ème année", stars: 4, fr: "Idéal si tu aimes construire et voir le résultat de ton travail.", ar: "مثالية إذا كنت تحب البناء ورؤية نتيجة عملك." }]
  },
  {
    slug: "encg", acronym: "ENCG", domain: "commerce",
    fr: "Écoles Nationales de Commerce et de Gestion", ar: "المدارس الوطنية للتجارة والتسيير",
    cities: ["Settat", "Casablanca", "Kénitra", "Tanger", "Agadir", "Fès", "Marrakech", "Oujda"],
    type: "public", years: 5, diploma_fr: "Diplôme ENCG (Bac+5)", diploma_ar: "دبلوم المدرسة الوطنية للتجارة والتسيير",
    fees: 0, access: "seuil+concours", weights: W_PRESEL,
    thresholds: { SM: [13.6, 14.2, 13.4, 13.9, 14.1], PC: [13.9, 14.5, 13.7, 14.2, 14.4], SVT: [14.1, 14.7, 13.9, 14.4, 14.6], ECO: [14.4, 15.0, 14.2, 14.7, 15.0] },
    careers: [
      { fr: "Auditeur / Contrôleur de gestion", ar: "مدقق / مراقب تسيير", min: 7000, max: 11000 },
      { fr: "Chargé marketing", ar: "مكلف بالتسويق", min: 6000, max: 9000 }
    ],
    reality_fr: "Accès par le concours TAFEM après présélection. Bonne insertion, mais forte concurrence entre lauréats : stages et langues font la différence.",
    reality_ar: "الولوج عبر مباراة TAFEM بعد الانتقاء الأولي. إدماج جيد لكن المنافسة قوية: التداريب واللغات تصنع الفرق.",
    reviews: [{ who: "Étudiante, 3ème année", stars: 4, fr: "Le TAFEM teste surtout la logique et le français. Fais des annales chronométrées.", ar: "مباراة TAFEM تختبر المنطق والفرنسية خاصة. اشتغل على امتحانات سابقة بالتوقيت." }]
  },
  {
    slug: "cpge", acronym: "CPGE", domain: "ingenierie",
    fr: "Classes Préparatoires aux Grandes Écoles", ar: "الأقسام التحضيرية للمدارس العليا",
    cities: ["Rabat", "Casablanca", "Marrakech", "Fès", "Tanger", "Kénitra", "Meknès"],
    type: "public", years: 2, diploma_fr: "Accès aux concours (CNC, ENCG...)", diploma_ar: "ولوج المباريات (CNC...)",
    fees: 0, access: "dossier", weights: W_BAC,
    thresholds: { SM: [15.0, 15.3, 14.7, 15.1, 15.4], PC: [15.6, 16.0, 15.4, 15.8, 16.1], ECO: [15.2, 15.6, 15.0, 15.4, 15.7] },
    careers: [{ fr: "Grandes écoles d'ingénieurs (EMI, INPT, Centrale...)", ar: "المدارس العليا للمهندسين", min: 10000, max: 16000 }],
    reality_fr: "2 ans très intenses, internat fréquent. La voie royale vers les meilleures écoles, mais il faut tenir le rythme.",
    reality_ar: "سنتان مكثفتان جدًا مع داخلية غالبًا. الطريق الملكي نحو أفضل المدارس لكن يجب الصمود.",
    reviews: [{ who: "Ex-préparationnaire", stars: 5, fr: "Les deux années les plus dures et les plus formatrices de ma vie.", ar: "أصعب سنتين في حياتي وأكثرها تكوينًا." }]
  },
  {
    slug: "est", acronym: "EST", domain: "ingenierie",
    fr: "Écoles Supérieures de Technologie (DUT)", ar: "المدارس العليا للتكنولوجيا",
    cities: ["Salé", "Casablanca", "Fès", "Meknès", "Agadir", "Oujda", "Safi", "Guelmim"],
    type: "public", years: 2, diploma_fr: "DUT (Bac+2)", diploma_ar: "دبلوم جامعي للتكنولوجيا",
    fees: 0, access: "seuil", weights: W_BAC,
    thresholds: { SM: [12.6, 13.0, 12.4, 12.8, 13.0], PC: [13.0, 13.4, 12.8, 13.2, 13.4], SVT: [13.3, 13.7, 13.1, 13.5, 13.7], ECO: [13.2, 13.6, 13.0, 13.4, 13.6] },
    careers: [{ fr: "Technicien supérieur", ar: "تقني متخصص", min: 4500, max: 7000 }],
    reality_fr: "Excellente porte d'entrée : 2 ans pratiques, puis passerelles vers licences pro, ENSA ou ENCG (compétitives).",
    reality_ar: "باب دخول ممتاز: سنتان تطبيقيتان ثم جسور نحو الإجازة المهنية أو المدارس (تنافسية).",
    reviews: [{ who: "Lauréat DUT", stars: 4, fr: "Je suis entré en ENSA par passerelle. C'est possible si tu es dans le top de ta promo.", ar: "دخلت ENSA عبر الجسور. ممكن إذا كنت ضمن الأوائل." }]
  },
  {
    slug: "ispits", acronym: "ISPITS", domain: "sante",
    fr: "Instituts Supérieurs des Professions Infirmières et Techniques de Santé", ar: "المعاهد العليا للمهن التمريضية وتقنيات الصحة",
    cities: ["Rabat", "Casablanca", "Fès", "Marrakech", "Agadir", "Tétouan"], type: "public", years: 3,
    diploma_fr: "Licence en soins infirmiers", diploma_ar: "إجازة في العلوم التمريضية",
    fees: 0, access: "seuil+concours", weights: W_PRESEL,
    thresholds: { PC: [13.8, 14.1, 13.5, 13.9, 14.2], SVT: [13.6, 13.9, 13.3, 13.7, 14.0] },
    careers: [{ fr: "Infirmier / Technicien de santé", ar: "ممرض / تقني صحة", min: 6000, max: 9000 }],
    reality_fr: "Métier très demandé au Maroc et à l'étranger. Gardes et stages hospitaliers dès la 1ère année.",
    reality_ar: "مهنة مطلوبة جدًا في المغرب والخارج. حراسات وتداريب استشفائية منذ السنة الأولى.",
    reviews: [{ who: "Étudiante, 2ème année", stars: 4, fr: "Physiquement fatigant mais on se sent utile tous les jours.", ar: "متعب جسديًا لكن نشعر بالفائدة كل يوم." }]
  },
  {
    slug: "isic", acronym: "ISIC", domain: "communication",
    fr: "Institut Supérieur de l'Information et de la Communication", ar: "المعهد العالي للإعلام والاتصال",
    cities: ["Rabat"], type: "public", years: 3, diploma_fr: "Licence en journalisme / communication", diploma_ar: "إجازة في الصحافة والتواصل",
    fees: 0, access: "seuil+concours", weights: W_PRESEL,
    thresholds: { SM: [13.5, 13.9, 13.3, 13.7, 14.0], PC: [13.8, 14.2, 13.6, 14.0, 14.3], ECO: [14.0, 14.4, 13.8, 14.2, 14.5], LET: [14.6, 15.0, 14.4, 14.8, 15.1] },
    careers: [
      { fr: "Journaliste", ar: "صحفي", min: 5000, max: 9000 },
      { fr: "Chargé de communication digitale", ar: "مكلف بالتواصل الرقمي", min: 6000, max: 10000 }
    ],
    reality_fr: "Concours écrit + oral exigeant sur la culture générale et l'expression. Le réseau et le portfolio comptent autant que le diplôme.",
    reality_ar: "مباراة كتابية وشفوية تركز على الثقافة العامة والتعبير. الشبكة والأعمال المنجزة مهمة مثل الدبلوم.",
    reviews: [{ who: "Étudiant, 2ème année", stars: 4, fr: "Lis la presse tous les jours avant l'oral, sérieusement.", ar: "اقرأ الجرائد يوميًا قبل الشفوي، بجدية." }]
  },
  {
    slug: "ena", acronym: "ENA", domain: "architecture",
    fr: "Écoles Nationales d'Architecture", ar: "المدارس الوطنية للهندسة المعمارية",
    cities: ["Rabat", "Fès", "Marrakech", "Tétouan", "Agadir", "Oujda"], type: "public", years: 6,
    diploma_fr: "Diplôme d'architecte", diploma_ar: "دبلوم مهندس معماري",
    fees: 0, access: "seuil+concours", weights: W_PRESEL,
    thresholds: { SM: [14.6, 15.1, 14.4, 14.8, 15.0], PC: [15.0, 15.5, 14.8, 15.2, 15.4] },
    careers: [{ fr: "Architecte", ar: "مهندس معماري", min: 7000, max: 15000 }],
    reality_fr: "Concours avec épreuve de dessin. Beaucoup de nuits blanches sur les projets, métier créatif mais marché concurrentiel.",
    reality_ar: "مباراة بها اختبار رسم. ليالٍ طويلة على المشاريع، مهنة إبداعية لكن السوق تنافسي.",
    reviews: [{ who: "Étudiante, 4ème année", stars: 5, fr: "Si tu dessines déjà pour le plaisir, fonce.", ar: "إذا كنت ترسم من أجل المتعة، انطلق." }]
  },
  {
    slug: "fst", acronym: "FST", domain: "sciences",
    fr: "Facultés des Sciences et Techniques", ar: "كليات العلوم والتقنيات",
    cities: ["Mohammedia", "Settat", "Fès", "Marrakech", "Tanger", "Béni Mellal", "Errachidia"],
    type: "public", years: 3, diploma_fr: "Licence (puis Master / cycle ingénieur)", diploma_ar: "إجازة (ثم ماستر / سلك مهندس)",
    fees: 0, access: "seuil", weights: W_BAC,
    thresholds: { SM: [12.0, 12.4, 11.9, 12.2, 12.5], PC: [12.4, 12.8, 12.2, 12.6, 12.9], SVT: [12.6, 13.0, 12.4, 12.8, 13.1] },
    careers: [{ fr: "Ingénieur (après cycle ingénieur FST)", ar: "مهندس بعد سلك المهندسين", min: 8000, max: 12000 }],
    reality_fr: "Accès sélectif modéré, effectifs raisonnables. Le cycle ingénieur FST est une vraie seconde chance pour devenir ingénieur.",
    reality_ar: "ولوج انتقائي معتدل وأعداد معقولة. سلك المهندسين بالكلية فرصة ثانية حقيقية.",
    reviews: [{ who: "Étudiant, MIP", stars: 4, fr: "Moins de pression qu'en école, mais il faut être autonome.", ar: "ضغط أقل من المدارس لكن يجب الاعتماد على النفس." }]
  },
  {
    slug: "fsjes", acronym: "FSJES", domain: "droit",
    fr: "Facultés des Sciences Juridiques, Économiques et Sociales", ar: "كليات العلوم القانونية والاقتصادية والاجتماعية",
    cities: ["Toutes les régions"], type: "public", years: 3,
    diploma_fr: "Licence (Droit, Économie, Gestion)", diploma_ar: "إجازة (قانون، اقتصاد، تسيير)",
    fees: 0, access: "ouvert", weights: W_BAC, thresholds: {},
    careers: [{ fr: "Juriste, concours administratifs, banque", ar: "قانوني، مباريات إدارية، أبناك", min: 5000, max: 9000 }],
    reality_fr: "Accès ouvert, amphis bondés en 1ère année et abandon élevé. Ceux qui s'organisent réussissent très bien.",
    reality_ar: "ولوج مفتوح ومدرجات مكتظة في السنة الأولى وانقطاع مرتفع. من ينظم وقته ينجح جيدًا.",
    reviews: [{ who: "Étudiante, Licence Droit", stars: 3, fr: "Personne ne te suit : c'est à toi de bosser régulièrement.", ar: "لا أحد يتابعك: عليك بالعمل بانتظام." }]
  },
  {
    slug: "ofppt", acronym: "OFPPT", domain: "ingenierie",
    fr: "OFPPT — Techniciens spécialisés", ar: "مكتب التكوين المهني — تقني متخصص",
    cities: ["Toutes les régions"], type: "public", years: 2,
    diploma_fr: "Technicien spécialisé (Bac+2)", diploma_ar: "تقني متخصص",
    fees: 0, access: "dossier", weights: W_BAC, thresholds: {},
    careers: [{ fr: "Développeur digital, technicien réseaux, électromécanicien", ar: "مطور رقمي، تقني شبكات", min: 4000, max: 7000 }],
    reality_fr: "Formation très pratique, accès rapide à l'emploi. La qualité varie selon les centres : renseigne-toi localement.",
    reality_ar: "تكوين تطبيقي جدًا وولوج سريع لسوق الشغل. الجودة تختلف حسب المراكز.",
    reviews: [{ who: "Lauréat Dév. Digital", stars: 4, fr: "J'ai trouvé un stage puis un CDI grâce à mon projet de fin d'études.", ar: "وجدت تدريبًا ثم عملًا بفضل مشروع التخرج." }]
  },
  {
    slug: "ingenieur-prive", acronym: "PRIVÉ", domain: "ingenierie",
    fr: "Écoles d'ingénieurs privées (reconnues par l'État)", ar: "مدارس المهندسين الخاصة (المعترف بها)",
    cities: ["Casablanca", "Rabat", "Marrakech", "Tanger"], type: "prive", years: 5,
    diploma_fr: "Diplôme d'ingénieur (vérifier l'équivalence)", diploma_ar: "دبلوم مهندس (تحقق من المعادلة)",
    fees: [55000, 90000], access: "dossier", weights: W_BAC, thresholds: {},
    careers: [{ fr: "Ingénieur informatique / industriel", ar: "مهندس معلوميات / صناعي", min: 8000, max: 13000 }],
    reality_fr: "Accès sur dossier + entretien. Vérifie TOUJOURS la reconnaissance de l'État et le taux d'insertion réel avant de payer.",
    reality_ar: "الولوج بالملف والمقابلة. تحقق دائمًا من اعتراف الدولة ونسبة الإدماج الحقيقية قبل الدفع.",
    reviews: [{ who: "Étudiant, 3ème année", stars: 3, fr: "Bon encadrement, mais le coût est lourd pour la famille.", ar: "تأطير جيد لكن التكلفة ثقيلة على الأسرة." }]
  }
];

// Dates indicatives de la saison 2027 (à vérifier sur les sites officiels)
export const DEADLINES = [
  { id: 1, school: "ofppt", kind: "open", date: "2027-03-01", fr: "Ouverture des préinscriptions OFPPT", ar: "فتح التسجيل القبلي بالتكوين المهني" },
  { id: 2, school: "cpge", kind: "open", date: "2027-05-14", fr: "Ouverture des candidatures CPGE", ar: "فتح الترشيحات للأقسام التحضيرية" },
  { id: 3, school: null, kind: "exam", date: "2027-06-02", fr: "Examen national du Bac — début", ar: "انطلاق الامتحان الوطني للباكالوريا" },
  { id: 4, school: "cpge", kind: "close", date: "2027-06-10", fr: "Clôture des candidatures CPGE", ar: "آخر أجل للترشح للأقسام التحضيرية" },
  { id: 5, school: "medecine", kind: "close", date: "2027-06-22", fr: "Médecine : clôture des préinscriptions", ar: "الطب: آخر أجل للتسجيل القبلي" },
  { id: 6, school: "medecine-dentaire", kind: "close", date: "2027-06-22", fr: "Médecine dentaire : clôture des préinscriptions", ar: "طب الأسنان: آخر أجل للتسجيل" },
  { id: 7, school: "ensa", kind: "close", date: "2027-06-25", fr: "ENSA : clôture des préinscriptions", ar: "ENSA: آخر أجل للتسجيل القبلي" },
  { id: 8, school: "ensam", kind: "close", date: "2027-06-27", fr: "ENSAM : clôture des préinscriptions", ar: "ENSAM: آخر أجل للتسجيل القبلي" },
  { id: 9, school: "encg", kind: "close", date: "2027-07-01", fr: "ENCG : clôture inscriptions TAFEM", ar: "ENCG: آخر أجل للتسجيل في TAFEM" },
  { id: 10, school: "isic", kind: "close", date: "2027-07-05", fr: "ISIC : clôture des candidatures", ar: "ISIC: آخر أجل للترشح" },
  { id: 11, school: "ena", kind: "close", date: "2027-07-08", fr: "Architecture : clôture des candidatures", ar: "الهندسة المعمارية: آخر أجل للترشح" },
  { id: 12, school: "ensa", kind: "exam", date: "2027-07-12", fr: "ENSA : concours écrit", ar: "ENSA: المباراة الكتابية" },
  { id: 13, school: "encg", kind: "exam", date: "2027-07-14", fr: "TAFEM : épreuve écrite", ar: "TAFEM: الاختبار الكتابي" },
  { id: 14, school: "ispits", kind: "close", date: "2027-07-15", fr: "ISPITS : clôture des candidatures", ar: "ISPITS: آخر أجل للترشح" },
  { id: 15, school: "est", kind: "close", date: "2027-07-18", fr: "EST : clôture des candidatures", ar: "EST: آخر أجل للترشح" },
  { id: 16, school: "fst", kind: "close", date: "2027-07-20", fr: "FST : clôture des candidatures", ar: "FST: آخر أجل للترشح" },
  { id: 17, school: "medecine", kind: "results", date: "2027-07-24", fr: "Médecine : résultats du concours", ar: "الطب: نتائج المباراة" },
  { id: 18, school: "cpge", kind: "results", date: "2027-07-02", fr: "CPGE : liste principale", ar: "الأقسام التحضيرية: اللائحة الرئيسية" }
];

// Banque d'annales (structure prête ; les PDF seront ajoutés dans Supabase Storage)
export const ANNALES = [
  { school: "ensa", year: 2025, fr: "Concours ENSA — Maths & Physique", ar: "مباراة ENSA — رياضيات وفيزياء", premium: false, quiz: "maths" },
  { school: "ensa", year: 2024, fr: "Concours ENSA — Maths & Physique", ar: "مباراة ENSA — رياضيات وفيزياء", premium: false },
  { school: "medecine", year: 2025, fr: "Concours Médecine — SVT, Chimie, Physique", ar: "مباراة الطب — علوم، كيمياء، فيزياء", premium: false, quiz: "sante" },
  { school: "medecine", year: 2024, fr: "Concours Médecine — corrigé détaillé", ar: "مباراة الطب — تصحيح مفصل", premium: true },
  { school: "encg", year: 2025, fr: "TAFEM — Logique, Français, Culture G.", ar: "TAFEM — منطق، فرنسية، ثقافة عامة", premium: false, quiz: "tafem" },
  { school: "encg", year: 2024, fr: "TAFEM — corrigé détaillé + méthode", ar: "TAFEM — تصحيح مفصل ومنهجية", premium: true },
  { school: "ensam", year: 2025, fr: "Concours ENSAM — Maths & Physique", ar: "مباراة ENSAM — رياضيات وفيزياء", premium: true },
  { school: "isic", year: 2025, fr: "ISIC — Culture générale & rédaction", ar: "ISIC — ثقافة عامة وتحرير", premium: true }
];

// Quiz chronométrés (questions originales, niveau concours post-bac)
export const QUIZZES = {
  maths: {
    fr: "Maths — type ENSA / ENSAM", ar: "رياضيات — نمط ENSA / ENSAM", seconds: 300,
    questions: [
      { q: "lim (x→0) sin(3x) / x = ?", options: ["0", "1", "3", "1/3"], answer: 2 },
      { q: "f(x) = ln(x² + 1). f′(x) = ?", options: ["1/(x²+1)", "2x/(x²+1)", "2x·ln(x²+1)", "x/(x²+1)"], answer: 1 },
      { q: "∫₀¹ 2x dx = ?", options: ["1/2", "1", "2", "0"], answer: 1 },
      { q: "z = 1 + i. |z|² = ?", options: ["1", "√2", "2", "4"], answer: 2 },
      { q: "(uₙ) géométrique : u₀ = 2, q = 3. u₃ = ?", options: ["18", "27", "54", "162"], answer: 2 }
    ]
  },
  tafem: {
    fr: "Logique & Culture G. — type TAFEM", ar: "منطق وثقافة عامة — نمط TAFEM", seconds: 300,
    questions: [
      { q: "2, 6, 12, 20, 30, … ?", options: ["36", "40", "42", "48"], answer: 2 },
      { q: "Tous les A sont B. Aucun B n'est C. Donc :", options: ["Certains A sont C", "Aucun A n'est C", "Tous les C sont A", "On ne peut rien conclure"], answer: 1 },
      { q: "Un prix augmente de 20 % puis baisse de 20 %. Variation totale ?", options: ["0 %", "−4 %", "+4 %", "−2 %"], answer: 1 },
      { q: "Synonyme de « pérenne » :", options: ["Éphémère", "Durable", "Fragile", "Récent"], answer: 1 },
      { q: "CA = 120 000 DH, charges = 90 000 DH. Taux de marge sur CA ?", options: ["20 %", "25 %", "30 %", "33 %"], answer: 1 }
    ]
  },
  sante: {
    fr: "Sciences — type Médecine", ar: "علوم — نمط مباراة الطب", seconds: 300,
    questions: [
      { q: "Où se trouve principalement l'ADN d'une cellule eucaryote ?", options: ["Cytoplasme", "Noyau", "Ribosome", "Membrane"], answer: 1 },
      { q: "[H₃O⁺] = 10⁻³ mol/L. pH = ?", options: ["−3", "3", "11", "7"], answer: 1 },
      { q: "Organite qui produit l'essentiel de l'ATP :", options: ["Mitochondrie", "Appareil de Golgi", "Lysosome", "Noyau"], answer: 0 },
      { q: "Donneur universel de globules rouges :", options: ["AB+", "A−", "O−", "B+"], answer: 2 },
      { q: "Masse molaire de H₂O (H = 1, O = 16) :", options: ["17 g/mol", "18 g/mol", "20 g/mol", "34 g/mol"], answer: 1 }
    ]
  }
};

// Test d'orientation : 10 questions, chaque réponse vote pour une dimension RIASEC
// R = Réaliste, I = Investigateur, A = Artistique, S = Social, E = Entreprenant, C = Conventionnel
export const ORIENTATION_TEST = [
  { fr: "Un samedi libre, tu préfères…", ar: "يوم سبت فارغ، تفضل…", options: [
    { fr: "Réparer ou bricoler quelque chose", ar: "إصلاح شيء أو صنعه", v: "R" },
    { fr: "Regarder un documentaire scientifique", ar: "مشاهدة وثائقي علمي", v: "I" },
    { fr: "Dessiner, filmer, écrire", ar: "الرسم أو التصوير أو الكتابة", v: "A" },
    { fr: "Aider un ami ou faire du bénévolat", ar: "مساعدة صديق أو التطوع", v: "S" }]},
  { fr: "La matière où tu te sens le plus à l'aise :", ar: "المادة التي ترتاح فيها أكثر:", options: [
    { fr: "Maths", ar: "الرياضيات", v: "I" },
    { fr: "SVT", ar: "علوم الحياة والأرض", v: "S" },
    { fr: "Langues & philo", ar: "اللغات والفلسفة", v: "A" },
    { fr: "Économie", ar: "الاقتصاد", v: "E" }]},
  { fr: "Dans un projet de groupe, tu es celui qui…", ar: "في مشروع جماعي، أنت من…", options: [
    { fr: "Organise et répartit les tâches", ar: "ينظم ويوزع المهام", v: "E" },
    { fr: "Vérifie que tout est juste", ar: "يتحقق من صحة كل شيء", v: "C" },
    { fr: "Trouve les idées originales", ar: "يجد الأفكار الأصلية", v: "A" },
    { fr: "Construit concrètement le résultat", ar: "ينجز النتيجة عمليًا", v: "R" }]},
  { fr: "Ce qui te motive le plus dans un futur métier :", ar: "ما يحفزك أكثر في مهنة المستقبل:", options: [
    { fr: "Soigner et aider les gens", ar: "علاج الناس ومساعدتهم", v: "S" },
    { fr: "Bien gagner ma vie et diriger", ar: "دخل جيد والقيادة", v: "E" },
    { fr: "Comprendre comment le monde fonctionne", ar: "فهم كيف يعمل العالم", v: "I" },
    { fr: "Créer des choses qui me ressemblent", ar: "إبداع أشياء تشبهني", v: "A" }]},
  { fr: "Face à un problème difficile, tu…", ar: "أمام مشكل صعب، أنت…", options: [
    { fr: "Analyses jusqu'à comprendre", ar: "تحلل حتى تفهم", v: "I" },
    { fr: "Suis une méthode étape par étape", ar: "تتبع منهجية خطوة بخطوة", v: "C" },
    { fr: "Testes directement des solutions", ar: "تجرب الحلول مباشرة", v: "R" },
    { fr: "En parles avec d'autres", ar: "تناقشه مع الآخرين", v: "S" }]},
  { fr: "Un environnement de travail idéal :", ar: "بيئة عمل مثالية:", options: [
    { fr: "Un atelier, un chantier, le terrain", ar: "ورشة أو ورش أو الميدان", v: "R" },
    { fr: "Un hôpital ou une école", ar: "مستشفى أو مدرسة", v: "S" },
    { fr: "Un bureau bien organisé", ar: "مكتب منظم", v: "C" },
    { fr: "Un studio ou une rédaction", ar: "استوديو أو قاعة تحرير", v: "A" }]},
  { fr: "On te propose de lancer un petit business :", ar: "يقترحون عليك إطلاق مشروع صغير:", options: [
    { fr: "Génial, j'y vais", ar: "رائع، أنطلق", v: "E" },
    { fr: "Je gère la compta", ar: "أتكلف بالمحاسبة", v: "C" },
    { fr: "Je fais le logo et la com", ar: "أصمم الشعار والتواصل", v: "A" },
    { fr: "Je fabrique le produit", ar: "أصنع المنتوج", v: "R" }]},
  { fr: "Tu préfères lire…", ar: "تفضل قراءة…", options: [
    { fr: "Un article de science", ar: "مقال علمي", v: "I" },
    { fr: "Un roman", ar: "رواية", v: "A" },
    { fr: "La biographie d'un entrepreneur", ar: "سيرة رجل أعمال", v: "E" },
    { fr: "Un tutoriel technique", ar: "دليل تقني", v: "R" }]},
  { fr: "Tes amis te demandent souvent…", ar: "أصدقاؤك يطلبون منك غالبًا…", options: [
    { fr: "Des conseils personnels", ar: "نصائح شخصية", v: "S" },
    { fr: "De l'aide en maths/physique", ar: "مساعدة في الرياضيات والفيزياء", v: "I" },
    { fr: "D'organiser les sorties", ar: "تنظيم الخرجات", v: "E" },
    { fr: "De vérifier leurs papiers et dossiers", ar: "مراجعة أوراقهم وملفاتهم", v: "C" }]},
  { fr: "Dans 10 ans, tu te vois…", ar: "بعد 10 سنوات، ترى نفسك…", options: [
    { fr: "Ingénieur ou technicien expert", ar: "مهندسًا أو تقنيًا خبيرًا", v: "R" },
    { fr: "Médecin, infirmier, enseignant", ar: "طبيبًا أو ممرضًا أو أستاذًا", v: "S" },
    { fr: "Chef d'entreprise ou manager", ar: "رئيس مقاولة أو مدير", v: "E" },
    { fr: "Journaliste, architecte, designer", ar: "صحفيًا أو معماريًا أو مصممًا", v: "A" }]}
];

export const RIASEC_LABELS = {
  R: { fr: "Réaliste — tu aimes le concret", ar: "واقعي — تحب الملموس" },
  I: { fr: "Investigateur — tu aimes comprendre", ar: "باحث — تحب الفهم" },
  A: { fr: "Artistique — tu aimes créer", ar: "فني — تحب الإبداع" },
  S: { fr: "Social — tu aimes aider", ar: "اجتماعي — تحب المساعدة" },
  E: { fr: "Entreprenant — tu aimes convaincre", ar: "مبادر — تحب الإقناع" },
  C: { fr: "Conventionnel — tu aimes l'organisation", ar: "منظم — تحب الترتيب" }
};

// Salons communautaires (seed de démonstration — messages fictifs)
export const ROOMS = [
  { slug: "medecine", fr: "Médecine & Dentaire", ar: "الطب وطب الأسنان", school: "medecine" },
  { slug: "ensa", fr: "ENSA & ENSAM", ar: "ENSA و ENSAM", school: "ensa" },
  { slug: "encg", fr: "ENCG / TAFEM", ar: "ENCG / TAFEM", school: "encg" },
  { slug: "cpge", fr: "Classes prépas", ar: "الأقسام التحضيرية", school: "cpge" },
  { slug: "general", fr: "Discussion générale Bac 2027", ar: "نقاش عام باك 2027", school: null }
];

export const SEED_MESSAGES = {
  medecine: [
    { who: "Yassine · SVT", t: "Quelqu'un sait si les annales 2024 sont proches du format 2025 ?", h: "09:12" },
    { who: "Salma · PC", t: "Oui, même structure. Le temps est le vrai piège.", h: "09:20" }
  ],
  ensa: [{ who: "Omar · SM", t: "Pour le concours ENSA, vous faites combien d'annales par semaine ?", h: "18:02" }],
  encg: [{ who: "Imane · ECO", t: "Groupe de révision TAFEM le dimanche, qui est partant ?", h: "20:15" }],
  cpge: [{ who: "Anas · SM", t: "MP ou PSI ? J'hésite vraiment…", h: "17:40" }],
  general: [{ who: "Équipe", t: "Bienvenue ! Respect, entraide, aucune info perso (téléphone, adresse) dans les salons.", h: "08:00" }]
};

// Remontées de listes d'attente (le sujet n°1 en juillet-août)
export const SEED_WAITLIST = [
  { room: "medecine", school: "FMP Rabat", list: 2, rank: 412, h: "il y a 2 h" },
  { room: "ensa", school: "ENSA Kénitra", list: 3, rank: 1180, h: "il y a 5 h" },
  { room: "encg", school: "ENCG Settat", list: 2, rank: 860, h: "hier" }
];
