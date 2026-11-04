"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Command, Dice5 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { HeroSectionNav } from "@/components/desktop/HeroSectionNav";
import { useBackToHero } from "@/hooks/useBackToHero";
import { useFullyVisible } from "@/hooks/useFullyVisible";
import { cv, localize } from "@/lib/data/cv";
import { fadeUp, stagger } from "@/lib/motion";
import { SCROLL_ROOT_ID } from "@/lib/scroll";
import { cn, relativeTime } from "@/lib/utils";
import type { GitHubRepo } from "@/types";

const containerVariants = stagger(0.1, 0.1);

const HeroAvailability = dynamic(
  () =>
    import("@/components/desktop/HeroAvailability").then(
      (module) => module.HeroAvailability,
    ),
  { ssr: false, loading: () => <div className="flex-1" /> },
);

interface HeroProps {
  latestRepo?: GitHubRepo;
  repoCount: number;
  onPlay: () => void;
  onOpenPalette: () => void;
}

export function Hero({
  latestRepo,
  repoCount,
  onPlay,
  onOpenPalette,
}: HeroProps) {
  const locale = useLocale();
  const t = useTranslations("hero");
  const tToy = useTranslations("toy");
  const tPalette = useTranslations("palette");
  const heroRef = useRef<HTMLElement>(null);
  const onHero = useFullyVisible(heroRef, SCROLL_ROOT_ID);
  useBackToHero(onHero);

  return (
    <motion.header
      ref={heroRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="pointer-events-none relative isolate flex min-h-full flex-col justify-between gap-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
        <motion.p
          variants={fadeUp}
          data-map-obstacle=""
          className="pointer-events-auto min-w-0 max-w-[26ch] font-mono text-2xl [@media(max-height:800px)]:text-xl tracking-tight text-balance text-contrast"
        >
          {localize(cv.identity.description, locale)}
          <span className="hero-caret" aria-hidden="true" />
        </motion.p>

        {latestRepo && (
          <motion.dl
            variants={fadeUp}
            data-map-obstacle=""
            className="pointer-events-auto text-right font-mono text-xs leading-relaxed"
          >
            <dt className="text-contrast/50 tracking-widest uppercase">
              {t("latest_activity")}
            </dt>
            <dd suppressHydrationWarning className="text-contrast/70">
              {relativeTime(latestRepo.pushed_at, locale)}
            </dd>
            <dd className="text-contrast/50">{latestRepo.name}</dd>
          </motion.dl>
        )}
      </div>

      <HeroAvailability />

      <div className="flex flex-col gap-8">
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-4"
        >
          <div className="h-px flex-1 bg-white/8" />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenPalette}
              data-map-obstacle=""
              className="pointer-events-auto inline-flex items-center gap-2 border border-white/8 px-4 py-2 font-mono text-xs uppercase tracking-widest text-contrast/70 transition-colors hover:border-accent/40 hover:text-accent"
            >
              <Command size={16} />
              {tPalette("open")}
              <kbd className="border border-white/8 px-1 text-contrast/50">
                {tPalette("shortcut")}
              </kbd>
            </button>
            <button
              type="button"
              onClick={onPlay}
              data-map-obstacle=""
              className="pointer-events-auto inline-flex items-center gap-2 border border-white/8 px-4 py-2 font-mono text-xs uppercase tracking-widest text-contrast/70 transition-colors hover:border-accent/40 hover:text-accent"
            >
              <Dice5 size={16} />
              {tToy("play")}
            </button>
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <div
            aria-hidden={!onHero}
            inert={!onHero}
            className={cn(
              "transition-opacity",
              onHero ? "pointer-events-auto" : "pointer-events-none opacity-0",
            )}
          >
            <HeroSectionNav repoCount={repoCount} />
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
