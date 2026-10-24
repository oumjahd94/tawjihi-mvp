import "./globals.css";
import Script from "next/script";
import { LangProvider } from "../components/LangProvider";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { SITE } from "../lib/site";
import { ContentProvider } from "../components/ContentProvider";
import { getSiteContent } from "../lib/content";

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Maslaki — Orientation après le bac au Maroc | مسلكي", template: "%s | Maslaki" },
  description: "Toutes les écoles du Maroc, les seuils 2026, les concours en cours, les actualités de l'orientation et un simulateur gratuit. مسلكي: التوجيه بعد الباك.",
  openGraph: { siteName: "Maslaki", locale: "fr_MA", alternateLocale: ["ar_MA"], type: "website" }
};

export const viewport = { themeColor: "#06372A" };

const ADSENSE = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export const revalidate = 300; // contenus admin (concours, seuils) rafraîchis toutes les 5 min

export default async function RootLayout({ children }) {
  const content = await getSiteContent();
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        {ADSENSE && <meta name="google-adsense-account" content={ADSENSE} />}
      </head>
      <body className="font-sans min-h-screen flex flex-col">
        {ADSENSE && (
          <Script async strategy="afterInteractive" crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE}`} />
        )}
        <LangProvider>
          <ContentProvider value={content}>
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </ContentProvider>
        </LangProvider>
      </body>
    </html>
  );
}
