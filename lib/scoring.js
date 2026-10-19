import { YEARS } from "./data";

const round2 = (n) => Math.round(n * 100) / 100;

// Moyenne générale du bac : 25 % contrôle continu + 25 % régional + 50 % national
export function bacAverage(g) {
  if (!isFilled(g)) return null;
  return round2(0.25 * g.cc + 0.25 * g.regional + 0.5 * g.national);
}

// Note de sélection selon la formule propre à chaque école
export function selectionScore(g, weights) {
  if (!isFilled(g)) return null;
  return round2(weights.regional * g.regional + weights.cc * g.cc + weights.national * g.national);
}

export function isFilled(g) {
  return g && [g.regional, g.cc, g.national].every((v) => typeof v === "number" && v >= 0 && v <= 20);
}

// Régression linéaire sur les 5 dernières années → seuil projeté pour l'année suivante
export function project(series) {
  const n = series.length;
  const xs = YEARS.slice(-n);
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = series.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  xs.forEach((x, i) => { num += (x - mx) * (series[i] - my); den += (x - mx) ** 2; });
  const slope = den ? num / den : 0;
  const next = my + slope * (xs[n - 1] + 1 - mx);
  const residuals = series.map((y, i) => y - (my + slope * (xs[i] - mx)));
  const std = Math.sqrt(residuals.reduce((a, r) => a + r * r, 0) / Math.max(n - 1, 1));
  return { next: round2(next), slope: round2(slope), sigma: Math.max(std, 0.3) };
}

// Fonction de répartition de la loi normale (approximation d'Abramowitz-Stegun)
function normalCdf(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

// Probabilité que la note dépasse le seuil de l'an prochain.
// estimated = note nationale estimée → on élargit l'incertitude.
export function chances(school, bac, grades, estimated = false) {
  if (school.access === "ouvert") return { tier: "open" };
  const series = school.thresholds?.[bac];
  if (!series?.length) return { tier: school.access === "dossier" ? "dossier" : "na" };
  const score = selectionScore(grades, school.weights);
  const proj = project(series);
  if (score == null) return { tier: "unknown", projected: proj.next, series };
  const sigma = proj.sigma + (estimated ? 0.4 : 0);
  const p = normalCdf((score - proj.next) / sigma);
  const prob = Math.round(Math.min(0.97, Math.max(0.03, p)) * 100);
  return {
    prob, score, projected: proj.next, slope: proj.slope, series,
    tier: prob >= 70 ? "green" : prob >= 35 ? "orange" : "red"
  };
}

export const TIER_META = {
  green: { fr: "Bonnes chances", ar: "حظوظ جيدة", color: "#0E9F77", cls: "text-mint bg-mint-soft" },
  orange: { fr: "Jouable", ar: "ممكن", color: "#E8970A", cls: "text-saffron bg-saffron-soft" },
  red: { fr: "Difficile", ar: "صعب", color: "#DE4747", cls: "text-coral bg-coral-soft" },
  open: { fr: "Accès ouvert", ar: "ولوج مفتوح", color: "#2F45D0", cls: "text-majorelle bg-majorelle-soft" },
  dossier: { fr: "Sur dossier", ar: "بالملف", color: "#2F45D0", cls: "text-majorelle bg-majorelle-soft" },
  na: { fr: "Non accessible avec ce bac", ar: "غير متاح لهذا الباك", color: "#8A8FA8", cls: "text-ink-faint bg-paper" },
  unknown: { fr: "Entre tes notes", ar: "أدخل نقطك", color: "#8A8FA8", cls: "text-ink-soft bg-paper" }
};

export function formulaLabel(w, t) {
  const parts = [];
  if (w.national) parts.push(`${w.national * 100}% ${t({ ar: "وطني", fr: "national" })}`);
  if (w.regional) parts.push(`${w.regional * 100}% ${t({ ar: "جهوي", fr: "régional" })}`);
  if (w.cc) parts.push(`${w.cc * 100}% ${t({ ar: "مراقبة مستمرة", fr: "contrôle continu" })}`);
  return parts.join(" + ");
}
