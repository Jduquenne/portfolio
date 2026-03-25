import { BottomNav } from "@/components/mobile/BottomNav";
import { HeroSection } from "@/components/mobile/sections/HeroSection";
import { LogicSection } from "@/components/mobile/sections/LogicSection";
import { EntropySection } from "@/components/mobile/sections/EntropySection";
import { ContactSection } from "@/components/mobile/sections/ContactSection";
import type { GitHubRepo } from "@/types";

interface MobileLayoutProps {
  repos: GitHubRepo[];
}

export function MobileLayout({ repos }: MobileLayoutProps) {
  return (
    <>
      <main className="h-screen overflow-y-scroll snap-y snap-mandatory bg-base text-contrast font-sans">
        <HeroSection />
        <LogicSection repos={repos} />
        <EntropySection />
        <ContactSection />
      </main>
      <BottomNav />
    </>
  );
}
