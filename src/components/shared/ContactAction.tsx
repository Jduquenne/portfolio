"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Mail, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cv } from "@/lib/data/cv";
import { cn } from "@/lib/utils";

type CopyState = "idle" | "copied" | "failed";

const RESET_DELAY_MS = 2000;

/** The one primary action of the portfolio: write to me, or copy the address. */
export function ContactAction() {
  const t = useTranslations("contact");
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cv.contact.email);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopyState("idle"), RESET_DELAY_MS);
  };

  const status =
    copyState === "copied"
      ? t("copied")
      : copyState === "failed"
        ? t("copy_failed")
        : "";

  const CopyIcon =
    copyState === "copied" ? Check : copyState === "failed" ? X : Copy;

  return (
    <div className="flex items-stretch gap-2">
      <a
        href={`mailto:${cv.contact.email}`}
        className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 bg-accent px-4 py-2 font-mono text-sm font-bold text-surface transition-colors hover:bg-accent/85"
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
          copyState === "idle" ? "text-contrast/50" : "text-accent",
        )}
      >
        <CopyIcon size={16} />
      </button>
      <span aria-live="polite" className="sr-only">
        {status}
      </span>
    </div>
  );
}
