"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cv } from "@/lib/data/cv";

const BUTTON =
  "inline-flex min-h-10 items-center justify-center border border-white/12 font-mono text-xs uppercase tracking-widest text-contrast/70 transition-colors hover:border-accent/40 hover:text-accent [@media(min-height:900px)]:min-h-12";

/** The secondary ways out: the code, the network, the CV. */
export function ContactLinks() {
  const t = useTranslations("contact");

  return (
    <div className="grid grid-cols-3 gap-2">
      <a href={cv.contact.github} target="_blank" rel="noopener noreferrer" className={BUTTON}>
        {t("github")}
      </a>
      <a href={cv.contact.linkedin} target="_blank" rel="noopener noreferrer" className={BUTTON}>
        {t("linkedin")}
      </a>
      <Link href="/cv" className={BUTTON}>
        {t("cv")}
      </Link>
    </div>
  );
}
