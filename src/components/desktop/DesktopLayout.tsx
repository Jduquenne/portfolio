import { DesktopNav } from "@/components/desktop/DesktopNav";
import { HeroCard } from "@/components/desktop/sections/HeroCard";
import { LogicCard } from "@/components/desktop/sections/LogicCard";
import { EntropyCard } from "@/components/desktop/sections/EntropyCard";
import { ContactCard } from "@/components/desktop/sections/ContactCard";
import type { GitHubRepo } from "@/types";

interface DesktopLayoutProps {
  repos: GitHubRepo[];
}

export function DesktopLayout({ repos }: DesktopLayoutProps) {
  return (
    <>
      <DesktopNav />
      <main className="bg-base text-contrast font-sans pt-16">
        <HeroCard />
        <LogicCard repos={repos} />
        <EntropyCard />
        <ContactCard />
      </main>
    </>
  );
}
