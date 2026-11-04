"use client";

import { useTranslations } from "next-intl";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";
import type { SectionId } from "@/types";

const sectionIds: SectionId[] = [
  "experience",
  "stack",
  "projects",
  "passions",
  "play",
];

export function BottomNav() {
  const t = useTranslations("nav");
  const activeId = useActiveSection(sectionIds);

  return (
    <nav className="relative z-10 flex h-14 shrink-0 items-center justify-around border-t border-white/8 bg-surface px-6">
      {sectionIds.map((id) => (
        <a
          key={id}
          href={`#${id}`}
          aria-current={activeId === id ? "true" : undefined}
          className={cn(
            "inline-flex h-full min-w-10 items-center justify-center font-mono text-xs hover:text-accent transition-colors duration-200 tracking-widest uppercase",
            activeId === id ? "text-accent" : "text-contrast/50",
          )}
        >
          {t(id)}
        </a>
      ))}
    </nav>
  );
}
