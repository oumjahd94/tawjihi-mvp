"use client";
import { useState } from "react";
import Link from "next/link";
import { useT } from "../../../components/LangProvider";
import KhatamGauge from "../../../components/KhatamGauge";
import FavButton from "../../../components/FavButton";
import ThresholdChart from "../../../components/ThresholdChart";
import DeadlineRow from "../../../components/DeadlineRow";
import { DEADLINES, ROOMS, DOMAINS } from "../../../lib/data";
import { chances, TIER_META, formulaLabel, selectionScore } from "../../../lib/scoring";
import { schoolBySlug, feesLabel } from "../../../lib/format";
import { useGrades } from "../../../lib/store";

const ACCESS = {
  "seuil+concours": { ar: "انتقاء أولي + مباراة", fr: "Présélection + concours" },
  seuil: { ar: "انتقاء حسب العتبة", fr: "Sélection sur seuil" },
  dossier: { ar: "دراسة الملف", fr: "Étude de dossier" },
  ouvert: { ar: "ولوج مفتوح", fr: "Accès ouvert" }
};

export default function SchoolView({ slug }) {
  const t = useT();
  const s = schoolBySlug(slug);
  const [grades] = useGrades();
  const bacs = Object.keys(s.thresholds);
  const [bac, setBac] = useState(bacs.includes(grades.bac) ? grades.bac : bacs[0]);
  const c = chances(s, grades.bac, grades, grades.estimated);
  const meta = TIER_META[c.tier];
  const deadlines = DEADLINES.filter((d) => d.school === slug).sort((a, b) => a.date.localeCompare(b.date));
  const room = ROOMS.find((r) => r.school === slug);
  const domain = DOMAINS.find((d) => d.slug === s.domain);
  const myScore = bac === grades.bac ? selectionScore(grades, s.weights) : null;

  const facts = [
    { l: { ar: "المدة", fr: "Durée" }, v: `${s.years} ${t({ ar: "سنوات", fr: "ans" })}` },
    { l: { ar: "الدبلوم", fr: "Diplôme" }, v: t({ ar: s.diploma_ar, fr: s.diploma_fr }) },
    { l: { ar: "الرسوم", fr: "Frais" }, v: feesLabel(s.fees, t) },
    { l: { ar: "الولوج", fr: "Accès" }, v: t(ACCESS[s.access]) }
  ];

  return (
    <article className="pb-10">
      {/* EN-TÊTE */}
      <header className="bg-white border-b border-line">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-10 flex flex-col md:flex-row md:items-end gap-6 justify-between">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 shrink-0 rounded-2xl bg-majorelle text-white grid place-items-center font-bold text-sm text-center leading-tight px-1">
              {s.acronym}
            </div>
            <div>
              <Link href={`/ecoles?domaine=${s.domain}`} className="eyebrow hover:underline">{t(domain)}</Link>
              <h1 className="mt-1 text-2xl md:text-3xl font-bold leading-tight max-w-2xl">{t(s)}</h1>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.cities.map((city) => <span key={city} className="rounded-md bg-paper px-2 py-1 text-xs font-medium text-ink-soft">{city}</span>)}
              </div>
            </div>
          </div>
          <FavButton slug={slug} />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        <div className="grid gap-8 min-w-0">
          {/* L'ESSENTIEL */}
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {facts.map((f) => (
              <div key={f.l.fr} className="card p-4">
                <dt className="text-xs font-semibold text-ink-faint">{t(f.l)}</dt>
                <dd className="mt-1 font-bold leading-snug">{f.v}</dd>
              </div>
            ))}
          </dl>

          {/* HISTORIQUE DES SEUILS */}
          {bacs.length > 0 && (
            <section className="card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-bold">{t({ ar: "العتبات خلال 5 سنوات", fr: "Seuils sur 5 ans" })}</h2>
                <div className="flex gap-1 rounded-xl bg-paper p-1 text-sm font-semibold">
                  {bacs.map((b) => (
                    <button key={b} onClick={() => setBac(b)} className={`rounded-lg px-3 py-1.5 ${bac === b ? "bg-white shadow-card" : "text-ink-soft"}`}>{b}</button>
                  ))}
                </div>
              </div>
              <div className="mt-4"><ThresholdChart series={s.thresholds[bac]} score={myScore} t={t} /></div>
              <p className="mt-3 text-sm text-ink-soft">
                {t({ ar: "صيغة الحساب:", fr: "Formule :" })} <b className="text-ink">{formulaLabel(s.weights, t)}</b>
                <span className="text-ink-faint"> · * {t({ ar: "توقع", fr: "projection" })}</span>
              </p>
            </section>
          )}

          {/* DÉBOUCHÉS */}
          <section>
            <h2 className="text-xl font-bold">{t({ ar: "الآفاق والرواتب", fr: "Débouchés & salaires" })}</h2>
            <ul className="mt-4 grid sm:grid-cols-2 gap-3">
              {s.careers.map((c) => (
                <li key={c.fr} className="card p-4">
                  <p className="font-semibold">{t(c)}</p>
                  <p className="mt-1 text-sm text-ink-soft" dir="ltr">
                    {c.min.toLocaleString("fr-MA")} – {c.max.toLocaleString("fr-MA")} DH / {t({ ar: "شهر", fr: "mois" })}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* RÉALITÉ TERRAIN */}
          <section className="rounded-xl2 bg-ink text-white p-6">
            <p className="eyebrow !text-saffron">{t({ ar: "بدون تجميل", fr: "Sans filtre" })}</p>
            <h2 className="mt-1 text-xl font-bold">{t({ ar: "الواقع كما هو", fr: "La réalité du terrain" })}</h2>
            <p className="mt-3 text-white/85 leading-relaxed">{t({ ar: s.reality_ar, fr: s.reality_fr })}</p>
          </section>

          {/* AVIS */}
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">{t({ ar: "آراء الطلبة", fr: "Avis d'étudiants" })}</h2>
              <span className="rounded-md bg-saffron-soft text-saffron px-2 py-1 text-xs font-bold">
                {t({ ar: "أمثلة تجريبية", fr: "Exemples fictifs (démo)" })}
              </span>
            </div>
            <ul className="mt-4 grid gap-3">
              {s.reviews.map((r, i) => (
                <li key={i} className="card p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink-soft">{r.who}</p>
                    <p className="text-saffron tracking-widest" aria-label={`${r.stars}/5`}>{"★".repeat(r.stars)}<span className="text-line">{"★".repeat(5 - r.stars)}</span></p>
                  </div>
                  <p className="mt-2 leading-relaxed">{t(r)}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* COLONNE : MES CHANCES + DATES + COMMUNAUTÉ */}
        <aside className="grid gap-4 min-w-0 lg:sticky lg:top-24">
          <section className="card p-6 text-center">
            <h2 className="font-bold">{t({ ar: "حظوظك في هذه المدرسة", fr: "Tes chances ici" })}</h2>
            <div className="mt-4 mx-auto w-fit">
              <KhatamGauge size={130} value={c.prob ?? null} color={meta.color} label={c.tier === "open" ? "∞" : c.tier === "unknown" ? "?" : "•"} />
            </div>
            <p className={`mt-4 inline-block rounded-full px-3 py-1 text-sm font-bold ${meta.cls}`}>{t(meta)}</p>
            {c.tier === "unknown" && (
              <Link href="/simulateur" className="btn-primary w-full mt-4">{t({ ar: "أدخل نقطي", fr: "Entrer mes notes" })}</Link>
            )}
            {c.score != null && (
              <p className="mt-3 text-sm text-ink-soft" dir="ltr">{c.score.toFixed(2)} → {c.projected.toFixed(2)}</p>
            )}
          </section>

          {deadlines.length > 0 && (
            <section className="card overflow-hidden">
              <h2 className="font-bold px-4 pt-4">{t({ ar: "المواعيد", fr: "Dates clés" })}</h2>
              <div className="divide-y divide-line">{deadlines.map((d) => <DeadlineRow key={d.id} d={d} />)}</div>
            </section>
          )}

          {room && (
            <Link href={`/communaute?salon=${room.slug}`} className="card p-5 hover:shadow-lift transition-shadow">
              <p className="font-bold">{t({ ar: "انضم إلى صالون", fr: "Rejoindre le salon" })} {t(room)}</p>
              <p className="mt-1 text-sm text-ink-soft">{t({ ar: "أسئلة، تجارب، ولوائح الانتظار مباشرة.", fr: "Questions, retours d'expérience et listes d'attente en direct." })}</p>
            </Link>
          )}
        </aside>
      </div>
    </article>
  );
}
