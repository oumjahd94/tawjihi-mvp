"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import { SCHOOLS } from "../../lib/schools";
import { BAC_TYPES } from "../../lib/data";
import { fmtSeuil, seuilFor } from "../../lib/scoring";
import { revalidateSite, Msg, Field, Check, Bilingual, explain } from "./ui";

// Seuils de présélection : les valeurs du code servent de base,
// une correction faite ici les remplace sur la fiche école et dans le simulateur.

const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const ELIGIBLE = SCHOOLS.filter((s) => String(s.access).includes("seuil"));
const BAC_LABEL = Object.fromEntries(BAC_TYPES.map((b) => [b.code, b.fr]));

// "12" → 12 ; "13,3 - 14,8" → [13.3, 14.8] ; "" → undefined ; invalide → NaN
function parseValue(raw) {
  const txt = String(raw ?? "").trim().replace(/,/g, ".");
  if (!txt) return undefined;
  const parts = txt.split(/\s*[-–]\s*/).map(Number);
  if (parts.some((n) => Number.isNaN(n) || n < 0 || n > 20) || parts.length > 2) return NaN;
  if (parts.length === 2) return parts[0] <= parts[1] ? parts : NaN;
  return parts[0];
}
const showValue = (v) => (v == null ? "" : Array.isArray(v) ? `${v[0]} - ${v[1]}` : String(v));
const summary = (byBac) => Object.entries(byBac || {}).map(([b, v]) => `${b} ${Array.isArray(v) ? `${v[0]}–${v[1]}` : v}`).join(" · ");

export default function SeuilsAdmin({ session }) {
  const [rows, setRows] = useState(null);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("seuils").select("*");
    if (error) { setMsg(explain(error)); setRows([]); return; }
    setRows(data);
  }, []);
  useEffect(() => { load(); }, [load]);

  const overrides = useMemo(() => Object.fromEntries((rows || []).map((r) => [r.school_slug, r])), [rows]);

  const list = useMemo(() => {
    const nq = norm(q);
    return ELIGIBLE
      .filter((s) => (nq ? norm(`${s.acronym} ${s.fr} ${s.city || ""}`).includes(nq) : s.seuil || overrides[s.slug]))
      // un établissement qui hérite du seuil de son réseau se modifie via le réseau
      .filter((s) => nq || overrides[s.slug] || !s.network || s.seuil !== SCHOOLS.find((n) => n.slug === s.network)?.seuil)
      .slice(0, 80);
  }, [q, overrides]);

  async function done(text) { setMsg(text); setEditing(null); await revalidateSite(session); load(); }

  if (editing) return <SeuilEditor school={editing} override={overrides[editing.slug]} onCancel={() => setEditing(null)} onDone={done} />;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Seuils de présélection</h1>
      <p className="mt-1 text-sm text-ink-soft max-w-3xl">
        Les seuils s'affichent sur les fiches écoles et servent au simulateur. Corrige-les ici dès qu'une source publie les nouveaux chiffres.
        Un seuil saisi sur un réseau (ex. ENSA) s'applique à tous ses établissements, sauf ceux qui ont leur propre seuil.
      </p>
      <Msg msg={msg} />
      <input className="input mt-6 max-w-md" placeholder="Chercher une école (ex. ENCG, ISCAE, Agadir)…" value={q} onChange={(e) => setQ(e.target.value)} />
      <p className="mt-2 text-xs text-ink-faint">{q ? "Résultats de la recherche (toutes les écoles avec présélection)." : "Écoles qui ont un seuil publié. Cherche une école pour lui en ajouter un."}</p>

      <div className="mt-4 card divide-y divide-line overflow-hidden">
        {list.length === 0 && <p className="p-6 text-ink-soft">Aucune école trouvée.</p>}
        {list.map((s) => {
          const o = overrides[s.slug];
          const value = o ? (Object.keys(o.by_bac || {}).length ? `${o.year} · ${summary(o.by_bac)}` : "Masqué (non publié)") : s.seuil ? `${s.seuil.year} · ${summary(s.seuil.byBac)}` : "Pas de seuil";
          return (
            <div key={s.slug} className="p-4 flex flex-wrap items-center gap-3">
              {o && <span className="rounded-md bg-brand-600 text-white px-2 py-0.5 text-xs font-semibold">Corrigé</span>}
              <div className="flex-1 min-w-[220px]">
                <p className="font-semibold">{s.acronym} <span className="font-normal text-ink-soft">— {s.kind === "network" ? (s.count ? `réseau (${s.count} établissements)` : s.fr) : s.fr}</span></p>
                <p className="text-xs text-ink-faint" dir="ltr" style={{ textAlign: "start" }}>{value}</p>
              </div>
              <button onClick={() => setEditing(s)} className="text-sm font-semibold hover:text-brand-700">{s.seuil || o ? "Modifier" : "Ajouter un seuil"}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SeuilEditor({ school, override, onCancel, onDone }) {
  const base = school.seuil;
  const bacs = school.bacs || BAC_TYPES.map((b) => b.code);
  const start = override || (base ? { year: base.year, by_bac: base.byBac, source_label: base.source?.label, source_url: base.source?.url, note_fr: base.note_fr, note_ar: base.note_ar } : { year: new Date().getFullYear(), by_bac: {} });
  const [year, setYear] = useState(start.year);
  const [values, setValues] = useState(() => Object.fromEntries(bacs.map((b) => [b, showValue(start.by_bac?.[b])])));
  const [hidden, setHidden] = useState(!!override && !Object.keys(override.by_bac || {}).length);
  const [source, setSource] = useState({ label: start.source_label || "", url: start.source_url || "" });
  const [note, setNote] = useState({ fr: start.note_fr || "", ar: start.note_ar || "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function save() {
    setError("");
    const byBac = {};
    if (!hidden) {
      for (const b of bacs) {
        const v = parseValue(values[b]);
        if (Number.isNaN(v)) return setError(`Valeur invalide pour ${b} : écris une note (ex. 12,5) ou une fourchette (ex. 13,3 - 14,8), entre 0 et 20.`);
        if (v !== undefined) byBac[b] = v;
      }
      if (!Object.keys(byBac).length) return setError("Saisis au moins un seuil, ou coche « Seuil non publié ».");
    }
    if (!/^https?:\/\//.test(source.url)) return setError("La source (lien https://…) est obligatoire : chaque seuil affiché doit être vérifiable.");
    const y = Number(year);
    if (!(y >= 2020 && y <= 2100)) return setError("Année invalide.");
    setBusy(true);
    const { error } = await supabase.from("seuils").upsert({
      school_slug: school.slug, year: y, by_bac: byBac,
      source_label: source.label || null, source_url: source.url,
      note_fr: note.fr || null, note_ar: note.ar || null
    });
    setBusy(false);
    if (error) return setError(explain(error));
    onDone(`Seuil de ${school.acronym} enregistré. Fiche et simulateur mis à jour.`);
  }

  async function reset() {
    if (!confirm(`Revenir au seuil d'origine de ${school.acronym} ?`)) return;
    setBusy(true);
    const { error } = await supabase.from("seuils").delete().eq("school_slug", school.slug);
    setBusy(false);
    if (error) return setError(explain(error));
    onDone(`${school.acronym} : seuil d'origine rétabli.`);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onCancel} className="text-sm font-semibold text-ink-soft hover:text-ink">← Retour à la liste</button>
        <div className="flex gap-2">
          {override && <button onClick={reset} disabled={busy} className="btn-ghost">Revenir au seuil d'origine</button>}
          <button onClick={save} disabled={busy} className="btn-primary">Enregistrer</button>
        </div>
      </div>
      {error && <p className="mt-4 rounded-xl bg-coral-soft text-coral px-4 py-3 text-sm font-semibold">{error}</p>}

      <div className="mt-6 grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="card p-6 grid gap-5 min-w-0">
          <div>
            <h1 className="text-xl font-semibold">{school.acronym}</h1>
            <p className="text-sm text-ink-soft">{school.fr}{school.kind === "network" && school.count > 0 && ` · s'applique aux ${school.count} établissements du réseau`}</p>
          </div>
          <Field label="Année du seuil" className="max-w-[160px]">
            <input type="number" className="input" value={year} onChange={(e) => setYear(e.target.value)} />
          </Field>
          <Check label="Seuil non publié cette année" hint="Le site affichera « Seuil non publié » au lieu d'un chiffre." checked={hidden} onChange={setHidden} />
          {!hidden && (
            <div className="grid gap-2">
              <p className="text-sm font-semibold">Seuil par type de bac <span className="font-normal text-ink-faint">— une note (12,5) ou une fourchette (13,3 - 14,8). Laisse vide si non concerné.</span></p>
              <div className="grid sm:grid-cols-2 gap-2">
                {bacs.map((b) => (
                  <label key={b} className="flex items-center gap-3 rounded-xl bg-paper px-3 py-2">
                    <span className="w-14 font-mono text-sm font-semibold">{b}</span>
                    <span className="flex-1 text-xs text-ink-soft truncate">{BAC_LABEL[b]}</span>
                    <input className="input !w-28 !py-1.5 text-end" inputMode="decimal" dir="ltr" value={values[b]} onChange={(e) => setValues((v) => ({ ...v, [b]: e.target.value }))} />
                  </label>
                ))}
              </div>
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Source (nom)"><input className="input" value={source.label} onChange={(e) => setSource((s) => ({ ...s, label: e.target.value }))} placeholder="ex. Note officielle ENSA 2027" /></Field>
            <Field label="Source (lien) *"><input className="input" type="url" value={source.url} onChange={(e) => setSource((s) => ({ ...s, url: e.target.value }))} placeholder="https://…" /></Field>
          </div>
          <Bilingual label="Note (facultatif)" rows={2} fr={note.fr} ar={note.ar} onFr={(v) => setNote((n) => ({ ...n, fr: v }))} onAr={(v) => setNote((n) => ({ ...n, ar: v }))}
            hint="Ex. « Fourchette selon la filière et le centre »" />
        </div>

        <aside className="card p-6 grid gap-3 text-sm">
          <p className="font-semibold">Valeur d'origine (code)</p>
          {base ? (
            <>
              <p className="text-ink-soft">Année {base.year}</p>
              <ul className="grid gap-1" dir="ltr">
                {Object.keys(base.byBac).map((b) => <li key={b} className="flex justify-between"><span className="font-mono">{b}</span><b>{fmtSeuil(seuilFor(base ? { seuil: base } : {}, b))}</b></li>)}
              </ul>
              {base.source && <a href={base.source.url} target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:underline">Source : {base.source.label}</a>}
            </>
          ) : <p className="text-ink-soft">Aucun seuil dans le code.</p>}
          <p className="pt-3 border-t border-line text-xs text-ink-faint leading-relaxed">
            La formule de calcul de la note ({school.weights?.national === 0.75 ? "75 % national + 25 % régional" : "moyenne du bac"}) reste celle du code. Un seuil reste un minimum pour passer le concours, pas une admission.
          </p>
        </aside>
      </div>
    </div>
  );
}
