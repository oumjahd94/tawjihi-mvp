"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useT } from "../../components/LangProvider";
import { ROOMS, SEED_MESSAGES, SEED_WAITLIST } from "../../lib/data";
import { useStored, useUser } from "../../lib/store";
import { supabase } from "../../lib/supabase";

// Modération automatique minimale : on bloque numéros de téléphone et emails
// (public souvent mineur → aucune donnée perso dans les salons publics)
const PERSONAL = /(\+?\d[\d\s.-]{7,}\d)|([\w.+-]+@[\w-]+\.[\w.]+)/;

function Community() {
  const t = useT();
  const params = useSearchParams();
  const [room, setRoom] = useState("general");
  const [user] = useUser();

  useEffect(() => {
    const s = params.get("salon");
    if (s && ROOMS.some((r) => r.slug === s)) setRoom(s);
  }, [params]);

  const current = ROOMS.find((r) => r.slug === room);

  return (
    <div className="max-w-6xl mx-auto px-4 pt-10">
      <p className="eyebrow">{t({ ar: "المجتمع", fr: "Communauté" })}</p>
      <h1 className="mt-1 text-3xl font-bold">{t({ ar: "المجتمع", fr: "La communauté" })}</h1>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {ROOMS.map((r) => (
          <button key={r.slug} onClick={() => setRoom(r.slug)} className={`chip shrink-0 ${room === r.slug ? "!bg-brand-600 !text-white !border-brand-600" : ""}`}># {t(r)}</button>
        ))}
      </div>

      <div className="mt-4 lg:mt-6 grid grid-cols-1 lg:grid-cols-[220px_1fr_300px] gap-5 items-start">
        <nav className="hidden lg:block card p-2">
          {ROOMS.map((r) => (
            <button key={r.slug} onClick={() => setRoom(r.slug)}
              className={`w-full text-start rounded-lg px-3 py-2.5 text-sm font-semibold ${room === r.slug ? "bg-brand-50 text-brand-600" : "text-ink-soft hover:bg-paper"}`}>
              # {t(r)}
            </button>
          ))}
        </nav>

        <Chat key={room} room={current} user={user} t={t} />
        <Waitlist room={room} t={t} />
      </div>
    </div>
  );
}

function Chat({ room, user, t }) {
  const [local, setLocal] = useStored("room:" + room.slug, SEED_MESSAGES[room.slug] || []);
  const [remote, setRemote] = useState(null);
  const [text, setText] = useState("");
  const [warn, setWarn] = useState("");
  const endRef = useRef(null);
  const messages = remote ?? local;

  // Avec Supabase : historique + temps réel
  useEffect(() => {
    if (!supabase) return;
    supabase.from("messages").select("*").eq("room", room.slug).order("created_at").limit(100)
      .then(({ data }) => data && setRemote(data.map(toMsg)));
    const ch = supabase.channel("room-" + room.slug)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `room=eq.${room.slug}` },
        (p) => setRemote((m) => [...(m || []), toMsg(p.new)]))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [room.slug]);

  useEffect(() => { endRef.current?.scrollIntoView({ block: "nearest" }); }, [messages.length]);

  async function send(e) {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    if (PERSONAL.test(body)) return setWarn(t({ ar: "لحمايتك: لا أرقام هاتف ولا بريد إلكتروني في الصالونات.", fr: "Pour ta sécurité : pas de numéro ni d'email dans les salons." }));
    setWarn("");
    setText("");
    const h = new Date().toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" });
    if (supabase && user?.id && user.id !== "demo") {
      await supabase.from("messages").insert({ room: room.slug, user_id: user.id, author: user.name?.split(" ")[0] || "Élève", body });
    } else {
      setLocal((m) => [...m, { who: (user?.name?.split(" ")[0] || t({ ar: "أنت", fr: "Toi" })), t: body, h, me: true }]);
    }
  }

  return (
    <section className="card flex flex-col h-[560px] overflow-hidden min-w-0">
      <header className="px-5 py-4 border-b border-line">
        <p className="font-bold"># {t(room)}</p>
        <p className="text-xs text-ink-faint">{t({ ar: "احترام · تعاون · لا معطيات شخصية", fr: "Respect · entraide · aucune donnée perso" })}</p>
      </header>
      <ul className="flex-1 overflow-y-auto p-5 grid gap-3 content-start">
        {messages.map((m, i) => (
          <li key={i} className={`max-w-[85%] ${m.me ? "ms-auto" : ""}`}>
            <p className={`text-xs font-semibold mb-1 ${m.me ? "text-end text-brand-600" : "text-ink-soft"}`}>{m.who} · <span dir="ltr">{m.h}</span></p>
            <p className={`rounded-2xl px-4 py-2.5 leading-relaxed ${m.me ? "bg-brand-600 text-white rounded-se-md" : "bg-paper rounded-ss-md"}`}>{m.t}</p>
          </li>
        ))}
        <li ref={endRef} />
      </ul>
      {user ? (
        <form onSubmit={send} className="border-t border-line p-3">
          {warn && <p className="text-xs font-semibold text-coral mb-2">{warn}</p>}
          <div className="flex gap-2">
            <input className="input" value={text} onChange={(e) => setText(e.target.value)} maxLength={500}
              placeholder={t({ ar: "اكتب رسالتك…", fr: "Écris ton message…" })} />
            <button className="btn-primary shrink-0">{t({ ar: "إرسال", fr: "Envoyer" })}</button>
          </div>
        </form>
      ) : (
        <div className="border-t border-line p-4 text-center text-sm">
          <Link href="/espace" className="font-semibold text-brand-600 hover:underline">{t({ ar: "سجّل الدخول للمشاركة", fr: "Connecte-toi pour participer" })}</Link>
        </div>
      )}
    </section>
  );
}

const toMsg = (r) => ({ who: r.author, t: r.body, h: new Date(r.created_at).toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" }) });

function Waitlist({ room, t }) {
  const [reports, setReports] = useStored("waitlist", SEED_WAITLIST);
  const [form, setForm] = useState({ school: "", list: "", rank: "" });
  const mine = reports.filter((r) => r.room === room);

  function submit(e) {
    e.preventDefault();
    if (!form.school || !form.rank) return;
    setReports((r) => [{ room, school: form.school, list: Number(form.list) || 1, rank: Number(form.rank), h: t({ ar: "الآن", fr: "à l'instant" }) }, ...r]);
    setForm({ school: "", list: "", rank: "" });
  }

  return (
    <aside className="card p-5">
      <h2 className="font-bold">{t({ ar: "لوائح الانتظار", fr: "Listes d'attente" })}</h2>
      <p className="text-xs text-ink-faint mt-1">{t({ ar: "آخر رتبة تم استدعاؤها حسب الطلبة", fr: "Dernier rang appelé, signalé par les élèves" })}</p>
      <ul className="mt-4 grid gap-2">
        {mine.length === 0 && <li className="text-sm text-ink-soft">{t({ ar: "لا توجد معلومات بعد.", fr: "Aucune remontée pour l'instant." })}</li>}
        {mine.map((r, i) => (
          <li key={i} className="rounded-xl bg-paper p-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">{r.school}</span>
              <span className="text-xs text-ink-faint">{r.h}</span>
            </div>
            <p className="mt-1 text-sm" dir="ltr">
              <span className="text-ink-soft">{t({ ar: "اللائحة", fr: "Liste" })} {r.list} ·</span> <b className="text-brand-600">#{r.rank}</b>
            </p>
          </li>
        ))}
      </ul>
      <form onSubmit={submit} className="mt-4 grid gap-2 border-t border-line pt-4">
        <p className="text-sm font-semibold">{t({ ar: "أضف معلومة", fr: "Signaler un appel" })}</p>
        <input className="input !py-2 text-sm" placeholder={t({ ar: "المدرسة (مثال: ENSA القنيطرة)", fr: "École (ex. ENSA Kénitra)" })}
          value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} />
        <div className="grid grid-cols-2 gap-2">
          <input className="input !py-2 text-sm" inputMode="numeric" placeholder={t({ ar: "اللائحة", fr: "N° liste" })}
            value={form.list} onChange={(e) => setForm({ ...form, list: e.target.value.replace(/\D/g, "") })} />
          <input className="input !py-2 text-sm" inputMode="numeric" placeholder={t({ ar: "الرتبة", fr: "Rang" })}
            value={form.rank} onChange={(e) => setForm({ ...form, rank: e.target.value.replace(/\D/g, "") })} />
        </div>
        <button className="btn-primary !py-2.5 text-sm">{t({ ar: "نشر", fr: "Publier" })}</button>
      </form>
    </aside>
  );
}

export default function Page() {
  return <Suspense><Community /></Suspense>;
}
