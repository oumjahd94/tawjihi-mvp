"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useT } from "../../components/LangProvider";
import KhatamGauge from "../../components/KhatamGauge";
import FavButton from "../../components/FavButton";
import ThresholdChart from "../../components/ThresholdChart";
import { BAC_TYPES, SCHOOLS, DOMAINS } from "../../lib/data";
import { bacAverage, chances, TIER_META, formulaLabel, isFilled } from "../../lib/scoring";
import { useGrades } from "../../lib/store";

const FIELDS = [
  { key: "regional", weight: 25, ar: "الامتحان الجهوي", fr: "Examen régional" },
  { key: "cc", weight: 25, ar: "المراقبة المستمرة", fr: "Contrôle continu" },
  { key: "national", weight: 50, ar: "الامتحان الوطني", fr: "Examen national" }
];

const FILTERS = [
  { key: "all", ar: "الكل", fr: "Tout" },
  { key: "green", ar: "حظوظ جيدة", fr: "Bonnes chances" },
  { key: "orange", ar: "ممكن", fr: "Jouable" },
  { key: "red", ar: "صعب", fr: "Difficile" }
];

export default function Simulateur() {
  const t = useT();
  const [grades, setGrades] = useGrades();
  const [filter, setFilter] = useState("all");
  const [domain, setDomain] = useState("all");
  const [openSlug, setOpenSlug] = useState(null);

  const avg = bacAverage(grades);
  const ready = isFilled(grades);

  const results = useMemo(() => {
    const order = { green: 0, orange: 1, red: 2, dossier: 3, open: 4, unknown: 5, na: 6 };
    return SCHOOLS
      .map((s) => ({ school: s, c: chances(s, grades.bac, grades, grades.estimated) }))
      .filter(({ c }) => c.tier !== "na")
      .sort((a, b) => order[a.c.tier] - order[b.c.tier] || (b.c.prob ?? 0) - (a.c.prob ?? 0));
  }, [grades]);

  const shown = results.filter(({ school, c }) =>
    (filter === "all" || c.tier === filter) && (domain === "all" || school.domain === domain));
  const counts = { green: 0, orange: 0, red: 0 };
  results.forEach(({ c }) => { if (counts[c.tier] != null) counts[c.tier]++; });

  function setField(key, raw) {
    const v = raw === "" ? null : Math.min(20, Math.max(0, parseFloat(raw.replace(",", "."))));
    setGrades((g) => ({ ...g, [key]: Number.isNaN(v) ? null : v }));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-10 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 items-start">
      {/* FORMULAIRE — collant sur desktop */}
      <section className="min-w-0 lg:sticky lg:top-24 card p-6">
        <p className="eyebrow">{t({ ar: "الخطوة 2 · قيّم", fr: "Étape 2 · Évaluer" })}</p>
        <h1 className="mt-1 text-2xl font-bold">{t({ ar: "محاكي العتبات", fr: "Simulateur de seuils" })}</h1>

        <label className="block mt-6">
          <span className="text-sm font-semibold">{t({ ar: "نوع الباكالوريا", fr: "Type de bac" })}</span>
          <select className="input mt-1.5" value={grades.bac} onChange={(e) => setGrades((g) => ({ ...g, bac: e.target.value }))}>
            {BAC_TYPES.map((b) => <option key={b.code} value={b.code}>{t(b)}</option>)}
          </select>
        </label>

        <div className="mt-5 grid gap-4">
          {FIELDS.map((f) => (
            <label key={f.key} className="block">
              <span className="flex items-center justify-between text-sm font-semibold">
                {t(f)}
                <span className="rounded-md bg-majorelle-soft text-majorelle px-2 py-0.5 text-xs" dir="ltr">{f.weight}%</span>
              </span>
              <input type="number" inputMode="decimal" step="0.01" min="0" max="20" dir="ltr" placeholder="14.50"
                className="input mt-1.5 text-lg font-semibold"
                value={grades[f.key] ?? ""} onChange={(e) => setField(f.key, e.target.value)} />
            </label>
          ))}
        </div>

        {/* Note nationale estimée ou réelle */}
        <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-paper p-1 text-sm font-semibold">
          {[true, false].map((est) => (
            <button key={String(est)} onClick={() => setGrades((g) => ({ ...g, estimated: est }))}
              className={`rounded-lg py-2 transition-colors ${grades.estimated === est ? "bg-white shadow-card text-ink" : "text-ink-soft"}`}>
              {est ? t({ ar: "الوطني تقديري", fr: "National estimé" }) : t({ ar: "الوطني نهائي", fr: "National réel" })}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-ink text-white p-4 flex items-center justify-between">
          <span className="text-sm text-white/70">{t({ ar: "المعدل العام للباك", fr: "Moyenne générale du bac" })}</span>
          <span className="text-2xl font-bold" dir="ltr">{avg != null ? avg.toFixed(2) : "—"}</span>
        </div>
        <p className="mt-3 text-xs text-ink-faint leading-relaxed">
          {t({
            ar: "انتبه: كل مدرسة تستعمل صيغتها الخاصة (مثلًا 75% وطني + 25% جهوي). نحسبها لك تلقائيًا.",
            fr: "Attention : chaque école a sa propre formule (ex. 75 % national + 25 % régional). On la calcule pour toi."
          })}
        </p>
      </section>

      {/* RÉSULTATS */}
      <section className="min-w-0">
        {!ready ? (
          <div className="card p-10 text-center">
            <div className="mx-auto w-fit"><KhatamGauge size={110} value={null} label="?" color="#2F45D0" /></div>
            <h2 className="mt-6 text-xl font-bold">{t({ ar: "أدخل نقطك الثلاث", fr: "Entre tes trois notes" })}</h2>
            <p className="mt-2 text-ink-soft max-w-md mx-auto">
              {t({
                ar: "سنقارنها مع عتبات آخر 5 سنوات لكل مدرسة ونعطيك نسبة حظوظك.",
                fr: "On les compare aux seuils des 5 dernières années de chaque école et on te donne tes chances en %."
              })}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              {["green", "orange", "red"].map((k) => (
                <button key={k} onClick={() => setFilter(filter === k ? "all" : k)}
                  className={`card p-4 text-start transition-all ${filter === k ? "ring-2 ring-offset-2" : ""}`}
                  style={filter === k ? { "--tw-ring-color": TIER_META[k].color } : undefined}>
                  <p className="text-3xl font-bold" style={{ color: TIER_META[k].color }}>{counts[k]}</p>
                  <p className="text-sm font-semibold text-ink-soft">{t(TIER_META[k])}</p>
                </button>
              ))}
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              <button onClick={() => setDomain("all")} className={`chip shrink-0 ${domain === "all" ? "!bg-ink !text-white !border-ink" : ""}`}>
                {t({ ar: "كل المجالات", fr: "Tous les domaines" })}
              </button>
              {DOMAINS.map((d) => (
                <button key={d.slug} onClick={() => setDomain(d.slug)}
                  className={`chip shrink-0 ${domain === d.slug ? "!bg-ink !text-white !border-ink" : ""}`}>{t(d)}</button>
              ))}
            </div>

            <ul className="mt-5 grid gap-3">
              {shown.map(({ school, c }) => {
                const meta = TIER_META[c.tier];
                const open = openSlug === school.slug;
                return (
                  <li key={school.slug} className="card overflow-hidden">
                    <div className="p-5 flex items-center gap-4">
                      <KhatamGauge size={76} value={c.prob ?? null} color={meta.color} label={c.tier === "open" ? "∞" : "•"} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold tracking-wider text-majorelle">{school.acronym}</p>
                        <Link href={`/ecoles/${school.slug}`} className="font-bold leading-snug hover:text-majorelle">{t(school)}</Link>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${meta.cls}`}>{t(meta)}</span>
                          {c.score != null && (
                            <span className="text-ink-soft" dir="ltr">
                              {c.score.toFixed(2)} vs {c.projected.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <FavButton slug={school.slug} compact />
                        {c.series && (
                          <button onClick={() => setOpenSlug(open ? null : school.slug)}
                            className="text-xs font-semibold text-majorelle hover:underline whitespace-nowrap">
                            {open ? t({ ar: "إخفاء", fr: "Masquer" }) : t({ ar: "التفاصيل", fr: "Détails" })}
                          </button>
                        )}
                      </div>
                    </div>
                    {open && c.series && (
                      <div className="border-t border-line bg-paper/60 p-5 grid md:grid-cols-[1fr_220px] gap-5">
                        <ThresholdChart series={c.series} score={c.score} t={t} />
                        <dl className="text-sm grid gap-3 content-start">
                          <div><dt className="text-ink-faint">{t({ ar: "صيغة الحساب", fr: "Formule de l'école" })}</dt><dd className="font-semibold">{formulaLabel(school.weights, t)}</dd></div>
                          <div><dt className="text-ink-faint">{t({ ar: "العتبة المتوقعة", fr: "Seuil projeté" })}</dt><dd className="font-semibold text-saffron" dir="ltr">{c.projected.toFixed(2)}</dd></div>
                          <div><dt className="text-ink-faint">{t({ ar: "المنحى", fr: "Tendance" })}</dt><dd className="font-semibold" dir="ltr">{c.slope >= 0 ? "↗ +" : "↘ "}{c.slope.toFixed(2)} / {t({ ar: "سنة", fr: "an" })}</dd></div>
                        </dl>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 text-xs text-ink-faint leading-relaxed">
              {t({
                ar: "⚠️ النسب تقديرية مبنية على عتبات السنوات الماضية (بيانات تجريبية). العتبات الحقيقية تتغير كل سنة: تحقق دائمًا من المصادر الرسمية.",
                fr: "⚠️ Probabilités estimées à partir des seuils passés (données de démo). Les seuils réels changent chaque année : vérifie toujours les sources officielles."
              })}
            </p>
          </>
        )}
      </section>
    </div>
  );
}
