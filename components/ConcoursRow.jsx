"use client";
import Link from "next/link";
import { useLang, useT } from "./LangProvider";
import { IconExternal } from "./Icons";
import { STATUS_META, daysLeft } from "../lib/concours";
import { formatDate } from "../lib/format";

// Une échéance : statut, dates, compte à rebours, source
export default function ConcoursRow({ c, showSource = false }) {
  const t = useT();
  const { lang } = useLang();
  const meta = STATUS_META[c.status];
  const target = c.status === "upcoming" ? c.start : c.end;
  const n = target ? daysLeft(target) : null;
  const urgent = c.status === "open" && n != null && n <= 7;

  return (
    <div className="flex items-start gap-3 p-4">
      <div className={`w-14 shrink-0 text-center rounded-xl py-2 ${urgent ? "bg-coral text-white" : c.status === "open" ? "bg-brand-50 text-brand-800" : "bg-paper text-ink"}`}>
        {target ? (
          <>
            <p className="text-xl font-semibold leading-none">{formatDate(target, lang, { day: "numeric" })}</p>
            <p className="text-[11px] mt-1 opacity-80">{formatDate(target, lang, { month: "short" })}</p>
          </>
        ) : <p className="text-lg leading-none py-1.5">•</p>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${meta.cls}`}>{t(meta)}</span>
          {!c.confirmed && <span className="rounded-md px-2 py-0.5 text-[11px] font-semibold bg-gold-50 text-gold-700">{t({ ar: "في انتظار التأكيد", fr: "À confirmer" })}</span>}
          {c.status === "open" && n != null && <span className={`text-[11px] font-bold ${urgent ? "text-coral" : "text-brand-700"}`} dir="ltr">J-{n}</span>}
        </div>
        {c.school ? (
          <Link href={`/ecoles/${c.school}`} className="mt-1 block font-semibold leading-snug hover:text-brand-700">{t(c)}</Link>
        ) : <p className="mt-1 font-semibold leading-snug">{t(c)}</p>}
        <p className="mt-0.5 text-xs text-ink-faint">
          {c.status === "upcoming" && c.start && `${t({ ar: "ابتداءً من", fr: "À partir du" })} ${formatDate(c.start, lang)}`}
          {c.status === "open" && c.end && `${t({ ar: "آخر أجل", fr: "Date limite" })} : ${formatDate(c.end, lang)}`}
          {c.status === "ongoing" && t({ ar: "جارٍ حاليًا", fr: "En cours actuellement" })}
          {!c.confirmed && c.basis && <span className="block">{t(c.basis)}</span>}
          {c.note_fr && <span className="block">{t({ fr: c.note_fr, ar: c.note_ar })}</span>}
        </p>
        {showSource && c.source && (
          <a href={c.source.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs text-brand-600 hover:underline">
            {t({ ar: "المصدر", fr: "Source" })} : {c.source.label} <IconExternal width={12} height={12} />
          </a>
        )}
      </div>
    </div>
  );
}
