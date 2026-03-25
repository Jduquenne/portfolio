"use client";

import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import type { SectionId } from "@/types";

const sectionIds: SectionId[] = ["hero", "logic", "entropy", "contact"];

export function BottomNav() {
  const t = useTranslations("nav");

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-white/8 flex items-center justify-around px-8">
      {sectionIds.map((id) => (
        <a
          key={id}
          href={`#${id}`}
          className="font-mono text-xs text-contrast/40 hover:text-accent transition-colors"
        >
          {t(id)}
        </a>
      ))}
      <LanguageSwitcher />
    </nav>
  );
}
