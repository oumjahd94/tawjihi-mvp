"use client";
import Link from "next/link";
import { useLang, useT } from "./LangProvider";
import { daysLeft, formatDate, KIND_META, schoolBySlug } from "../lib/format";

// Une échéance, avec un compte à rebours dont la couleur suit l'urgence
export default function DeadlineRow({ d }) {
  const t = useT();
  const { lang } = useLang();
  const n = daysLeft(d.date);
  const school = d.school ? schoolBySlug(d.school) : null;
  const urgency = n <= 3 ? "bg-coral text-white" : n <= 14 ? "bg-saffron-soft text-saffron" : "bg-majorelle-soft text-majorelle";
  const [day, month] = [formatDate(d.date, lang, { day: "numeric" }), formatDate(d.date, lang, { month: "short" })];

  const body = (
    <div className="flex items-center gap-4 p-4">
      <div className="w-14 shrink-0 text-center rounded-xl bg-paper py-2">
        <p className="text-xl font-bold leading-none">{day}</p>
        <p className="text-xs text-ink-soft mt-1">{month}</p>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-ink-faint">
          {school ? school.acronym : t({ ar: "عام", fr: "Général" })} · {t(KIND_META[d.kind])}
        </p>
        <p className="font-semibold leading-snug">{t(d)}</p>
      </div>
      <span className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-bold ${urgency}`} dir="ltr">
        {n === 0 ? t({ ar: "اليوم", fr: "Aujourd'hui" }) : n < 0 ? t({ ar: "انتهى", fr: "Passé" }) : `J-${n}`}
      </span>
    </div>
  );

  return school ? (
    <Link href={`/ecoles/${school.slug}`} className="block hover:bg-paper/60 transition-colors">{body}</Link>
  ) : body;
}
