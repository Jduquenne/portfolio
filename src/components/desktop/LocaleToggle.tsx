"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** Both languages side by side, the current one lit: no guessing which one the button will switch to. */
export function LocaleToggle() {
  const t = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      role="group"
      aria-label={t("switch")}
      className="flex items-center font-mono text-xs"
    >
      {routing.locales.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={code === locale}
          onClick={() => {
            if (code !== locale) router.replace(pathname, { locale: code });
          }}
          className={cn(
            "px-2 py-1 uppercase tracking-widest transition-colors",
            code === locale
              ? "bg-accent/10 text-accent"
              : "text-contrast/50 hover:text-contrast",
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
