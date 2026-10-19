"use client";
import { useEffect, useState } from "react";
import { useT } from "./LangProvider";
import { IconClock } from "./Icons";
import { useStored } from "../lib/store";

// Quiz chronométré, pensé pour le smartphone (gros boutons, une question par écran)
export default function QuizRunner({ id, quiz, onExit }) {
  const t = useT();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(quiz.seconds);
  const [done, setDone] = useState(false);
  const [, setBest] = useStored("quiz-best", {});
  const q = quiz.questions[i];

  useEffect(() => {
    if (done) return;
    if (left <= 0) { finish(score); return; }
    const timer = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, done]);

  function finish(final) {
    setDone(true);
    setBest((b) => ({ ...b, [id]: Math.max(b[id] ?? 0, final) }));
  }

  function choose(k) {
    if (picked !== null) return;
    setPicked(k);
    const nextScore = score + (k === q.answer ? 1 : 0);
    setScore(nextScore);
    setTimeout(() => {
      if (i + 1 === quiz.questions.length) finish(nextScore);
      else { setI(i + 1); setPicked(null); }
    }, 900);
  }

  const mm = String(Math.floor(left / 60)).padStart(1, "0");
  const ss = String(left % 60).padStart(2, "0");

  if (done) {
    const pct = Math.round((score / quiz.questions.length) * 100);
    return (
      <div className="card p-8 text-center max-w-lg mx-auto">
        <p className="eyebrow">{t({ ar: "النتيجة", fr: "Résultat" })}</p>
        <p className="mt-3 text-6xl font-bold text-brand-600" dir="ltr">{score}/{quiz.questions.length}</p>
        <p className="mt-3 text-ink-soft">
          {pct >= 80 ? t({ ar: "ممتاز! أنت جاهز تقريبًا.", fr: "Excellent, tu es presque prêt !" })
            : pct >= 50 ? t({ ar: "جيد، واصل التدريب.", fr: "Pas mal, continue à t'entraîner." })
            : t({ ar: "راجع الدروس وأعد المحاولة.", fr: "Revois les notions et retente ta chance." })}
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <button onClick={onExit} className="btn-ghost">{t({ ar: "رجوع", fr: "Retour" })}</button>
          <button onClick={() => { setI(0); setPicked(null); setScore(0); setLeft(quiz.seconds); setDone(false); }} className="btn-primary">
            {t({ ar: "إعادة", fr: "Recommencer" })}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="text-sm font-semibold text-ink-soft hover:text-ink">✕ {t({ ar: "خروج", fr: "Quitter" })}</button>
        <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-bold text-sm ${left <= 30 ? "bg-coral-soft text-coral" : "bg-white border border-line"}`} dir="ltr">
          <IconClock width={16} height={16} /> {mm}:{ss}
        </span>
      </div>
      <div className="mt-4 flex gap-1.5">
        {quiz.questions.map((_, k) => (
          <span key={k} className={`h-1.5 flex-1 rounded-full ${k < i ? "bg-brand-600" : k === i ? "bg-brand-600/40" : "bg-line"}`} />
        ))}
      </div>
      <p className="mt-8 text-2xl font-bold leading-snug" dir="ltr" style={{ textAlign: "start" }}>{q.q}</p>
      <div className="mt-6 grid gap-3" dir="ltr">
        {q.options.map((o, k) => {
          const state = picked === null ? "" : k === q.answer ? "!border-brand-600 !bg-brand-50" : k === picked ? "!border-coral !bg-coral-soft" : "opacity-50";
          return (
            <button key={k} onClick={() => choose(k)}
              className={`card text-left p-4 text-lg font-medium flex items-center gap-3 hover:border-brand-600 transition-all ${state}`}>
              <span className="h-8 w-8 shrink-0 rounded-lg bg-paper grid place-items-center text-sm font-bold text-ink-soft">{"ABCD"[k]}</span>
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
