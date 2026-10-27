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
    <nav className="fixed bottom-0 left-0 right-0 h-14 bg-surface/90 backdrop-blur-sm border-t border-white/8 flex items-center justify-around px-6">
      {sectionIds.map((id) => (
        <a
          key={id}
          href={`#${id}`}
          aria-current={activeId === id ? "true" : undefined}
          className={cn(
            "inline-flex h-full min-w-10 items-center justify-center font-mono text-xs hover:text-accent transition-colors duration-200 tracking-widest uppercase",
            activeId === id ? "text-accent" : "text-contrast/40",
          )}
        >
          {t(id)}
        </a>
      ))}
    </nav>
  );
}
