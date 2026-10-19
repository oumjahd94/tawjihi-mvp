"use client";
import { useState } from "react";
import Link from "next/link";
import { useT } from "../../components/LangProvider";
import SchoolCard from "../../components/SchoolCard";
import { ORIENTATION_TEST, RIASEC_LABELS, DOMAINS } from "../../lib/data";
import { SCHOOLS } from "../../lib/schools";
import { useStored } from "../../lib/store";

export default function TestPage() {
  const t = useT();
  const [answers, setAnswers] = useState([]);
  const [, saveProfile] = useStored("riasec", null);
  const step = answers.length;
  const done = step === ORIENTATION_TEST.length;

  function pick(v) {
    const next = [...answers, v];
    setAnswers(next);
    if (next.length === ORIENTATION_TEST.length) saveProfile(topLetters(next));
  }

  if (done) return <Result letters={topLetters(answers)} onRestart={() => setAnswers([])} t={t} />;

  const q = ORIENTATION_TEST[step];
  return (
    <div className="max-w-2xl mx-auto px-4 pt-10">
      <div className="flex items-center justify-between text-sm font-semibold text-ink-soft">
        <span>{t({ ar: "اختبار التوجيه", fr: "Test d'orientation" })}</span>
        <span dir="ltr">{step + 1} / {ORIENTATION_TEST.length}</span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-line overflow-hidden">
        <div className="h-full bg-brand-600 rounded-full transition-all duration-500" style={{ width: `${(step / ORIENTATION_TEST.length) * 100}%` }} />
      </div>

      <h1 className="mt-10 text-2xl md:text-3xl font-bold leading-snug">{t(q)}</h1>
      <div className="mt-8 grid gap-3">
        {q.options.map((o, i) => (
          <button key={i} onClick={() => pick(o.v)}
            className="card text-start p-5 font-medium text-lg hover:border-brand-600 hover:bg-brand-50 active:scale-[.99] transition-all">
            {t(o)}
          </button>
        ))}
      </div>
      {step > 0 && (
        <button onClick={() => setAnswers(answers.slice(0, -1))} className="mt-6 text-sm font-semibold text-ink-soft hover:text-ink">
          {t({ ar: "→ السؤال السابق", fr: "← Question précédente" })}
        </button>
      )}
    </div>
  );
}

function topLetters(answers) {
  const count = {};
  answers.forEach((v) => (count[v] = (count[v] || 0) + 1));
  return Object.entries(count).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => k);
}

function Result({ letters, onRestart, t }) {
  // Domaines dont le profil RIASEC croise le profil de l'élève
  const domains = DOMAINS
    .map((d) => ({ ...d, match: d.riasec.filter((r) => letters.includes(r)).length + (d.riasec[0] === letters[0] ? 1 : 0) }))
    .filter((d) => d.match > 0)
    .sort((a, b) => b.match - a.match)
    .slice(0, 3);
  const schools = SCHOOLS.filter((s) => (s.kind === "network" || !s.network) && s.type !== "prive" && domains.some((d) => d.slug === s.domain)).slice(0, 6);

  return (
    <div className="max-w-4xl mx-auto px-4 pt-10">
      <p className="eyebrow">{t({ ar: "نتيجتك", fr: "Ton résultat" })}</p>
      <h1 className="mt-2 text-3xl md:text-4xl font-bold">{t({ ar: "ملفك الشخصي", fr: "Ton profil" })}</h1>
      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        {letters.map((l, i) => (
          <div key={l} className={`rounded-xl2 p-5 ${i === 0 ? "bg-brand-600 text-white" : "card"}`}>
            <p className={`text-4xl font-bold ${i === 0 ? "" : "text-brand-600"}`}>{l}</p>
            <p className="mt-2 font-semibold">{t(RIASEC_LABELS[l])}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-bold">{t({ ar: "مجالات تناسبك", fr: "Les domaines qui te correspondent" })}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {domains.map((d) => <Link key={d.slug} href={`/ecoles?domaine=${d.slug}`} className="chip">{t(d)}</Link>)}
      </div>

      <h2 className="mt-10 text-xl font-bold">{t({ ar: "مدارس لتكتشفها", fr: "Des écoles à découvrir" })}</h2>
      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        {schools.map((s) => <SchoolCard key={s.slug} school={s} />)}
      </div>

      <div className="mt-10 card p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
        <p className="font-semibold">{t({ ar: "الخطوة التالية: هل نقطك كافية لهذه المدارس؟", fr: "Étape suivante : tes notes suffisent-elles pour ces écoles ?" })}</p>
        <Link href="/simulateur" className="btn-primary shrink-0">{t({ ar: "احسب حظوظي", fr: "Calculer mes chances" })}</Link>
      </div>
      <button onClick={onRestart} className="mt-6 text-sm font-semibold text-ink-soft hover:text-ink">
        {t({ ar: "إعادة الاختبار", fr: "Refaire le test" })}
      </button>
      <p className="mt-6 text-xs text-ink-faint">
        {t({ ar: "هذا الاختبار مؤشر وليس حكمًا نهائيًا. ناقش النتيجة مع مستشار التوجيه.", fr: "Ce test est un indicateur, pas un verdict. Discute du résultat avec un conseiller d'orientation." })}
      </p>
    </div>
  );
}
