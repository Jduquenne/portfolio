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

const PINNED_REPOS_QUERY = `
  query GetPinnedRepos($login: String!) {
    user(login: $login) {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
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
            updatedAt
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
  }
`;

interface PinnedRepoNode {
  databaseId: number;
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  repositoryTopics: { nodes: Array<{ topic: { name: string } }> };
  primaryLanguage: { name: string } | null;
  stargazerCount: number;
  updatedAt: string;
  isFork: boolean;
  deployments: {
    nodes: Array<{
      latestStatus: { environmentUrl: string; state: string } | null;
    }>;
  };
}

async function fetchPinnedRepos(username: string): Promise<GitHubRepo[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return [];

  const res = await fetch(`${BASE_URL}/graphql`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: PINNED_REPOS_QUERY,
      variables: { login: username },
    }),
    cache: "force-cache",
  });

  if (!res.ok) return [];

  const data = await res.json();
  const nodes: PinnedRepoNode[] =
    data?.data?.user?.pinnedItems?.nodes ?? [];

  return [...nodes]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .map((node) => {
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
      updated_at: node.updatedAt,
      fork: node.isFork,
    };
  });
}

async function fetchByTopic(username: string): Promise<GitHubRepo[]> {
  const res = await fetch(
    `${BASE_URL}/search/repositories?q=user:${username}+topic:portfolio&sort=updated&per_page=12`,
    {
      headers: getHeaders(),
      cache: "force-cache",
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  return (data.items ?? []).map((item: GitHubRepo) => ({
    ...item,
    pages_url: null,
  }));
}

export async function fetchPortfolioRepos(): Promise<GitHubRepo[]> {
  const username = process.env.GITHUB_USERNAME;
  if (!username) return [];

  const pinned = await fetchPinnedRepos(username);
  if (pinned.length > 0) return pinned;

  return fetchByTopic(username);
}
