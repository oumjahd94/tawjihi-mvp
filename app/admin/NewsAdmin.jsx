"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import { NEWS_CATEGORIES, NEWS_SEED } from "../../lib/news-seed";
import { renderMarkdown } from "../../lib/markdown";
import { slugify, revalidateSite } from "./ui";

// Back-office des actualités.
const EMPTY = { slug: "", category: "orientation", title_fr: "", title_ar: "", excerpt_fr: "", excerpt_ar: "", body_fr: "", body_ar: "", cover_url: "", source_label: "", source_url: "", status: "draft", pinned: false, published_at: new Date().toISOString() };
const toLocal = (iso) => { const d = new Date(iso); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); };

export default function NewsManager({ session }) {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("news").select("id, slug, title_fr, category, status, pinned, published_at").order("published_at", { ascending: false });
    if (error) setMsg("Erreur de chargement : " + error.message); else setItems(data);
  }, []);
  useEffect(() => { load(); }, [load]);

  const revalidate = (slug) => revalidateSite(session, slug);

  async function importSeed() {
    const rows = NEWS_SEED.map(({ ...n }) => ({ ...n, status: "published", author_id: session.user.id }));
    const { error } = await supabase.from("news").upsert(rows, { onConflict: "slug" });
    setMsg(error ? "Erreur : " + error.message : `${rows.length} articles importés.`);
    await revalidate(); load();
  }

  async function remove(item) {
    if (!confirm(`Supprimer définitivement « ${item.title_fr} » ?`)) return;
    const { error } = await supabase.from("news").delete().eq("id", item.id);
    setMsg(error ? "Erreur : " + error.message : "Article supprimé.");
    await revalidate(item.slug); load();
  }

  async function open(item) {
    if (!item) return setEditing({ ...EMPTY, published_at: new Date().toISOString() });
    const { data } = await supabase.from("news").select("*").eq("id", item.id).single();
    setEditing(data);
  }

  if (editing) return <Editor initial={editing} session={session} onDone={async (m, slug) => { setEditing(null); setMsg(m || ""); if (slug) await revalidate(slug); load(); }} />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Actualités <span className="text-ink-faint">({items.length})</span></h1>
        <div className="flex gap-2">
          {items.length === 0 && <button onClick={importSeed} className="btn-ghost">Importer les 6 articles de départ</button>}
          <button onClick={() => open(null)} className="btn-primary">+ Nouvel article</button>
        </div>
      </div>
      {msg && <p className="mt-4 rounded-xl bg-brand-50 text-brand-800 px-4 py-3 text-sm font-semibold">{msg}</p>}
      <div className="mt-6 card divide-y divide-line overflow-hidden">
        {items.length === 0 && <p className="p-6 text-ink-soft">Aucun article. Importe les articles de départ ou crée le premier.</p>}
        {items.map((n) => (
          <div key={n.id} className="p-4 flex flex-wrap items-center gap-3">
            <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${n.status === "published" ? "bg-brand-600 text-white" : "bg-paper text-ink-soft ring-1 ring-line"}`}>{n.status === "published" ? "Publié" : "Brouillon"}</span>
            {n.pinned && <span className="rounded-md bg-gold-400 text-brand-950 px-2 py-0.5 text-xs font-bold">À la une</span>}
            <div className="flex-1 min-w-[200px]">
              <p className="font-semibold">{n.title_fr}</p>
              <p className="text-xs text-ink-faint">{NEWS_CATEGORIES[n.category]?.fr} · {new Date(n.published_at).toLocaleString("fr-FR")}</p>
            </div>
            {n.status === "published" && <Link href={`/actualites/${n.slug}`} target="_blank" className="text-sm text-brand-700 hover:underline">Voir</Link>}
            <button onClick={() => open(n)} className="text-sm font-semibold text-ink hover:text-brand-700">Modifier</button>
            <button onClick={() => remove(n)} className="text-sm font-semibold text-coral">Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Editor({ initial, session, onDone }) {
  const [f, setF] = useState(initial);
  const [lang, setLang] = useState("fr");
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isNew = !initial.id;
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  async function upload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) return setError("Image trop lourde (3 Mo maximum).");
    setBusy(true);
    const path = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${file.name.split(".").pop().toLowerCase()}`;
    const { error } = await supabase.storage.from("news").upload(path, file, { contentType: file.type });
    setBusy(false);
    if (error) return setError("Échec de l'envoi : " + error.message);
    setF((x) => ({ ...x, cover_url: supabase.storage.from("news").getPublicUrl(path).data.publicUrl }));
  }

  async function save(status) {
    setError("");
    const slug = f.slug || slugify(f.title_fr);
    if (!f.title_fr.trim()) return setError("Le titre en français est obligatoire.");
    if (!slug) return setError("Slug invalide.");
    setBusy(true);
    const row = { ...f, slug, status, author_id: f.author_id || session.user.id, published_at: new Date(f.published_at).toISOString() };
    delete row.created_at; delete row.updated_at;
    if (isNew) delete row.id;
    const { error } = isNew ? await supabase.from("news").insert(row) : await supabase.from("news").update(row).eq("id", f.id);
    setBusy(false);
    if (error) return setError(error.message.includes("duplicate") ? "Ce slug existe déjà : modifie-le." : error.message);
    onDone(status === "published" ? "Article publié. Il est en ligne." : "Brouillon enregistré.", slug);
  }

  const body = lang === "fr" ? "body_fr" : "body_ar";
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={() => onDone()} className="text-sm font-semibold text-ink-soft hover:text-ink">← Retour à la liste</button>
        <div className="flex gap-2">
          <button onClick={() => save("draft")} disabled={busy} className="btn-ghost">Enregistrer le brouillon</button>
          <button onClick={() => save("published")} disabled={busy} className="btn-primary">Publier</button>
        </div>
      </div>
      {error && <p className="mt-4 rounded-xl bg-coral-soft text-coral px-4 py-3 text-sm font-semibold">{error}</p>}

      <div className="mt-6 grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="card p-6 grid gap-4 min-w-0">
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-paper p-1 text-sm font-semibold w-60">
            {["fr", "ar"].map((l) => <button key={l} onClick={() => setLang(l)} className={`rounded-lg py-1.5 ${lang === l ? "bg-white shadow-card" : "text-ink-soft"}`}>{l === "fr" ? "Français" : "العربية"}</button>)}
          </div>
          <div dir={lang === "ar" ? "rtl" : "ltr"} className="grid gap-4">
            <label className="grid gap-1.5 text-sm font-semibold">Titre {lang === "fr" && "*"}
              <input className="input text-lg" value={f[`title_${lang}`] || ""} onChange={(e) => setF((x) => ({ ...x, [`title_${lang}`]: e.target.value, ...(lang === "fr" && isNew ? { slug: slugify(e.target.value) } : {}) }))} />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold">Chapô (résumé en 1-2 phrases)
              <textarea className="input" rows={2} value={f[`excerpt_${lang}`] || ""} onChange={set(`excerpt_${lang}`)} />
            </label>
            <div className="grid gap-1.5">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>Contenu</span>
                <button onClick={() => setPreview(!preview)} className="text-brand-700">{preview ? "Modifier" : "Aperçu"}</button>
              </div>
              {preview ? (
                <div className="prose-maslaki rounded-xl border border-line p-4 min-h-[320px]" dangerouslySetInnerHTML={{ __html: renderMarkdown(f[body] || "") }} />
              ) : (
                <textarea className="input font-mono text-sm leading-relaxed" rows={16} value={f[body] || ""} onChange={set(body)}
                  placeholder={"Paragraphe…\n\n## Sous-titre\n\n- un point\n- un autre point\n\n**gras**, *italique*, [lien](https://…)"} />
              )}
              <p className="text-xs text-ink-faint font-normal">Mise en forme : ## titre, - liste, **gras**, *italique*, [texte](lien).</p>
            </div>
          </div>
        </div>

        <aside className="card p-6 grid gap-4">
          <label className="grid gap-1.5 text-sm font-semibold">Catégorie
            <select className="input" value={f.category} onChange={set("category")}>
              {Object.entries(NEWS_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.fr}</option>)}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">Date de publication
            <input type="datetime-local" className="input" value={toLocal(f.published_at)} onChange={(e) => setF((x) => ({ ...x, published_at: new Date(e.target.value).toISOString() }))} />
            <span className="text-xs text-ink-faint font-normal">Une date future programme la publication.</span>
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={!!f.pinned} onChange={set("pinned")} className="h-4 w-4 accent-brand-600" /> Mettre à la une</label>
          <label className="grid gap-1.5 text-sm font-semibold">Slug (adresse)
            <input className="input font-mono text-sm" value={f.slug} onChange={(e) => setF((x) => ({ ...x, slug: slugify(e.target.value) }))} />
          </label>
          <div className="grid gap-1.5 text-sm font-semibold">Image de couverture
            {f.cover_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={f.cover_url} alt="" className="rounded-xl border border-line aspect-video object-cover" />
            )}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} className="text-sm font-normal" />
            {f.cover_url && <button onClick={() => setF((x) => ({ ...x, cover_url: "" }))} className="text-xs text-coral text-start">Retirer l'image</button>}
          </div>
          <label className="grid gap-1.5 text-sm font-semibold">Source (nom)
            <input className="input" value={f.source_label || ""} onChange={set("source_label")} placeholder="ex. Ministère de l'Enseignement supérieur" />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">Source (lien)
            <input className="input" type="url" value={f.source_url || ""} onChange={set("source_url")} placeholder="https://…" />
          </label>
        </aside>
      </div>
    </div>
  );
}
