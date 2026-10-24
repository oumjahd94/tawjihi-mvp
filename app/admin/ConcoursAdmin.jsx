"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { CONCOURS, UPDATED_AT, CATEGORIES, STATUS_META, statusOf } from "../../lib/concours";
import { rowToConcours, concoursToRow } from "../../lib/content-map";
import { schoolBySlug } from "../../lib/schools";
import ConcoursRow from "../../components/ConcoursRow";
import { slugify, revalidateSite, Msg, Field, Check, Bilingual, SchoolSelect, explain } from "./ui";

// Concours & échéances : ce qui s'affiche dans « En ce moment » (accueil),
// la page /concours, les fiches écoles et le calendrier de l'espace élève.

const EMPTY = { id: "", cat: "postbac", school: null, title_fr: "", title_ar: "", start_date: "", end_date: "", ongoing: false, confirmed: true, basis_fr: "", basis_ar: "", note_fr: "", note_ar: "", source_label: "", source_url: "", visible: true };
const todayStr = () => new Date().toISOString().slice(0, 10);
const fmt = (d) => (d ? new Date(d + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : null);

export default function ConcoursAdmin({ session }) {
  const [rows, setRows] = useState(null);
  const [checkedAt, setCheckedAt] = useState(null);
  const [filter, setFilter] = useState("active");
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const [{ data, error }, st] = await Promise.all([
      supabase.from("concours").select("*"),
      supabase.from("site_settings").select("value").eq("key", "concours_checked_at").maybeSingle()
    ]);
    if (error) { setMsg(explain(error)); setRows([]); return; }
    setRows(data);
    setCheckedAt(st.data?.value || null);
  }, []);
  useEffect(() => { load(); }, [load]);

  const list = useMemo(() => {
    const rank = { open: 0, ongoing: 1, upcoming: 2, closed: 3 };
    return (rows || [])
      .map((r) => ({ r, c: rowToConcours(r), status: statusOf(rowToConcours(r)) }))
      .filter(({ status }) => filter === "all" || (filter === "closed" ? status === "closed" : status !== "closed"))
      .sort((a, b) => rank[a.status] - rank[b.status] || (a.r.end_date || a.r.start_date || "9").localeCompare(b.r.end_date || b.r.start_date || "9"));
  }, [rows, filter]);

  const lastEdit = useMemo(() => [...(rows || []).map((r) => r.updated_at?.slice(0, 10)), checkedAt].filter(Boolean).sort().pop(), [rows, checkedAt]);

  async function done(text) {
    setMsg(text);
    await revalidateSite(session);
    load();
  }

  async function importCode() {
    // Les lignes gardent la date de vérification d'origine : importer ne « rajeunit » pas les données.
    const stamp = UPDATED_AT + "T12:00:00Z";
    const data = CONCOURS.map((c) => ({ ...concoursToRow(c), updated_at: stamp }));
    const { error } = await supabase.from("concours").insert(data);
    done(error ? explain(error) : `${data.length} échéances importées. Elles sont maintenant modifiables ici.`);
  }

  async function markChecked() {
    const { error } = await supabase.from("site_settings").upsert({ key: "concours_checked_at", value: todayStr() });
    done(error ? explain(error) : "C'est noté : le site affiche « Mis à jour » à la date d'aujourd'hui.");
  }

  async function toggleVisible(r) {
    const { error } = await supabase.from("concours").update({ visible: !r.visible }).eq("id", r.id);
    done(error ? explain(error) : r.visible ? "Échéance masquée du site." : "Échéance de nouveau visible.");
  }

  async function remove(r) {
    if (!confirm(`Supprimer définitivement « ${r.title_fr} » ?`)) return;
    const { error } = await supabase.from("concours").delete().eq("id", r.id);
    done(error ? explain(error) : "Échéance supprimée.");
  }

  function duplicate(r) {
    const next = (d) => (d ? String(Number(d.slice(0, 4)) + 1) + d.slice(4) : "");
    const bumped = r.id.replace(/20\d\d/g, (y) => String(Number(y) + 1));
    setEditing({ ...r, id: bumped !== r.id ? bumped : `${r.id}-2`, created_at: undefined, updated_at: undefined, start_date: next(r.start_date), end_date: next(r.end_date), confirmed: false, basis_fr: "Prévu d'après le calendrier de l'année précédente, à confirmer", basis_ar: "متوقع حسب جدولة السنة الماضية، في انتظار التأكيد", _new: true });
  }

  if (editing) {
    return <ConcoursEditor initial={editing} onCancel={() => setEditing(null)} onSaved={(t) => { setEditing(null); done(t); }} />;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Concours & échéances <span className="text-ink-faint">({rows?.length ?? "…"})</span></h1>
          <p className="mt-1 text-sm text-ink-soft">
            Affiché sur le site : « Mis à jour le {lastEdit ? fmt(lastEdit) : fmt(UPDATED_AT)} ». Cette date change quand tu modifies une échéance ou cliques sur « Tout est vérifié ».
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {rows?.length > 0 && <button onClick={markChecked} className="btn-ghost" title="Tu as relu la liste et rien n'a changé">✓ Tout est vérifié aujourd'hui</button>}
          <button onClick={() => setEditing({ ...EMPTY, _new: true })} className="btn-primary">+ Nouvelle échéance</button>
        </div>
      </div>
      <Msg msg={msg} />

      {rows && rows.length === 0 && (
        <div className="mt-6 card p-6">
          <p className="font-semibold">La liste est vide : le site affiche pour l'instant les {CONCOURS.length} échéances écrites dans le code.</p>
          <p className="mt-1 text-sm text-ink-soft">Importe-les une fois pour pouvoir les modifier ici. Ensuite, c'est cette liste qui fait foi.</p>
          <button onClick={importCode} className="btn-primary mt-4">Importer les {CONCOURS.length} échéances actuelles</button>
        </div>
      )}

      {rows?.length > 0 && (
        <>
          <div className="mt-6 flex gap-2">
            {[["active", "En cours et à venir"], ["closed", "Clôturées"], ["all", "Toutes"]].map(([k, l]) => (
              <button key={k} onClick={() => setFilter(k)} className={`chip ${filter === k ? "chip-on" : ""}`}>{l}</button>
            ))}
          </div>
          <div className="mt-4 card divide-y divide-line overflow-hidden">
            {list.length === 0 && <p className="p-6 text-ink-soft">Rien dans cette catégorie.</p>}
            {list.map(({ r, status }) => (
              <div key={r.id} className={`p-4 flex flex-wrap items-center gap-3 ${r.visible ? "" : "opacity-60"}`}>
                <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${STATUS_META[status].cls}`}>{STATUS_META[status].fr}</span>
                {!r.confirmed && <span className="rounded-md px-2 py-0.5 text-xs font-semibold bg-gold-50 text-gold-700">À confirmer</span>}
                {!r.visible && <span className="rounded-md px-2 py-0.5 text-xs font-semibold bg-paper text-ink-soft ring-1 ring-line">Masquée</span>}
                <div className="flex-1 min-w-[220px]">
                  <p className="font-semibold leading-snug">{r.title_fr}</p>
                  <p className="text-xs text-ink-faint">
                    {CATEGORIES[r.cat]?.fr}
                    {r.school && ` · ${schoolBySlug(r.school)?.acronym || r.school}`}
                    {r.ongoing ? " · en cours" : ""}
                    {r.start_date && ` · du ${fmt(r.start_date)}`}
                    {r.end_date && ` · jusqu'au ${fmt(r.end_date)}`}
                    {!r.source_url && <span className="text-coral"> · sans source</span>}
                  </p>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 w-full sm:w-auto">
                  <button onClick={() => setEditing(r)} className="text-sm font-semibold hover:text-brand-700">Modifier</button>
                <button onClick={() => duplicate(r)} className="text-sm font-semibold text-ink-soft hover:text-brand-700" title="Crée une copie pour l'année suivante">Dupliquer +1 an</button>
                <button onClick={() => toggleVisible(r)} className="text-sm font-semibold text-ink-soft hover:text-ink">{r.visible ? "Masquer" : "Afficher"}</button>
                <button onClick={() => remove(r)} className="text-sm font-semibold text-coral">Supprimer</button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-ink-faint">Une échéance dont la date limite est passée disparaît automatiquement du site (filtre « Clôturées » ici). Tu peux la garder pour la dupliquer l'année suivante.</p>
        </>
      )}
    </div>
  );
}

function ConcoursEditor({ initial, onCancel, onSaved }) {
  const isNew = !!initial._new;
  const [f, setF] = useState(() => { const x = { ...initial }; delete x._new; return x; });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setF((x) => ({ ...x, [k]: v }));
  const preview = useMemo(() => { const c = rowToConcours({ ...f, start_date: f.start_date || null, end_date: f.end_date || null }); return { ...c, status: statusOf(c) }; }, [f]);

  async function save() {
    setError("");
    const id = f.id || slugify(f.title_fr);
    if (!f.title_fr.trim()) return setError("Le titre en français est obligatoire.");
    if (!id) return setError("Identifiant invalide.");
    if (!f.start_date && !f.end_date && !f.ongoing) return setError("Indique au moins une date (début ou limite), ou coche « En cours ».");
    if (f.start_date && f.end_date && f.end_date < f.start_date) return setError("La date limite est avant la date de début.");
    if (f.confirmed && !f.source_url) return setError("Une date confirmée doit avoir sa source (lien officiel ou article).");
    if (f.source_url && !/^https?:\/\//.test(f.source_url)) return setError("Le lien source doit commencer par https://");
    setBusy(true);
    const row = { ...f, id };
    delete row.created_at; delete row.updated_at;
    for (const k of ["start_date", "end_date", "title_ar", "basis_fr", "basis_ar", "note_fr", "note_ar", "source_label", "source_url"]) if (row[k] === "") row[k] = null;
    if (row.confirmed) { row.basis_fr = null; row.basis_ar = null; }
    const { error } = isNew ? await supabase.from("concours").insert(row) : await supabase.from("concours").update(row).eq("id", initial.id);
    setBusy(false);
    if (error) return setError(explain(error));
    onSaved(isNew ? "Échéance ajoutée. Elle est en ligne." : "Échéance mise à jour.");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onCancel} className="text-sm font-semibold text-ink-soft hover:text-ink">← Retour à la liste</button>
        <button onClick={save} disabled={busy} className="btn-primary">{isNew ? "Ajouter" : "Enregistrer"}</button>
      </div>
      {error && <p className="mt-4 rounded-xl bg-coral-soft text-coral px-4 py-3 text-sm font-semibold">{error}</p>}

      <div className="mt-6 grid lg:grid-cols-[1fr_340px] gap-6 items-start">
        <div className="card p-6 grid gap-5 min-w-0">
          <Bilingual label="Intitulé" required fr={f.title_fr} ar={f.title_ar} onFr={(v) => setF((x) => ({ ...x, title_fr: v, ...(isNew ? { id: slugify(v) } : {}) }))} onAr={set("title_ar")}
            hint="Ex. « ENSA — préinscription et classement des choix (cursussup) »" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Catégorie">
              <select className="input" value={f.cat} onChange={(e) => set("cat")(e.target.value)}>
                {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.fr}</option>)}
              </select>
            </Field>
            <Field label="École concernée" hint="Relie l'échéance à la fiche école et aux alertes des élèves qui la suivent.">
              <SchoolSelect value={f.school} onChange={set("school")} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Début (ouverture)" hint="Facultatif">
              <input type="date" className="input" value={f.start_date || ""} onChange={(e) => set("start_date")(e.target.value)} />
            </Field>
            <Field label="Date limite" hint="Le compte à rebours J-x se base sur cette date.">
              <input type="date" className="input" value={f.end_date || ""} onChange={(e) => set("end_date")(e.target.value)} />
            </Field>
          </div>
          <Check label="En cours, sans date de fin" hint="Pour les listes d'attente, résultats publiés au fil de l'eau…" checked={f.ongoing} onChange={set("ongoing")} />
          <Check label="Date confirmée par une source officielle" hint="Sinon le site affiche « À confirmer »." checked={f.confirmed} onChange={set("confirmed")} />
          {!f.confirmed && (
            <Bilingual label="Pourquoi c'est à confirmer" fr={f.basis_fr} ar={f.basis_ar} onFr={set("basis_fr")} onAr={set("basis_ar")}
              hint="Ex. « Prévu d'après le calendrier 2026, à confirmer »" />
          )}
          <Bilingual label="Note (facultatif)" rows={2} fr={f.note_fr} ar={f.note_ar} onFr={set("note_fr")} onAr={set("note_ar")}
            hint="Ex. « Dépôt et paiement avant le 15 novembre à 23h59 »" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Source (nom)"><input className="input" value={f.source_label || ""} onChange={(e) => set("source_label")(e.target.value)} placeholder="ex. Ministère, cursussup.gov.ma" /></Field>
            <Field label={`Source (lien)${f.confirmed ? " *" : ""}`}><input className="input" type="url" value={f.source_url || ""} onChange={(e) => set("source_url")(e.target.value)} placeholder="https://…" /></Field>
          </div>
          <Check label="Visible sur le site" checked={f.visible} onChange={set("visible")} />
          <Field label="Identifiant" hint="Généré à partir du titre. Ne change pas une fois créé.">
            <input className="input font-mono text-sm" value={f.id} disabled={!isNew} onChange={(e) => set("id")(slugify(e.target.value))} />
          </Field>
        </div>

        <aside className="card overflow-hidden lg:sticky lg:top-6">
          <p className="px-4 pt-4 text-sm font-semibold text-ink-soft">Aperçu sur le site</p>
          {f.title_fr ? <ConcoursRow c={preview} showSource /> : <p className="p-4 text-sm text-ink-faint">Saisis un intitulé pour voir l'aperçu.</p>}
          {preview.status === "closed" && <p className="px-4 pb-4 text-xs text-coral font-semibold">Date limite passée : cette échéance ne s'affichera pas sur le site.</p>}
        </aside>
      </div>
    </div>
  );
}
