"use client";
import { useState } from "react";
import Link from "next/link";
import { useLang, useT } from "../../components/LangProvider";
import DeadlineRow from "../../components/DeadlineRow";
import { DEADLINES } from "../../lib/data";
import { daysLeft, formatDate, KIND_META } from "../../lib/format";

// Calendrier public de toutes les échéances (le calendrier perso est dans /espace)
export default function Calendrier() {
  const t = useT();
  const { lang } = useLang();
  const [kind, setKind] = useState("all");
  const items = DEADLINES
    .filter((d) => daysLeft(d.date) >= 0 && (kind === "all" || d.kind === kind))
    .sort((a, b) => a.date.localeCompare(b.date));
  const byMonth = items.reduce((acc, d) => ((acc[d.date.slice(0, 7)] ||= []).push(d), acc), {});

  return (
    <div className="max-w-3xl mx-auto px-4 pt-10">
      <p className="eyebrow">{t({ ar: "كل المواعيد", fr: "Toutes les dates" })}</p>
      <h1 className="mt-1 text-3xl font-bold">{t({ ar: "رزنامة التوجيه", fr: "Calendrier de l'orientation" })}</h1>
      <div className="mt-6 flex gap-2 overflow-x-auto">
        {["all", ...Object.keys(KIND_META)].map((k) => (
          <button key={k} onClick={() => setKind(k)} className={`chip shrink-0 ${kind === k ? "!bg-ink !text-white !border-ink" : ""}`}>
            {k === "all" ? t({ ar: "الكل", fr: "Tout" }) : t(KIND_META[k])}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-6">
        {Object.entries(byMonth).map(([m, list]) => (
          <section key={m}>
            <h2 className="text-sm font-bold text-ink-soft mb-2">{formatDate(m + "-01", lang, { month: "long", year: "numeric" })}</h2>
            <div className="card divide-y divide-line overflow-hidden">{list.map((d) => <DeadlineRow key={d.id} d={d} />)}</div>
          </section>
        ))}
      </div>
      <Link href="/espace" className="btn-primary w-full mt-8">{t({ ar: "رزنامة شخصية + تنبيهات واتساب", fr: "Mon calendrier perso + alertes WhatsApp" })}</Link>
    </div>
  );
}
