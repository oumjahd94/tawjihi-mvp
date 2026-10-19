// Référentiels communs (bacs, domaines, test, quiz, communauté).
// Les écoles sont dans lib/schools.js, les concours dans lib/concours.js.

export const BAC_TYPES = [
  { code: "SM", fr: "Sciences Mathématiques (A/B)", ar: "علوم رياضية (أ/ب)" },
  { code: "PC", fr: "Sciences Physiques", ar: "علوم فيزيائية" },
  { code: "SVT", fr: "Sciences de la Vie et de la Terre", ar: "علوم الحياة والأرض" },
  { code: "STE", fr: "Sciences & Technologies", ar: "علوم وتكنولوجيات" },
  { code: "AGRO", fr: "Sciences Agronomiques", ar: "علوم زراعية" },
  { code: "ECO", fr: "Sciences Éco & Gestion comptable", ar: "علوم اقتصادية وتدبير محاسباتي" },
  { code: "LET", fr: "Lettres & Sciences Humaines", ar: "آداب وعلوم إنسانية" },
  { code: "PRO", fr: "Bac Professionnel", ar: "باكالوريا مهنية" }
];

export const DOMAINS = [
  { slug: "sante", fr: "Santé", ar: "الصحة", riasec: ["I", "S"] },
  { slug: "ingenierie", fr: "Ingénierie & Tech", ar: "الهندسة والتكنولوجيا", riasec: ["R", "I"] },
  { slug: "commerce", fr: "Commerce & Gestion", ar: "التجارة والتسيير", riasec: ["E", "C"] },
  { slug: "universites", fr: "Universités (accès ouvert)", ar: "الجامعات (ولوج مفتوح)", riasec: ["I", "S"] },
  { slug: "education", fr: "Enseignement & Éducation", ar: "التربية والتعليم", riasec: ["S", "A"] },
  { slug: "architecture", fr: "Architecture & Arts", ar: "الهندسة المعمارية والفنون", riasec: ["A", "R"] },
  { slug: "communication", fr: "Journalisme & Audiovisuel", ar: "الصحافة والسمعي البصري", riasec: ["A", "S"] },
  { slug: "agronomie", fr: "Agronomie & Environnement", ar: "الفلاحة والبيئة", riasec: ["R", "I"] },
  { slug: "tourisme", fr: "Tourisme & Maritime", ar: "السياحة والبحرية", riasec: ["S", "E"] },
  { slug: "formation", fr: "Formation professionnelle", ar: "التكوين المهني", riasec: ["R", "C"] },
  { slug: "militaire", fr: "Écoles militaires", ar: "المدارس العسكرية", riasec: ["R", "E"] }
];

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

// Banque d'annales (structure prête ; les PDF iront dans Supabase Storage)
export const ANNALES = [
  { school: "ensa", year: 2026, fr: "Concours ENSA — Maths & Physique", ar: "مباراة ENSA — رياضيات وفيزياء", premium: false, quiz: "maths" },
  { school: "ensa", year: 2025, fr: "Concours ENSA — Maths & Physique", ar: "مباراة ENSA — رياضيات وفيزياء", premium: false },
  { school: "medecine", year: 2026, fr: "Concours Médecine — SVT, Chimie, Physique, Maths", ar: "مباراة الطب — علوم، كيمياء، فيزياء، رياضيات", premium: false, quiz: "sante" },
  { school: "medecine", year: 2025, fr: "Concours Médecine — corrigé détaillé", ar: "مباراة الطب — تصحيح مفصل", premium: true },
  { school: "encg", year: 2026, fr: "TAFEM — Logique, Français, Culture G.", ar: "TAFEM — منطق، فرنسية، ثقافة عامة", premium: false, quiz: "tafem" },
  { school: "encg", year: 2025, fr: "TAFEM — corrigé détaillé + méthode", ar: "TAFEM — تصحيح مفصل ومنهجية", premium: true },
  { school: "ensam", year: 2026, fr: "Concours ENSAM — Maths & Physique", ar: "مباراة ENSAM — رياضيات وفيزياء", premium: true },
  { school: "isic", year: 2026, fr: "ISIC — Culture générale & rédaction", ar: "ISIC — ثقافة عامة وتحرير", premium: true }
];

// Quiz chronométrés (questions originales)
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

export const ROOMS = [
  { slug: "medecine", fr: "Médecine & Dentaire", ar: "الطب وطب الأسنان", school: "medecine" },
  { slug: "ensa", fr: "ENSA & ENSAM", ar: "ENSA و ENSAM", school: "ensa" },
  { slug: "encg", fr: "ENCG / TAFEM", ar: "ENCG / TAFEM", school: "encg" },
  { slug: "cpge", fr: "Classes prépas", ar: "الأقسام التحضيرية", school: "cpge" },
  { slug: "general", fr: "Discussion générale Bac 2027", ar: "نقاش عام باك 2027", school: null }
];

export const SEED_MESSAGES = {
  general: [{ who: "Maslaki", t: "Bienvenue ! Respect, entraide, aucune info perso (téléphone, adresse) dans les salons.", h: "08:00" }],
  medecine: [], ensa: [], encg: [], cpge: []
};

export const SEED_WAITLIST = [];
