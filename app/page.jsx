"use client";
import Link from "next/link";
import { useT } from "../components/LangProvider";
import SmartSearch from "../components/SmartSearch";
import SchoolCard from "../components/SchoolCard";
import DeadlineRow from "../components/DeadlineRow";
import { IconArrow, IconSpark, IconWhatsapp } from "../components/Icons";
import { SCHOOLS, DEADLINES } from "../lib/data";
import { daysLeft } from "../lib/format";

const POPULAR = ["ENSA", "Médecine", "ENCG", "CPGE", "ISIC", "Architecture"];

// Les 5 étapes du parcours élève : l'ordre a un sens, d'où la numérotation
const JOURNEY = [
  { href: "/test", ar: "اكتشف", fr: "Découvrir", d_ar: "اختبار توجيه في 10 أسئلة", d_fr: "Un test d'orientation en 10 questions" },
  { href: "/simulateur", ar: "قيّم", fr: "Évaluer", d_ar: "حظوظك في كل مدرسة حسب نقطك", d_fr: "Tes chances dans chaque école selon tes notes" },
  { href: "/espace", ar: "نظّم", fr: "S'organiser", d_ar: "رزنامتك وتنبيهات واتساب", d_fr: "Ton calendrier et tes alertes WhatsApp" },
  { href: "/preparation", ar: "حضّر", fr: "Se préparer", d_ar: "امتحانات سابقة وكويزات بالتوقيت", d_fr: "Annales et quiz chronométrés" },
  { href: "/communaute", ar: "شارك", fr: "S'entraider", d_ar: "صالونات حسب الشعبة ولوائح الانتظار", d_fr: "Salons par filière et listes d'attente" }
];

export default function Home() {
  const t = useT();
  const upcoming = DEADLINES.filter((d) => daysLeft(d.date) >= 0).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
  const featured = ["medecine", "ensa", "encg", "cpge", "isic", "est"].map((s) => SCHOOLS.find((x) => x.slug === s));

  return (
    <>
      {/* 1. DÉCOUVERTE — hero bleu Majorelle, la recherche au centre */}
      <section className="zellige-bg text-white">
        <div className="max-w-3xl mx-auto px-4 pt-14 pb-20 md:pt-20 md:pb-28 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium ring-1 ring-white/20">
            <span className="h-2 w-2 rounded-full bg-saffron" /> {t({ ar: "باك 2027 · مجاني 100%", fr: "Bac 2027 · 100 % gratuit" })}
          </p>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-[1.15] tracking-tight">
            {t({ ar: "ماذا ستدرس بعد الباك؟", fr: "Après le bac, tu vas où ?" })}
          </h1>
          <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
            {t({
              ar: "مدرسة، شعبة أو مهنة: ابحث، قارن حظوظك، ولا تفوّت أي أجل.",
              fr: "Une école, une filière, un métier : cherche, mesure tes chances, et ne rate plus aucune date."
            })}
          </p>
          <div className="mt-8"><SmartSearch large /></div>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {POPULAR.map((p) => (
              <Link key={p} href={`/ecoles?q=${encodeURIComponent(p)}`}
                className="rounded-full bg-white/10 hover:bg-white/20 ring-1 ring-white/20 px-3 py-1.5 text-sm font-medium transition-colors">
                {p}
              </Link>
            ))}
          </div>
          <Link href="/test"
            className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-saffron text-ink px-6 py-4 font-bold shadow-lift hover:brightness-105 transition">
            <IconSpark width={20} height={20} />
            {t({ ar: "لا تعرف ماذا تختار؟ اختبار في 3 دقائق", fr: "Tu ne sais pas quoi choisir ? Test en 3 minutes" })}
          </Link>
        </div>
      </section>

      {/* LE PARCOURS EN 5 ÉTAPES */}
      <section className="max-w-6xl mx-auto px-4 -mt-10 relative z-10">
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {JOURNEY.map((s, i) => (
            <li key={s.href}>
              <Link href={s.href} className="card h-full p-5 flex flex-col gap-2 hover:shadow-lift hover:-translate-y-0.5 transition-all group">
                <span className="text-sm font-bold text-majorelle" dir="ltr">0{i + 1}</span>
                <span className="text-lg font-bold">{t(s)}</span>
                <span className="text-sm text-ink-soft leading-relaxed">{t({ ar: s.d_ar, fr: s.d_fr })}</span>
                <IconArrow width={18} height={18} className="mt-auto text-ink-faint group-hover:text-majorelle rtl:rotate-180 transition-colors" />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <div className="max-w-6xl mx-auto px-4 mt-16 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
        {/* ÉCOLES POPULAIRES */}
        <section className="min-w-0">
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="eyebrow">{t({ ar: "الأكثر بحثًا", fr: "Les plus recherchées" })}</p>
              <h2 className="text-2xl font-bold mt-1">{t({ ar: "المدارس والشعب", fr: "Écoles & filières" })}</h2>
            </div>
            <Link href="/ecoles" className="text-sm font-semibold text-majorelle hover:underline">
              {t({ ar: "كل المدارس", fr: "Toutes les écoles" })}
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {featured.map((s) => <SchoolCard key={s.slug} school={s} />)}
          </div>
        </section>

        {/* DEADLINES + ALERTES */}
        <aside>
          <p className="eyebrow">{t({ ar: "لا تفوّت", fr: "À ne pas rater" })}</p>
          <h2 className="text-2xl font-bold mt-1 mb-5">{t({ ar: "المواعيد القادمة", fr: "Prochaines dates" })}</h2>
          <div className="card divide-y divide-line overflow-hidden">
            {upcoming.map((d) => <DeadlineRow key={d.id} d={d} />)}
          </div>
          <div className="mt-4 rounded-xl2 bg-ink text-white p-5">
            <div className="flex items-center gap-2 text-mint"><IconWhatsapp /><span className="font-bold">WhatsApp</span></div>
            <p className="mt-2 font-semibold leading-snug">
              {t({ ar: "توصل بتنبيه على هاتفك فور فتح التسجيل.", fr: "Reçois une alerte sur ton téléphone dès qu'une inscription ouvre." })}
            </p>
            <Link href="/espace" className="mt-4 btn bg-white text-ink hover:bg-paper w-full">
              {t({ ar: "فعّل التنبيهات", fr: "Activer mes alertes" })}
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
