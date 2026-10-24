"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "../../components/Nav";
import { supabase } from "../../lib/supabase";
import NewsAdmin from "./NewsAdmin";
import ConcoursAdmin from "./ConcoursAdmin";
import SeuilsAdmin from "./SeuilsAdmin";
import AnnalesAdmin from "./AnnalesAdmin";
import QuizAdmin from "./QuizAdmin";

// Back-office (interface en français).
// Accès : compte Supabase dont le profil a le rôle "admin" (voir migration_v3).
// Les rubriques Concours, Seuils, Annales et Quiz demandent migration_v4_contenus.sql.

const TABS = [
  { key: "news", label: "Actualités", C: NewsAdmin },
  { key: "concours", label: "Concours", C: ConcoursAdmin },
  { key: "seuils", label: "Seuils", C: SeuilsAdmin },
  { key: "annales", label: "Annales", C: AnnalesAdmin },
  { key: "quiz", label: "Quiz", C: QuizAdmin }
];

export default function Admin() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null); // null = en cours, "admin" ou autre
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supabase) { setReady(true); return; }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setRole(null); return; }
    supabase.rpc("is_admin").then(({ data }) => setRole(data ? "admin" : "user"));
  }, [session]);

  if (!ready) return null;
  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-brand-950 text-white">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3"><Link href="/"><Logo light /></Link><span className="text-sm text-gold-300 font-semibold">Admin</span></div>
          {session && <button onClick={() => supabase.auth.signOut()} className="text-sm text-white/70 hover:text-white">Se déconnecter</button>}
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        {!supabase ? <NotConfigured /> : !session ? <Login /> : role === null ? <p>Vérification…</p> : role !== "admin" ? <NotAdmin email={session.user.email} /> : <Dashboard session={session} />}
      </main>
    </div>
  );
}

function NotConfigured() {
  return (
    <div className="card p-8 max-w-2xl">
      <h1 className="text-2xl font-semibold">Back-office non activé</h1>
      <p className="mt-3 text-ink-soft leading-relaxed">Le site tourne en mode démo : les actualités affichées viennent de <code>lib/news-seed.js</code>. Pour publier depuis cette page :</p>
      <ol className="mt-4 list-decimal ps-6 space-y-2 text-ink">
        <li>Renseigne <code>NEXT_PUBLIC_SUPABASE_URL</code> et <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> dans <code>.env.local</code>.</li>
        <li>Exécute <code>supabase/migration_v3_actualites.sql</code> dans le SQL Editor.</li>
        <li>Crée ton compte (Authentication &gt; Users) et donne-lui le rôle admin (fin du fichier SQL).</li>
        <li>Relance le site et reviens sur <code>/admin</code>.</li>
      </ol>
    </div>
  );
}

function NotAdmin({ email }) {
  return (
    <div className="card p-8 max-w-xl">
      <h1 className="text-xl font-semibold">Accès refusé</h1>
      <p className="mt-2 text-ink-soft">Le compte <b>{email}</b> n'a pas le rôle admin. Donne-le-lui avec la requête SQL en bas de <code>migration_v3_actualites.sql</code>.</p>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      const m = error.message || "";
      if (/email not confirmed/i.test(m)) setError("Email non confirmé : confirme l'utilisateur dans Supabase (Authentication > Users).");
      else if (/invalid login credentials/i.test(m)) setError("Email ou mot de passe incorrect.");
      else if (/api key|apikey|jwt/i.test(m)) setError("Clé Supabase invalide : vérifie NEXT_PUBLIC_SUPABASE_ANON_KEY sur Vercel. (" + m + ")");
      else setError("Erreur de connexion : " + m);
    }
  }
  return (
    <form onSubmit={submit} className="card p-8 max-w-sm mx-auto mt-10 grid gap-4">
      <h1 className="text-xl font-semibold">Connexion admin</h1>
      <input className="input" type="email" autoComplete="username" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className="input" type="password" autoComplete="current-password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {error && <p className="text-sm font-semibold text-coral">{error}</p>}
      <button className="btn-primary" disabled={busy}>Se connecter</button>
    </form>
  );
}


function Dashboard({ session }) {
  const [tab, setTab] = useState("news");
  useEffect(() => {
    const sync = () => { const h = window.location.hash.slice(1); if (TABS.some((x) => x.key === h)) setTab(h); };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  const select = (k) => { setTab(k); history.replaceState(null, "", `#${k}`); };
  const Current = TABS.find((x) => x.key === tab).C;
  return (
    <>
      <nav className="flex gap-1 overflow-x-auto rounded-xl bg-white p-1 shadow-card mb-8 w-fit max-w-full">
        {TABS.map((x) => (
          <button key={x.key} onClick={() => select(x.key)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${tab === x.key ? "bg-brand-700 text-white" : "text-ink-soft hover:text-ink"}`}>
            {x.label}
          </button>
        ))}
      </nav>
      <Current key={tab} session={session} />
    </>
  );
}
