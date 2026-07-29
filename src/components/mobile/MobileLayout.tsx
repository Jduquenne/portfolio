import { BottomNav } from "@/components/mobile/BottomNav";
import { ProfileSection } from "@/components/mobile/sections/ProfileSection";
import { ExperienceSection } from "@/components/mobile/sections/ExperienceSection";
import { StackSection } from "@/components/mobile/sections/StackSection";
import { ProjectsSection } from "@/components/mobile/sections/ProjectsSection";
import { PassionsSection } from "@/components/mobile/sections/PassionsSection";
import type { GitHubRepo } from "@/types";

interface MobileLayoutProps {
  repos: GitHubRepo[];
}

export function MobileLayout({ repos }: MobileLayoutProps) {
  return (
    <>
      <main className="h-screen overflow-y-scroll snap-y snap-mandatory bg-base text-contrast font-sans">
        <ProfileSection />
        <ExperienceSection />
        <StackSection />
        <ProjectsSection repos={repos} />
        <PassionsSection />
      </main>
      <BottomNav />
    </>
  );
}
