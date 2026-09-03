import { BottomNav } from "@/components/mobile/BottomNav";
import { ScrollToTop } from "@/components/mobile/ScrollToTop";
import { ProfileSection } from "@/components/mobile/sections/ProfileSection";
import { ExperienceSection } from "@/components/mobile/sections/ExperienceSection";
import { StackSection } from "@/components/mobile/sections/StackSection";
import { ProjectsSection } from "@/components/mobile/sections/ProjectsSection";
import { PassionsSection } from "@/components/mobile/sections/PassionsSection";
import { PlaySection } from "@/components/mobile/sections/PlaySection";
import type { GitHubRepo, RepoStats } from "@/types";

interface MobileLayoutProps {
  repos: GitHubRepo[];
  stats: RepoStats | null;
}

export function MobileLayout({ repos, stats }: MobileLayoutProps) {
  return (
    <>
      <main className="grid-backdrop bento-scroll h-screen overflow-y-scroll snap-y snap-mandatory text-contrast font-sans">
        <ProfileSection />
        <ExperienceSection />
        <StackSection />
        <ProjectsSection repos={repos} stats={stats} />
        <PassionsSection />
        <PlaySection />
      </main>
      <ScrollToTop />
      <BottomNav />
    </>
  );
}
