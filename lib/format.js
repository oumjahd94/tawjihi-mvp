export { schoolBySlug } from "./schools";
export { daysLeft } from "./concours";

export function formatDate(dateStr, lang, opts = { day: "numeric", month: "long", year: "numeric" }) {
  if (!dateStr) return "";
  const d = dateStr.length > 10 ? new Date(dateStr) : new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(lang === "ar" ? "ar-MA" : "fr-FR", opts);
}

export function feesLabel(s, t) {
  if (s.paid) return t({ ar: "مؤدى عنه · راجع الموقع الرسمي", fr: "Payant · voir le site officiel" });
  return t({ ar: "مجاني (عمومي)", fr: "Gratuit (public)" });
}

export const TYPE_META = {
  public: { fr: "Public", ar: "عمومي" },
  "semi-public": { fr: "Semi-public", ar: "شبه عمومي" },
  prive: { fr: "Privé reconnu", ar: "خاص معترف به" },
  militaire: { fr: "Militaire", ar: "عسكري" }
};

export const ACCESS_META = {
  "seuil+concours": { ar: "انتقاء أولي + مباراة", fr: "Présélection + concours" },
  seuil: { ar: "انتقاء حسب العتبة", fr: "Sélection sur seuil" },
  dossier: { ar: "دراسة الملف", fr: "Étude de dossier" },
  concours: { ar: "مباراة", fr: "Concours" },
  cnc: { ar: "بعد الأقسام التحضيرية (CNC)", fr: "Après CPGE (CNC)" },
  ouvert: { ar: "ولوج مفتوح", fr: "Accès ouvert" }
};
