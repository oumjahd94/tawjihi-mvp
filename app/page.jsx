import HomeView from "./HomeView";
import { listNews } from "../lib/news";

export const revalidate = 300; // les actualités se rafraîchissent toutes les 5 min

export default async function Page() {
  const news = await listNews(6);
  return <HomeView news={news} />;
}
