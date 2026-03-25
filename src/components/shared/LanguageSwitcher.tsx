"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import type { Locale } from "next-intl";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const nextLocale: Locale = locale === "fr" ? "en" : "fr";

  const handleSwitch = () => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={handleSwitch}
      className="font-mono text-xs text-contrast/40 hover:text-accent transition-colors tracking-widest uppercase"
    >
      {nextLocale}
    </button>
  );
}
