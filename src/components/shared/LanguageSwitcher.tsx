"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import type { Locale } from "next-intl";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("language");
  const router = useRouter();
  const pathname = usePathname();

  const nextLocale: Locale = locale === "fr" ? "en" : "fr";

  const handleSwitch = () => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      type="button"
      lang={nextLocale}
      aria-label={`${nextLocale.toUpperCase()}: ${t("switch")}`}
      onClick={handleSwitch}
      className="-m-2 inline-flex min-h-10 min-w-10 items-center justify-center font-mono text-xs text-contrast/50 hover:text-accent transition-colors tracking-widest uppercase"
    >
      {nextLocale}
    </button>
  );
}
