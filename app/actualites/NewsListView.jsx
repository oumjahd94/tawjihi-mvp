"use client";
import { useState } from "react";
import { useT } from "../../components/LangProvider";
import NewsCard from "../../components/NewsCard";
import AdSlot, { AD_SLOTS } from "../../components/AdSlot";
import { NEWS_CATEGORIES } from "../../lib/news-seed";

export default function NewsListView({ news }) {
  const t = useT();
  const [cat, setCat] = useState("all");
  const list = news.filter((n) => cat === "all" || n.category === cat);
  const [first, ...rest] = list;

  return (
    <div className="max-w-6xl mx-auto px-4 pt-10 pb-6">
      <p className="eyebrow">{t({ ar: "المستجدات", fr: "Actualités" })}</p>
      <h1 className="mt-1 text-3xl md:text-4xl font-semibold">{t({ ar: "مستجدات التوجيه", fr: "L'actualité de l'orientation" })}</h1>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        <button onClick={() => setCat("all")} className={`chip shrink-0 ${cat === "all" ? "chip-on" : ""}`}>{t({ ar: "الكل", fr: "Tout" })}</button>
        {Object.entries(NEWS_CATEGORIES).map(([k, v]) => (
          <button key={k} onClick={() => setCat(k)} className={`chip shrink-0 ${cat === k ? "chip-on" : ""}`}>{t(v)}</button>
        ))}
      </div>

      {first ? (
        <div className="mt-6 grid lg:grid-cols-[1.3fr_1fr] gap-4 items-start">
          <NewsCard n={first} featured />
          <div className="card p-2 divide-y divide-line">{rest.slice(0, 3).map((n) => <NewsCard key={n.slug} n={n} />)}</div>
        </div>
      ) : (
        <p className="mt-10 text-center text-ink-soft">{t({ ar: "لا توجد مقالات في هذه الفئة بعد.", fr: "Aucun article dans cette catégorie pour l'instant." })}</p>
      )}

      {rest.length > 3 && (
        <>
          <AdSlot slot={AD_SLOTS.list} className="mt-8" />
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {rest.slice(3).map((n) => <div key={n.slug} className="card"><NewsCard n={n} /></div>)}
          </div>
        </>
      )}
    </div>
  );
}
