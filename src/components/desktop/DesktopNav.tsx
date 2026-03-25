"use client";

import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import type { SectionId } from "@/types";

const sectionIds: SectionId[] = ["hero", "logic", "entropy", "contact"];

export function DesktopNav() {
  const t = useTranslations("nav");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-8 bg-surface/80 backdrop-blur-sm border-b border-white/8">
      <span className="font-mono text-sm text-accent tracking-widest">
        jason.dev
      </span>
      <nav className="flex items-center gap-8">
        {sectionIds.map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className="font-mono text-xs text-contrast/40 hover:text-contrast transition-colors tracking-widest uppercase"
          >
            {t(id)}
          </a>
        ))}
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
