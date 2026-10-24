"use client";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { ANNALES } from "../../lib/data";
import { annaleToRow } from "../../lib/content-map";
import { schoolBySlug } from "../../lib/schools";
import { revalidateSite, Msg, Field, Check, Bilingual, SchoolSelect, uploadFile, explain } from "./ui";

// Banque d'annales de la page « Prépa concours » (sujets et corrigés en PDF).

const EMPTY = { school: "", year: new Date().getFullYear(), title_fr: "", title_ar: "", file_url: "", corrige_url: "", quiz_slug: "", premium: false, visible: true };

export default function AnnalesAdmin({ session }) {
  const [rows, setRows] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const [a, q] = await Promise.all([
      supabase.from("annales").select("*").order("year", { ascending: false }).order("school"),
      supabase.from("quizzes").select("slug, title_fr")
    ]);
    if (a.error) { setMsg(explain(a.error)); setRows([]); return; }
    setRows(a.data);
    setQuizzes(q.data || []);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function done(text) { setMsg(text); setEditing(null); await revalidateSite(session); load(); }

  async function importCode() {
    const known = new Set(quizzes.map((q) => q.slug));
    const data = ANNALES.map((a) => ({ ...annaleToRow(a), quiz_slug: known.has(a.quiz) ? a.quiz : null }));
    const { error } = await supabase.from("annales").insert(data);
    done(error ? explain(error) : `${data.length} annales importées.${known.size ? "" : " Importe aussi les quiz (onglet Quiz) puis relie-les aux annales."}`);
  }

  async function toggleVisible(r) {
    const { error } = await supabase.from("annales").update({ visible: !r.visible }).eq("id", r.id);
    done(error ? explain(error) : r.visible ? "Annale masquée." : "Annale de nouveau visible.");
  }

  async function remove(r) {
    if (!confirm(`Supprimer « ${r.title_fr} (${r.year}) » ? Les fichiers PDF restent dans le stockage.`)) return;
    const { error } = await supabase.from("annales").delete().eq("id", r.id);
    done(error ? explain(error) : "Annale supprimée.");
  }

  if (editing) return <AnnaleEditor initial={editing} quizzes={quizzes} onCancel={() => setEditing(null)} onDone={done} />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Banque d'annales <span className="text-ink-faint">({rows?.length ?? "…"})</span></h1>
        <button onClick={() => setEditing({ ...EMPTY, _new: true })} className="btn-primary">+ Nouvelle annale</button>
      </div>
      <Msg msg={msg} />
      {rows && rows.length === 0 && (
        <div className="mt-6 card p-6">
          <p className="font-semibold">Aucune annale en base : le site affiche les {ANNALES.length} entrées écrites dans le code.</p>
          <p className="mt-1 text-sm text-ink-soft">Conseil : importe d'abord les quiz (onglet Quiz) pour que les liens « S'entraîner » soient conservés.</p>
          <button onClick={importCode} className="btn-primary mt-4">Importer les {ANNALES.length} annales actuelles</button>
        </div>
      )}
      {rows?.length > 0 && (
        <div className="mt-6 card divide-y divide-line overflow-hidden">
          {rows.map((r) => (
            <div key={r.id} className={`p-4 flex flex-wrap items-center gap-3 ${r.visible ? "" : "opacity-60"}`}>
              {r.premium && <span className="rounded-md bg-gold-50 text-gold-700 px-2 py-0.5 text-xs font-semibold">Premium</span>}
              {!r.visible && <span className="rounded-md px-2 py-0.5 text-xs font-semibold bg-paper text-ink-soft ring-1 ring-line">Masquée</span>}
              <div className="flex-1 min-w-[220px]">
                <p className="font-semibold">{r.title_fr}</p>
                <p className="text-xs text-ink-faint">
                  {schoolBySlug(r.school)?.acronym || r.school} · {r.year}
                  {r.file_url ? " · sujet PDF" : ""}{r.corrige_url ? " · corrigé PDF" : ""}{r.quiz_slug ? ` · quiz ${r.quiz_slug}` : ""}
                  {!r.file_url && !r.corrige_url && !r.quiz_slug && " · affiché « Bientôt »"}
                </p>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 w-full sm:w-auto">
                  <button onClick={() => setEditing(r)} className="text-sm font-semibold hover:text-brand-700">Modifier</button>
              <button onClick={() => toggleVisible(r)} className="text-sm font-semibold text-ink-soft hover:text-ink">{r.visible ? "Masquer" : "Afficher"}</button>
              <button onClick={() => remove(r)} className="text-sm font-semibold text-coral">Supprimer</button>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PdfField({ label, value, onChange, setError }) {
  const [busy, setBusy] = useState(false);
  async function pick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setError("");
    try { onChange(await uploadFile("annales", file, { maxMb: 20, types: ["application/pdf"] })); }
    catch (err) { setError("Échec de l'envoi : " + err.message); }
    setBusy(false);
    e.target.value = "";
  }
  return (
    <div className="grid gap-1.5 text-sm font-semibold">
      <span>{label}</span>
      {value ? (
        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-paper px-3 py-2 font-normal">
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:underline truncate max-w-[260px]">{value.split("/").pop()}</a>
          <button onClick={() => onChange("")} className="text-xs text-coral font-semibold">Retirer</button>
        </div>
      ) : (
        <>
          <input type="file" accept="application/pdf" onChange={pick} disabled={busy} className="text-sm font-normal" />
          <input className="input" type="url" placeholder="… ou colle un lien https:// vers le PDF officiel" onBlur={(e) => e.target.value && onChange(e.target.value)} />
        </>
      )}
      <span className="text-xs text-ink-faint font-normal">{busy ? "Envoi en cours…" : "PDF, 20 Mo maximum."}</span>
    </div>
  );
}

function AnnaleEditor({ initial, quizzes, onCancel, onDone }) {
  const isNew = !!initial._new;
  const [f, setF] = useState(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setF((x) => ({ ...x, [k]: v }));

  async function save() {
    setError("");
    if (!f.school) return setError("Choisis l'école.");
    if (!f.title_fr.trim()) return setError("Le titre en français est obligatoire.");
    const y = Number(f.year);
    if (!(y >= 1990 && y <= 2100)) return setError("Année invalide.");
    for (const k of ["file_url", "corrige_url"]) if (f[k] && !/^https?:\/\//.test(f[k])) return setError("Les liens PDF doivent commencer par https://");
    setBusy(true);
    const row = { school: f.school, year: y, title_fr: f.title_fr, title_ar: f.title_ar || null, file_url: f.file_url || null, corrige_url: f.corrige_url || null, quiz_slug: f.quiz_slug || null, premium: !!f.premium, visible: !!f.visible };
    const { error } = isNew ? await supabase.from("annales").insert(row) : await supabase.from("annales").update(row).eq("id", initial.id);
    setBusy(false);
    if (error) return setError(explain(error));
    onDone(isNew ? "Annale ajoutée. Elle est en ligne." : "Annale mise à jour.");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onCancel} className="text-sm font-semibold text-ink-soft hover:text-ink">← Retour à la liste</button>
        <button onClick={save} disabled={busy} className="btn-primary">{isNew ? "Ajouter" : "Enregistrer"}</button>
      </div>
      {error && <p className="mt-4 rounded-xl bg-coral-soft text-coral px-4 py-3 text-sm font-semibold">{error}</p>}

      <div className="mt-4 rounded-xl bg-gold-50 text-gold-700 px-4 py-3 text-sm">
        <b>Droits de diffusion :</b> publie seulement des sujets que l'école diffuse elle-même ou que tu as l'autorisation de partager. En cas de doute, mets plutôt le lien vers la page officielle.
      </div>

      <div className="mt-6 card p-6 grid gap-5">
        <div className="grid sm:grid-cols-[1fr_140px] gap-4">
          <Field label="École *"><SchoolSelect value={f.school} onChange={set("school")} emptyLabel="— Choisir —" /></Field>
          <Field label="Année *"><input type="number" className="input" value={f.year} onChange={(e) => set("year")(e.target.value)} /></Field>
        </div>
        <Bilingual label="Titre" required fr={f.title_fr} ar={f.title_ar} onFr={set("title_fr")} onAr={set("title_ar")} hint="Ex. « Concours ENSA — Maths & Physique »" />
        <div className="grid md:grid-cols-2 gap-5">
          <PdfField label="Sujet (PDF)" value={f.file_url} onChange={set("file_url")} setError={setError} />
          <PdfField label="Corrigé (PDF, facultatif)" value={f.corrige_url} onChange={set("corrige_url")} setError={setError} />
        </div>
        <Field label="Quiz d'entraînement associé (facultatif)" hint="Affiche un bouton « S'entraîner » à côté de l'annale.">
          <select className="input" value={f.quiz_slug || ""} onChange={(e) => set("quiz_slug")(e.target.value)}>
            <option value="">— Aucun —</option>
            {quizzes.map((q) => <option key={q.slug} value={q.slug}>{q.title_fr}</option>)}
          </select>
        </Field>
        <Check label="Premium" hint="Affiche un cadenas « Premium » : les fichiers ne sont pas proposés en téléchargement." checked={f.premium} onChange={set("premium")} />
        <Check label="Visible sur le site" checked={f.visible} onChange={set("visible")} />
      </div>
    </div>
  );
}
