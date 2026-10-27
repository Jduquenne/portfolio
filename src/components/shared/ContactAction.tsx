"use client";

import { Check, Copy, Mail, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCopyEmail } from "@/hooks/useCopyEmail";
import { cv } from "@/lib/data/cv";
import { cn } from "@/lib/utils";

/** The one primary action of the mobile portfolio: write to me, or copy the address. */
export function ContactAction() {
  const t = useTranslations("contact");
  const { state, copy } = useCopyEmail();

  const status =
    state === "copied"
      ? t("copied")
      : state === "failed"
        ? `${t("copy_failed")} ${cv.contact.email}`
        : "";

  const CopyIcon = state === "copied" ? Check : state === "failed" ? X : Copy;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-stretch gap-2">
        <a
          href={`mailto:${cv.contact.email}`}
          className="inline-flex min-h-10 min-w-0 flex-1 items-center justify-center gap-2 bg-accent px-4 py-2 font-mono text-sm font-bold text-surface transition-colors hover:bg-accent/85"
        >
          <Mail size={16} />
          {t("write")}
        </a>
        <button
          type="button"
          onClick={() => void copy()}
          aria-label={t("copy")}
          className={cn(
            "inline-flex aspect-square shrink-0 items-center justify-center transition-colors hover:text-accent",
            state === "idle" ? "text-contrast/50" : "text-accent",
          )}
        >
          <CopyIcon size={16} />
        </button>
        <span aria-live="polite" className="sr-only">
          {status}
        </span>
      </div>
      {state === "failed" && (
        <p className="font-mono text-xs text-contrast/50">
          {t("copy_failed")}{" "}
          <span className="select-all text-contrast">{cv.contact.email}</span>
        </p>
      )}
    </div>
  );
}
