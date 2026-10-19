// Articles de départ : affichés tant que la base Supabase est vide ou non
// configurée. Importables en un clic depuis /admin. Rédigés à partir des
// sources citées en bas de chaque article.

export const NEWS_CATEGORIES = {
  concours: { fr: "Concours", ar: "مباريات" },
  resultats: { fr: "Résultats", ar: "نتائج" },
  bourses: { fr: "Bourses", ar: "منح" },
  etranger: { fr: "Études à l'étranger", ar: "الدراسة بالخارج" },
  orientation: { fr: "Orientation", ar: "توجيه" },
  recrutement: { fr: "Recrutement", ar: "توظيف" }
};

export const NEWS_SEED = [
  {
    slug: "etudes-en-france-candidatures-2027",
    category: "etranger", pinned: true, published_at: "2026-10-19T12:00:00Z",
    title_fr: "Études en France : les candidatures sont ouvertes jusqu'au 15 novembre",
    title_ar: "الدراسة بفرنسا: الترشيحات مفتوحة إلى غاية 15 نونبر",
    excerpt_fr: "La procédure Campus France pour la rentrée 2027 a démarré le 1er octobre. Dossier et paiement à finaliser avant le 15 novembre.",
    excerpt_ar: "انطلقت مسطرة كامبوس فرانس لدخول 2027 يوم فاتح أكتوبر. يجب إتمام الملف والأداء قبل 15 نونبر.",
    body_fr: "Les élèves et étudiants résidant au Maroc qui visent une formation en France pour la rentrée de septembre 2027 peuvent déposer leur dossier depuis le **1er octobre 2026**.\n\n## Ce qu'il faut retenir\n\n- **Date limite : 15 novembre 2026 à 23h59**, heure marocaine.\n- Le dépôt du dossier **et** le paiement des frais doivent être faits avant cette date.\n- La candidature se fait en ligne sur la plateforme Études en France de Campus France Maroc.\n\n## Nos conseils\n\nPrépare tes relevés de notes et ton projet de motivation dès maintenant : les dossiers déposés à la dernière minute sont souvent incomplets. Si tu es en terminale, renseigne-toi aussi sur le test de langue demandé selon ta formation.",
    body_ar: "يمكن للتلاميذ والطلبة المقيمين بالمغرب الراغبين في الدراسة بفرنسا في شتنبر 2027 إيداع ملفاتهم منذ **فاتح أكتوبر 2026**.\n\n## ما يجب معرفته\n\n- **آخر أجل: 15 نونبر 2026 على الساعة 23:59** بتوقيت المغرب.\n- يجب إيداع الملف **و**أداء الرسوم قبل هذا التاريخ.\n- الترشيح يتم عبر منصة Études en France.\n\n## نصائحنا\n\nحضّر كشوف النقط ورسالة التحفيز من الآن، فالملفات المودعة في آخر لحظة تكون غالبًا ناقصة.",
    source_label: "Bladi.net", source_url: "https://www.bladi.net/etudes-france-candidatures-ouvrent-aujourd-hui-maroc-jusqu-novembre,124087.html"
  },
  {
    slug: "far-recrutement-soldats-octobre-2026",
    category: "recrutement", published_at: "2026-10-19T11:00:00Z",
    title_fr: "Forces Armées Royales : le recrutement de soldats se termine le 23 octobre",
    title_ar: "القوات المسلحة الملكية: توظيف الجنود ينتهي يوم 23 أكتوبر",
    excerpt_fr: "Les candidatures pour le recrutement de soldats des FAR sont reçues jusqu'au 23 octobre 2026.",
    excerpt_ar: "تستقبل ترشيحات توظيف جنود القوات المسلحة الملكية إلى غاية 23 أكتوبر 2026.",
    body_fr: "Les **Forces Armées Royales** recrutent des soldats. La date limite de dépôt des candidatures est fixée au **23 octobre 2026**.\n\nLes conditions (âge, niveau d'études, aptitude physique) sont précisées dans l'avis officiel : lis-le attentivement avant de constituer ton dossier, et méfie-toi des intermédiaires qui demandent de l'argent. Le recrutement est gratuit.",
    body_ar: "تعلن **القوات المسلحة الملكية** عن توظيف جنود. آخر أجل لإيداع الترشيحات هو **23 أكتوبر 2026**.\n\nالشروط (السن، المستوى الدراسي، اللياقة البدنية) مفصلة في الإعلان الرسمي. احذر من الوسطاء الذين يطلبون المال: التوظيف مجاني.",
    source_label: "tawjihnet.net", source_url: "https://www.tawjihnet.net/"
  },
  {
    slug: "listes-attente-medecine-ispits-octobre-2026",
    category: "resultats", published_at: "2026-10-19T10:00:00Z",
    title_fr: "Médecine et ISPITS : les listes d'attente continuent d'avancer",
    title_ar: "الطب و ISPITS: لوائح الانتظار مستمرة",
    excerpt_fr: "Les facultés de médecine, pharmacie et médecine dentaire, ainsi que les ISPITS, publient encore des listes d'attente en octobre.",
    excerpt_ar: "لا تزال كليات الطب والصيدلة وطب الأسنان، وكذا المعاهد العليا للمهن التمريضية، تنشر لوائح الانتظار في أكتوبر.",
    body_fr: "Même après la rentrée, les places se libèrent : des candidats admis se désistent pour une autre formation. Les **facultés de médecine, pharmacie et médecine dentaire** et les **ISPITS** continuent donc d'appeler des candidats sur liste d'attente.\n\n## Que faire si tu es sur liste d'attente ?\n\n- Consulte le site de ton établissement **tous les jours** : les délais d'inscription après un appel sont très courts.\n- Garde ton dossier prêt (copies certifiées, photos, frais d'inscription).\n- Ne laisse pas tomber ta formation actuelle tant que ton inscription n'est pas confirmée.\n\nSur Maslaki, le salon **Médecine & Dentaire** permet aux élèves de signaler le dernier rang appelé.",
    body_ar: "حتى بعد الدخول الجامعي، تتحرر مقاعد بسبب انسحاب بعض المقبولين. لذلك تستمر **كليات الطب** و**ISPITS** في استدعاء المترشحين من لوائح الانتظار.\n\n## ماذا تفعل إذا كنت في لائحة الانتظار؟\n\n- تفقد موقع مؤسستك **يوميًا**: آجال التسجيل بعد الاستدعاء قصيرة جدًا.\n- جهّز ملفك مسبقًا.\n- لا تتخل عن تكوينك الحالي قبل تأكيد تسجيلك.",
    source_label: "tawjihnet.net", source_url: "https://www.tawjihnet.net/"
  },
  {
    slug: "bac-2027-dates-examen-national",
    category: "orientation", published_at: "2026-10-19T09:00:00Z",
    title_fr: "Bac 2027 : l'examen national est prévu du 1er au 3 juin",
    title_ar: "باك 2027: الامتحان الوطني مقرر من 1 إلى 3 يونيو",
    excerpt_fr: "La session normale de l'examen national se tiendra du 1er au 3 juin 2027, le rattrapage du 1er au 3 juillet.",
    excerpt_ar: "الدورة العادية للامتحان الوطني من 1 إلى 3 يونيو 2027، والدورة الاستدراكية من 1 إلى 3 يوليوز.",
    body_fr: "Pour les élèves de 2ème année bac, les dates sont posées :\n\n- **Session normale : 1er au 3 juin 2027**\n- **Session de rattrapage : 1er au 3 juillet 2027**\n\n## Pourquoi c'est important pour ton orientation\n\nPour la plupart des écoles sélectives (ENSA, ENCG, médecine…), la note de présélection se calcule avec **75 % de l'examen national et 25 % de l'examen régional**. Le contrôle continu ne compte pas dans cette note. L'examen national pèse donc lourd : c'est lui qu'il faut préparer en priorité.\n\nUtilise le **simulateur Maslaki** pour voir où tu te situes par rapport aux seuils 2026.",
    body_ar: "بالنسبة لتلاميذ الثانية باك:\n\n- **الدورة العادية: من 1 إلى 3 يونيو 2027**\n- **الدورة الاستدراكية: من 1 إلى 3 يوليوز 2027**\n\n## لماذا هذا مهم لتوجيهك\n\nفي أغلب المدارس الانتقائية، تحتسب نقطة الانتقاء بـ **75% من الوطني و25% من الجهوي**، ولا تدخل المراقبة المستمرة. لذلك فالامتحان الوطني هو الأولوية.",
    source_label: "9rayti.com", source_url: "https://www.9rayti.com/article/bac-libre-maroc-dates-importantes-et-inscription"
  },
  {
    slug: "concours-enseignants-2026-ce-quon-sait",
    category: "recrutement", published_at: "2026-10-19T08:00:00Z",
    title_fr: "Concours des enseignants 2026 : ce que l'on sait avant l'avis officiel",
    title_ar: "مباراة الأساتذة 2026: ما نعرفه قبل الإعلان الرسمي",
    excerpt_fr: "L'avis officiel n'est pas encore publié. La session précédente s'était tenue en novembre.",
    excerpt_ar: "الإعلان الرسمي لم ينشر بعد. الدورة السابقة جرت في نونبر.",
    body_fr: "Le ministère n'a **pas encore publié l'avis officiel** du concours de recrutement des enseignants pour 2026. La session précédente avait eu lieu en novembre, mais cela ne garantit pas le même calendrier cette année.\n\n## En attendant\n\n- Aux sessions précédentes, une **licence** ou un diplôme équivalent reconnu était exigé.\n- L'âge maximum et les spécialités ouvertes seront confirmés dans l'avis.\n- N'utilise que les liens du ministère, des académies régionales ou du portail de l'emploi public.\n\nMaslaki mettra cet article à jour dès la publication de l'avis.",
    body_ar: "لم تنشر الوزارة **بعد الإعلان الرسمي** لمباراة توظيف الأساتذة لسنة 2026. الدورة السابقة جرت في نونبر، لكن ذلك لا يضمن نفس الجدولة.\n\n## في انتظار ذلك\n\n- في الدورات السابقة كانت **الإجازة** أو ما يعادلها مطلوبة.\n- السن الأقصى والتخصصات ستحدد في الإعلان.\n- اعتمد فقط على روابط الوزارة والأكاديميات.",
    source_label: "wadifapublic.ma", source_url: "https://www.wadifapublic.ma/fr/emploi-public/articles/tout-savoir-sur-le-prochain-concours-d-enseignement-primaire-2026"
  },
  {
    slug: "seuils-2026-ensa-encg-medecine",
    category: "concours", published_at: "2026-10-19T07:00:00Z",
    title_fr: "Seuils 2026 : ENSA, ENCG, Médecine, ISCAE… le récapitulatif",
    title_ar: "عتبات 2026: ENSA و ENCG والطب و ISCAE… الملخص",
    excerpt_fr: "Médecine à 12/20, ENSA à 12 (SM) et 14,5 (PC), ISCAE au-dessus de 17 : les seuils de présélection 2026 en un coup d'œil.",
    excerpt_ar: "الطب 12/20، ENSA بـ 12 (علوم رياضية) و14.5 (فيزياء)، ISCAE فوق 17: عتبات الانتقاء 2026.",
    body_fr: "Voici les principaux seuils de présélection de la session 2026, à garder en tête pour préparer 2027.\n\n- **Médecine, Pharmacie, Dentaire** : 12/20 (13/20 en 2024).\n- **ENSA** : 12 en Sciences Maths, 14,5 en PC, 15 en SVT et bac pro.\n- **ENCG** : 12 en Sciences Éco et Sciences Maths, 14 en PC et SVT.\n- **ENSAM** : 12,25 (Sciences Maths & Technologies), 16,17 (PC, SVT, bac pro).\n- **ISCAE** : 17,25 (18,05 en PC).\n- **Architecture (ENA)** : de 14,61 (Oujda) à 16,04 (Rabat).\n\n## Attention\n\nUn seuil de présélection n'est **pas** une admission : il te donne le droit de passer le concours. Les seuils peuvent aussi bouger d'une année à l'autre.\n\nCompare ta note à ces seuils avec le **simulateur Maslaki**.",
    body_ar: "أهم عتبات الانتقاء لدورة 2026:\n\n- **الطب والصيدلة وطب الأسنان**: 12/20.\n- **ENSA**: 12 علوم رياضية، 14.5 فيزياء، 15 علوم الحياة والأرض.\n- **ENCG**: 12 علوم اقتصادية ورياضية، 14 فيزياء وعلوم الحياة.\n- **ENSAM**: 12.25 و16.17.\n- **ISCAE**: 17.25 (18.05 فيزياء).\n- **الهندسة المعمارية**: من 14.61 (وجدة) إلى 16.04 (الرباط).\n\n## انتبه\n\nعتبة الانتقاء ليست قبولًا نهائيًا: إنها تمنحك حق اجتياز المباراة.",
    source_label: "orientation-chabab.com", source_url: "https://orientation-chabab.com/seuil"
  }
];
