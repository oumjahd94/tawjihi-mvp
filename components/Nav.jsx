"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang, useT } from "./LangProvider";
import { KhatamMark } from "./KhatamGauge";
import { IconHome, IconGauge, IconUser, IconBook, IconChat } from "./Icons";
import { SITE } from "../lib/site";
import { useUser } from "../lib/store";

const LINKS = [
  { href: "/", fr: "Accueil", ar: "الرئيسية", Icon: IconHome },
  { href: "/simulateur", fr: "Simulateur", ar: "المحاكي", Icon: IconGauge },
  { href: "/ecoles", fr: "Écoles", ar: "المدارس", Icon: null },
  { href: "/preparation", fr: "Prépa", ar: "التحضير", Icon: IconBook },
  { href: "/communaute", fr: "Communauté", ar: "المجتمع", Icon: IconChat },
  { href: "/espace", fr: "Mon espace", ar: "فضائي", Icon: IconUser }
];

export default function Nav() {
  const { lang, setLang } = useLang();
  const t = useT();
  const path = usePathname();
  const [user] = useUser();
  const active = (href) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-line">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-majorelle font-bold text-xl">
            <KhatamMark size={28} />
            <span className="text-ink">{t(SITE.name)}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-[15px]">
            {LINKS.slice(1, 5).map((l) => (
              <Link key={l.href} href={l.href}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${active(l.href) ? "text-majorelle bg-majorelle-soft" : "text-ink-soft hover:text-ink"}`}>
                {t(l)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === "ar" ? "fr" : "ar")}
              className="h-10 px-3 rounded-lg border border-line text-sm font-semibold hover:border-majorelle hover:text-majorelle"
              aria-label={lang === "ar" ? "Passer en français" : "التبديل إلى العربية"}>
              {lang === "ar" ? "FR" : "ع"}
            </button>
            <Link href="/espace" className="hidden md:inline-flex btn-primary !py-2.5 !px-4 text-sm">
              {user ? t({ ar: "فضائي", fr: "Mon espace" }) : t({ ar: "تسجيل الدخول", fr: "Se connecter" })}
            </Link>
          </div>
        </div>
      </header>

      {/* Barre d'onglets mobile : l'expérience "appli" sans app store */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-line pb-[env(safe-area-inset-bottom)]">
        <ul className="grid grid-cols-5">
          {LINKS.filter((l) => l.Icon).map(({ href, Icon, ...l }) => (
            <li key={href}>
              <Link href={href} className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${active(href) ? "text-majorelle" : "text-ink-faint"}`}>
                <Icon width={22} height={22} />
                {t(l)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
