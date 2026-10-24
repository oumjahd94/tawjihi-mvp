"use client";
// Petits composants et utilitaires partagés par les onglets de l'admin.
import { supabase } from "../../lib/supabase";
import { SCHOOLS } from "../../lib/schools";

export const slugify = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 90);

// Vide le cache du site pour que la modification soit visible tout de suite.
export async function revalidateSite(session, slug) {
  await fetch("/api/revalidate", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
    body: JSON.stringify({ slug })
  }).catch(() => {});
}

// Écoles proposées dans les listes déroulantes : réseaux + écoles autonomes (pas les 184 villes)
export const SCHOOL_OPTIONS = SCHOOLS
  .filter((s) => s.kind === "network" || !s.network)
  .map((s) => ({ value: s.slug, label: `${s.acronym} — ${s.fr}` }))
  .sort((a, b) => a.label.localeCompare(b.label, "fr"));

export function Msg({ msg }) {
  if (!msg) return null;
  const isError = /^erreur|impossible|échec/i.test(msg);
  return <p className={`mt-4 rounded-xl px-4 py-3 text-sm font-semibold ${isError ? "bg-coral-soft text-coral" : "bg-brand-50 text-brand-800"}`}>{msg}</p>;
}

export function Field({ label, hint, children, className = "" }) {
  return (
    <label className={`grid content-start gap-1.5 text-sm font-semibold ${className}`}>
      <span>{label}</span>
      {children}
      {hint && <span className="text-xs text-ink-faint font-normal">{hint}</span>}
    </label>
  );
}

export function Check({ label, checked, onChange, hint }) {
  return (
    <label className="flex items-start gap-2 text-sm font-semibold">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4 accent-brand-600" />
      <span>{label}{hint && <span className="block text-xs text-ink-faint font-normal">{hint}</span>}</span>
    </label>
  );
}

// Champ texte en deux langues côte à côte (FR / AR)
export function Bilingual({ label, fr, ar, onFr, onAr, rows = 1, required = false, hint }) {
  const Tag = rows > 1 ? "textarea" : "input";
  return (
    <div className="grid gap-1.5 text-sm font-semibold">
      <span>{label}{required && " *"}</span>
      <div className="grid md:grid-cols-2 gap-2">
        <Tag className="input" rows={rows > 1 ? rows : undefined} value={fr || ""} onChange={(e) => onFr(e.target.value)} placeholder="Français" />
        <Tag className="input" rows={rows > 1 ? rows : undefined} value={ar || ""} onChange={(e) => onAr(e.target.value)} placeholder="العربية" dir="rtl" />
      </div>
      {hint && <span className="text-xs text-ink-faint font-normal">{hint}</span>}
    </div>
  );
}

export function SchoolSelect({ value, onChange, allowEmpty = true, emptyLabel = "— Aucune (échéance générale) —" }) {
  return (
    <select className="input" value={value || ""} onChange={(e) => onChange(e.target.value || null)}>
      {allowEmpty && <option value="">{emptyLabel}</option>}
      {SCHOOL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

// Envoi d'un fichier dans un bucket Supabase Storage, renvoie son URL publique
export async function uploadFile(bucket, file, { maxMb = 20, types } = {}) {
  if (types && !types.includes(file.type)) throw new Error("Format non accepté.");
  if (file.size > maxMb * 1024 * 1024) throw new Error(`Fichier trop lourd (${maxMb} Mo maximum).`);
  const ext = file.name.split(".").pop().toLowerCase();
  const path = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, "")) || "fichier"}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type });
  if (error) throw new Error(error.message);
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

// Erreur Supabase → message compréhensible
export function explain(error) {
  const m = error?.message || String(error);
  if (/relation .* does not exist|could not find the table/i.test(m)) return "Erreur : la table n'existe pas encore. Exécute supabase/migration_v4_contenus.sql dans Supabase.";
  if (/duplicate key/i.test(m)) return "Erreur : cet identifiant existe déjà, choisis-en un autre.";
  if (/row-level security/i.test(m)) return "Erreur : action refusée (ton compte n'a pas le rôle admin).";
  return "Erreur : " + m;
}
