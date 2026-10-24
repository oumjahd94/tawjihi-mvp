"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang, useT } from "../../components/LangProvider";
import { VerdictGauge } from "../../components/KhatamGauge";
import ConcoursRow from "../../components/ConcoursRow";
import FavButton from "../../components/FavButton";
import { IconGoogle, IconWhatsapp, IconBell } from "../../components/Icons";
import { daysLeft } from "../../lib/concours";
import { useConcours } from "../../components/ContentProvider";
import { verdict, TIER_META, bacAverage } from "../../lib/scoring";
import { schoolBySlug, formatDate } from "../../lib/format";
import { useAlertPrefs, useFavorites, useGrades, useUser } from "../../lib/store";
import { supabase } from "../../lib/supabase";

export default function Espace() {
  const [user, setUser] = useUser();

  // Avec Supabase : on récupère la vraie session (retour de Google OAuth, etc.)
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      if (u) setUser({ id: u.id, name: u.user_metadata?.full_name || u.phone || u.email, via: u.app_metadata?.provider || "phone" });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return user ? <Dashboard user={user} onLogout={async () => { if (supabase) await supabase.auth.signOut(); setUser(null); }} /> : <Login onLogin={setUser} />;
}

/* ---------------- CONNEXION EN 2 CLICS ---------------- */
function Login({ onLogin }) {
  const t = useT();
  const [step, setStep] = useState("choose"); // choose | phone | code
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const fullPhone = "+212" + phone.replace(/\D/g, "").replace(/^0/, "");

  async function google() {
    if (!supabase) return onLogin({ id: "demo", name: "Élève démo", via: "google" });
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "/espace" } });
  }

  async function sendCode() {
    setError("");
    if (fullPhone.length !== 13) return setError(t({ ar: "رقم غير صحيح (مثال: 0612345678)", fr: "Numéro invalide (ex. 0612345678)" }));
    setBusy(true);
    if (supabase) {
      const { error } = await supabase.auth.signInWithOtp({ phone: fullPhone, options: { channel: "whatsapp" } });
      if (error) { setBusy(false); return setError(error.message); }
    }
    setBusy(false);
    setStep("code");
  }

  async function verify() {
    setError("");
    if (code.length !== 6) return setError(t({ ar: "الرمز يتكون من 6 أرقام", fr: "Le code fait 6 chiffres" }));
    if (!supabase) return onLogin({ id: "demo", name: fullPhone, via: "whatsapp", phone: fullPhone });
    setBusy(true);
    const { data, error } = await supabase.auth.verifyOtp({ phone: fullPhone, token: code, type: "sms" });
    setBusy(false);
    if (error) return setError(error.message);
    onLogin({ id: data.user.id, name: fullPhone, via: "whatsapp", phone: fullPhone });
  }

  const benefits = [
    { ar: "تابع المدارس التي تهمك في مكان واحد", fr: "Suis les écoles qui t'intéressent, au même endroit" },
    { ar: "رزنامة شخصية بمواعيد مدارسك فقط", fr: "Un calendrier perso avec les dates de TES écoles" },
    { ar: "تنبيه واتساب قبل كل أجل (اختياري)", fr: "Une alerte WhatsApp avant chaque date limite (si tu le souhaites)" },
    { ar: "احتفظ بنقطك ونتائج المحاكي", fr: "Tes notes et résultats du simulateur sauvegardés" }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
      <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-lift border border-line">
        {/* Pourquoi créer un compte */}
        <div className="hero-bg text-white p-8 md:p-10 flex flex-col">
          <h1 className="text-3xl font-semibold leading-tight">{t({ ar: "مرحبًا بك في مسلكي", fr: "Bienvenue sur Maslaki" })}</h1>
          <p className="mt-3 text-white/75 leading-relaxed">{t({ ar: "حساب مجاني يكفي لتنظيم توجيهك.", fr: "Un compte gratuit pour organiser ton orientation." })}</p>
          <ul className="mt-8 grid gap-4">
            {benefits.map((b) => (
              <li key={b.fr} className="flex items-start gap-3">
                <span className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-gold-400 text-brand-950 grid place-items-center text-sm font-bold">✓</span>
                <span className="leading-snug">{t(b)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-auto pt-10 text-sm text-white/60">{t({ ar: "لا نبيع معطياتك أبدًا.", fr: "Nous ne revendons jamais tes données." })}</p>
        </div>

        {/* Connexion */}
        <div className="bg-white p-8 md:p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold">{t({ ar: "تسجيل الدخول أو إنشاء حساب", fr: "Se connecter ou créer un compte" })}</h2>
          <p className="mt-1 text-sm text-ink-soft">{t({ ar: "في نقرتين، بدون كلمة مرور.", fr: "En 2 clics, sans mot de passe." })}</p>

          <div className="mt-7">
            {step === "choose" && (
              <div className="grid gap-3">
                <button onClick={google} className="btn-ghost w-full !py-3.5"><IconGoogle /> {t({ ar: "المتابعة مع Google", fr: "Continuer avec Google" })}</button>
                <button onClick={() => setStep("phone")} className="btn w-full !py-3.5 bg-[#25D366] text-white hover:brightness-95">
                  <IconWhatsapp /> {t({ ar: "المتابعة عبر واتساب", fr: "Continuer avec WhatsApp" })}
                </button>
              </div>
            )}

            {step === "phone" && (
              <div>
                <label className="text-sm font-semibold" htmlFor="phone">{t({ ar: "رقم هاتفك", fr: "Ton numéro" })}</label>
                <div className="mt-1.5 flex gap-2" dir="ltr">
                  <span className="input !w-auto font-semibold text-ink-soft">+212</span>
                  <input id="phone" className="input" inputMode="tel" autoComplete="tel-national" placeholder="6 12 34 56 78" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <button onClick={sendCode} disabled={busy} className="btn w-full mt-4 bg-[#25D366] text-white">
                  {t({ ar: "أرسل الرمز على واتساب", fr: "Recevoir le code sur WhatsApp" })}
                </button>
              </div>
            )}

            {step === "code" && (
              <div>
                <label className="text-sm font-semibold" htmlFor="code">{t({ ar: "الرمز المرسل إلى", fr: "Code envoyé au" })} <span dir="ltr">{fullPhone}</span></label>
                <input id="code" className="input mt-1.5 text-center text-2xl tracking-[.5em] font-bold" dir="ltr" inputMode="numeric" autoComplete="one-time-code" maxLength={6}
                  value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="••••••" />
                <button onClick={verify} disabled={busy} className="btn-primary w-full mt-4">{t({ ar: "تأكيد", fr: "Valider" })}</button>
                {!supabase && <p className="mt-2 text-xs text-ink-faint text-center">{t({ ar: "وضع تجريبي: أي 6 أرقام", fr: "Mode démo : n'importe quels 6 chiffres" })}</p>}
              </div>
            )}

            {error && <p className="mt-3 text-sm font-semibold text-coral">{error}</p>}
            {step !== "choose" && (
              <button onClick={() => { setStep("choose"); setError(""); }} className="mt-4 text-sm font-semibold text-ink-soft hover:text-ink">
                {t({ ar: "رجوع", fr: "Retour" })}
              </button>
            )}
          </div>

          <p className="mt-8 text-xs text-ink-faint leading-relaxed">
            {t({ ar: "بالمتابعة، أنت توافق على", fr: "En continuant, tu acceptes la" })}{" "}
            <Link href="/confidentialite" className="underline hover:text-brand-700">{t({ ar: "سياسة الخصوصية", fr: "politique de confidentialité" })}</Link>.{" "}
            {t({ ar: "التنبيهات تفعل لاحقًا باختيارك. أقل من 18 سنة: بموافقة أحد الوالدين.", fr: "Les alertes s'activent ensuite, seulement si tu le choisis. Moins de 18 ans : avec l'accord d'un parent." })}
          </p>
          <Link href="/" className="mt-4 text-sm font-semibold text-brand-700 hover:underline">{t({ ar: "المتابعة بدون حساب", fr: "Continuer sans compte" })}</Link>
        </div>
      </div>
    </div>
  );
}

/* ---------------- TABLEAU DE BORD ---------------- */
function Dashboard({ user, onLogout }) {
  const t = useT();
  const { lang } = useLang();
  const [favs] = useFavorites();
  const [grades] = useGrades();
  const [prefs, setPrefs] = useAlertPrefs();
  const schools = favs.map(schoolBySlug).filter(Boolean);
  // Échéances de mes écoles (un établissement suit les dates de son réseau) + échéances générales
  const keys = new Set(schools.map((s) => s.network || s.slug));
  const { active } = useConcours();
  const myDeadlines = active.filter((c) => c.school === null || keys.has(c.school));
  const dateOf = (c) => (c.status === "upcoming" ? c.start : c.end || c.start);
  const next = myDeadlines.find((c) => c.school && c.status !== "ongoing" && dateOf(c));
  const avg = bacAverage(grades);

  // Regroupement par mois pour le calendrier
  const byMonth = myDeadlines.reduce((acc, d) => {
    const k = d.status === "ongoing" ? "0000-00" : (dateOf(d) || "0000-00").slice(0, 7);
    (acc[k] ||= []).push(d);
    return acc;
  }, {});

  const toggles = [
    { k: "whatsapp", ar: "تنبيهات واتساب", fr: "Alertes WhatsApp" },
    { k: "sms", ar: "رسائل SMS", fr: "SMS" },
    { k: "opening", ar: "عند فتح التسجيل", fr: "À l'ouverture des inscriptions" },
    { k: "j7", ar: "7 أيام قبل الأجل", fr: "7 jours avant la clôture" },
    { k: "j1", ar: "يوم قبل الأجل", fr: "La veille de la clôture" }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 pt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{t({ ar: "فضائي", fr: "Mon espace" })}</p>
          <h1 className="mt-1 text-3xl font-bold">{t({ ar: "مرحبًا", fr: "Salut" })} {user.name?.split(" ")[0]} 👋</h1>
        </div>
        <button onClick={onLogout} className="text-sm font-semibold text-ink-soft hover:text-coral">{t({ ar: "تسجيل الخروج", fr: "Se déconnecter" })}</button>
      </div>

      {/* BANDEAU PROCHAINE ÉCHÉANCE */}
      {next && (
        <div className="mt-6 rounded-xl2 bg-brand-600 text-white p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div>
            <p className="text-white/70 text-sm font-semibold">{t({ ar: "الأجل القادم", fr: "Ta prochaine échéance" })}</p>
            <p className="mt-1 text-xl font-bold">{t(next)}</p>
            <p className="text-white/80 text-sm mt-1">{formatDate(dateOf(next), lang)}</p>
          </div>
          <div className="text-center rounded-xl bg-white/10 ring-1 ring-white/20 px-6 py-3">
            <p className="text-4xl font-bold" dir="ltr">{daysLeft(dateOf(next))}</p>
            <p className="text-sm text-white/80">{t({ ar: "يوم متبقي", fr: "jours restants" })}</p>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="grid gap-8 min-w-0">
          {/* ÉCOLES SUIVIES */}
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{t({ ar: "مدارسي المفضلة", fr: "Mes écoles suivies" })} <span className="text-ink-faint">({schools.length})</span></h2>
              <Link href="/ecoles" className="text-sm font-semibold text-brand-600 hover:underline">+ {t({ ar: "إضافة", fr: "Ajouter" })}</Link>
            </div>
            {schools.length === 0 ? (
              <div className="card p-8 mt-4 text-center">
                <p className="font-semibold">{t({ ar: "لم تتابع أي مدرسة بعد.", fr: "Tu ne suis encore aucune école." })}</p>
                <p className="text-sm text-ink-soft mt-1">{t({ ar: "اضغط ♡ على أي مدرسة لتظهر هنا مع مواعيدها.", fr: "Appuie sur ♡ sur une école : elle apparaîtra ici avec ses dates." })}</p>
                <Link href="/simulateur" className="btn-primary mt-4">{t({ ar: "ابدأ بالمحاكي", fr: "Commencer par le simulateur" })}</Link>
              </div>
            ) : (
              <ul className="mt-4 grid sm:grid-cols-2 gap-3">
                {schools.map((s) => {
                  const c = verdict(s, grades.bac, grades);
                  const m = TIER_META[c.tier];
                  return (
                    <li key={s.slug} className="card p-4 flex items-center gap-4">
                      <VerdictGauge v={c} meta={m} size={60} t={t} />
                      <Link href={`/ecoles/${s.slug}`} className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-brand-600">{s.acronym}</p>
                        <p className="font-semibold truncate">{t(s)}</p>
                        <p className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-bold ${m.cls}`}>{t(m)}</p>
                      </Link>
                      <FavButton slug={s.slug} compact />
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* CALENDRIER PERSONNALISÉ */}
          <section>
            <h2 className="text-xl font-bold">{t({ ar: "رزنامتي", fr: "Mon calendrier" })}</h2>
            <div className="mt-4 grid gap-5">
              {Object.entries(byMonth).map(([month, items]) => (
                <div key={month}>
                  <p className="text-sm font-bold text-ink-soft mb-2">{month === "0000-00" ? t({ ar: "جارٍ حاليًا", fr: "En cours" }) : formatDate(month + "-01", lang, { month: "long", year: "numeric" })}</p>
                  <div className="card divide-y divide-line overflow-hidden">{items.map((d) => <ConcoursRow key={d.id} c={d} />)}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* PROFIL + ALERTES */}
        <aside className="grid gap-4 lg:sticky lg:top-24">
          <section className="card p-5">
            <h2 className="font-bold">{t({ ar: "ملفي", fr: "Mon profil" })}</h2>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-ink-soft">{t({ ar: "الباك", fr: "Bac" })}</span><b>{grades.bac}</b>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-ink-soft">{t({ ar: "المعدل", fr: "Moyenne" })}</span><b dir="ltr">{avg != null ? avg.toFixed(2) : "—"}</b>
            </div>
            <Link href="/simulateur" className="btn-ghost w-full mt-4 !py-2.5 text-sm">{t({ ar: "تعديل نقطي", fr: "Modifier mes notes" })}</Link>
          </section>

          <section className="card p-5">
            <div className="flex items-center gap-2"><IconBell width={20} height={20} className="text-brand-600" /><h2 className="font-bold">{t({ ar: "تنبيهاتي", fr: "Mes alertes" })}</h2></div>
            <ul className="mt-4 grid gap-3">
              {toggles.map((o) => (
                <li key={o.k} className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">{t(o)}</span>
                  <button role="switch" aria-checked={!!prefs[o.k]} onClick={() => setPrefs((p) => ({ ...p, [o.k]: !p[o.k] }))}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${prefs[o.k] ? "bg-brand-600" : "bg-line"}`}>
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${prefs[o.k] ? "start-[22px]" : "start-0.5"}`} />
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-ink-faint leading-relaxed">
              {user.via === "whatsapp"
                ? t({ ar: "سنراسلك على", fr: "On t'écrira au" }) + " " + (user.phone || "")
                : t({ ar: "أضف رقمك عبر تسجيل الدخول بواتساب لتلقي التنبيهات.", fr: "Connecte-toi avec WhatsApp pour recevoir les alertes sur ton téléphone." })}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
