import { SCHOOLS } from "./data";

export const schoolBySlug = (slug) => SCHOOLS.find((s) => s.slug === slug);

export function daysLeft(dateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + "T00:00:00");
  return Math.round((d - today) / 86400000);
}

export function formatDate(dateStr, lang, opts = { day: "numeric", month: "long", year: "numeric" }) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString(lang === "ar" ? "ar-MA" : "fr-MA", opts);
}

export function feesLabel(fees, t) {
  if (!fees) return t({ ar: "مجاني (عمومي)", fr: "Gratuit (public)" });
  const [a, b] = fees;
  return `${a.toLocaleString("fr-MA")} – ${b.toLocaleString("fr-MA")} DH/${t({ ar: "سنة", fr: "an" })}`;
}

export const KIND_META = {
  open: { fr: "Ouverture", ar: "افتتاح" },
  close: { fr: "Clôture", ar: "آخر أجل" },
  exam: { fr: "Épreuve", ar: "اختبار" },
  results: { fr: "Résultats", ar: "نتائج" }
};
