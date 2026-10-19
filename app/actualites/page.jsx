import { listNews } from "../../lib/news";
import NewsListView from "./NewsListView";

export const revalidate = 300;
export const metadata = {
  title: "Actualités de l'orientation au Maroc",
  description: "Concours, résultats, listes d'attente, bourses, études à l'étranger : toute l'actualité de l'orientation après le bac. مستجدات التوجيه."
};

export default async function Page() {
  return <NewsListView news={await listNews(100)} />;
}
