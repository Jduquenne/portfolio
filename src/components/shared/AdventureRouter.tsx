"use client";

import { useDevice } from "@/hooks/useDevice";
import { DesktopLayout } from "@/components/desktop/DesktopLayout";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import type { GitHubRepo } from "@/types";

interface AdventureRouterProps {
  repos: GitHubRepo[];
}

export function AdventureRouter({ repos }: AdventureRouterProps) {
  const { isDesktop } = useDevice();

  if (isDesktop === null) return <div className="h-full bg-base" />;

  return isDesktop ? (
    <DesktopLayout repos={repos} />
  ) : (
    <MobileLayout repos={repos} />
  );
}
