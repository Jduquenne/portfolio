import type { GitHubRepo } from "@/types";

const BASE_URL = "https://api.github.com";

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

export async function fetchPortfolioRepos(): Promise<GitHubRepo[]> {
  const username = process.env.GITHUB_USERNAME;
  if (!username || username === "YOUR_GITHUB_USERNAME") return [];

  const res = await fetch(
    `${BASE_URL}/search/repositories?q=user:${username}+topic:portfolio&sort=updated&per_page=12`,
    {
      headers: getHeaders(),
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  return (data.items ?? []) as GitHubRepo[];
}
