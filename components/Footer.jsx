"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "./LangProvider";
import { Logo } from "./Nav";

const COLS = [
  { title: { fr: "Explorer", ar: "استكشف" }, links: [
    { href: "/ecoles", fr: "Écoles & filières", ar: "المدارس والشعب" },
    { href: "/simulateur", fr: "Simulateur de seuils", ar: "محاكي العتبات" },
    { href: "/concours", fr: "Concours", ar: "المباريات" },
    { href: "/actualites", fr: "Actualités", ar: "المستجدات" }] },
  { title: { fr: "Se préparer", ar: "استعد" }, links: [
    { href: "/test", fr: "Test d'orientation", ar: "اختبار التوجيه" },
    { href: "/preparation", fr: "Annales & quiz", ar: "امتحانات وكويزات" },
    { href: "/communaute", fr: "Communauté", ar: "المجتمع" },
    { href: "/espace", fr: "Mon espace", ar: "فضائي" }] },
  { title: { fr: "Maslaki", ar: "مسلكي" }, links: [
    { href: "/a-propos", fr: "À propos", ar: "من نحن" },
    { href: "/contact", fr: "Contact", ar: "اتصل بنا" },
    { href: "/confidentialite", fr: "Confidentialité", ar: "سياسة الخصوصية" },
    { href: "/mentions-legales", fr: "Mentions légales", ar: "الإشعار القانوني" }] }
];

export default function Footer() {
  const t = useT();
  if (usePathname().startsWith("/admin")) return null;
  return (
    <footer className="bg-brand-950 text-white/70 mt-16">
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-28 md:pb-10 grid gap-10 md:grid-cols-[1.3fr_repeat(3,1fr)]">
        <div>
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed max-w-xs">
            {t({ ar: "منصة التوجيه بعد الباك: المدارس، العتبات، المباريات والمستجدات في مكان واحد.", fr: "La plateforme d'orientation après le bac : écoles, seuils, concours et actualités au même endroit." })}
          </p>
        </div>
        {COLS.map((c) => (
          <div key={c.title.fr}>
            <p className="text-sm font-semibold text-gold-300">{t(c.title)}</p>
            <ul className="mt-3 grid gap-2 text-sm">
              {c.links.map((l) => <li key={l.href}><Link href={l.href} className="hover:text-white transition-colors">{t(l)}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <p className="max-w-6xl mx-auto px-4 py-5 text-xs text-white/50">© {new Date().getFullYear()} Maslaki</p>
      </div>
    </footer>
  );
}
