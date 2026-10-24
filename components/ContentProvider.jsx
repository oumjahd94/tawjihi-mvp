"use client";
import { createContext, useContext, useMemo } from "react";
import { CONCOURS, UPDATED_AT, activeConcours } from "../lib/concours";
import { SCHOOLS, withSeuils, simulatorSchools } from "../lib/schools";
import { rowToSeuil } from "../lib/content-map";

// Contenus modifiables depuis /admin, chargés une fois par le layout (serveur)
// et partagés avec toutes les pages : concours, date de mise à jour, seuils corrigés.
const ContentContext = createContext({ concours: CONCOURS, updatedAt: UPDATED_AT, seuils: [] });

export function ContentProvider({ value, children }) {
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

// Concours encore utiles (ouverts, en cours, à venir) + date de dernière mise à jour
export function useConcours() {
  const { concours, updatedAt } = useContext(ContentContext);
  const active = useMemo(() => activeConcours(concours), [concours]);
  return { active, updatedAt };
}

// Toutes les fiches écoles, avec les seuils corrigés depuis l'admin
export function useSchools() {
  const { seuils } = useContext(ContentContext);
  return useMemo(() => withSeuils(SCHOOLS, seuils, rowToSeuil), [seuils]);
}

export function useSchool(slug) {
  const list = useSchools();
  return useMemo(() => list.find((s) => s.slug === slug), [list, slug]);
}

// Année des seuils affichée dans les textes : celle de la majorité des écoles du simulateur
export function useSeuilYear() {
  const sims = useSimulatorSchools();
  return useMemo(() => {
    const n = {};
    sims.forEach((s) => { n[s.seuil.year] = (n[s.seuil.year] || 0) + 1; });
    return Number(Object.keys(n).sort((a, b) => n[b] - n[a] || b - a)[0]) || 2026;
  }, [sims]);
}

export function useSimulatorSchools() {
  const list = useSchools();
  return useMemo(() => simulatorSchools(list), [list]);
}
