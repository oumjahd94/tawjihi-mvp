// ============================================================
// CONCOURS & ÉCHÉANCES — mis à jour le 19 octobre 2026
// confirmed: true  = date publiée par une source (lien fourni)
// confirmed: false = date prévue, estimée d'après le calendrier 2026
// Les échéances passées disparaissent automatiquement de l'affichage.
// ============================================================

export const UPDATED_AT = "2026-10-19";

const TAWJIHNET = { label: "tawjihnet.net", url: "https://www.tawjihnet.net/" };
const BASED_2026 = { fr: "Prévu d'après le calendrier 2026, à confirmer", ar: "متوقع حسب جدولة 2026، في انتظار التأكيد" };

export const CATEGORIES = {
  postbac: { fr: "Concours post-bac", ar: "مباريات ما بعد الباك" },
  bac: { fr: "Baccalauréat", ar: "الباكالوريا" },
  etranger: { fr: "Études à l'étranger", ar: "الدراسة بالخارج" },
  bourse: { fr: "Bourses", ar: "المنح" },
  recrutement: { fr: "Recrutements", ar: "التوظيف" },
  resultats: { fr: "Résultats & listes d'attente", ar: "النتائج ولوائح الانتظار" }
};

export const CONCOURS = [
  // --- EN CE MOMENT ---
  {
    id: "campus-france-2027", cat: "etranger", school: null,
    fr: "Études en France (Campus France) — candidatures pour la rentrée 2027",
    ar: "الدراسة بفرنسا (كامبوس فرانس) — الترشيحات لدخول 2027",
    start: "2026-10-01", end: "2026-11-15", confirmed: true,
    source: { label: "Bladi.net", url: "https://www.bladi.net/etudes-france-candidatures-ouvrent-aujourd-hui-maroc-jusqu-novembre,124087.html" },
    note_fr: "Dépôt et paiement avant le 15 novembre à 23h59 (heure marocaine).", note_ar: "الإيداع والأداء قبل 15 نونبر على الساعة 23:59."
  },
  {
    id: "far-soldats-2026", cat: "recrutement", school: null,
    fr: "Forces Armées Royales — recrutement de soldats", ar: "القوات المسلحة الملكية — توظيف جنود",
    start: null, end: "2026-10-23", confirmed: true, source: TAWJIHNET
  },
  {
    id: "medecine-la-2026", cat: "resultats", school: "medecine",
    fr: "Médecine, Pharmacie, Dentaire — listes d'attente 2026-2027", ar: "الطب والصيدلة وطب الأسنان — لوائح الانتظار 2026-2027",
    start: "2026-08-04", end: null, ongoing: true, confirmed: true, source: TAWJIHNET
  },
  {
    id: "ispits-la-2026", cat: "resultats", school: "ispits",
    fr: "ISPITS — listes d'attente et oraux", ar: "ISPITS — لوائح الانتظار والشفوي",
    start: "2026-09-01", end: null, ongoing: true, confirmed: true, source: TAWJIHNET
  },
  {
    id: "licence-inscriptions-2026", cat: "resultats", school: "universites",
    fr: "Universités — inscriptions en licence (accès ouvert)", ar: "الجامعات — التسجيل في الإجازة (ولوج مفتوح)",
    start: "2026-09-01", end: null, ongoing: true, confirmed: true, source: TAWJIHNET,
    note_fr: "Dates propres à chaque université : vérifie le site de la tienne.", note_ar: "التواريخ خاصة بكل جامعة."
  },
  {
    id: "enseignants-2026", cat: "recrutement", school: null,
    fr: "Concours de recrutement des enseignants (académies)", ar: "مباراة توظيف الأساتذة (الأكاديميات)",
    start: "2026-11-01", end: null, confirmed: false,
    basis: { fr: "Avis officiel pas encore publié ; la session précédente avait lieu en novembre", ar: "الإعلان الرسمي لم يصدر بعد؛ الدورة السابقة كانت في نونبر" },
    source: { label: "wadifapublic.ma", url: "https://www.wadifapublic.ma/fr/emploi-public/articles/tout-savoir-sur-le-prochain-concours-d-enseignement-primaire-2026" }
  },
  {
    id: "bac-libre-2027", cat: "bac", school: null,
    fr: "Bac 2027 — inscription des candidats libres", ar: "باك 2027 — تسجيل المترشحين الأحرار",
    start: "2026-11-15", end: null, confirmed: false,
    basis: { fr: "Dates pas encore annoncées ; inscription sur candidaturesbac.men.gov.ma", ar: "التواريخ لم تعلن بعد؛ التسجيل عبر candidaturesbac.men.gov.ma" },
    source: { label: "candidaturesbac.men.gov.ma", url: "https://candidaturesbac.men.gov.ma/FrontPage" }
  },
  // --- SAISON 2027 ---
  {
    id: "bac-regional-2027", cat: "bac", school: null,
    fr: "Examen régional (1ère année bac) — session normale", ar: "الامتحان الجهوي (الأولى باك) — الدورة العادية",
    start: "2027-06-01", end: "2027-06-02", confirmed: false, basis: BASED_2026,
    source: { label: "dreamjob.ma (calendrier 2026)", url: "https://www.dreamjob.ma/orientation/dates-examens-scolaires-maroc/" }
  },
  {
    id: "bac-national-2027", cat: "bac", school: null,
    fr: "Examen national du Bac 2027 — session normale", ar: "الامتحان الوطني لباك 2027 — الدورة العادية",
    start: "2027-06-01", end: "2027-06-03", confirmed: true,
    source: { label: "9rayti.com", url: "https://www.9rayti.com/article/bac-libre-maroc-dates-importantes-et-inscription" }
  },
  {
    id: "cpge-2027", cat: "postbac", school: "cpge",
    fr: "CPGE — candidatures sur cpge.ac.ma", ar: "الأقسام التحضيرية — الترشيح عبر cpge.ac.ma",
    start: "2027-05-15", end: "2027-06-22", confirmed: false, basis: BASED_2026, source: TAWJIHNET
  },
  {
    id: "medecine-2027", cat: "postbac", school: "medecine",
    fr: "Médecine, Pharmacie, Dentaire — préinscription (cursussup)", ar: "الطب والصيدلة وطب الأسنان — التسجيل القبلي",
    start: "2027-06-19", end: "2027-07-10", confirmed: false, basis: BASED_2026,
    source: { label: "Calendrier 2026 (Morocco World News)", url: "https://www.moroccoworldnews.com/2026/06/324068/morocco-opens-7340-medical-school-places-for-2026-sets-12-20-threshold/" }
  },
  {
    id: "ensa-2027", cat: "postbac", school: "ensa",
    fr: "ENSA — préinscription et classement des choix (cursussup)", ar: "ENSA — التسجيل القبلي وترتيب الاختيارات",
    start: "2027-06-19", end: "2027-07-10", confirmed: false, basis: BASED_2026,
    source: { label: "Note ENSA 2026", url: "https://ensa.uit.ac.ma/wp-content/uploads/2026/06/Note-ENSA_2026_2027.pdf" }
  },
  {
    id: "ensam-2027", cat: "postbac", school: "ensam",
    fr: "ENSAM — préinscription (cursussup)", ar: "ENSAM — التسجيل القبلي",
    start: "2027-06-19", end: "2027-07-10", confirmed: false, basis: BASED_2026, source: TAWJIHNET
  },
  {
    id: "encg-2027", cat: "postbac", school: "encg",
    fr: "ENCG — préinscription au concours TAFEM (cursussup)", ar: "ENCG — التسجيل في مباراة TAFEM",
    start: "2027-06-19", end: "2027-07-10", confirmed: false, basis: BASED_2026, source: TAWJIHNET
  },
  {
    id: "ena-2027", cat: "postbac", school: "ena",
    fr: "Écoles d'Architecture (ENA) — candidature", ar: "المدارس الوطنية للهندسة المعمارية — الترشيح",
    start: "2027-06-19", end: "2027-07-10", confirmed: false, basis: BASED_2026, source: TAWJIHNET
  },
  {
    id: "ispits-2027", cat: "postbac", school: "ispits",
    fr: "ISPITS — candidature au concours", ar: "ISPITS — الترشيح للمباراة",
    start: "2027-06-20", end: "2027-07-13", confirmed: false, basis: BASED_2026, source: TAWJIHNET
  },
  {
    id: "est-fst-2027", cat: "postbac", school: "est",
    fr: "EST & FST — candidature (cursussup)", ar: "EST و FST — الترشيح",
    start: "2027-06-20", end: "2027-08-23", confirmed: false, basis: BASED_2026, source: TAWJIHNET
  },
  {
    id: "ens-esef-2027", cat: "postbac", school: "ens",
    fr: "ENS & ESEF — licences d'éducation, candidature", ar: "ENS و ESEF — إجازات التربية، الترشيح",
    start: "2027-06-20", end: "2027-08-23", confirmed: false, basis: BASED_2026, source: TAWJIHNET
  }
];

const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const asDate = (s) => (s ? new Date(s + "T00:00:00") : null);

// open | ongoing | upcoming | closed
export function statusOf(c) {
  const t = today(), s = asDate(c.start), e = asDate(c.end);
  if (e && e < t) return "closed";
  if (c.ongoing) return "ongoing";
  if (s && s > t) return "upcoming";
  return "open";
}

export function daysLeft(dateStr) {
  return Math.round((asDate(dateStr) - today()) / 86400000);
}

// Les échéances encore utiles, triées : ouvert → en cours → à venir
export function activeConcours(list = CONCOURS) {
  const rank = { open: 0, ongoing: 1, upcoming: 2 };
  return list
    .map((c) => ({ ...c, status: statusOf(c) }))
    .filter((c) => c.status !== "closed")
    .sort((a, b) => rank[a.status] - rank[b.status] || (a.end || a.start || "9").localeCompare(b.end || b.start || "9"));
}

export const STATUS_META = {
  open: { fr: "Ouvert", ar: "مفتوح", cls: "bg-emerald-600 text-white" },
  ongoing: { fr: "En cours", ar: "جارٍ", cls: "bg-gold-100 text-gold-700" },
  upcoming: { fr: "À venir", ar: "قادم", cls: "bg-paper text-ink-soft ring-1 ring-line" },
  closed: { fr: "Clôturé", ar: "مغلق", cls: "bg-paper text-ink-faint" }
};
