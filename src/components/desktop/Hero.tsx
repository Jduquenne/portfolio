"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Dice5 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PlayModal } from "@/components/desktop/PlayModal";
import { cv, localize } from "@/lib/data/cv";
import { relativeTime } from "@/lib/utils";
import type { GitHubRepo } from "@/types";

const containerVariants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.1, staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 90, damping: 20 },
  },
};

interface HeroProps {
  latestRepo?: GitHubRepo;
}

export function Hero({ latestRepo }: HeroProps) {
  const locale = useLocale();
  const t = useTranslations("hero");
  const tToy = useTranslations("toy");
  const [playOpen, setPlayOpen] = useState(false);

  return (
    <>
      <motion.header
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
          <motion.p
            variants={itemVariants}
            className="min-w-0 max-w-[26ch] font-mono text-[2rem] leading-[1.18] tracking-tight text-balance text-contrast"
          >
            {localize(cv.identity.description, locale)}
            <span className="hero-caret" aria-hidden="true" />
          </motion.p>

          {latestRepo && (
            <motion.dl
              variants={itemVariants}
              className="text-right font-mono text-xs leading-relaxed"
            >
              <dt className="text-contrast/40 tracking-widest uppercase">
                {t("latest_activity")}
              </dt>
              <dd suppressHydrationWarning className="text-contrast/70">
                {relativeTime(latestRepo.pushed_at, locale)}
              </dd>
              <dd className="text-contrast/40">{latestRepo.name}</dd>
            </motion.dl>
          )}
        </div>

        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4"
        >
          <div className="h-px flex-1 bg-white/8" />
          <button
            type="button"
            onClick={() => setPlayOpen(true)}
            className="inline-flex items-center gap-2 border border-white/8 px-3 py-2 font-mono text-xs uppercase tracking-widest text-contrast/50 transition-colors hover:border-accent/40 hover:text-accent"
          >
            <Dice5 size={16} />
            {tToy("play")}
          </button>
        </motion.div>
      </motion.header>

      <PlayModal open={playOpen} onClose={() => setPlayOpen(false)} />
    </>
  );
}
