"use client";
import { useState } from "react";
import { useT } from "../../components/LangProvider";
import QuizRunner from "../../components/QuizRunner";
import { IconClock, IconLock, IconBook } from "../../components/Icons";
import { ANNALES, QUIZZES } from "../../lib/data";
import { schoolBySlug } from "../../lib/format";
import { useStored } from "../../lib/store";

export default function Preparation() {
  const t = useT();
  const [running, setRunning] = useState(null);
  const [filter, setFilter] = useState("all");
  const [best] = useStored("quiz-best", {});

  if (running) {
    return (
      <div className="px-4 pt-8">
        <QuizRunner id={running} quiz={QUIZZES[running]} onExit={() => setRunning(null)} />
      </div>
    );
  }

  const schools = [...new Set(ANNALES.map((a) => a.school))];
  const annales = ANNALES.filter((a) => filter === "all" || a.school === filter);

  return (
    <div className="max-w-6xl mx-auto px-4 pt-10">
      <p className="eyebrow">{t({ ar: "الخطوة 4 · حضّر", fr: "Étape 4 · Se préparer" })}</p>
      <h1 className="mt-1 text-3xl font-bold">{t({ ar: "التحضير للمباريات", fr: "Préparer les concours" })}</h1>
      <p className="mt-2 text-ink-soft max-w-2xl">
        {t({ ar: "كويزات بالتوقيت لتتدرب على هاتفك في أي مكان، وبنك امتحانات سابقة مصححة.", fr: "Des quiz chronométrés pour t'entraîner sur ton téléphone, partout, et une banque d'annales corrigées." })}
      </p>

      {/* QUIZ CHRONOMÉTRÉS */}
      <section className="mt-8">
        <h2 className="text-xl font-bold">{t({ ar: "كويزات سريعة", fr: "Quiz express" })}</h2>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          {Object.entries(QUIZZES).map(([id, q]) => (
            <button key={id} onClick={() => setRunning(id)} className="card p-5 text-start hover:shadow-lift hover:-translate-y-0.5 transition-all group">
              <div className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-1.5 font-semibold text-ink-soft"><IconClock width={16} height={16} /> {q.seconds / 60} min · {q.questions.length} Q</span>
                {best[id] != null && <span className="rounded-md bg-brand-50 text-brand-600 px-2 py-0.5 text-xs font-bold" dir="ltr">★ {best[id]}/{q.questions.length}</span>}
              </div>
              <p className="mt-3 font-bold text-lg leading-snug">{t(q)}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-brand-600 group-hover:underline">{t({ ar: "ابدأ ←", fr: "Commencer →" })}</span>
            </button>
          ))}
        </div>
      </section>

      {/* BANQUE D'ANNALES */}
      <section className="mt-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold">{t({ ar: "بنك الامتحانات السابقة", fr: "Banque d'annales" })}</h2>
          <div className="flex gap-2 overflow-x-auto">
            <button onClick={() => setFilter("all")} className={`chip shrink-0 ${filter === "all" ? "!bg-ink !text-white !border-ink" : ""}`}>{t({ ar: "الكل", fr: "Toutes" })}</button>
            {schools.map((s) => (
              <button key={s} onClick={() => setFilter(s)} className={`chip shrink-0 ${filter === s ? "!bg-ink !text-white !border-ink" : ""}`}>{schoolBySlug(s).acronym}</button>
            ))}
          </div>
        </div>
        <ul className="mt-4 card divide-y divide-line overflow-hidden">
          {annales.map((a, k) => (
            <li key={k} className="p-4 flex items-center gap-4">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-brand-50 text-brand-600 grid place-items-center"><IconBook width={20} height={20} /></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold leading-snug">{t(a)}</p>
                <p className="text-sm text-ink-soft">{schoolBySlug(a.school).acronym} · {a.year}</p>
              </div>
              {a.premium ? (
                <span className="inline-flex items-center gap-1 rounded-lg bg-gold-50 text-gold-700 px-2.5 py-1.5 text-xs font-bold">
                  <IconLock width={14} height={14} /> Premium
                </span>
              ) : a.quiz ? (
                <button onClick={() => setRunning(a.quiz)} className="rounded-lg bg-brand-600 text-white px-3 py-1.5 text-xs font-bold">{t({ ar: "تدرب", fr: "S'entraîner" })}</button>
              ) : (
                <span className="rounded-lg bg-paper text-ink-soft px-2.5 py-1.5 text-xs font-bold">{t({ ar: "قريبًا", fr: "Bientôt" })}</span>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-ink-faint">
          {t({
            ar: "⚠️ قبل نشر أي امتحان: تحقق من حقوق النشر (بعض المدارس تمنع إعادة النشر). الأسئلة الحالية أصلية ومن إنتاجنا.",
            fr: "⚠️ Avant de publier une annale : vérifie les droits de diffusion (certaines écoles l'interdisent). Les questions actuelles sont originales."
          })}
        </p>
      </section>
    </div>
  );
}
