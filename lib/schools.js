// ============================================================
// ANNUAIRE DES ÉTABLISSEMENTS — Maslaki
// Un "réseau" (ENSA, ENCG, EST…) génère automatiquement une fiche
// par établissement (ENSA Kénitra, ENSA Agadir…). Les écoles uniques
// et le privé sont déclarés un par un plus bas.
//
// Sources des seuils 2026 : orientation-chabab.com/seuil (agrégateur)
// et circulaire médecine 2026 (seuil 12/20). Formule ENSA/Médecine
// vérifiée : 75 % examen national + 25 % examen régional.
// Frais du privé : non renseignés tant qu'ils ne sont pas vérifiés.
// ============================================================

export const CITY_AR = {
  "Agadir": "أكادير", "Al Hoceima": "الحسيمة", "Béni Mellal": "بني ملال", "Benguerir": "ابن جرير",
  "Berkane": "بركان", "Berrechid": "برشيد", "Casablanca": "الدار البيضاء", "Dakhla": "الداخلة",
  "El Jadida": "الجديدة", "Errachidia": "الرشيدية", "Essaouira": "الصويرة", "Fès": "فاس",
  "Fkih Ben Salah": "الفقيه بن صالح", "Guelmim": "كلميم", "Ifrane": "إفران", "Kénitra": "القنيطرة",
  "Kelâa des Sraghna": "قلعة السراغنة", "Khénifra": "خنيفرة", "Khouribga": "خريبكة", "Laâyoune": "العيون",
  "Marrakech": "مراكش", "Meknès": "مكناس", "Mohammedia": "المحمدية", "Nador": "الناظور",
  "Ouarzazate": "ورزازات", "Oujda": "وجدة", "Rabat": "الرباط", "Safi": "آسفي", "Salé": "سلا",
  "Settat": "سطات", "Sidi Bennour": "سيدي بنور", "Tanger": "طنجة", "Taroudant": "تارودانت",
  "Tétouan": "تطوان", "Touissit": "تويسيت"
};

export const CITIES = Object.keys(CITY_AR).sort((a, b) => a.localeCompare(b, "fr"));

const SRC_SEUILS = { label: "orientation-chabab.com", url: "https://orientation-chabab.com/seuil" };
const SRC_MED = { label: "Circulaire ministérielle 2026 (via Morocco World News)", url: "https://www.moroccoworldnews.com/2026/06/324068/morocco-opens-7340-medical-school-places-for-2026-sets-12-20-threshold/" };
const SRC_ENSA = { label: "Note officielle ENSA 2026-2027", url: "https://ensa.uit.ac.ma/wp-content/uploads/2026/06/Note-ENSA_2026_2027.pdf" };

const W75 = { regional: 0.25, cc: 0, national: 0.75 };
const WBAC = { regional: 0.25, cc: 0.25, national: 0.5 };
const CURSUSSUP = "https://www.cursussup.gov.ma";

const slugify = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const deFr = (city) => (/^[AEÉIOUY]/i.test(city) ? `d'${city}` : `de ${city}`);
const biAr = (city) => `ب${CITY_AR[city] || city}`;

// ------------------------------------------------------------
// 1. RÉSEAUX PUBLICS
// ------------------------------------------------------------
const NETWORKS = [
  {
    slug: "medecine", acronym: "FMP", domain: "sante", type: "public",
    fr: "Facultés de Médecine et de Pharmacie", ar: "كليات الطب والصيدلة",
    unit_fr: "Faculté de Médecine et de Pharmacie", unit_ar: "كلية الطب والصيدلة",
    years: 7, diploma_fr: "Doctorat en médecine / pharmacie", diploma_ar: "دكتوراه في الطب / الصيدلة",
    access: "seuil+concours", weights: W75, weightsVerified: true, apply: CURSUSSUP,
    bacs: ["SM", "PC", "SVT"],
    seuil: { year: 2026, byBac: { SM: 12, PC: 12, SVT: 12 }, source: SRC_MED },
    history: [{ year: 2024, value: 13 }, { year: 2025, value: 12 }, { year: 2026, value: 12 }],
    facts_fr: "7 340 places en 2026 (médecine, pharmacie, dentaire). Concours écrit commun : 4 matières, élimination sous 3/20 dans une matière.",
    facts_ar: "7340 مقعدًا سنة 2026. مباراة كتابية موحدة في 4 مواد، مع الإقصاء إذا قلت النقطة عن 3/20 في مادة.",
    careers: [{ fr: "Médecin généraliste", ar: "طبيب عام" }, { fr: "Médecin spécialiste", ar: "طبيب أخصائي" }, { fr: "Pharmacien", ar: "صيدلي" }],
    reality_fr: "7 ans minimum et un rythme très dense dès la 1ère année. L'emploi est quasi garanti, mais les premiers postes publics sont souvent hors des grandes villes.",
    reality_ar: "7 سنوات على الأقل وإيقاع مكثف منذ السنة الأولى. الشغل شبه مضمون، لكن المناصب الأولى غالبًا خارج المدن الكبرى.",
    members: ["Rabat", "Casablanca", "Fès", "Marrakech", "Oujda", "Agadir", "Tanger", "Béni Mellal", "Errachidia", "Kénitra", "Settat", "Guelmim", "Laâyoune"]
  },
  {
    slug: "medecine-dentaire", acronym: "FMD", domain: "sante", type: "public",
    fr: "Facultés de Médecine Dentaire", ar: "كليات طب الأسنان",
    unit_fr: "Faculté de Médecine Dentaire", unit_ar: "كلية طب الأسنان",
    years: 6, diploma_fr: "Doctorat en médecine dentaire", diploma_ar: "دكتوراه في طب الأسنان",
    access: "seuil+concours", weights: W75, weightsVerified: true, apply: CURSUSSUP,
    bacs: ["SM", "PC", "SVT"],
    seuil: { year: 2026, byBac: { SM: 12, PC: 12, SVT: 12 }, source: SRC_MED },
    facts_fr: "Même concours commun que la médecine ; tu classes tes choix (médecine, pharmacie, dentaire) à l'inscription.",
    facts_ar: "نفس المباراة الموحدة للطب؛ ترتب اختياراتك عند التسجيل.",
    careers: [{ fr: "Chirurgien-dentiste", ar: "جراح أسنان" }],
    reality_fr: "Peu de places et beaucoup de pratique clinique. S'installer en cabinet demande un investissement important.",
    reality_ar: "مقاعد قليلة وتطبيق سريري كثير. فتح عيادة يتطلب استثمارًا مهمًا.",
    members: ["Rabat", "Casablanca"]
  },
  {
    slug: "ensa", acronym: "ENSA", domain: "ingenierie", type: "public",
    fr: "Écoles Nationales des Sciences Appliquées", ar: "المدارس الوطنية للعلوم التطبيقية",
    unit_fr: "École Nationale des Sciences Appliquées", unit_ar: "المدرسة الوطنية للعلوم التطبيقية",
    years: 5, diploma_fr: "Diplôme d'ingénieur d'État", diploma_ar: "دبلوم مهندس الدولة",
    access: "seuil+concours", weights: W75, weightsVerified: true, apply: CURSUSSUP,
    bacs: ["SM", "PC", "SVT", "STE", "PRO"],
    seuil: { year: 2026, byBac: { SM: 12, PC: 14.5, SVT: 15, PRO: 15 }, source: SRC_SEUILS },
    facts_fr: "Présélection sur la note (75 % national + 25 % régional), puis concours écrit national commun aux 13 ENSA.",
    facts_ar: "انتقاء أولي حسب النقطة (75% وطني + 25% جهوي) ثم مباراة كتابية وطنية مشتركة بين 13 مدرسة.",
    factsSource: SRC_ENSA,
    careers: [{ fr: "Ingénieur logiciel", ar: "مهندس برمجيات" }, { fr: "Ingénieur industriel", ar: "مهندس صناعي" }, { fr: "Ingénieur réseaux & télécoms", ar: "مهندس شبكات واتصالات" }],
    reality_fr: "2 années de prépa intégrée exigeantes, puis spécialisation selon ton classement. Très bonne insertion, surtout en informatique et industrie.",
    reality_ar: "سنتان تحضيريتان مدمجتان صعبتان ثم التخصص حسب الترتيب. إدماج جيد جدًا خاصة في المعلوميات والصناعة.",
    members: [["Agadir", "UIZ"], ["Al Hoceima", "UAE"], ["Béni Mellal", "USMS"], ["Berrechid", "UH1"], ["El Jadida", "UCD"], ["Fès", "USMBA"], ["Kénitra", "UIT"], ["Khouribga", "USMS"], ["Marrakech", "UCA"], ["Oujda", "UMP"], ["Safi", "UCA"], ["Tanger", "UAE"], ["Tétouan", "UAE"]]
  },
  {
    slug: "ensam", acronym: "ENSAM", domain: "ingenierie", type: "public",
    fr: "Écoles Nationales Supérieures d'Arts et Métiers", ar: "المدارس الوطنية العليا للفنون والمهن",
    unit_fr: "École Nationale Supérieure d'Arts et Métiers", unit_ar: "المدرسة الوطنية العليا للفنون والمهن",
    years: 5, diploma_fr: "Diplôme d'ingénieur d'État", diploma_ar: "دبلوم مهندس الدولة",
    access: "seuil+concours", weights: W75, apply: CURSUSSUP,
    bacs: ["SM", "PC", "SVT", "STE", "PRO"],
    seuil: { year: 2026, byBac: { SM: 12.25, STE: 12.25, PC: 16.17, SVT: 16.17, PRO: 16.17 }, source: SRC_SEUILS },
    careers: [{ fr: "Ingénieur mécanique / production", ar: "مهندس ميكانيك / إنتاج" }, { fr: "Ingénieur génie électrique", ar: "مهندس كهرباء" }],
    reality_fr: "Très orientée industrie (automobile, aéronautique). Beaucoup d'ateliers et de projets concrets.",
    reality_ar: "موجهة نحو الصناعة (السيارات والطيران). ورشات ومشاريع تطبيقية كثيرة.",
    members: [["Meknès", "UMI"], ["Casablanca", "UH2"], ["Rabat", "UM5"]]
  },
  {
    slug: "encg", acronym: "ENCG", domain: "commerce", type: "public",
    fr: "Écoles Nationales de Commerce et de Gestion", ar: "المدارس الوطنية للتجارة والتسيير",
    unit_fr: "École Nationale de Commerce et de Gestion", unit_ar: "المدرسة الوطنية للتجارة والتسيير",
    years: 5, diploma_fr: "Diplôme ENCG (Bac+5)", diploma_ar: "دبلوم المدرسة الوطنية للتجارة والتسيير",
    access: "seuil+concours", weights: W75, apply: CURSUSSUP,
    bacs: ["SM", "PC", "SVT", "ECO", "STE"],
    seuil: { year: 2026, byBac: { ECO: 12, SM: 12, PC: 14, SVT: 14 }, source: SRC_SEUILS },
    facts_fr: "Présélection puis concours national TAFEM (logique, français, culture générale).",
    facts_ar: "انتقاء أولي ثم مباراة TAFEM الوطنية (منطق، فرنسية، ثقافة عامة).",
    careers: [{ fr: "Auditeur / Contrôleur de gestion", ar: "مدقق / مراقب تسيير" }, { fr: "Marketing & commercial", ar: "تسويق وتجارة" }, { fr: "Finance & banque", ar: "مالية وأبناك" }],
    reality_fr: "Bonne insertion, mais forte concurrence entre lauréats : stages, langues et spécialisation font la différence.",
    reality_ar: "إدماج جيد لكن المنافسة قوية بين الخريجين: التداريب واللغات والتخصص تصنع الفرق.",
    members: [["Agadir", "UIZ"], ["Béni Mellal", "USMS"], ["Casablanca", "UH2"], ["Dakhla", "UIZ"], ["El Jadida", "UCD"], ["Fès", "USMBA"], ["Kénitra", "UIT"], ["Marrakech", "UCA"], ["Meknès", "UMI"], ["Oujda", "UMP"], ["Settat", "UH1"], ["Tanger", "UAE"]]
  },
  {
    slug: "est", acronym: "EST", domain: "ingenierie", type: "public",
    fr: "Écoles Supérieures de Technologie (DUT)", ar: "المدارس العليا للتكنولوجيا",
    unit_fr: "École Supérieure de Technologie", unit_ar: "المدرسة العليا للتكنولوجيا",
    years: 2, diploma_fr: "DUT (Bac+2), puis licence possible", diploma_ar: "دبلوم جامعي للتكنولوجيا ثم إجازة",
    access: "seuil", weights: WBAC, apply: CURSUSSUP,
    bacs: ["SM", "PC", "SVT", "STE", "ECO", "PRO"],
    facts_fr: "Sélection sur dossier selon la filière ; seuils propres à chaque EST, publiés après la candidature.",
    facts_ar: "انتقاء بالملف حسب الشعبة؛ لكل مدرسة عتباتها.",
    careers: [{ fr: "Technicien supérieur", ar: "تقني متخصص" }, { fr: "Poursuite en licence pro / école d'ingénieurs", ar: "متابعة الدراسة في الإجازة أو المهندسين" }],
    reality_fr: "Excellente porte d'entrée : 2 ans pratiques, puis passerelles vers licences, ENSA ou ENCG (compétitives).",
    reality_ar: "باب دخول ممتاز: سنتان تطبيقيتان ثم جسور نحو الإجازة أو المدارس (تنافسية).",
    members: [["Agadir", "UIZ"], ["Béni Mellal", "USMS"], ["Casablanca", "UH2"], ["Dakhla", "UIZ"], ["Essaouira", "UCA"], ["Fès", "USMBA"], ["Fkih Ben Salah", "USMS"], ["Guelmim", "UIZ"], ["Kelâa des Sraghna", "UCA"], ["Kénitra", "UIT"], ["Khénifra", "USMS"], ["Laâyoune", "UIZ"], ["Meknès", "UMI"], ["Nador", "UMP"], ["Ouarzazate", "UIZ"], ["Oujda", "UMP"], ["Safi", "UCA"], ["Salé", "UM5"], ["Sidi Bennour", "UCD"]]
  },
  {
    slug: "fst", acronym: "FST", domain: "ingenierie", type: "public",
    fr: "Facultés des Sciences et Techniques", ar: "كليات العلوم والتقنيات",
    unit_fr: "Faculté des Sciences et Techniques", unit_ar: "كلية العلوم والتقنيات",
    years: 3, diploma_fr: "Licence, puis Master ou cycle ingénieur", diploma_ar: "إجازة ثم ماستر أو سلك المهندسين",
    access: "seuil", weights: WBAC, apply: CURSUSSUP,
    bacs: ["SM", "PC", "SVT", "STE", "AGRO"],
    careers: [{ fr: "Ingénieur (après cycle ingénieur FST)", ar: "مهندس بعد سلك المهندسين" }, { fr: "Chercheur, enseignant", ar: "باحث، أستاذ" }],
    reality_fr: "Accès sélectif modéré. Le cycle ingénieur FST est une vraie seconde chance pour devenir ingénieur.",
    reality_ar: "ولوج انتقائي معتدل. سلك المهندسين بالكلية فرصة ثانية حقيقية.",
    members: [["Al Hoceima", "UAE"], ["Béni Mellal", "USMS"], ["Errachidia", "UMI"], ["Fès", "USMBA"], ["Marrakech", "UCA"], ["Mohammedia", "UH2"], ["Settat", "UH1"], ["Tanger", "UAE"]]
  },
  {
    slug: "ena", acronym: "ENA", domain: "architecture", type: "public",
    fr: "Écoles Nationales d'Architecture", ar: "المدارس الوطنية للهندسة المعمارية",
    unit_fr: "École Nationale d'Architecture", unit_ar: "المدرسة الوطنية للهندسة المعمارية",
    years: 6, diploma_fr: "Diplôme d'architecte", diploma_ar: "دبلوم مهندس معماري",
    access: "seuil+concours", weights: W75, apply: CURSUSSUP,
    bacs: ["SM", "PC", "SVT", "STE"],
    facts_fr: "Présélection puis concours avec épreuve de dessin. Chaque ENA a son propre seuil.",
    facts_ar: "انتقاء أولي ثم مباراة تتضمن اختبار رسم. لكل مدرسة عتبتها.",
    careers: [{ fr: "Architecte", ar: "مهندس معماري" }, { fr: "Urbaniste", ar: "مخطط حضري" }],
    reality_fr: "Beaucoup de nuits sur les projets ; métier créatif, marché concurrentiel.",
    reality_ar: "ليالٍ طويلة على المشاريع؛ مهنة إبداعية وسوق تنافسي.",
    members: [["Rabat", null, 16.04], ["Fès", null, 15.22], ["Agadir", null, 15.27], ["Oujda", null, 14.61], ["Tétouan", null, 14.98], ["Marrakech", null, 15.2]]
  },
  {
    slug: "ens", acronym: "ENS", domain: "education", type: "public",
    fr: "Écoles Normales Supérieures", ar: "المدارس العليا للأساتذة",
    unit_fr: "École Normale Supérieure", unit_ar: "المدرسة العليا للأساتذة",
    years: 3, diploma_fr: "Licence en éducation", diploma_ar: "إجازة في التربية",
    access: "dossier", weights: WBAC,
    bacs: ["SM", "PC", "SVT", "STE", "ECO", "LET"],
    careers: [{ fr: "Enseignant (primaire / secondaire)", ar: "أستاذ (ابتدائي / ثانوي)" }],
    reality_fr: "Présélection sur dossier puis entretien oral. Les licences d'éducation préparent aux concours d'enseignement.",
    reality_ar: "انتقاء بالملف ثم مقابلة شفوية. إجازات التربية تهيئ لمباريات التعليم.",
    members: [["Casablanca", "UH2"], ["Fès", "USMBA"], ["Marrakech", "UCA"], ["Meknès", "UMI"], ["Rabat", "UM5"], ["Tétouan", "UAE"]]
  },
  {
    slug: "esef", acronym: "ESEF", domain: "education", type: "public",
    fr: "Écoles Supérieures de l'Éducation et de la Formation", ar: "المدارس العليا للتربية والتكوين",
    unit_fr: "École Supérieure de l'Éducation et de la Formation", unit_ar: "المدرسة العليا للتربية والتكوين",
    years: 3, diploma_fr: "Licence en éducation", diploma_ar: "إجازة في التربية",
    access: "dossier", weights: WBAC,
    bacs: ["SM", "PC", "SVT", "STE", "ECO", "LET"],
    careers: [{ fr: "Enseignant", ar: "أستاذ" }, { fr: "Métiers de la formation", ar: "مهن التكوين" }],
    reality_fr: "Même logique que les ENS : dossier, oral, puis concours d'enseignement après la licence.",
    reality_ar: "نفس منطق المدارس العليا للأساتذة: ملف، شفوي، ثم مباريات التعليم بعد الإجازة.",
    members: [["Agadir", "UIZ"], ["Berrechid", "UH1"], ["El Jadida", "UCD"], ["Kénitra", "UIT"], ["Oujda", "UMP"]]
  },
  {
    slug: "istp", acronym: "ISTP", domain: "ingenierie", type: "public",
    fr: "Instituts des Travaux Publics (ISTP)", ar: "معاهد الأشغال العمومية",
    unit_fr: "Institut des Travaux Publics (ISTP)", unit_ar: "معهد الأشغال العمومية",
    years: 2, diploma_fr: "Technicien spécialisé en travaux publics", diploma_ar: "تقني متخصص في الأشغال العمومية",
    access: "seuil", weights: WBAC, bacs: ["SM", "PC", "SVT", "STE"],
    careers: [{ fr: "Technicien BTP / chantier", ar: "تقني أشغال / ورش" }],
    members: ["Fès", "Marrakech", "Agadir", "Oujda"]
  },
  {
    slug: "ifmeree", acronym: "IFMEREE", domain: "formation", type: "public",
    fr: "Instituts des Énergies Renouvelables (IFMEREE)", ar: "معاهد مهن الطاقات المتجددة",
    unit_fr: "Institut de Formation aux Métiers des Énergies Renouvelables et de l'Efficacité Énergétique", unit_ar: "معهد التكوين في مهن الطاقات المتجددة والنجاعة الطاقية",
    years: 2, diploma_fr: "Technicien spécialisé", diploma_ar: "تقني متخصص",
    access: "concours", weights: WBAC, bacs: ["SM", "PC", "SVT", "STE", "PRO"],
    careers: [{ fr: "Technicien solaire / éolien", ar: "تقني طاقة شمسية / ريحية" }],
    members: ["Oujda", "Tanger", "Ouarzazate"]
  },
  {
    slug: "universites", acronym: "UNIV", domain: "universites", type: "public",
    fr: "Universités publiques (facultés à accès ouvert)", ar: "الجامعات العمومية (ولوج مفتوح)",
    years: 3, diploma_fr: "Licence (FSJES, FLSH, Sciences, Polydisciplinaires)", diploma_ar: "إجازة (حقوق، آداب، علوم، متعددة التخصصات)",
    access: "ouvert", weights: WBAC, bacs: ["SM", "PC", "SVT", "STE", "AGRO", "ECO", "LET", "PRO"],
    careers: [{ fr: "Droit, économie, gestion", ar: "قانون، اقتصاد، تسيير" }, { fr: "Lettres, langues, sciences humaines", ar: "آداب ولغات وعلوم إنسانية" }, { fr: "Sciences fondamentales", ar: "علوم أساسية" }],
    reality_fr: "Accès ouvert, amphis chargés en 1ère année et abandon élevé. Ceux qui s'organisent réussissent très bien.",
    reality_ar: "ولوج مفتوح ومدرجات مكتظة وانقطاع مرتفع. من ينظم وقته ينجح جيدًا.",
    custom: [
      { code: "UM5", fr: "Université Mohammed V", ar: "جامعة محمد الخامس", city: "Rabat" },
      { code: "UH2", fr: "Université Hassan II", ar: "جامعة الحسن الثاني", city: "Casablanca" },
      { code: "USMBA", fr: "Université Sidi Mohamed Ben Abdellah", ar: "جامعة سيدي محمد بن عبد الله", city: "Fès" },
      { code: "UCA", fr: "Université Cadi Ayyad", ar: "جامعة القاضي عياض", city: "Marrakech" },
      { code: "UMP", fr: "Université Mohammed Premier", ar: "جامعة محمد الأول", city: "Oujda" },
      { code: "UAE", fr: "Université Abdelmalek Essaâdi", ar: "جامعة عبد المالك السعدي", city: "Tétouan" },
      { code: "UIZ", fr: "Université Ibn Zohr", ar: "جامعة ابن زهر", city: "Agadir" },
      { code: "UIT", fr: "Université Ibn Tofaïl", ar: "جامعة ابن طفيل", city: "Kénitra" },
      { code: "UMI", fr: "Université Moulay Ismaïl", ar: "جامعة مولاي إسماعيل", city: "Meknès" },
      { code: "USMS", fr: "Université Sultan Moulay Slimane", ar: "جامعة السلطان مولاي سليمان", city: "Béni Mellal" },
      { code: "UH1", fr: "Université Hassan Premier", ar: "جامعة الحسن الأول", city: "Settat" },
      { code: "UCD", fr: "Université Chouaib Doukkali", ar: "جامعة شعيب الدكالي", city: "El Jadida" },
      { code: "UAQ", fr: "Université Al Quaraouiyine", ar: "جامعة القرويين", city: "Fès" }
    ]
  },
  // Réseaux sans fiche par établissement
  {
    slug: "cpge", acronym: "CPGE", domain: "ingenierie", type: "public",
    fr: "Classes Préparatoires aux Grandes Écoles", ar: "الأقسام التحضيرية للمدارس العليا",
    years: 2, diploma_fr: "Accès aux concours (CNC, ENCG, ISCAE…)", diploma_ar: "ولوج المباريات (CNC…)",
    access: "dossier", weights: WBAC, bacs: ["SM", "PC", "STE", "ECO"],
    facts_fr: "Sélection sur une note spécifique (moyenne pondérée des matières principales), candidature en juin sur cpge.ac.ma.",
    facts_ar: "انتقاء حسب نقطة خاصة (معدل مرجح للمواد الأساسية)، الترشيح في يونيو عبر cpge.ac.ma.",
    apply: "https://www.cpge.ac.ma",
    careers: [{ fr: "Grandes écoles d'ingénieurs (EMI, INPT, EHTP…)", ar: "المدارس العليا للمهندسين" }, { fr: "ISCAE, ENCG (filière ECT)", ar: "ISCAE و ENCG" }],
    reality_fr: "2 ans très intenses, souvent en internat. La voie royale vers les meilleures écoles, à condition de tenir le rythme.",
    reality_ar: "سنتان مكثفتان جدًا مع داخلية غالبًا. الطريق الملكي نحو أفضل المدارس.",
    cities_fr: "Plus de 40 lycées dans tout le Maroc"
  },
  {
    slug: "ispits", acronym: "ISPITS", domain: "sante", type: "public",
    fr: "Instituts Supérieurs des Professions Infirmières et Techniques de Santé", ar: "المعاهد العليا للمهن التمريضية وتقنيات الصحة",
    years: 3, diploma_fr: "Licence (infirmier, sage-femme, techniques de santé)", diploma_ar: "إجازة في المهن التمريضية وتقنيات الصحة",
    access: "seuil+concours", weights: W75, bacs: ["SM", "PC", "SVT", "STE"],
    seuil: { year: 2026, byBac: { SM: [13.3, 14.8], PC: [13.3, 14.8], SVT: [13.3, 14.8], STE: [13.3, 14.8] }, source: SRC_SEUILS, note_fr: "Fourchette pour Infirmier polyvalent ; varie selon la filière et le centre (ex. anesthésie 15,50–17,90).", note_ar: "مجال خاص بالممرض متعدد الاختصاصات؛ يختلف حسب الشعبة والمركز." },
    careers: [{ fr: "Infirmier polyvalent", ar: "ممرض متعدد الاختصاصات" }, { fr: "Sage-femme", ar: "قابلة" }, { fr: "Technicien de laboratoire / radiologie", ar: "تقني مختبر / أشعة" }],
    reality_fr: "Métier très demandé au Maroc et à l'étranger. Stages hospitaliers dès la 1ère année.",
    reality_ar: "مهنة مطلوبة جدًا في المغرب والخارج. تداريب استشفائية منذ السنة الأولى.",
    cities_fr: "Instituts et annexes dans toutes les régions"
  },
  {
    slug: "ofppt", acronym: "OFPPT", domain: "formation", type: "public",
    fr: "OFPPT — Formation professionnelle (Technicien spécialisé)", ar: "مكتب التكوين المهني وإنعاش الشغل",
    years: 2, diploma_fr: "Technicien spécialisé (Bac+2)", diploma_ar: "تقني متخصص",
    access: "dossier", weights: WBAC, bacs: ["SM", "PC", "SVT", "STE", "AGRO", "ECO", "LET", "PRO"],
    apply: "https://www.myway.ac.ma",
    careers: [{ fr: "Développement digital, réseaux", ar: "التطوير الرقمي، الشبكات" }, { fr: "Électromécanique, BTP, gestion", ar: "كهروميكانيك، بناء، تسيير" }],
    reality_fr: "Formation très pratique et accès rapide à l'emploi. La qualité varie selon les centres.",
    reality_ar: "تكوين تطبيقي وولوج سريع لسوق الشغل. الجودة تختلف حسب المراكز.",
    cities_fr: "Centres dans toutes les régions, dont les Cités des Métiers et des Compétences (CMC)"
  },
  {
    slug: "bts", acronym: "BTS", domain: "formation", type: "public",
    fr: "Brevet de Technicien Supérieur (BTS)", ar: "شهادة التقني العالي",
    years: 2, diploma_fr: "BTS (Bac+2)", diploma_ar: "شهادة التقني العالي",
    access: "dossier", weights: WBAC, bacs: ["SM", "PC", "SVT", "STE", "ECO", "PRO"],
    careers: [{ fr: "Technicien supérieur (industrie, gestion, informatique)", ar: "تقني عالي" }],
    reality_fr: "Formation en lycée, très encadrée, avec des débouchés concrets. Peut se poursuivre en licence professionnelle.",
    reality_ar: "تكوين داخل الثانوية مؤطر جيدًا وآفاقه ملموسة.",
    cities_fr: "Lycées dans toutes les régions"
  }
];

const UNIV_NAME = Object.fromEntries(NETWORKS.find((n) => n.slug === "universites").custom.map((u) => [u.code, u]));

// ------------------------------------------------------------
// 2. ÉCOLES UNIQUES (publiques, semi-publiques, militaires)
// ------------------------------------------------------------
const SINGLES = [
  { slug: "iscae", acronym: "ISCAE", fr: "Institut Supérieur de Commerce et d'Administration des Entreprises", ar: "المعهد العالي للتجارة وإدارة المقاولات", city: "Casablanca", domain: "commerce", type: "public", years: 3, diploma_fr: "Licence / Grande École (après concours)", access: "seuil+concours", weights: W75, bacs: ["SM", "PC", "SVT", "STE", "ECO"], seuil: { year: 2026, byBac: { ECO: 17.25, SM: 17.25, SVT: 17.25, STE: 17.25, PC: 18.05 }, source: SRC_SEUILS }, facts_fr: "Campus à Casablanca et Rabat. L'un des seuils les plus élevés du pays." },
  { slug: "apesa-iav", acronym: "APESA", fr: "IAV Hassan II — Année Préparatoire (APESA)", ar: "معهد الحسن الثاني للزراعة والبيطرة — السنة التحضيرية", city: "Rabat", domain: "agronomie", type: "public", years: 2, diploma_fr: "Prépa intégrée, puis ingénieur agronome / vétérinaire", access: "seuil+concours", weights: W75, bacs: ["SM", "PC", "SVT", "AGRO"], seuil: { year: 2026, byBac: { SM: [14, 14.5], PC: [15.5, 16.2], SVT: [16.5, 17.2], AGRO: [13.5, 14] }, source: SRC_SEUILS } },
  { slug: "enam-meknes", acronym: "ENAM", fr: "École Nationale d'Agriculture de Meknès", ar: "المدرسة الوطنية للفلاحة بمكناس", city: "Meknès", domain: "agronomie", type: "public", years: 5, diploma_fr: "Ingénieur agronome", access: "seuil+concours", weights: W75, bacs: ["SM", "PC", "SVT", "AGRO"], seuil: { year: 2026, byBac: { SM: [13.5, 14], PC: [14.5, 15.2], SVT: [15.5, 16], AGRO: [13, 13.5] }, source: SRC_SEUILS } },
  { slug: "eniad-berkane", acronym: "ENIAD", fr: "École Nationale de l'Intelligence Artificielle et du Digital", ar: "المدرسة الوطنية للذكاء الاصطناعي والرقمنة", city: "Berkane", univ: "UMP", domain: "ingenierie", type: "public", years: 5, diploma_fr: "Ingénieur d'État (IA, data, digital)", access: "seuil+concours", weights: W75, bacs: ["SM", "PC", "STE"], isNew: true, facts_fr: "Nouvelle école d'IA, avec cycle préparatoire intégré après le bac." },
  { slug: "ensiasd-taroudant", acronym: "ENSIASD", fr: "École Nationale Supérieure de l'IA et des Sciences des Données", ar: "المدرسة الوطنية العليا للذكاء الاصطناعي وعلوم البيانات", city: "Taroudant", univ: "UIZ", domain: "ingenierie", type: "public", years: 5, diploma_fr: "Ingénieur d'État (IA & data science)", access: "seuil+concours", weights: W75, bacs: ["SM", "PC", "STE"], isNew: true, facts_fr: "Nouvelle école d'IA, avec cycle préparatoire intégré après le bac." },
  { slug: "isic", acronym: "ISIC", fr: "Institut Supérieur de l'Information et de la Communication", ar: "المعهد العالي للإعلام والاتصال", city: "Rabat", domain: "communication", type: "public", years: 3, diploma_fr: "Licence en journalisme / communication", access: "seuil+concours", weights: W75, bacs: ["SM", "PC", "SVT", "STE", "ECO", "LET"], facts_fr: "Concours écrit et oral sur la culture générale et l'expression." },
  { slug: "ismac", acronym: "ISMAC", fr: "Institut Supérieur des Métiers de l'Audiovisuel et du Cinéma", ar: "المعهد العالي لمهن السمعي البصري والسينما", city: "Rabat", domain: "communication", type: "public", years: 3, diploma_fr: "Licence (audiovisuel, cinéma)", access: "concours", weights: WBAC, bacs: ["SM", "PC", "SVT", "STE", "ECO", "LET"] },
  { slug: "isadac", acronym: "ISADAC", fr: "Institut Supérieur d'Art Dramatique et d'Animation Culturelle", ar: "المعهد العالي للفن المسرحي والتنشيط الثقافي", city: "Rabat", domain: "architecture", type: "public", years: 4, diploma_fr: "Diplôme d'art dramatique", access: "concours", weights: WBAC, bacs: ["SM", "PC", "SVT", "STE", "ECO", "LET"] },
  { slug: "inba-tetouan", acronym: "INBA", fr: "Institut National des Beaux-Arts de Tétouan", ar: "المعهد الوطني للفنون الجميلة بتطوان", city: "Tétouan", domain: "architecture", type: "public", years: 4, diploma_fr: "Diplôme des beaux-arts", access: "concours", weights: WBAC, bacs: ["SM", "PC", "SVT", "STE", "ECO", "LET"] },
  { slug: "ensad-casablanca", acronym: "ENSAD", fr: "École Nationale Supérieure d'Art et de Design", ar: "المدرسة الوطنية العليا للفن والتصميم", city: "Casablanca", univ: "UH2", domain: "architecture", type: "public", years: 5, diploma_fr: "Diplôme en design (Bac+5)", access: "concours", weights: WBAC, bacs: ["SM", "PC", "SVT", "STE", "ECO", "LET"] },
  { slug: "aat-casablanca", acronym: "AAT", fr: "Académie des Arts Traditionnels", ar: "أكاديمية الفنون التقليدية", city: "Casablanca", domain: "architecture", type: "semi-public", years: 3, diploma_fr: "Licence en arts traditionnels", access: "concours", weights: WBAC, bacs: ["SM", "PC", "SVT", "STE", "ECO", "LET", "PRO"] },
  { slug: "isit-tanger", acronym: "ISIT", fr: "Institut Supérieur International du Tourisme", ar: "المعهد العالي الدولي للسياحة", city: "Tanger", domain: "tourisme", type: "public", years: 3, diploma_fr: "Licence en tourisme", access: "concours", weights: WBAC, bacs: ["SM", "PC", "SVT", "STE", "ECO", "LET"] },
  { slug: "ispm-agadir", acronym: "ISPM", fr: "Institut Supérieur des Pêches Maritimes", ar: "المعهد العالي للصيد البحري", city: "Agadir", domain: "tourisme", type: "public", years: 3, diploma_fr: "Licence (pêche, aquaculture)", access: "concours", weights: WBAC, bacs: ["SM", "PC", "SVT", "STE"] },
  { slug: "isem-casablanca", acronym: "ISEM", fr: "Institut Supérieur d'Études Maritimes", ar: "المعهد العالي للدراسات البحرية", city: "Casablanca", domain: "tourisme", type: "public", years: 3, diploma_fr: "Officier de la marine marchande", access: "concours", weights: WBAC, bacs: ["SM", "PC", "STE"] },
  { slug: "imm-marrakech", acronym: "IMM", fr: "Institut des Mines de Marrakech", ar: "معهد المعادن بمراكش", city: "Marrakech", domain: "ingenierie", type: "public", years: 2, diploma_fr: "Technicien supérieur des mines", access: "concours", weights: WBAC, bacs: ["SM", "PC", "SVT", "STE"] },
  { slug: "imt-touissit", acronym: "IMT", fr: "Institut des Mines de Touissit", ar: "معهد المعادن بتويسيت", city: "Touissit", domain: "ingenierie", type: "public", years: 2, diploma_fr: "Technicien des mines", access: "concours", weights: WBAC, bacs: ["SM", "PC", "SVT", "STE"] },
  { slug: "esith", acronym: "ESITH", fr: "École Supérieure des Industries du Textile et de l'Habillement", ar: "المدرسة العليا لصناعات النسيج والألبسة", city: "Casablanca", domain: "ingenierie", type: "semi-public", years: 5, diploma_fr: "Ingénieur / licence (textile, logistique)", access: "concours", weights: WBAC, bacs: ["SM", "PC", "SVT", "STE", "ECO"] },
  { slug: "akhawayn", acronym: "AUI", fr: "Université Al Akhawayn", ar: "جامعة الأخوين", city: "Ifrane", domain: "commerce", type: "semi-public", years: 4, diploma_fr: "Bachelor (système américain, en anglais)", access: "dossier", weights: WBAC, bacs: ["SM", "PC", "SVT", "STE", "ECO", "LET"], paid: true, facts_fr: "Université publique autonome, enseignement en anglais, frais de scolarité élevés (bourses possibles)." },
  // Après CPGE (accès via le Concours National Commun)
  ...[
    ["emi", "EMI", "École Mohammadia d'Ingénieurs", "المدرسة المحمدية للمهندسين", "Rabat"],
    ["ensias", "ENSIAS", "École Nationale Supérieure d'Informatique et d'Analyse des Systèmes", "المدرسة الوطنية العليا للمعلوميات وتحليل النظم", "Rabat"],
    ["inpt", "INPT", "Institut National des Postes et Télécommunications", "المعهد الوطني للبريد والمواصلات", "Rabat"],
    ["insea", "INSEA", "Institut National de Statistique et d'Économie Appliquée", "المعهد الوطني للإحصاء والاقتصاد التطبيقي", "Rabat"],
    ["ehtp", "EHTP", "École Hassania des Travaux Publics", "المدرسة الحسنية للأشغال العمومية", "Casablanca"],
    ["enim", "ENSMR", "École Nationale Supérieure des Mines de Rabat", "المدرسة الوطنية العليا للمعادن بالرباط", "Rabat"],
    ["enfi", "ENFI", "École Nationale Forestière d'Ingénieurs", "المدرسة الوطنية الغابوية للمهندسين", "Salé"]
  ].map(([slug, acronym, fr, ar, city]) => ({ slug, acronym, fr, ar, city, domain: "ingenierie", type: "public", years: 3, diploma_fr: "Ingénieur d'État (après 2 ans de CPGE)", access: "cnc", weights: WBAC, bacs: ["SM", "PC", "STE"] })),
  // Écoles militaires
  ...[
    ["arm-meknes", "ARM", "Académie Royale Militaire", "الأكاديمية الملكية العسكرية", "Meknès"],
    ["era-marrakech", "ERA", "École Royale de l'Air", "المدرسة الملكية الجوية", "Marrakech"],
    ["ern-casablanca", "ERN", "École Royale Navale", "المدرسة الملكية البحرية", "Casablanca"],
    ["erssm-rabat", "ERSSM", "École Royale du Service de Santé Militaire", "المدرسة الملكية لمصلحة الصحة العسكرية", "Rabat"]
  ].map(([slug, acronym, fr, ar, city]) => ({ slug, acronym, fr, ar, city, domain: "militaire", type: "militaire", years: 5, diploma_fr: "Officier + diplôme supérieur", access: "concours", weights: WBAC, bacs: ["SM", "PC", "SVT", "STE"], facts_fr: "Concours annuel des Forces Armées Royales : conditions d'âge, de nationalité et d'aptitude physique." }))
];

// ------------------------------------------------------------
// 3. PRIVÉ — universités et écoles reconnues par l'État
// (liste du ministère, via tawjihnet.net). Frais : à consulter.
// ------------------------------------------------------------
const PRIVATE = [
  ["um6p", "UM6P", "Université Mohammed VI Polytechnique", "جامعة محمد السادس متعددة التخصصات التقنية", "Benguerir", "ingenierie", "Université à but non lucratif ; campus à Benguerir et Rabat. Admission sur dossier, tests et entretien."],
  ["uir", "UIR", "Université Internationale de Rabat", "الجامعة الدولية للرباط", "Rabat", "ingenierie"],
  ["uic", "UIC", "Université Internationale de Casablanca", "الجامعة الدولية للدار البيضاء", "Casablanca", "commerce"],
  ["uemf", "UEMF", "Université Euro-Méditerranéenne de Fès", "الجامعة الأورومتوسطية بفاس", "Fès", "ingenierie"],
  ["um6ss", "UM6SS", "Université Mohammed VI des Sciences de la Santé", "جامعة محمد السادس لعلوم الصحة", "Casablanca", "sante"],
  ["uiass", "UIASS", "Université Internationale Abulcasis des Sciences de la Santé", "الجامعة الدولية أبو القاسم الزهراوي لعلوم الصحة", "Rabat", "sante"],
  ["upm", "UPM", "Université Privée de Marrakech", "الجامعة الخاصة بمراكش", "Marrakech", "ingenierie"],
  ["universiapolis", "UIA", "Université Internationale d'Agadir (Universiapolis)", "الجامعة الدولية لأكادير", "Agadir", "commerce"],
  ["mundiapolis", "MUNDIAPOLIS", "Université Mundiapolis", "جامعة موندياپوليس", "Casablanca", "commerce"],
  ["upf", "UPF", "Université Privée de Fès", "الجامعة الخاصة بفاس", "Fès", "ingenierie"],
  ["eac", "EAC", "École Supérieure d'Architecture de Casablanca", "المدرسة العليا للهندسة المعمارية بالدار البيضاء", "Casablanca", "architecture"],
  ["centrale-casablanca", "ECC", "École Centrale Casablanca", "المدرسة المركزية بالدار البيضاء", "Casablanca", "ingenierie"],
  ["esca", "ESCA", "ESCA École de Management", "ESCA مدرسة التدبير", "Casablanca", "commerce"],
  ["supdeco-marrakech", "SUP DE CO", "Sup de Co Marrakech", "Sup de Co مراكش", "Marrakech", "commerce"],
  ["estem", "ESTEM", "ESTEM — Ingénierie de l'Information, Télécoms, Management et Génie Civil", "ESTEM", "Casablanca", "ingenierie"],
  ["iga", "IGA", "Institut Supérieur du Génie Appliqué", "IGA", "Casablanca", "ingenierie"],
  ["emsi-casablanca", "EMSI", "EMSI Casablanca", "EMSI الدار البيضاء", "Casablanca", "ingenierie"],
  ["emsi-rabat", "EMSI", "EMSI Rabat", "EMSI الرباط", "Rabat", "ingenierie"],
  ["emsi-marrakech", "EMSI", "EMSI Marrakech", "EMSI مراكش", "Marrakech", "ingenierie"],
  ["emsi-tanger", "EMSI", "EMSI Tanger", "EMSI طنجة", "Tanger", "ingenierie"],
  ["isga-rabat", "ISGA", "ISGA Rabat", "ISGA الرباط", "Rabat", "ingenierie"],
  ["isga-casablanca", "ISGA", "ISGA Casablanca", "ISGA الدار البيضاء", "Casablanca", "ingenierie"],
  ["isga-fes", "ISGA", "ISGA Fès", "ISGA فاس", "Fès", "ingenierie"],
  ["isga-marrakech", "ISGA", "ISGA Marrakech", "ISGA مراكش", "Marrakech", "ingenierie"],
  ["emg-rabat", "EMG", "École Marocaine d'Ingénierie (EMG)", "EMG", "Rabat", "ingenierie"],
  ["istl", "ISTL", "Institut Supérieur de Transport et de la Logistique", "ISTL", "Casablanca", "commerce"],
  ["hem", "HEM", "HEM Business School", "HEM", "Casablanca", "commerce"],
  ["heec", "HEEC", "HEEC Marrakech", "HEEC مراكش", "Marrakech", "commerce"],
  ["supmanagement", "SUP'MANAGEMENT", "Sup'Management Fès", "Sup'Management فاس", "Fès", "commerce"],
  ["eigsica", "EIGSI", "EIGSI Casablanca", "EIGSI الدار البيضاء", "Casablanca", "ingenierie"],
  ["supmti", "SUPMTI", "SUPMTI Rabat", "SUPMTI الرباط", "Rabat", "ingenierie"],
  ["eheio", "EHEIO", "EHEIO Oujda", "EHEIO وجدة", "Oujda", "ingenierie"],
  ["emaa", "EMAA", "École de Management et d'Administration des Affaires", "EMAA", "Agadir", "commerce"],
  ["ismagi", "ISMAGI", "ISMAGI", "ISMAGI", "Rabat", "ingenierie"],
  ["hestim", "HESTIM", "HESTIM", "HESTIM", "Casablanca", "ingenierie"],
  ["heci", "HECI", "HECI Casablanca", "HECI الدار البيضاء", "Casablanca", "commerce"],
  ["essem", "ESSEM", "ESSEM Business School", "ESSEM", "Casablanca", "commerce"],
  ["suprh", "SUP'RH", "Sup'RH — Management et Ressources Humaines", "Sup'RH", "Casablanca", "commerce"],
  ["esss", "ESSS", "École Supérieure des Sciences de la Santé", "المدرسة العليا لعلوم الصحة", "Casablanca", "sante"],
  ["ensit-tanger", "ENSIT", "École des Nouvelles Sciences et Ingénierie", "ENSIT", "Tanger", "ingenierie"],
  ["hecf", "HECF", "HECF Fès — Hautes Études Comptables et Financières", "HECF فاس", "Fès", "commerce"],
  ["eamr", "EAMR", "École Arts et Métiers — Campus de Rabat", "EAMR", "Rabat", "ingenierie"],
  ["suptech-sante", "SUPTECH", "Suptech Santé — Génie biomédical", "Suptech Santé", "Mohammedia", "sante"],
  ["esp-casablanca", "ESP", "École Supérieure de Psychologie", "المدرسة العليا لعلم النفس", "Casablanca", "sante"],
  ["supemir", "SUPEMIR", "SUPEMIR — Multimédia, Informatique et Réseaux", "SUPEMIR", "Casablanca", "ingenierie"],
  ["eheb", "EHEB", "EHEB — Biotechnologie et Santé", "EHEB", "Casablanca", "sante"],
  ["esisa", "ESISA", "ESISA — Ingénierie en Sciences Appliquées", "ESISA", "Fès", "ingenierie"],
  ["escga", "ESCGA", "ESCGA Tanger", "ESCGA طنجة", "Tanger", "commerce"]
].map(([slug, acronym, fr, ar, city, domain, facts_fr]) => ({
  slug, acronym, fr, ar, city, domain, type: "prive", paid: true, recognized: true,
  years: 5, diploma_fr: "Diplôme reconnu par l'État (vérifie l'équivalence de ta filière)",
  access: "dossier", weights: WBAC, bacs: ["SM", "PC", "SVT", "STE", "ECO", "LET", "PRO", "AGRO"],
  facts_fr: facts_fr || "Admission sur dossier, test et/ou entretien. Établissement reconnu par l'État.",
  reality_fr: "Avant de t'engager : vérifie les frais réels, la reconnaissance de TA filière et le taux d'insertion des lauréats.",
  reality_ar: "قبل الالتزام: تحقق من الرسوم الحقيقية واعتراف الدولة بشعبتك ونسبة إدماج الخريجين."
}));

// ------------------------------------------------------------
// 4. CONSTRUCTION DES FICHES
// ------------------------------------------------------------
const INHERIT = ["domain", "type", "years", "diploma_fr", "diploma_ar", "access", "weights", "weightsVerified", "apply", "bacs", "seuil", "history", "facts_fr", "facts_ar", "factsSource", "careers", "reality_fr", "reality_ar"];

function fromNetwork(net, m) {
  if (net.custom) {
    return { ...pick(net), kind: "establishment", network: net.slug, slug: slugify(m.code), acronym: m.code, fr: m.fr, ar: m.ar, city: m.city };
  }
  const [city, univ, seuilCity] = Array.isArray(m) ? m : [m];
  const e = {
    ...pick(net), kind: "establishment", network: net.slug,
    slug: `${net.slug}-${slugify(city)}`,
    acronym: `${net.acronym} ${city}`,
    fr: `${net.unit_fr} ${deFr(city)}`, ar: `${net.unit_ar} ${biAr(city)}`,
    city, univ: univ || null
  };
  if (seuilCity != null) {
    e.seuil = { year: 2026, byBac: Object.fromEntries(net.bacs.map((b) => [b, seuilCity])), source: SRC_SEUILS };
  }
  return e;
}
const pick = (net) => Object.fromEntries(INHERIT.filter((k) => net[k] !== undefined).map((k) => [k, net[k]]));

const ESTABLISHMENTS = [
  ...NETWORKS.flatMap((n) => (n.custom || n.members || []).map((m) => fromNetwork(n, m))),
  ...SINGLES.map((s) => ({ kind: "establishment", network: null, ...s })),
  ...PRIVATE.map((s) => ({ kind: "establishment", network: null, ...s }))
];

const NETWORK_FICHES = NETWORKS.map((n) => ({ ...n, kind: "network", count: (n.custom || n.members || []).length }));

export const SCHOOLS = [...NETWORK_FICHES, ...ESTABLISHMENTS];
export const ESTABLISHMENT_COUNT = ESTABLISHMENTS.length;

export const schoolBySlug = (slug) => SCHOOLS.find((s) => s.slug === slug);
export const membersOf = (slug) => ESTABLISHMENTS.filter((e) => e.network === slug);
export const univName = (code) => UNIV_NAME[code];

// Fiches utilisées par le simulateur : celles qui ont un seuil publié.
// Pour un réseau au seuil commun, on garde la fiche réseau ; l'ENA a un seuil par ville.
export const SIMULATOR_SCHOOLS = SCHOOLS.filter((s) =>
  s.seuil && (s.kind === "network" || s.network === "ena" || !s.network) && !(s.kind === "network" && s.slug === "ena"));
