"use client";
import { useT } from "./LangProvider";
import { SITE } from "../lib/site";

export default function Footer() {
  const t = useT();
  return (
    <footer className="hidden md:block border-t border-line bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-wrap items-center justify-between gap-4 text-sm text-ink-soft">
        <p>
          <b className="text-ink">{t(SITE.name)}</b> — {t(SITE.tagline)}
        </p>
        <p className="text-ink-faint">
          {t({ ar: "بيانات تجريبية للعرض — تحقق دائمًا من المصادر الرسمية", fr: "Données de démonstration — vérifie toujours les sources officielles" })}
        </p>
      </div>
    </footer>
  );
}
