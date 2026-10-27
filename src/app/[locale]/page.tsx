import { AdventureRouter } from "@/components/shared/AdventureRouter";
import { NoScriptContent } from "@/components/shared/NoScriptContent";
import { fetchPortfolioRepos } from "@/lib/github";
import { withPreviews } from "@/lib/previews";
import type { Locale } from "@/types";

export const dynamic = "force-static";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const { repos: listed, stats } = await fetchPortfolioRepos();
  const repos = withPreviews(listed);

  return (
    <>
      <AdventureRouter repos={repos} stats={stats} />
      <NoScriptContent locale={locale} repos={repos} />
    </>
  );
}
