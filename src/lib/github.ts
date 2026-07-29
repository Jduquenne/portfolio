import type { GitHubRepo, RepoStats } from "@/types";

const BASE_URL = "https://api.github.com";

export const REPO_COUNT = 8;

function getHeaders(withToken = true): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (withToken && process.env.GH_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GH_TOKEN}`;
  }
  return headers;
}

const RECENT_REPOS_QUERY = `
  query GetRecentRepos($login: String!, $count: Int!) {
    user(login: $login) {
      publicCount: repositories(ownerAffiliations: [OWNER], isFork: false, privacy: PUBLIC) {
        totalCount
      }
      privateCount: repositories(ownerAffiliations: [OWNER], isFork: false, privacy: PRIVATE) {
        totalCount
      }
      forkCount: repositories(ownerAffiliations: [OWNER], isFork: true) {
        totalCount
      }
      repositories(
        first: $count
        privacy: PUBLIC
        isFork: false
        ownerAffiliations: [OWNER]
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        nodes {
          databaseId
          name
          description
          url
          homepageUrl
          repositoryTopics(first: 10) {
            nodes { topic { name } }
          }
          primaryLanguage { name }
          stargazerCount
          pushedAt
          isFork
          deployments(last: 1, environments: ["github-pages"]) {
            nodes {
              latestStatus {
                environmentUrl
                state
              }
            }
          }
        }
      }
    }
  }
`;

interface RecentRepoNode {
  databaseId: number;
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  repositoryTopics: { nodes: Array<{ topic: { name: string } }> };
  primaryLanguage: { name: string } | null;
  stargazerCount: number;
  pushedAt: string;
  isFork: boolean;
  deployments: {
    nodes: Array<{
      latestStatus: { environmentUrl: string; state: string } | null;
    }>;
  };
}

export interface PortfolioData {
  repos: GitHubRepo[];
  stats: RepoStats | null;
}

async function fetchRecentRepos(username: string): Promise<PortfolioData> {
  const token = process.env.GH_TOKEN;
  if (!token) return { repos: [], stats: null };

  const res = await fetch(`${BASE_URL}/graphql`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: RECENT_REPOS_QUERY,
      variables: { login: username, count: REPO_COUNT },
    }),
    cache: "force-cache",
  });

  if (!res.ok) {
    console.warn(`[github] GraphQL request failed (${res.status})`);
    return { repos: [], stats: null };
  }

  const data = await res.json();

  if (data?.errors?.length) {
    console.warn(`[github] GraphQL errors: ${data.errors[0]?.message}`);
  }

  const user = data?.data?.user;
  const nodes: RecentRepoNode[] = user?.repositories?.nodes ?? [];

  const publicCount: number = user?.publicCount?.totalCount ?? 0;
  const privateCount: number = user?.privateCount?.totalCount ?? 0;

  const repos = nodes.map((node) => {
    const deployment = node.deployments.nodes[0]?.latestStatus;
    const pagesUrl =
      deployment?.state === "SUCCESS" ? deployment.environmentUrl : null;

    return {
      id: node.databaseId,
      name: node.name,
      description: node.description,
      html_url: node.url,
      homepage: node.homepageUrl,
      pages_url: pagesUrl,
      topics: node.repositoryTopics.nodes.map((t) => t.topic.name),
      language: node.primaryLanguage?.name ?? null,
      stargazers_count: node.stargazerCount,
      pushed_at: node.pushedAt,
      fork: node.isFork,
    };
  });

  return {
    repos,
    stats: {
      total: publicCount + privateCount,
      public: publicCount,
      private: privateCount,
      forks: user?.forkCount?.totalCount ?? 0,
    },
  };
}

interface RestRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
  private: boolean;
}

async function fetchRecentReposRest(username: string): Promise<GitHubRepo[]> {
  const url = `${BASE_URL}/users/${username}/repos?sort=pushed&direction=desc&type=owner&per_page=${REPO_COUNT * 2}`;

  let res = await fetch(url, { headers: getHeaders(), cache: "force-cache" });

  // A rejected token must not take the public fallback down with it
  if (res.status === 401 || res.status === 403) {
    console.warn(
      `[github] token rejected (${res.status}) — retrying unauthenticated`
    );
    res = await fetch(url, {
      headers: getHeaders(false),
      cache: "force-cache",
    });
  }

  if (!res.ok) {
    console.warn(`[github] repo fallback failed (${res.status})`);
    return [];
  }

  const data: RestRepo[] = await res.json();

  return data
    .filter((repo) => !repo.fork && !repo.private)
    .slice(0, REPO_COUNT)
    .map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      html_url: repo.html_url,
      homepage: repo.homepage,
      pages_url: null,
      topics: repo.topics ?? [],
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      pushed_at: repo.pushed_at,
      fork: repo.fork,
    }));
}

export async function fetchPortfolioRepos(): Promise<PortfolioData> {
  const username = process.env.GH_USERNAME;
  if (!username) return { repos: [], stats: null };

  const recent = await fetchRecentRepos(username);
  if (recent.repos.length > 0) return recent;

  return { repos: await fetchRecentReposRest(username), stats: null };
}
