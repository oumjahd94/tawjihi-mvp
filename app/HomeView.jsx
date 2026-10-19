"use client";
import Link from "next/link";
import { useLang, useT } from "../components/LangProvider";
import SmartSearch from "../components/SmartSearch";
import SchoolCard from "../components/SchoolCard";
import ConcoursRow from "../components/ConcoursRow";
import NewsCard from "../components/NewsCard";
import AdSlot, { AD_SLOTS } from "../components/AdSlot";
import { IconArrow, IconSpark, IconWhatsapp } from "../components/Icons";
import { DOMAINS } from "../lib/data";
import { SCHOOLS, ESTABLISHMENT_COUNT, schoolBySlug } from "../lib/schools";
import { activeConcours, UPDATED_AT } from "../lib/concours";
import { formatDate } from "../lib/format";

const POPULAR = ["ENSA", "Médecine", "ENCG", "UM6P", "CPGE", "ISCAE", "EST"];

const JOURNEY = [
  { href: "/test", ar: "اكتشف", fr: "Découvrir", d_ar: "اختبار توجيه في 10 أسئلة", d_fr: "Test d'orientation en 10 questions" },
  { href: "/simulateur", ar: "قيّم", fr: "Évaluer", d_ar: "قارن نقطتك بعتبات 2026", d_fr: "Compare ta note aux seuils 2026" },
  { href: "/espace", ar: "نظّم", fr: "S'organiser", d_ar: "مدارسك المفضلة وتنبيهاتك", d_fr: "Tes écoles suivies et tes alertes" },
  { href: "/preparation", ar: "حضّر", fr: "Se préparer", d_ar: "امتحانات سابقة وكويزات", d_fr: "Annales et quiz chronométrés" },
  { href: "/communaute", ar: "شارك", fr: "S'entraider", d_ar: "صالونات ولوائح الانتظار", d_fr: "Salons et listes d'attente" }
];

export default function HomeView({ news }) {
  const t = useT();
  const { lang } = useLang();
  const live = activeConcours().slice(0, 4);
  const [featured, ...rest] = news;
  const counts = Object.fromEntries(DOMAINS.map((d) => [d.slug, SCHOOLS.filter((s) => s.kind === "establishment" && s.domain === d.slug).length]));
  const picks = ["medecine", "ensa", "encg", "um6p", "eniad-berkane", "iscae"].map(schoolBySlug);

  return (
    <>
      {/* HERO */}
      <section className="hero-bg text-white">
        <div className="max-w-6xl mx-auto px-4 pt-12 pb-16 md:pt-16 md:pb-20 grid lg:grid-cols-[1.25fr_1fr] gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium ring-1 ring-white/15">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" /></span>
              {t({ ar: "محدّث في", fr: "Mis à jour le" })} {formatDate(UPDATED_AT, lang, { day: "numeric", month: "long" })}
            </p>
            <h1 className="mt-6 text-[2.5rem] leading-[1.1] md:text-6xl md:leading-[1.05] font-semibold">
              {t({ ar: "مسلكك بعد الباك", fr: "Ton chemin après le bac" })}{" "}
              <span className="text-gold-400">{t({ ar: "يبدأ من هنا.", fr: "commence ici." })}</span>
            </h1>
            <p className="mt-5 text-lg text-white/75 max-w-xl leading-relaxed">
              {t({
                ar: `${ESTABLISHMENT_COUNT} مؤسسة، عتبات 2026، المباريات المفتوحة الآن والمستجدات اليومية. مجانًا.`,
                fr: `${ESTABLISHMENT_COUNT} établissements, les seuils 2026, les concours ouverts en ce moment et l'actualité du jour. Gratuit.`
              })}
            </p>
            <div className="mt-8 max-w-xl"><SmartSearch large /></div>
            <div className="mt-4 flex flex-wrap gap-2">
              {POPULAR.map((p) => (
                <Link key={p} href={`/ecoles?q=${encodeURIComponent(p)}`}
                  className="rounded-full bg-white/5 hover:bg-white/15 ring-1 ring-white/15 px-3 py-1.5 text-sm font-medium transition-colors">{p}</Link>
              ))}
            </div>
          </div>

          {/* EN CE MOMENT : la fraîcheur, raison n°1 de revenir */}
          <div className="rounded-2xl bg-white text-ink shadow-lift overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-5">
              <p className="font-semibold">{t({ ar: "الآن", fr: "En ce moment" })}</p>
              <Link href="/concours" className="text-sm font-semibold text-brand-700 hover:underline">{t({ ar: "كل المباريات", fr: "Tous les concours" })}</Link>
            </div>
            <div className="divide-y divide-line">{live.map((c) => <ConcoursRow key={c.id} c={c} />)}</div>
          </div>
        </div>
      </section>

      {/* ACTUALITÉS */}
      <section className="max-w-6xl mx-auto px-4 mt-14">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="eyebrow">{t({ ar: "المستجدات", fr: "Actualités" })}</p>
            <h2 className="section-title mt-1">{t({ ar: "ما الجديد في التوجيه", fr: "Quoi de neuf dans l'orientation" })}</h2>
          </div>
          <Link href="/actualites" className="text-sm font-semibold text-brand-700 hover:underline">{t({ ar: "كل المستجدات", fr: "Toutes les actualités" })}</Link>
        </div>
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-4">
          {featured && <NewsCard n={featured} featured />}
          <div className="card p-2 divide-y divide-line">{rest.slice(0, 4).map((n) => <NewsCard key={n.slug} n={n} />)}</div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 mt-10"><AdSlot slot={AD_SLOTS.home} /></div>

      {/* PARCOURS */}
      <section className="max-w-6xl mx-auto px-4 mt-14">
        <p className="eyebrow">{t({ ar: "مسارك في 5 خطوات", fr: "Ton parcours en 5 étapes" })}</p>
        <ol className="mt-4 grid grid-cols-2 lg:grid-cols-5 gap-3">
          {JOURNEY.map((s, i) => (
            <li key={s.href} className={i === 4 ? "col-span-2 lg:col-span-1" : ""}>
              <Link href={s.href} className="card h-full p-5 flex flex-col gap-1.5 hover:shadow-lift hover:-translate-y-0.5 transition-all group">
                <span className="text-sm font-semibold text-gold-500" dir="ltr">0{i + 1}</span>
                <span className="text-lg font-semibold">{t(s)}</span>
                <span className="text-sm text-ink-soft leading-relaxed">{t({ ar: s.d_ar, fr: s.d_fr })}</span>
                <IconArrow width={18} height={18} className="mt-auto pt-2 text-ink-faint group-hover:text-brand-600 rtl:rotate-180 transition-colors" />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* EXPLORER PAR DOMAINE */}
      <section className="max-w-6xl mx-auto px-4 mt-14">
        <p className="eyebrow">{t({ ar: "استكشف", fr: "Explorer" })}</p>
        <h2 className="section-title mt-1">{t({ ar: "المدارس حسب المجال", fr: "Les écoles par domaine" })}</h2>
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          {DOMAINS.filter((d) => counts[d.slug]).map((d, i) => (
            <Link key={d.slug} href={`/ecoles?domaine=${d.slug}`}
              className={`rounded-xl2 p-5 border transition-all hover:-translate-y-0.5 hover:shadow-lift ${i === 0 ? "bg-brand-900 text-white border-brand-900 md:col-span-2" : "bg-white border-line"}`}>
              <p className={`text-3xl font-semibold ${i === 0 ? "text-gold-400" : "text-brand-700"}`}>{counts[d.slug]}</p>
              <p className="mt-1 font-semibold">{t(d)}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* SÉLECTION + SIMULATEUR */}
      <section className="max-w-6xl mx-auto px-4 mt-14 grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div className="min-w-0">
          <h2 className="section-title">{t({ ar: "الأكثر بحثًا", fr: "Les plus recherchées" })}</h2>
          <div className="mt-5 grid sm:grid-cols-2 gap-3">{picks.map((s) => <SchoolCard key={s.slug} school={s} />)}</div>
        </div>
        <aside className="grid gap-4 lg:sticky lg:top-24">
          <div className="rounded-xl2 bg-gradient-to-br from-gold-50 to-white border border-gold-100 p-6">
            <IconSpark width={26} height={26} className="text-gold-500" />
            <p className="mt-3 text-xl font-semibold leading-snug">{t({ ar: "هل نقطك كافية؟", fr: "Tes notes suffisent-elles ?" })}</p>
            <p className="mt-2 text-sm text-ink-soft leading-relaxed">{t({ ar: "أدخل نقطك وقارنها مع عتبات 2026 لكل مدرسة.", fr: "Entre tes notes et compare-les aux seuils 2026 de chaque école." })}</p>
            <Link href="/simulateur" className="btn-primary w-full mt-5">{t({ ar: "جرّب المحاكي", fr: "Lancer le simulateur" })}</Link>
            <Link href="/test" className="btn-ghost w-full mt-2">{t({ ar: "اختبار التوجيه", fr: "Faire le test d'orientation" })}</Link>
          </div>
          <div className="rounded-xl2 bg-brand-950 text-white p-6">
            <div className="flex items-center gap-2 text-[#25D366]"><IconWhatsapp /><span className="font-semibold">WhatsApp</span></div>
            <p className="mt-2 font-semibold leading-snug">{t({ ar: "توصل بتنبيه فور فتح التسجيل.", fr: "Reçois une alerte dès qu'une inscription ouvre." })}</p>
            <Link href="/espace" className="btn bg-white text-brand-950 hover:bg-paper w-full mt-4">{t({ ar: "فعّل التنبيهات", fr: "Activer mes alertes" })}</Link>
          </div>
        </aside>
      </section>
    </>
  );
}
