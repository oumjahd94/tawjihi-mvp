import "./globals.css";
import { LangProvider } from "../components/LangProvider";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata = {
  title: "Tawjihi — Orientation après le bac au Maroc | توجيهي",
  description:
    "Simulateur de seuils (ENSA, ENCG, Médecine…), fiches écoles claires, alertes WhatsApp pour les concours, annales et entraide. مجاني."
};

export const viewport = { themeColor: "#2F45D0" };

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans min-h-screen flex flex-col">
        <LangProvider>
          <Nav />
          <main className="flex-1 pb-24 md:pb-12">{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
