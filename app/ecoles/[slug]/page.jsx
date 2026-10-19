import { notFound } from "next/navigation";
import { SCHOOLS } from "../../../lib/data";
import SchoolView from "./SchoolView";

// Une page statique par école, générée au build → indexée par Google
export function generateStaticParams() {
  return SCHOOLS.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }) {
  const s = SCHOOLS.find((x) => x.slug === params.slug);
  if (!s) return {};
  return {
    title: `${s.acronym} : seuils, concours, débouchés | ${s.ar}`,
    description: `${s.fr} — seuils des 5 dernières années, formule de calcul, dates d'inscription, débouchés et salaires au Maroc.`
  };
}

export default function Page({ params }) {
  const s = SCHOOLS.find((x) => x.slug === params.slug);
  if (!s) notFound();
  return <SchoolView slug={s.slug} />;
}
