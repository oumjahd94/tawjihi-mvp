"use client";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { QUIZZES } from "../../lib/data";
import { quizToRow } from "../../lib/content-map";
import { slugify, revalidateSite, Msg, Field, Check, Bilingual, explain } from "./ui";

// Quiz chronométrés de la page « Prépa concours ».

const blankQuestion = () => ({ q: "", options: ["", "", "", ""], answer: 0 });
const EMPTY = { slug: "", title_fr: "", title_ar: "", seconds: 300, questions: [blankQuestion()], visible: true, sort: 0 };

export default function QuizAdmin({ session }) {
  const [rows, setRows] = useState(null);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("quizzes").select("*").order("sort").order("slug");
    if (error) { setMsg(explain(error)); setRows([]); return; }
    setRows(data);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function done(text) { setMsg(text); setEditing(null); await revalidateSite(session); load(); }

  async function importCode() {
    const data = Object.entries(QUIZZES).map(([slug, q], i) => quizToRow(slug, q, i));
    const { error } = await supabase.from("quizzes").insert(data);
    done(error ? explain(error) : `${data.length} quiz importés.`);
  }

  async function toggleVisible(r) {
    const { error } = await supabase.from("quizzes").update({ visible: !r.visible }).eq("slug", r.slug);
    done(error ? explain(error) : r.visible ? "Quiz masqué." : "Quiz de nouveau visible.");
  }

  async function remove(r) {
    if (!confirm(`Supprimer définitivement le quiz « ${r.title_fr} » ?`)) return;
    const { error } = await supabase.from("quizzes").delete().eq("slug", r.slug);
    done(error ? explain(error) : "Quiz supprimé.");
  }

  if (editing) return <QuizEditor initial={editing} onCancel={() => setEditing(null)} onDone={done} />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Quiz chronométrés <span className="text-ink-faint">({rows?.length ?? "…"})</span></h1>
        <button onClick={() => setEditing({ ...EMPTY, _new: true })} className="btn-primary">+ Nouveau quiz</button>
      </div>
      <Msg msg={msg} />
      {rows && rows.length === 0 && (
        <div className="mt-6 card p-6">
          <p className="font-semibold">Aucun quiz en base : le site affiche les {Object.keys(QUIZZES).length} quiz écrits dans le code.</p>
          <button onClick={importCode} className="btn-primary mt-4">Importer les {Object.keys(QUIZZES).length} quiz actuels</button>
        </div>
      )}
      {rows?.length > 0 && (
        <div className="mt-6 card divide-y divide-line overflow-hidden">
          {rows.map((r) => (
            <div key={r.slug} className={`p-4 flex flex-wrap items-center gap-3 ${r.visible ? "" : "opacity-60"}`}>
              {!r.visible && <span className="rounded-md px-2 py-0.5 text-xs font-semibold bg-paper text-ink-soft ring-1 ring-line">Masqué</span>}
              <div className="flex-1 min-w-[200px]">
                <p className="font-semibold">{r.title_fr}</p>
                <p className="text-xs text-ink-faint">{(r.questions || []).length} questions · {Math.round(r.seconds / 60)} min · <span className="font-mono">{r.slug}</span></p>
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

function QuizEditor({ initial, onCancel, onDone }) {
  const isNew = !!initial._new;
  const [f, setF] = useState(() => ({
    ...initial,
    // l'éditeur travaille toujours avec 4 champs de réponse
    questions: (initial.questions || []).map((q) => ({ ...q, options: [...q.options, "", "", "", ""].slice(0, 4) }))
  }));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const setQ = (i, patch) => setF((x) => ({ ...x, questions: x.questions.map((q, k) => (k === i ? { ...q, ...patch } : q)) }));
  const setOpt = (i, j, v) => setF((x) => ({ ...x, questions: x.questions.map((q, k) => (k === i ? { ...q, options: q.options.map((o, m) => (m === j ? v : o)) } : q)) }));
  const move = (i, d) => setF((x) => { const qs = [...x.questions]; const j = i + d; if (j < 0 || j >= qs.length) return x; [qs[i], qs[j]] = [qs[j], qs[i]]; return { ...x, questions: qs }; });
  const removeQ = (i) => setF((x) => ({ ...x, questions: x.questions.filter((_, k) => k !== i) }));

  async function save() {
    setError("");
    const slug = f.slug || slugify(f.title_fr);
    if (!f.title_fr.trim()) return setError("Le titre en français est obligatoire.");
    if (!f.questions.length) return setError("Ajoute au moins une question.");
    const questions = [];
    for (const [i, q] of f.questions.entries()) {
      if (!q.q.trim()) return setError(`Question ${i + 1} : l'énoncé est vide.`);
      const filled = q.options.map((o, k) => ({ o: o.trim(), k })).filter((x) => x.o);
      if (filled.length < 2) return setError(`Question ${i + 1} : il faut au moins 2 réponses.`);
      const answer = filled.findIndex((x) => x.k === q.answer);
      if (answer < 0) return setError(`Question ${i + 1} : la bonne réponse cochée est vide.`);
      questions.push({ q: q.q.trim(), options: filled.map((x) => x.o), answer });
    }
    setBusy(true);
    const row = { slug, title_fr: f.title_fr, title_ar: f.title_ar || null, seconds: Number(f.seconds) || 300, questions, visible: f.visible, sort: f.sort || 0 };
    const { error } = isNew ? await supabase.from("quizzes").insert(row) : await supabase.from("quizzes").update(row).eq("slug", initial.slug);
    setBusy(false);
    if (error) return setError(explain(error));
    onDone(isNew ? "Quiz créé. Il est en ligne sur « Prépa concours »." : "Quiz mis à jour.");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={onCancel} className="text-sm font-semibold text-ink-soft hover:text-ink">← Retour à la liste</button>
        <button onClick={save} disabled={busy} className="btn-primary">{isNew ? "Créer le quiz" : "Enregistrer"}</button>
      </div>
      {error && <p className="mt-4 rounded-xl bg-coral-soft text-coral px-4 py-3 text-sm font-semibold">{error}</p>}

      <div className="mt-6 card p-6 grid gap-5">
        <Bilingual label="Titre" required fr={f.title_fr} ar={f.title_ar} onFr={(v) => setF((x) => ({ ...x, title_fr: v, ...(isNew ? { slug: slugify(v) } : {}) }))} onAr={(v) => setF((x) => ({ ...x, title_ar: v }))}
          hint="Ex. « Maths — type ENSA / ENSAM »" />
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Durée (minutes)">
            <input type="number" min="1" max="120" className="input" value={Math.round(f.seconds / 60)} onChange={(e) => setF((x) => ({ ...x, seconds: Math.max(1, Number(e.target.value) || 1) * 60 }))} />
          </Field>
          <Field label="Ordre d'affichage" hint="Plus petit = en premier">
            <input type="number" className="input" value={f.sort || 0} onChange={(e) => setF((x) => ({ ...x, sort: Number(e.target.value) || 0 }))} />
          </Field>
          <Field label="Identifiant" hint="Ne change pas une fois créé.">
            <input className="input font-mono text-sm" value={f.slug} disabled={!isNew} onChange={(e) => setF((x) => ({ ...x, slug: slugify(e.target.value) }))} />
          </Field>
        </div>
        <Check label="Visible sur le site" checked={f.visible} onChange={(v) => setF((x) => ({ ...x, visible: v }))} />
      </div>

      <div className="mt-6 grid gap-4">
        {f.questions.map((q, i) => (
          <div key={i} className="card p-5 grid gap-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold">Question {i + 1}</p>
              <div className="flex gap-3 text-sm font-semibold">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="text-ink-soft disabled:opacity-30">↑</button>
                <button onClick={() => move(i, 1)} disabled={i === f.questions.length - 1} className="text-ink-soft disabled:opacity-30">↓</button>
                <button onClick={() => removeQ(i)} className="text-coral">Retirer</button>
              </div>
            </div>
            <textarea className="input" rows={2} value={q.q} onChange={(e) => setQ(i, { q: e.target.value })} placeholder="Énoncé de la question" />
            <div className="grid sm:grid-cols-2 gap-2">
              {q.options.map((o, j) => (
                <label key={j} className={`flex items-center gap-2 rounded-xl px-3 py-2 ${q.answer === j ? "bg-brand-50 ring-1 ring-brand-200" : "bg-paper"}`}>
                  <input type="radio" name={`answer-${i}`} checked={q.answer === j} onChange={() => setQ(i, { answer: j })} className="accent-brand-600" title="Bonne réponse" />
                  <span className="text-sm font-bold text-ink-soft">{"ABCD"[j]}</span>
                  <input className="input !py-1.5 flex-1" value={o} onChange={(e) => setOpt(i, j, e.target.value)} placeholder={j < 2 ? "Réponse" : "Réponse (facultatif)"} />
                </label>
              ))}
            </div>
            <p className="text-xs text-ink-faint">Coche le rond de la bonne réponse.</p>
          </div>
        ))}
        <button onClick={() => setF((x) => ({ ...x, questions: [...x.questions, blankQuestion()] }))} className="btn-ghost justify-self-start">+ Ajouter une question</button>
      </div>
    </div>
  );
}
