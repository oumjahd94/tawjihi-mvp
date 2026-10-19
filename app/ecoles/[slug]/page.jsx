import { notFound } from "next/navigation";
import { SCHOOLS, schoolBySlug } from "../../../lib/schools";
import SchoolView from "./SchoolView";

export function generateStaticParams() {
  return SCHOOLS.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }) {
  const s = schoolBySlug(params.slug);
  if (!s) return {};
  const seuil = s.seuil ? ` Seuil ${s.seuil.year}.` : "";
  return {
    title: `${s.acronym} : seuils, concours, inscription`,
    description: `${s.fr}${s.city ? ` (${s.city})` : ""} — accès, durée, diplôme, débouchés.${seuil} ${s.ar}`
  };
}

export default function Page({ params }) {
  if (!schoolBySlug(params.slug)) notFound();
  return <SchoolView slug={params.slug} />;
}
