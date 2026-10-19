"use client";
import { createContext, useContext, useEffect, useState } from "react";

// Arabe par défaut (langue majoritaire des bacheliers), choix mémorisé.
const LangContext = createContext({ lang: "ar", setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState("ar");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tw:lang");
      if (saved === "fr" || saved === "ar") setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l) => {
    setLangState(l);
    try { localStorage.setItem("tw:lang", l); } catch {}
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

// t({ ar: "...", fr: "..." }) ou t(objet avec clés ar/fr)
export function useT() {
  const { lang } = useLang();
  return (obj) => (obj ? obj[lang] ?? obj.fr ?? "" : "");
}
