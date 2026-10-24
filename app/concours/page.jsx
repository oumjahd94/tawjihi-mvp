"use client";
import { useState } from "react";
import Link from "next/link";
import { useLang, useT } from "../../components/LangProvider";
import ConcoursRow from "../../components/ConcoursRow";
import AdSlot, { AD_SLOTS } from "../../components/AdSlot";
import { CATEGORIES } from "../../lib/concours";
import { useConcours } from "../../components/ContentProvider";
import { formatDate } from "../../lib/format";

const GROUPS = [
  { key: "open", ar: "مفتوح الآن", fr: "Ouvert maintenant" },
  { key: "ongoing", ar: "جارٍ: نتائج ولوائح الانتظار", fr: "En cours : résultats et listes d'attente" },
  { key: "upcoming", ar: "قادم", fr: "À venir" }
];

export default function ConcoursPage() {
  const t = useT();
  const { lang } = useLang();
  const [cat, setCat] = useState("all");
  const { active, updatedAt } = useConcours();
  const items = active.filter((c) => cat === "all" || c.cat === cat);

  return (
    <div className="max-w-3xl mx-auto px-4 pt-10 pb-6">
      <p className="eyebrow">{t({ ar: "المباريات", fr: "Concours" })}</p>
      <h1 className="mt-1 text-3xl md:text-4xl font-semibold">{t({ ar: "المباريات والمواعيد", fr: "Concours & échéances" })}</h1>
      <p className="mt-2 text-ink-soft">{t({ ar: "آخر تحديث:", fr: "Dernière mise à jour :" })} {formatDate(updatedAt, lang)}</p>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        <button onClick={() => setCat("all")} className={`chip shrink-0 ${cat === "all" ? "chip-on" : ""}`}>{t({ ar: "الكل", fr: "Tout" })}</button>
        {Object.entries(CATEGORIES).map(([k, v]) => (
          <button key={k} onClick={() => setCat(k)} className={`chip shrink-0 ${cat === k ? "chip-on" : ""}`}>{t(v)}</button>
        ))}
      </div>

      <div className="mt-6 grid gap-8">
        {GROUPS.map((g) => {
          const list = items.filter((c) => c.status === g.key);
          if (!list.length) return null;
          return (
            <section key={g.key}>
              <h2 className="text-sm font-semibold text-ink-soft mb-2">{t(g)} <span className="text-ink-faint">({list.length})</span></h2>
              <div className="card divide-y divide-line overflow-hidden">{list.map((c) => <ConcoursRow key={c.id} c={c} showSource />)}</div>
            </section>
          );
        })}
        {items.length === 0 && <p className="text-ink-soft">{t({ ar: "لا توجد مواعيد في هذه الفئة حاليًا.", fr: "Aucune échéance dans cette catégorie pour le moment." })}</p>}
      </div>

      <AdSlot slot={AD_SLOTS.list} className="mt-8" />
      <p className="mt-6 text-xs text-ink-faint leading-relaxed">
        {t({
          ar: "المواعيد المؤكدة مرفقة بمصدرها. المواعيد «في انتظار التأكيد» مقدرة حسب دورة 2026 وسيتم تحيينها فور صدور الإعلانات الرسمية.",
          fr: "Les dates confirmées sont accompagnées de leur source. Les dates « à confirmer » sont estimées d'après la session 2026 et seront mises à jour dès les annonces officielles."
        })}
      </p>
      <Link href="/espace" className="btn-primary w-full mt-6">{t({ ar: "تنبيهات واتساب لمدارسي", fr: "Recevoir les alertes de mes écoles" })}</Link>
    </div>
  );
}
