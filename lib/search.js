import { SCHOOLS, DOMAINS } from "./data";

// Normalisation FR + AR : minuscules, sans accents, sans diacritiques arabes,
// variantes d'alef/ya/ta marbuta unifiées → "médecine", "medecine", "الطب" matchent.
export function normalize(s = "") {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[ً-ْـ]/g, "")
    .replace(/[إأآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
    .replace(/\s+/g, " ").trim();
}

// Mots qui ne disent rien de l'intention ("seuil ENSA 2026" → "ensa")
const STOP = new Set(["seuil", "seuils", "ecole", "ecoles", "concours", "inscription", "le", "la", "les", "de", "des", "du", "en", "au", "عتبه", "عتبات", "مباراه", "مدرسه", "التسجيل", "في"]);

function buildIndex() {
  const entries = [];
  for (const s of SCHOOLS) {
    entries.push({
      kind: "school", href: `/ecoles/${s.slug}`,
      fr: s.fr, ar: s.ar, badge: s.acronym,
      hay: normalize([s.acronym, s.fr, s.ar, s.cities.join(" "), s.careers.map((c) => c.fr + " " + c.ar).join(" ")].join(" "))
    });
  }
  for (const d of DOMAINS) {
    entries.push({ kind: "domain", href: `/ecoles?domaine=${d.slug}`, fr: d.fr, ar: d.ar, badge: "#", hay: normalize(d.fr + " " + d.ar) });
  }
  return entries;
}

const INDEX = buildIndex();

export function search(query, limit = 7) {
  const tokens = normalize(query).split(" ").filter((t) => t && !STOP.has(t) && !/^\d{4}$/.test(t));
  if (!tokens.length) return [];
  return INDEX
    .map((e) => {
      let score = 0;
      for (const t of tokens) {
        const i = e.hay.indexOf(t);
        if (i === -1) return null;                     // tous les mots doivent matcher
        score += i === 0 ? 3 : e.hay.includes(" " + t) ? 2 : 1;
      }
      if (e.kind === "school") score += 0.5;
      return { ...e, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
