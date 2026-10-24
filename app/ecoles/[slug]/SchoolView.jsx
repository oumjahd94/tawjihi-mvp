"use client";
import Link from "next/link";
import { useT } from "../../../components/LangProvider";
import { VerdictGauge } from "../../../components/KhatamGauge";
import FavButton from "../../../components/FavButton";
import ConcoursRow from "../../../components/ConcoursRow";
import { IconExternal } from "../../../components/Icons";
import { DOMAINS, BAC_TYPES, ROOMS } from "../../../lib/data";
import { univName, CITY_AR } from "../../../lib/schools";
import { useConcours, useSchools } from "../../../components/ContentProvider";
import { verdict, TIER_META, formulaLabel, seuilFor, fmtSeuil } from "../../../lib/scoring";
import { feesLabel, TYPE_META, ACCESS_META } from "../../../lib/format";
import { useGrades } from "../../../lib/store";

export default function SchoolView({ slug }) {
  const t = useT();
  const schools = useSchools();
  const { active } = useConcours();
  const s = schools.find((x) => x.slug === slug);
  const [grades] = useGrades();
  const parent = s.network ? schools.find((x) => x.slug === s.network) : null;
  const members = s.kind === "network" ? schools.filter((x) => x.kind === "establishment" && x.network === s.slug) : [];
  const v = verdict(s, grades.bac, grades);
  const meta = TIER_META[v.tier];
  const domain = DOMAINS.find((d) => d.slug === s.domain);
  const key = s.network || s.slug;
  const concours = active.filter((c) => c.school === key);
  const room = ROOMS.find((r) => r.school === key);
  const univ = s.univ ? univName(s.univ) : null;
  const bacsWithSeuil = s.seuil ? BAC_TYPES.filter((b) => s.seuil.byBac[b.code] != null) : [];

  const facts = [
    { l: { ar: "المدة", fr: "Durée" }, v: `${s.years} ${t({ ar: "سنوات", fr: "ans" })}` },
    { l: { ar: "الدبلوم", fr: "Diplôme" }, v: t({ ar: s.diploma_ar || s.diploma_fr, fr: s.diploma_fr }) },
    { l: { ar: "الرسوم", fr: "Frais" }, v: feesLabel(s, t) },
    { l: { ar: "الولوج", fr: "Accès" }, v: t(ACCESS_META[s.access]) }
  ];

  return (
    <article className="pb-6">
      <header className="bg-white border-b border-line">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
          <nav className="text-sm text-ink-faint flex flex-wrap gap-1.5">
            <Link href="/ecoles" className="hover:text-brand-700">{t({ ar: "المدارس", fr: "Écoles" })}</Link>
            {parent && <><span>/</span><Link href={`/ecoles/${parent.slug}`} className="hover:text-brand-700">{parent.acronym}</Link></>}
          </nav>
          <div className="mt-4 flex flex-col md:flex-row md:items-end gap-6 justify-between">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 shrink-0 rounded-2xl bg-brand-900 text-gold-300 grid place-items-center font-semibold text-xs text-center leading-tight px-1">
                {s.acronym.split(" ")[0]}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/ecoles?domaine=${s.domain}`} className="eyebrow hover:underline">{t(domain)}</Link>
                  <span className="rounded-md bg-paper px-2 py-0.5 text-xs font-semibold text-ink-soft">{t(TYPE_META[s.type])}</span>
                  {s.isNew && <span className="rounded-md bg-gold-400 text-brand-950 px-2 py-0.5 text-xs font-bold">{t({ ar: "جديد", fr: "Nouveau" })}</span>}
                </div>
                <h1 className="mt-1.5 text-2xl md:text-[2rem] font-semibold leading-tight max-w-3xl">{t(s)}</h1>
                <p className="mt-2 text-ink-soft">
                  {s.city && t({ fr: s.city, ar: CITY_AR[s.city] })}
                  {univ && <> · {t(univ)}</>}
                  {s.kind === "network" && (s.cities_fr || `${members.length} ${t({ ar: "مؤسسة", fr: "établissements" })}`)}
                </p>
              </div>
            </div>
            <FavButton slug={slug} />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">
        <div className="grid gap-8 min-w-0">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {facts.map((f) => (
              <div key={f.l.fr} className="card p-4">
                <dt className="text-xs font-semibold text-ink-faint">{t(f.l)}</dt>
                <dd className="mt-1 font-semibold leading-snug">{f.v}</dd>
              </div>
            ))}
          </dl>

          {(s.facts_fr || s.facts_ar) && (
            <p className="text-ink leading-relaxed">
              {t({ fr: s.facts_fr, ar: s.facts_ar || s.facts_fr })}
              {s.factsSource && <a href={s.factsSource.url} target="_blank" rel="noopener noreferrer" className="ms-2 text-sm text-brand-600 hover:underline"><bdi>({s.factsSource.label})</bdi></a>}
            </p>
          )}

          {/* SEUILS */}
          {s.seuil && (
            <section className="card p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-xl font-semibold">{t({ ar: "عتبات الانتقاء", fr: "Seuils de présélection" })} {s.seuil.year}</h2>
                <p className="text-sm text-ink-soft">{t({ ar: "الصيغة:", fr: "Formule :" })} <b className="text-ink">{formulaLabel(s.weights, t)}</b></p>
              </div>
              <ul className="mt-4 grid sm:grid-cols-2 gap-2">
                {bacsWithSeuil.map((b) => (
                  <li key={b.code} className={`flex items-center justify-between rounded-xl px-4 py-3 ${b.code === grades.bac ? "bg-brand-50 ring-1 ring-brand-200" : "bg-paper"}`}>
                    <span className="text-sm font-medium">{t(b)}</span>
                    <b className="text-brand-800" dir="ltr">{fmtSeuil(seuilFor(s, b.code))}</b>
                  </li>
                ))}
              </ul>
              {s.history && (
                <p className="mt-4 text-sm text-ink-soft" dir="ltr">
                  {t({ ar: "التطور:", fr: "Évolution :" })} {s.history.map((h) => `${h.year} : ${h.value}`).join("  ·  ")}
                </p>
              )}
              {s.seuil.note_fr && <p className="mt-3 text-sm text-ink-soft">{t({ fr: s.seuil.note_fr, ar: s.seuil.note_ar })}</p>}
              <p className="mt-4 text-xs text-ink-faint leading-relaxed">
                {t({ ar: "العتبة حد أدنى لاجتياز المباراة وليست قبولًا نهائيًا. المصدر:", fr: "Le seuil est un minimum pour passer le concours, pas une admission. Source :" })}{" "}
                <a href={s.seuil.source.url} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">{s.seuil.source.label}</a>
              </p>
            </section>
          )}

          {/* ÉTABLISSEMENTS DU RÉSEAU */}
          {members.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold">{t({ ar: "مؤسسات الشبكة", fr: "Les établissements du réseau" })} <span className="text-ink-faint">({members.length})</span></h2>
              <ul className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {members.map((m) => (
                  <li key={m.slug}>
                    <Link href={`/ecoles/${m.slug}`} className="card px-4 py-3 flex items-center justify-between gap-2 hover:border-brand-500 transition-colors">
                      <span className="min-w-0">
                        <span className="block font-semibold truncate">{m.kind === "establishment" && s.custom ? m.acronym : t({ fr: m.city, ar: CITY_AR[m.city] })}</span>
                        <span className="block text-xs text-ink-faint truncate">{s.custom ? t(m) : m.univ ? t(univName(m.univ)) : m.acronym}</span>
                      </span>
                      {m.seuil && m.seuil !== s.seuil && <b className="text-sm text-brand-700" dir="ltr">{fmtSeuil(seuilFor(m, m.bacs[0]))}</b>}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* DÉBOUCHÉS */}
          {s.careers && (
            <section>
              <h2 className="text-xl font-semibold">{t({ ar: "الآفاق المهنية", fr: "Débouchés" })}</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {s.careers.map((c) => <li key={c.fr} className="rounded-xl bg-white border border-line px-4 py-2.5 font-medium">{t(c)}</li>)}
              </ul>
            </section>
          )}

          {(s.reality_fr) && (
            <section className="rounded-xl2 bg-brand-950 text-white p-6">
              <p className="eyebrow !text-gold-300">{t({ ar: "بدون تجميل", fr: "Sans filtre" })}</p>
              <h2 className="mt-1 text-xl font-semibold">{t({ ar: "الواقع كما هو", fr: "La réalité du terrain" })}</h2>
              <p className="mt-3 text-white/80 leading-relaxed">{t({ ar: s.reality_ar, fr: s.reality_fr })}</p>
            </section>
          )}

          <section className="card p-6 text-center">
            <h2 className="font-semibold">{t({ ar: "آراء الطلبة", fr: "Avis d'étudiants" })}</h2>
            <p className="mt-1 text-sm text-ink-soft">{t({ ar: "لا توجد آراء بعد. هل درست هنا؟ شارك تجربتك قريبًا من فضائك.", fr: "Pas encore d'avis. Tu étudies ici ? Tu pourras bientôt partager ton expérience depuis ton espace." })}</p>
          </section>
        </div>

        <aside className="grid gap-4 min-w-0 lg:sticky lg:top-24">
          <section className="card p-6 text-center">
            <h2 className="font-semibold">{t({ ar: "وضعيتك", fr: "Ta situation" })}</h2>
            <div className="mt-4 mx-auto w-fit"><VerdictGauge v={v} meta={meta} size={120} t={t} /></div>
            <p className={`mt-4 inline-block rounded-full px-3 py-1 text-sm font-semibold ${meta.cls}`}>{t(meta)}</p>
            {v.score != null && <p className="mt-2 text-sm text-ink-soft" dir="ltr">{v.score.toFixed(2)} / {t({ ar: "عتبة", fr: "seuil" })} {fmtSeuil(v)}</p>}
            {v.tier === "unknown" && <Link href="/simulateur" className="btn-primary w-full mt-4">{t({ ar: "أدخل نقطي", fr: "Entrer mes notes" })}</Link>}
            {s.apply && (
              <a href={s.apply} target="_blank" rel="noopener noreferrer" className="btn-ghost w-full mt-3 text-sm">
                {t({ ar: "منصة الترشيح", fr: "Plateforme de candidature" })} <IconExternal width={14} height={14} />
              </a>
            )}
          </section>

          {concours.length > 0 && (
            <section className="card overflow-hidden">
              <h2 className="font-semibold px-4 pt-4">{t({ ar: "المواعيد", fr: "Dates clés" })}</h2>
              <div className="divide-y divide-line">{concours.map((c) => <ConcoursRow key={c.id} c={c} />)}</div>
            </section>
          )}

          {room && (
            <Link href={`/communaute?salon=${room.slug}`} className="card p-5 hover:shadow-lift transition-shadow">
              <p className="font-semibold">{t({ ar: "انضم إلى صالون", fr: "Rejoindre le salon" })} {t(room)}</p>
              <p className="mt-1 text-sm text-ink-soft">{t({ ar: "أسئلة وتجارب ولوائح الانتظار مباشرة.", fr: "Questions, retours d'expérience et listes d'attente en direct." })}</p>
            </Link>
          )}
        </aside>
      </div>
    </article>
  );
}
