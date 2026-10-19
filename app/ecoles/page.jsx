"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useT } from "../../components/LangProvider";
import SchoolCard from "../../components/SchoolCard";
import AdSlot, { AD_SLOTS } from "../../components/AdSlot";
import { SCHOOLS, CITIES, CITY_AR, ESTABLISHMENT_COUNT } from "../../lib/schools";
import { DOMAINS } from "../../lib/data";
import { TYPE_META } from "../../lib/format";
import { normalize } from "../../lib/search";

const PAGE = 30;

function SchoolsList() {
  const t = useT();
  const params = useSearchParams();
  const [q, setQ] = useState("");
  const [domain, setDomain] = useState("all");
  const [type, setType] = useState("all");
  const [city, setCity] = useState("all");
  const [limit, setLimit] = useState(PAGE);

  useEffect(() => {
    setQ(params.get("q") ?? "");
    setDomain(params.get("domaine") ?? "all");
    setLimit(PAGE);
  }, [params]);

  const networks = SCHOOLS.filter((s) => s.kind === "network");
  const list = useMemo(() => {
    const nq = normalize(q);
    return SCHOOLS.filter((s) => s.kind === "establishment" || !s.count)
      .filter((s) => (domain === "all" || s.domain === domain) && (type === "all" || s.type === type) && (city === "all" || s.city === city))
      .filter((s) => !nq || normalize(`${s.acronym} ${s.fr} ${s.ar} ${s.city || ""} ${CITY_AR[s.city] || ""}`).includes(nq))
      .sort((a, b) => (a.city || "").localeCompare(b.city || "", "fr") || a.fr.localeCompare(b.fr, "fr"));
  }, [q, domain, type, city]);

  return (
    <div className="max-w-6xl mx-auto px-4 pt-10 pb-6">
      <p className="eyebrow">{t({ ar: "دليل المؤسسات", fr: "Annuaire" })}</p>
      <h1 className="mt-1 text-3xl md:text-4xl font-semibold">{t({ ar: "كل المدارس والكليات بالمغرب", fr: "Toutes les écoles du Maroc" })}</h1>
      <p className="mt-2 text-ink-soft">{ESTABLISHMENT_COUNT} {t({ ar: "مؤسسة عمومية وخاصة معترف بها", fr: "établissements publics et privés reconnus" })}</p>

      {/* Réseaux */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {networks.map((n) => (
          <Link key={n.slug} href={`/ecoles/${n.slug}`} className="chip shrink-0">
            <b className="text-brand-700">{n.acronym}</b>{n.count ? <span className="text-ink-faint">{n.count}</span> : null}
          </Link>
        ))}
      </div>

      {/* Filtres */}
      <div className="mt-5 card p-3 grid gap-3 md:grid-cols-[1fr_200px_180px]">
        <input className="input" value={q} onChange={(e) => { setQ(e.target.value); setLimit(PAGE); }}
          placeholder={t({ ar: "ابحث: اسم، مدينة، اختصار…", fr: "Rechercher : nom, ville, sigle…" })} />
        <select className="input" value={city} onChange={(e) => { setCity(e.target.value); setLimit(PAGE); }}>
          <option value="all">{t({ ar: "كل المدن", fr: "Toutes les villes" })}</option>
          {CITIES.map((c) => <option key={c} value={c}>{t({ fr: c, ar: CITY_AR[c] })}</option>)}
        </select>
        <select className="input" value={type} onChange={(e) => { setType(e.target.value); setLimit(PAGE); }}>
          <option value="all">{t({ ar: "عمومي وخاص", fr: "Public & privé" })}</option>
          {Object.entries(TYPE_META).map(([k, v]) => <option key={k} value={k}>{t(v)}</option>)}
        </select>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        <button onClick={() => setDomain("all")} className={`chip shrink-0 ${domain === "all" ? "chip-on" : ""}`}>{t({ ar: "كل المجالات", fr: "Tous les domaines" })}</button>
        {DOMAINS.map((d) => (
          <button key={d.slug} onClick={() => { setDomain(d.slug); setLimit(PAGE); }} className={`chip shrink-0 ${domain === d.slug ? "chip-on" : ""}`}>{t(d)}</button>
        ))}
      </div>

      <p className="mt-5 text-sm font-medium text-ink-soft">{list.length} {t({ ar: "نتيجة", fr: "résultats" })}</p>
      <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {list.slice(0, limit).map((s, i) => (
          <div key={s.slug} className="contents">
            <SchoolCard school={s} compact />
            {i === 8 && <div className="sm:col-span-2 lg:col-span-3"><AdSlot slot={AD_SLOTS.list} /></div>}
          </div>
        ))}
      </div>
      {list.length > limit && (
        <div className="mt-6 text-center">
          <button onClick={() => setLimit(limit + PAGE)} className="btn-ghost">{t({ ar: "عرض المزيد", fr: "Afficher plus" })} ({list.length - limit})</button>
        </div>
      )}
      {list.length === 0 && <p className="mt-10 text-center text-ink-soft">{t({ ar: "لا توجد نتيجة بهذه المعايير.", fr: "Aucun établissement ne correspond à ces filtres." })}</p>}
    </div>
  );
}

export default function Page() {
  return <Suspense><SchoolsList /></Suspense>;
}
