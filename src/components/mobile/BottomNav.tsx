"use client";

import { useTranslations } from "next-intl";
import type { SectionId } from "@/types";

const sectionIds: SectionId[] = ["profile", "experience", "stack", "projects", "entropy"];

export function BottomNav() {
  const t = useTranslations("nav");

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-14 bg-surface/90 backdrop-blur-sm border-t border-white/8 flex items-center justify-around px-6">
      {sectionIds.map((id) => (
        <a
          key={id}
          href={`#${id}`}
          className="font-mono text-xs text-contrast/40 hover:text-accent transition-colors tracking-widest uppercase"
        >
          {t(id)}
        </a>
      ))}
    </nav>
  );
}
