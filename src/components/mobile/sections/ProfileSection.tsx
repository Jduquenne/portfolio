"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { cv, localize } from "@/lib/data/cv";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 90, damping: 20 },
  },
};

export function ProfileSection() {
  const locale = useLocale();
  const t = useTranslations("hero");
  const tc = useTranslations("contact");

  return (
    <section
      id="profile"
      className="h-screen snap-start overflow-y-auto shrink-0 bento-scroll"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-6 px-6 pt-12 pb-14"
      >
        {/* Photo + identity */}
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0">
            <div className="w-full h-full border border-white/12 bg-surface flex items-center justify-center">
              <span className="font-mono text-lg font-bold text-accent/40">
                {cv.identity.initials}
              </span>
            </div>
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent/60" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-accent/60" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-accent/60" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-accent/60" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="font-mono text-base font-bold text-contrast leading-tight">
              {cv.identity.name}
            </h1>
            <p className="font-sans text-xs text-contrast/50">
              {localize(cv.identity.subtitle, locale)}
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between"
        >
          <span className="font-mono text-xs text-accent tracking-widest uppercase">
            {t("available")}
          </span>
          <LanguageSwitcher />
        </motion.div>

        <div className="border-t border-white/8" />

        <motion.div variants={itemVariants} className="flex flex-col gap-3">
          <span className="font-mono text-xs text-contrast/24 tracking-widest uppercase">
            // contact
          </span>
          <a
            href={`mailto:${cv.contact.email}`}
            className="flex items-center gap-2 font-mono text-xs text-contrast/50 hover:text-accent transition-colors w-fit"
          >
            {cv.contact.email}
            <ArrowUpRight size={12} />
          </a>
          <div className="flex items-center gap-6">
            <a
              href={cv.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-contrast/50 hover:text-accent transition-colors tracking-widest uppercase"
            >
              {tc("github")}
            </a>
            <span className="text-contrast/16 font-mono text-xs">—</span>
            <a
              href={cv.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-contrast/50 hover:text-accent transition-colors tracking-widest uppercase"
            >
              {tc("linkedin")}
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
