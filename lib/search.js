import { SCHOOLS, CITY_AR } from "./schools";
import { DOMAINS } from "./data";

// Normalisation FR + AR : sans accents, diacritiques arabes, variantes d'alef/ya/ta marbuta
export function normalize(s = "") {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[ً-ْـ]/g, "").replace(/[إأآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
    .replace(/\s+/g, " ").trim();
}

const STOP = new Set(["seuil", "seuils", "ecole", "ecoles", "concours", "inscription", "le", "la", "les", "de", "des", "du", "d", "en", "au", "a", "عتبه", "عتبات", "مباراه", "مدرسه", "التسجيل", "في"]);

const INDEX = [
  ...SCHOOLS.map((s) => ({
    kind: s.kind, href: `/ecoles/${s.slug}`, fr: s.fr, ar: s.ar, badge: s.kind === "network" ? s.acronym : s.acronym.split(" ")[0],
    city: s.city, hay: normalize([s.acronym, s.fr, s.ar, s.city, s.city && CITY_AR[s.city], (s.careers || []).map((c) => c.fr + " " + c.ar).join(" ")].join(" "))
  })),
  ...DOMAINS.map((d) => ({ kind: "domain", href: `/ecoles?domaine=${d.slug}`, fr: d.fr, ar: d.ar, badge: "#", hay: normalize(d.fr + " " + d.ar) }))
];

export function search(query, limit = 8) {
  const tokens = normalize(query).split(" ").filter((t) => t && !STOP.has(t) && !/^\d{4}$/.test(t));
  if (!tokens.length) return [];
  return INDEX.map((e) => {
    let score = 0;
    for (const t of tokens) {
      const i = e.hay.indexOf(t);
      if (i === -1) return null;
      score += i === 0 ? 3 : e.hay.includes(" " + t) ? 2 : 1;
    }
    if (e.kind === "network") score += 1.5;
    if (e.kind === "domain") score += 0.5;
    return { ...e, score };
  }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, limit);
}
