"use client";
import { useT } from "./LangProvider";

// Gabarit des pages légales : sections { h: {fr, ar}, p: {fr, ar} }
export default function LegalPage({ title, intro, sections, updated = "19 octobre 2026" }) {
  const t = useT();
  return (
    <div className="max-w-3xl mx-auto px-4 pt-10 pb-6">
      <h1 className="text-3xl md:text-4xl font-semibold">{t(title)}</h1>
      {intro && <p className="mt-4 text-lg text-ink-soft leading-relaxed">{t(intro)}</p>}
      <div className="mt-8 grid gap-6">
        {sections.map((s) => (
          <section key={s.h.fr} className="card p-6">
            <h2 className="text-lg font-semibold">{t(s.h)}</h2>
            <div className="mt-2 text-ink leading-relaxed whitespace-pre-line">{t(s.p)}</div>
          </section>
        ))}
      </div>
      <p className="mt-8 text-sm text-ink-faint">{t({ ar: "آخر تحديث:", fr: "Dernière mise à jour :" })} {updated}</p>
    </div>
  );
}
