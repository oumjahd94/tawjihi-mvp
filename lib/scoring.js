// Calcul des notes et verdicts face aux seuils de présélection 2026.
// Un seuil de présélection est un MINIMUM pour passer le concours,
// pas une garantie d'admission : les libellés le disent clairement.

const round2 = (n) => Math.round(n * 100) / 100;

export function isFilled(g) {
  return !!g && [g.regional, g.cc, g.national].every((v) => typeof v === "number" && v >= 0 && v <= 20);
}

// Moyenne générale : 25 % contrôle continu + 25 % régional + 50 % national
export function bacAverage(g) {
  return isFilled(g) ? round2(0.25 * g.cc + 0.25 * g.regional + 0.5 * g.national) : null;
}

export function selectionScore(g, weights) {
  return isFilled(g) ? round2(weights.regional * g.regional + weights.cc * g.cc + weights.national * g.national) : null;
}

// Seuil sous forme { lo, hi, range } (une fourchette quand la source en donne une)
export function seuilFor(school, bac) {
  const v = school.seuil?.byBac?.[bac];
  if (v == null) return null;
  return Array.isArray(v) ? { lo: v[0], hi: v[1], range: true } : { lo: v, hi: v + 1, range: false };
}

export function verdict(school, bac, grades) {
  if (school.access === "ouvert") return { tier: "open" };
  if (school.bacs && !school.bacs.includes(bac)) return { tier: "na" };
  if (school.access === "cnc") return { tier: "cnc" };
  const s = seuilFor(school, bac);
  if (!s) return { tier: "noseuil" };
  const score = selectionScore(grades, school.weights);
  if (score == null) return { tier: "unknown", ...s };
  const margin = round2(score - s.lo);
  const tier = score >= s.hi ? "good" : score >= s.lo ? "ok" : score >= s.lo - 0.5 ? "close" : "below";
  // Remplissage visuel de la jauge (pas une probabilité)
  const fill = Math.round(Math.max(6, Math.min(100, 55 + margin * 22)));
  return { tier, score, margin, fill, ...s };
}

export const TIER_META = {
  good: { fr: "Au-dessus du seuil", ar: "فوق العتبة", color: "#0E7A5A", cls: "text-brand-700 bg-brand-50" },
  ok: { fr: "Juste au-dessus", ar: "فوق العتبة بقليل", color: "#C9962E", cls: "text-gold-700 bg-gold-50" },
  close: { fr: "Juste en dessous", ar: "تحت العتبة بقليل", color: "#C76A06", cls: "text-amber bg-amber-soft" },
  below: { fr: "En dessous du seuil", ar: "تحت العتبة", color: "#CF3F3F", cls: "text-coral bg-coral-soft" },
  open: { fr: "Accès ouvert", ar: "ولوج مفتوح", color: "#0E7A5A", cls: "text-brand-700 bg-brand-50" },
  noseuil: { fr: "Seuil non publié", ar: "عتبة غير منشورة", color: "#86948E", cls: "text-ink-soft bg-paper" },
  cnc: { fr: "Après CPGE (CNC)", ar: "بعد الأقسام التحضيرية", color: "#86948E", cls: "text-ink-soft bg-paper" },
  na: { fr: "Pas ouvert à ce bac", ar: "غير مفتوح لهذا الباك", color: "#86948E", cls: "text-ink-faint bg-paper" },
  unknown: { fr: "Entre tes notes", ar: "أدخل نقطك", color: "#86948E", cls: "text-ink-soft bg-paper" }
};

export function formulaLabel(w, t) {
  const parts = [];
  if (w.national) parts.push(`${w.national * 100}% ${t({ ar: "وطني", fr: "national" })}`);
  if (w.regional) parts.push(`${w.regional * 100}% ${t({ ar: "جهوي", fr: "régional" })}`);
  if (w.cc) parts.push(`${w.cc * 100}% ${t({ ar: "مراقبة مستمرة", fr: "contrôle continu" })}`);
  return parts.join(" + ");
}

export const fmt = (n) => (n == null ? "—" : Number(n).toFixed(2).replace(/\.00$/, ""));
export const fmtSeuil = (s) => (s ? (s.range ? `${fmt(s.lo)} – ${fmt(s.hi)}` : fmt(s.lo)) : "—");
