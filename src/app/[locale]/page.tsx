import { AdventureRouter } from "@/components/shared/AdventureRouter";
import { fetchPortfolioRepos } from "@/lib/github";

export default async function Page() {
  const repos = await fetchPortfolioRepos();
  return <AdventureRouter repos={repos} />;
}
