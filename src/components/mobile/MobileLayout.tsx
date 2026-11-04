import { BottomNav } from "@/components/mobile/BottomNav";
import { ScrollToTop } from "@/components/mobile/ScrollToTop";
import { AvailabilitySection } from "@/components/mobile/sections/AvailabilitySection";
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
    <div className="h-visible flex flex-col bg-base text-contrast font-sans">
      <main
        id="main"
        className="grid-backdrop bento-scroll min-h-0 flex-1 overflow-y-scroll snap-y snap-mandatory"
      >
        <ProfileSection />
        <AvailabilitySection />
        <ExperienceSection />
        <StackSection />
        <ProjectsSection repos={repos} stats={stats} />
        <PassionsSection />
        <PlaySection />
      </main>
      <ScrollToTop />
      <BottomNav />
    </div>
  );
}
