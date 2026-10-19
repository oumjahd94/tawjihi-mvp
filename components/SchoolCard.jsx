"use client";
import Link from "next/link";
import { useT } from "./LangProvider";
import KhatamGauge from "./KhatamGauge";
import FavButton from "./FavButton";
import { chances, TIER_META } from "../lib/scoring";
import { feesLabel } from "../lib/format";
import { useGrades } from "../lib/store";

export default function SchoolCard({ school }) {
  const t = useT();
  const [grades] = useGrades();
  const c = chances(school, grades.bac, grades, grades.estimated);
  const meta = TIER_META[c.tier];

  return (
    <Link href={`/ecoles/${school.slug}`}
      className="card p-5 flex gap-4 items-start hover:shadow-lift hover:-translate-y-0.5 transition-all">
      <KhatamGauge
        size={72}
        value={c.prob ?? null}
        color={meta.color}
        label={c.tier === "unknown" && c.projected ? c.projected.toFixed(1) : c.tier === "open" ? "∞" : "•"}
        sublabel={c.tier === "unknown" ? t({ ar: "عتبة", fr: "seuil" }) : undefined}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-bold tracking-wider text-majorelle">{school.acronym}</p>
          <FavButton slug={school.slug} compact />
        </div>
        <h3 className="font-bold leading-snug -mt-3 pe-10">{t(school)}</h3>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-ink-soft">
          <span>{school.years} {t({ ar: "سنوات", fr: "ans" })}</span>
          <span>·</span>
          <span>{feesLabel(school.fees, t)}</span>
        </div>
        <span className={`mt-3 inline-block rounded-full px-2.5 py-1 text-xs font-bold ${meta.cls}`}>{t(meta)}</span>
      </div>
    </Link>
  );
}
