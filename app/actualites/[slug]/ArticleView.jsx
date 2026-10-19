"use client";
import Link from "next/link";
import { useLang, useT } from "../../../components/LangProvider";
import { NewsMeta } from "../../../components/NewsCard";
import NewsCard from "../../../components/NewsCard";
import AdSlot, { AD_SLOTS } from "../../../components/AdSlot";
import { IconExternal } from "../../../components/Icons";

export default function ArticleView({ n, html, related }) {
  const t = useT();
  const { lang } = useLang();
  const title = n[`title_${lang}`] || n.title_fr;
  const excerpt = n[`excerpt_${lang}`] || n.excerpt_fr;

  return (
    <div className="max-w-6xl mx-auto px-4 pt-8 pb-6 grid lg:grid-cols-[1fr_320px] gap-10 items-start">
      <article className="min-w-0">
        <nav className="text-sm text-ink-faint">
          <Link href="/actualites" className="hover:text-brand-700">{t({ ar: "← المستجدات", fr: "← Actualités" })}</Link>
        </nav>
        <div className="mt-5"><NewsMeta n={n} /></div>
        <h1 className="mt-3 text-3xl md:text-[2.4rem] font-semibold leading-tight">{title}</h1>
        <p className="mt-4 text-lg text-ink-soft leading-relaxed">{excerpt}</p>
        {n.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={n.cover_url} alt="" className="mt-6 w-full rounded-xl2 border border-line object-cover max-h-[420px]" />
        )}
        <div className="mt-6 h-px bg-line" />
        <div className="prose-maslaki mt-2" dangerouslySetInnerHTML={{ __html: html[lang] || html.fr }} />
        <AdSlot slot={AD_SLOTS.article} className="mt-8" />
        {n.source_url && (
          <p className="mt-8 text-sm text-ink-soft">
            {t({ ar: "المصدر:", fr: "Source :" })}{" "}
            <a href={n.source_url} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1 text-brand-700 hover:underline">
              {n.source_label || n.source_url} <IconExternal width={13} height={13} />
            </a>
          </p>
        )}
      </article>

      <aside className="grid gap-4 lg:sticky lg:top-24 min-w-0">
        <div className="rounded-xl2 bg-brand-950 text-white p-6">
          <p className="font-semibold leading-snug">{t({ ar: "لا تفوّت أي موعد", fr: "Ne rate aucune date" })}</p>
          <p className="mt-1 text-sm text-white/70">{t({ ar: "تابع مدارسك وتوصل بتنبيهات واتساب.", fr: "Suis tes écoles et reçois des alertes WhatsApp." })}</p>
          <Link href="/espace" className="btn-gold w-full mt-4">{t({ ar: "فضائي", fr: "Créer mon espace" })}</Link>
        </div>
        {related.length > 0 && (
          <div className="card p-2">
            <p className="px-4 pt-3 text-sm font-semibold text-ink-soft">{t({ ar: "اقرأ أيضًا", fr: "À lire aussi" })}</p>
            <div className="divide-y divide-line">{related.map((r) => <NewsCard key={r.slug} n={r} />)}</div>
          </div>
        )}
      </aside>
    </div>
  );
}
