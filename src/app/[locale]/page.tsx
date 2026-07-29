import { AdventureRouter } from "@/components/shared/AdventureRouter";
import { fetchPortfolioRepos } from "@/lib/github";

export const dynamic = "force-static";

export default async function Page() {
  const { repos, stats } = await fetchPortfolioRepos();
  return <AdventureRouter repos={repos} stats={stats} />;
}
