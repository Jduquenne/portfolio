export type SectionId = "hero" | "logic" | "entropy" | "contact";

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

export interface Passion {
  title: string;
  stat: string;
  label: string;
  year?: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  fork: boolean;
}
