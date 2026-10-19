import { notFound } from "next/navigation";
import { getNews, listNews } from "../../../lib/news";
import { renderMarkdown } from "../../../lib/markdown";
import ArticleView from "./ArticleView";

export const revalidate = 300;
export const dynamicParams = true; // les nouveaux articles publiés depuis /admin sont servis sans rebuild

export async function generateStaticParams() {
  return (await listNews(100)).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }) {
  const n = await getNews(params.slug);
  if (!n) return {};
  return {
    title: n.title_fr,
    description: n.excerpt_fr,
    openGraph: { title: n.title_fr, description: n.excerpt_fr, type: "article", publishedTime: n.published_at, images: n.cover_url ? [n.cover_url] : undefined }
  };
}

export default async function Page({ params }) {
  const n = await getNews(params.slug);
  if (!n) notFound();
  const related = (await listNews(8)).filter((x) => x.slug !== n.slug).slice(0, 3);
  return (
    <ArticleView
      n={n}
      html={{ fr: renderMarkdown(n.body_fr), ar: renderMarkdown(n.body_ar || n.body_fr) }}
      related={related}
    />
  );
}
