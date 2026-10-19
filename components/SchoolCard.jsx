"use client";
import Link from "next/link";
import { useT } from "./LangProvider";
import { VerdictGauge } from "./KhatamGauge";
import FavButton from "./FavButton";
import { verdict, TIER_META } from "../lib/scoring";
import { TYPE_META } from "../lib/format";
import { useGrades } from "../lib/store";

export default function SchoolCard({ school, compact = false }) {
  const t = useT();
  const [grades] = useGrades();
  const v = verdict(school, grades.bac, grades);
  const meta = TIER_META[v.tier];
  const showGauge = ["good", "ok", "close", "below", "unknown"].includes(v.tier);

  return (
    <Link href={`/ecoles/${school.slug}`}
      className="card p-4 sm:p-5 flex gap-4 items-start hover:shadow-lift hover:-translate-y-0.5 transition-all group">
      {showGauge ? <VerdictGauge v={v} meta={meta} size={compact ? 58 : 66} t={t} /> : (
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-brand-50 text-brand-700 grid place-items-center text-[11px] font-bold text-center leading-tight px-1">
          {school.acronym.split(" ")[0].slice(0, 7)}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-brand-600 flex items-center gap-1.5 flex-wrap">
              {school.kind === "network" ? `${school.acronym} · ${t({ ar: "شبكة", fr: "Réseau" })}` : school.city}
              {school.isNew && <span className="rounded bg-gold-400 text-brand-950 px-1.5 py-px text-[10px] font-bold">{t({ ar: "جديد", fr: "NOUVEAU" })}</span>}
            </p>
            <h3 className="mt-0.5 font-semibold leading-snug text-ink group-hover:text-brand-700 transition-colors line-clamp-2">{t(school)}</h3>
          </div>
          <FavButton slug={school.slug} compact />
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs">
          <span className={`rounded-full px-2.5 py-1 font-semibold ${meta.cls}`}>{t(meta)}</span>
          <span className="rounded-full px-2.5 py-1 bg-paper text-ink-soft font-medium">{t(TYPE_META[school.type])}</span>
          {school.kind === "network" && school.count > 0 && (
            <span className="rounded-full px-2.5 py-1 bg-paper text-ink-soft font-medium">{school.count} {t({ ar: "مؤسسة", fr: "établissements" })}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
