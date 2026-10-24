"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useT } from "../../components/LangProvider";
import KhatamGauge, { VerdictGauge } from "../../components/KhatamGauge";
import FavButton from "../../components/FavButton";
import { BAC_TYPES } from "../../lib/data";
import { useSimulatorSchools, useSeuilYear } from "../../components/ContentProvider";
import { bacAverage, verdict, TIER_META, formulaLabel, isFilled, fmtSeuil } from "../../lib/scoring";
import { useGrades } from "../../lib/store";

const FIELDS = [
  { key: "regional", weight: 25, ar: "الامتحان الجهوي", fr: "Examen régional" },
  { key: "cc", weight: 25, ar: "المراقبة المستمرة", fr: "Contrôle continu" },
  { key: "national", weight: 50, ar: "الامتحان الوطني", fr: "Examen national" }
];
const ORDER = { good: 0, ok: 1, close: 2, below: 3 };

export default function Simulateur() {
  const t = useT();
  const [grades, setGrades] = useGrades();
  const [filter, setFilter] = useState("all");
  const simSchools = useSimulatorSchools();
  const Y = useSeuilYear();
  const avg = bacAverage(grades);
  const ready = isFilled(grades);

  const { results, excluded } = useMemo(() => {
    const all = simSchools.map((s) => ({ school: s, v: verdict(s, grades.bac, grades) }));
    return {
      results: all.filter(({ v }) => ORDER[v.tier] != null).sort((a, b) => ORDER[a.v.tier] - ORDER[b.v.tier] || b.v.margin - a.v.margin),
      excluded: all.filter(({ v }) => v.tier === "na" || v.tier === "noseuil")
    };
  }, [grades, simSchools]);

  const counts = { good: 0, ok: 0, close: 0, below: 0 };
  results.forEach(({ v }) => counts[v.tier]++);
  const shown = results.filter(({ v }) => filter === "all" || v.tier === filter);

  function setField(key, raw) {
    const n = parseFloat(String(raw).replace(",", "."));
    setGrades((g) => ({ ...g, [key]: raw === "" || Number.isNaN(n) ? null : Math.min(20, Math.max(0, n)) }));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-10 pb-6 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 items-start">
      <section className="min-w-0 lg:sticky lg:top-24 card p-6">
        <p className="eyebrow">{t({ ar: "قيّم", fr: "Évaluer" })}</p>
        <h1 className="mt-1 text-2xl font-semibold">{t({ ar: `محاكي العتبات ${Y}`, fr: `Simulateur de seuils ${Y}` })}</h1>

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
                <span className="rounded-md bg-brand-50 text-brand-700 px-2 py-0.5 text-xs" dir="ltr">{f.weight}%</span>
              </span>
              <input type="number" inputMode="decimal" step="0.01" min="0" max="20" dir="ltr" placeholder="14.50"
                className="input mt-1.5 text-lg font-semibold" value={grades[f.key] ?? ""} onChange={(e) => setField(f.key, e.target.value)} />
            </label>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-brand-950 text-white p-4 flex items-center justify-between">
          <span className="text-sm text-white/70">{t({ ar: "المعدل العام للباك", fr: "Moyenne générale du bac" })}</span>
          <span className="text-2xl font-semibold" dir="ltr">{avg != null ? avg.toFixed(2) : "—"}</span>
        </div>
        <p className="mt-3 text-xs text-ink-faint leading-relaxed">
          {t({
            ar: "الانتقاء في أغلب المدارس يحتسب بـ 75% وطني + 25% جهوي (المراقبة المستمرة لا تدخل). نحسب لكل مدرسة صيغتها.",
            fr: "Pour la plupart des écoles, la présélection se calcule avec 75 % national + 25 % régional (le contrôle continu ne compte pas). On applique la formule de chaque école."
          })}
        </p>
      </section>

      <section className="min-w-0">
        {!ready ? (
          <div className="card p-10 text-center">
            <div className="mx-auto w-fit"><KhatamGauge size={110} value={null} label="?" /></div>
            <h2 className="mt-6 text-xl font-semibold">{t({ ar: "أدخل نقطك الثلاث", fr: "Entre tes trois notes" })}</h2>
            <p className="mt-2 text-ink-soft max-w-md mx-auto">
              {t({ ar: `سنقارن نقطتك مع عتبات الانتقاء لسنة ${Y} في كل مدرسة نشرت عتبتها.`, fr: `On compare ta note aux seuils de présélection ${Y} de chaque école qui a publié le sien.` })}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.keys(counts).map((k) => (
                <button key={k} onClick={() => setFilter(filter === k ? "all" : k)}
                  className={`card p-4 text-start transition-all ${filter === k ? "ring-2" : ""}`} style={filter === k ? { "--tw-ring-color": TIER_META[k].color } : undefined}>
                  <p className="text-3xl font-semibold" style={{ color: TIER_META[k].color }}>{counts[k]}</p>
                  <p className="text-sm font-medium text-ink-soft">{t(TIER_META[k])}</p>
                </button>
              ))}
            </div>

            <ul className="mt-5 grid gap-3">
              {shown.map(({ school, v }) => {
                const meta = TIER_META[v.tier];
                return (
                  <li key={school.slug} className="card p-5 flex items-center gap-4">
                    <VerdictGauge v={v} meta={meta} size={74} t={t} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-brand-600">{school.kind === "network" ? `${school.acronym} · ${school.count} ${t({ ar: "مؤسسة", fr: "établ." })}` : school.acronym}</p>
                      <Link href={`/ecoles/${school.slug}`} className="font-semibold leading-snug hover:text-brand-700">{t(school)}</Link>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.cls}`}>{t(meta)}</span>
                        <span className="text-ink-soft" dir="ltr">{v.score.toFixed(2)} / {fmtSeuil(v)}</span>
                        <span className="text-xs text-ink-faint">{formulaLabel(school.weights, t)}</span>
                      </div>
                    </div>
                    <FavButton slug={school.slug} compact />
                  </li>
                );
              })}
            </ul>

            {excluded.length > 0 && (
              <p className="mt-5 text-sm text-ink-soft">
                {t({ ar: "غير معروضة لهذا الباك:", fr: "Non affichées pour ton bac :" })} {excluded.map(({ school }) => school.acronym).join(", ")}
              </p>
            )}
            <div className="mt-6 rounded-xl bg-gold-50 border border-gold-100 p-4 text-sm leading-relaxed text-ink">
              <b>{t({ ar: "مهم:", fr: "Important :" })}</b>{" "}
              {t({
                ar: `هذه عتبات ${Y} (المصدر مذكور في بطاقة كل مدرسة). العتبة حد أدنى لاجتياز المباراة، وقد تتغير في ${Y + 1}. المدارس الأخرى (CPGE، EST، FST…) لم تنشر عتبة موحدة.`,
                fr: `Ce sont les seuils ${Y} (source indiquée sur la fiche de chaque école). Un seuil est un minimum pour passer le concours, et il peut changer en ${Y + 1}. Les autres écoles (CPGE, EST, FST…) ne publient pas de seuil unique.`
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
