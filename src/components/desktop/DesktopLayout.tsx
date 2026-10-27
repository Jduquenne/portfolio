"use client";

import { useState } from "react";
import { CommandPalette } from "@/components/desktop/CommandPalette";
import { CursorGlow } from "@/components/desktop/CursorGlow";
import { Hero } from "@/components/desktop/Hero";
import { PlayModal } from "@/components/desktop/PlayModal";
import { StackFocusProvider } from "@/components/desktop/StackFocus";
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
  const [playOpen, setPlayOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div className="grid-backdrop relative isolate flex h-screen text-contrast font-sans overflow-hidden">
      <CursorGlow />
      <StackFocusProvider>
        <Sidebar />
        <main id="main" className="flex-1 overflow-y-auto bento-scroll px-16 py-12 flex flex-col gap-16">
          <Hero
            latestRepo={repos[0]}
            onPlay={() => setPlayOpen(true)}
            onOpenPalette={() => setPaletteOpen(true)}
          />
          <ExperienceSection />
          <ProjectsSection repos={repos} stats={stats} />
          <SpecialtiesSection />
        </main>
      </StackFocusProvider>

      <PlayModal open={playOpen} onClose={() => setPlayOpen(false)} />
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onPlay={() => setPlayOpen(true)}
      />
    </div>
  );
}
