// Lecture des contenus gérés depuis /admin (côté serveur uniquement).
// Si Supabase n'est pas configuré, ou si une table est vide / absente,
// le site utilise les données écrites dans le code (lib/concours.js, lib/data.js).
// Cache de 5 minutes ; l'admin vide le cache dès qu'il enregistre (étiquette "content").
import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { CONCOURS, UPDATED_AT } from "./concours";
import { ANNALES, QUIZZES } from "./data";
import { rowToConcours, rowsToQuizzes, rowToAnnale } from "./content-map";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const db = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;

const day = (iso) => (iso ? String(iso).slice(0, 10) : null);
const maxDay = (...days) => days.filter(Boolean).sort().pop() || null;

async function loadSite() {
  const fallback = { concours: CONCOURS, updatedAt: UPDATED_AT, seuils: [] };
  if (!db) return fallback;
  try {
    const [c, s, st] = await Promise.all([
      db.from("concours").select("*").eq("visible", true),
      db.from("seuils").select("*"),
      db.from("site_settings").select("value").eq("key", "concours_checked_at").maybeSingle()
    ]);
    const fromDb = !c.error && c.data?.length > 0;
    return {
      concours: fromDb ? c.data.map(rowToConcours) : CONCOURS,
      updatedAt: fromDb ? maxDay(...c.data.map((r) => day(r.updated_at)), day(st.data?.value)) : maxDay(UPDATED_AT, day(st.data?.value)),
      seuils: s.error ? [] : s.data || []
    };
  } catch {
    return fallback;
  }
}

async function loadPrep() {
  const fallback = { annales: ANNALES, quizzes: QUIZZES };
  if (!db) return fallback;
  try {
    const [a, q] = await Promise.all([
      db.from("annales").select("*").eq("visible", true).order("year", { ascending: false }),
      db.from("quizzes").select("*").eq("visible", true).order("sort").order("slug")
    ]);
    return {
      annales: !a.error && a.data?.length ? a.data.map(rowToAnnale) : ANNALES,
      quizzes: !q.error && q.data?.length ? rowsToQuizzes(q.data) : QUIZZES
    };
  } catch {
    return fallback;
  }
}

export const getSiteContent = unstable_cache(loadSite, ["site-content-v1"], { revalidate: 300, tags: ["content"] });
export const getPrepContent = unstable_cache(loadPrep, ["prep-content-v1"], { revalidate: 300, tags: ["content"] });
