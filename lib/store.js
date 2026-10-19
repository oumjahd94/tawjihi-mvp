"use client";
import { useCallback, useEffect, useState } from "react";

// Petit store persistant (localStorage) partagé entre composants.
// En mode démo c'est la seule persistance ; avec Supabase, l'Espace
// synchronise en plus les favoris et le profil côté serveur.

const EVT = "tw-store";

function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem("tw:" + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function useStored(key, fallback) {
  const [value, setValue] = useState(fallback);

  useEffect(() => {
    setValue(read(key, fallback));
    const onChange = (e) => { if (!e.detail || e.detail === key) setValue(read(key, fallback)); };
    window.addEventListener(EVT, onChange);
    return () => window.removeEventListener(EVT, onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback((next) => {
    const current = read(key, fallback);
    const v = typeof next === "function" ? next(current) : next;
    try { window.localStorage.setItem("tw:" + key, JSON.stringify(v)); } catch {}
    window.dispatchEvent(new CustomEvent(EVT, { detail: key }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, update];
}

// Raccourcis métier
export const useGrades = () => useStored("grades", { bac: "PC", regional: null, cc: null, national: null, estimated: true });
export const useFavorites = () => useStored("favorites", []);
export const useUser = () => useStored("user", null);
export const useAlertPrefs = () => useStored("alerts", { whatsapp: false, sms: false, email: false, j7: true, j1: true, opening: true });
