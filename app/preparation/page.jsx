import PreparationView from "./PreparationView";
import { getPrepContent } from "../../lib/content";

export const revalidate = 300;
export const metadata = { title: "Prépa concours : annales et quiz chronométrés" };

export default async function Page() {
  const { annales, quizzes } = await getPrepContent();
  return <PreparationView annales={annales} quizzes={quizzes} />;
}
