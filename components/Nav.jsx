"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang, useT } from "./LangProvider";
import { KhatamMark } from "./KhatamGauge";
import { IconHome, IconGauge, IconUser, IconNews, IconFlag } from "./Icons";
import { SITE } from "../lib/site";
import { useUser } from "../lib/store";

const DESKTOP = [
  { href: "/ecoles", fr: "Écoles", ar: "المدارس" },
  { href: "/simulateur", fr: "Simulateur", ar: "المحاكي" },
  { href: "/concours", fr: "Concours", ar: "المباريات" },
  { href: "/actualites", fr: "Actualités", ar: "المستجدات" },
  { href: "/preparation", fr: "Prépa", ar: "التحضير" },
  { href: "/communaute", fr: "Communauté", ar: "المجتمع" }
];

const TABS = [
  { href: "/", fr: "Accueil", ar: "الرئيسية", Icon: IconHome },
  { href: "/concours", fr: "Concours", ar: "المباريات", Icon: IconFlag },
  { href: "/simulateur", fr: "Simulateur", ar: "المحاكي", Icon: IconGauge },
  { href: "/actualites", fr: "Actus", ar: "المستجدات", Icon: IconNews },
  { href: "/espace", fr: "Espace", ar: "فضائي", Icon: IconUser }
];

export function Logo({ light = false }) {
  const t = useT();
  return (
    <span className="flex items-center gap-2">
      <KhatamMark size={30} color={light ? "#fff" : "#0E7A5A"} />
      <span className={`text-xl font-semibold tracking-tightish ${light ? "text-white" : "text-brand-900"}`}>{t(SITE.name)}</span>
    </span>
  );
}

export default function Nav() {
  const { lang, setLang } = useLang();
  const t = useT();
  const path = usePathname();
  const [user] = useUser();
  const active = (href) => (href === "/" ? path === "/" : path.startsWith(href));
  if (path.startsWith("/admin")) return null;

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-line">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" aria-label={t(SITE.name)}><Logo /></Link>

          <nav className="hidden lg:flex items-center gap-0.5 text-[15px]">
            {DESKTOP.map((l) => (
              <Link key={l.href} href={l.href}
                className={`px-3 py-2 rounded-lg font-medium transition-colors ${active(l.href) ? "text-brand-700 bg-brand-50" : "text-ink-soft hover:text-ink"}`}>
                {t(l)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === "ar" ? "fr" : "ar")}
              className="h-10 min-w-10 px-3 rounded-lg border border-line text-sm font-semibold hover:border-brand-500 hover:text-brand-700"
              aria-label={lang === "ar" ? "Passer en français" : "التبديل إلى العربية"}>
              {lang === "ar" ? "FR" : "ع"}
            </button>
            <Link href="/espace" className="hidden md:inline-flex btn-primary !py-2.5 !px-4 text-sm">
              {user ? t({ ar: "فضائي", fr: "Mon espace" }) : t({ ar: "تسجيل الدخول", fr: "Se connecter" })}
            </Link>
          </div>
        </div>
        {/* Liens secondaires sur tablette / mobile */}
        <nav className="lg:hidden border-t border-line overflow-x-auto">
          <div className="flex gap-1 px-3 py-1.5 text-sm whitespace-nowrap">
            {DESKTOP.map((l) => (
              <Link key={l.href} href={l.href} className={`px-3 py-1.5 rounded-lg font-medium ${active(l.href) ? "text-brand-700 bg-brand-50" : "text-ink-soft"}`}>{t(l)}</Link>
            ))}
          </div>
        </nav>
      </header>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-line pb-[env(safe-area-inset-bottom)]">
        <ul className="grid grid-cols-5">
          {TABS.map(({ href, Icon, ...l }) => (
            <li key={href}>
              <Link href={href} className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${active(href) ? "text-brand-700" : "text-ink-faint"}`}>
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
