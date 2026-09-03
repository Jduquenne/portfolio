import { Hero } from "@/components/desktop/Hero";
import { Sidebar } from "@/components/desktop/Sidebar";
import { ExperienceSection } from "@/components/desktop/sections/ExperienceSection";
import { ProjectsSection } from "@/components/desktop/sections/ProjectsSection";
import { SpecialtiesSection } from "@/components/desktop/sections/SpecialtiesSection";
import type { GitHubRepo, RepoStats } from "@/types";

interface DesktopLayoutProps {
  repos: GitHubRepo[];
  stats: RepoStats | null;
}

export function DesktopLayout({ repos, stats }: DesktopLayoutProps) {
  return (
    <div className="grid-backdrop flex h-screen text-contrast font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bento-scroll px-16 py-12 flex flex-col gap-16">
        <Hero latestRepo={repos[0]} />
        <ExperienceSection />
        <ProjectsSection repos={repos} stats={stats} />
        <SpecialtiesSection />
      </main>
    </div>
  );
}
