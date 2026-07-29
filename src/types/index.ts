export type Locale = "en" | "fr";
export type LocalizedString = Record<Locale, string>;

export type SectionId = "profile" | "experience" | "stack" | "projects" | "passions";

export interface Section {
  id: SectionId;
  label: string;
}

export interface Project {
  title: string;
  description: string;
  stack: string[];
  url?: string;
  repo?: string;
}

export interface RepoStats {
  total: number;
  public: number;
  private: number;
  forks: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  pages_url: string | null;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
}
