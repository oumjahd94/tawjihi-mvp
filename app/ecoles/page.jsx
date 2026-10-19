"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useT } from "../../components/LangProvider";
import SchoolCard from "../../components/SchoolCard";
import { SCHOOLS, DOMAINS } from "../../lib/data";
import { normalize } from "../../lib/search";

function SchoolsList() {
  const t = useT();
  const params = useSearchParams();
  const [q, setQ] = useState("");
  const [domain, setDomain] = useState("all");
  const [type, setType] = useState("all");

  useEffect(() => {
    setQ(params.get("q") ?? "");
    setDomain(params.get("domaine") ?? "all");
  }, [params]);

  const nq = normalize(q);
  const list = SCHOOLS.filter((s) =>
    (domain === "all" || s.domain === domain) &&
    (type === "all" || s.type === type) &&
    (!nq || normalize(`${s.acronym} ${s.fr} ${s.ar} ${s.cities.join(" ")}`).includes(nq)));

  return (
    <div className="max-w-6xl mx-auto px-4 pt-10">
      <p className="eyebrow">{t({ ar: "دليل المدارس", fr: "Guide des écoles" })}</p>
      <h1 className="mt-1 text-3xl font-bold">{t({ ar: "كل المدارس والشعب", fr: "Toutes les écoles & filières" })}</h1>

      <div className="mt-6 flex flex-col md:flex-row gap-3">
        <input className="input md:max-w-sm" value={q} onChange={(e) => setQ(e.target.value)}
          placeholder={t({ ar: "ابحث: اسم، مدينة…", fr: "Rechercher : nom, ville…" })} />
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-white border border-line p-1 text-sm font-semibold md:w-80">
          {[["all", { ar: "الكل", fr: "Tout" }], ["public", { ar: "عمومي", fr: "Public" }], ["prive", { ar: "خاص", fr: "Privé" }]].map(([k, l]) => (
            <button key={k} onClick={() => setType(k)} className={`rounded-lg py-2 ${type === k ? "bg-majorelle text-white" : "text-ink-soft"}`}>{t(l)}</button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        <button onClick={() => setDomain("all")} className={`chip shrink-0 ${domain === "all" ? "!bg-ink !text-white !border-ink" : ""}`}>
          {t({ ar: "كل المجالات", fr: "Tous les domaines" })}
        </button>
        {DOMAINS.map((d) => (
          <button key={d.slug} onClick={() => setDomain(d.slug)} className={`chip shrink-0 ${domain === d.slug ? "!bg-ink !text-white !border-ink" : ""}`}>{t(d)}</button>
        ))}
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((s) => <SchoolCard key={s.slug} school={s} />)}
      </div>
      {list.length === 0 && (
        <p className="mt-10 text-center text-ink-soft">{t({ ar: "لا توجد نتيجة بهذه المعايير.", fr: "Aucune école ne correspond à ces filtres." })}</p>
      )}
    </div>
  );
}

export default function Page() {
  return <Suspense><SchoolsList /></Suspense>;
}
