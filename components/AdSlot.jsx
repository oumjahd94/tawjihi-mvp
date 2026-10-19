"use client";
import { useEffect, useRef } from "react";

// Emplacement Google AdSense.
// - Production : s'affiche seulement si NEXT_PUBLIC_ADSENSE_CLIENT est défini.
// - Développement : un cadre pointillé montre où la pub apparaîtra.
const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function AdSlot({ slot, format = "auto", className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!CLIENT || !slot || !ref.current || ref.current.dataset.loaded) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      ref.current.dataset.loaded = "1";
    } catch {}
  }, [slot]);

  if (!CLIENT || !slot) {
    if (process.env.NODE_ENV !== "development") return null;
    return (
      <div className={`grid place-items-center rounded-xl border-2 border-dashed border-line text-xs font-semibold text-ink-faint h-24 ${className}`}>
        Emplacement publicitaire (AdSense)
      </div>
    );
  }

  return (
    <div className={className}>
      <p className="text-[10px] uppercase tracking-wider text-ink-faint mb-1">Publicité</p>
      <ins ref={ref} className="adsbygoogle block" style={{ display: "block" }}
        data-ad-client={CLIENT} data-ad-slot={slot} data-ad-format={format} data-full-width-responsive="true" />
    </div>
  );
}

export const AD_SLOTS = {
  home: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME,
  article: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE,
  list: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LIST
};
