"use client";
import Link from "next/link";
import { useLang, useT } from "./LangProvider";
import { KhatamMark } from "./KhatamGauge";
import { NEWS_CATEGORIES } from "../lib/news-seed";
import { formatDate } from "../lib/format";

const pick = (n, lang, k) => n[`${k}_${lang}`] || n[`${k}_fr`] || "";

export function NewsMeta({ n }) {
  const t = useT();
  const { lang } = useLang();
  return (
    <p className="flex items-center gap-2 text-xs font-medium">
      <span className="rounded-md bg-brand-50 text-brand-700 px-2 py-0.5 font-semibold">{t(NEWS_CATEGORIES[n.category] || NEWS_CATEGORIES.orientation)}</span>
      <span className="text-ink-faint">{formatDate(n.published_at, lang, { day: "numeric", month: "long" })}</span>
    </p>
  );
}

export default function NewsCard({ n, featured = false }) {
  const { lang } = useLang();
  const t = useT();
  if (featured) {
    return (
      <Link href={`/actualites/${n.slug}`} className="group relative overflow-hidden rounded-xl2 bg-brand-900 text-white p-6 md:p-8 flex flex-col justify-end min-h-[280px] shadow-lift">
        {n.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={n.cover_url} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="absolute -top-10 -end-10 opacity-20 group-hover:rotate-12 transition-transform duration-700"><KhatamMark size={240} color="#14936D" core="#DDB45E" /></div>
        )}
        <div className="relative">
          <span className="inline-block rounded-md bg-gold-400 text-brand-950 px-2 py-0.5 text-xs font-bold">{t(NEWS_CATEGORIES[n.category] || NEWS_CATEGORIES.orientation)}</span>
          <h3 className="mt-3 text-2xl md:text-[1.7rem] font-semibold leading-tight">{pick(n, lang, "title")}</h3>
          <p className="mt-3 text-white/75 leading-relaxed line-clamp-2">{pick(n, lang, "excerpt")}</p>
          <p className="mt-4 text-sm font-semibold text-gold-300">{t({ ar: "اقرأ المقال ←", fr: "Lire l'article →" })}</p>
        </div>
      </Link>
    );
  }
  return (
    <Link href={`/actualites/${n.slug}`} className="group block p-4 rounded-xl hover:bg-white transition-colors">
      <NewsMeta n={n} />
      <h3 className="mt-2 font-semibold leading-snug group-hover:text-brand-700 transition-colors">{pick(n, lang, "title")}</h3>
      <p className="mt-1 text-sm text-ink-soft line-clamp-2">{pick(n, lang, "excerpt")}</p>
    </Link>
  );
}
