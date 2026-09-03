"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function CvLoading({ error = false }: { error?: boolean }) {
  const t = useTranslations("cv");

  return (
    <div className="flex h-[82vh] w-full items-center justify-center border border-white/8 bg-surface">
      <span
        className={cn(
          "font-mono text-xs uppercase tracking-widest text-contrast/40",
          !error && "cv-loading",
        )}
      >
        {error ? t("error") : t("loading")}
      </span>
    </div>
  );
}
