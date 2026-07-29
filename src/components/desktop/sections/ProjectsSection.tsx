"use client";

import { motion } from "framer-motion";
import { ExternalLink, GitBranch, Globe, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { GitHubRepo, RepoStats } from "@/types";
import { LANG_COLORS } from "@/lib/languages";
import { relativeTime } from "@/lib/utils";
import { RepoStatsReadout } from "@/components/shared/RepoStatsReadout";

const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 90, damping: 20 },
  },
};

const accentBarVariants = {
  rest: { scaleY: 0 },
  hover: {
    scaleY: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 },
  },
};

const topicsVariants = {
  rest: { opacity: 1 },
  hover: { opacity: 0, transition: { duration: 0.12 } },
};

const descriptionVariants = {
  rest: { opacity: 0, y: 8 },
  hover: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 26 },
  },
};

interface ProjectsSectionProps {
  repos: GitHubRepo[];
  stats: RepoStats | null;
}

export function ProjectsSection({ repos, stats }: ProjectsSectionProps) {
  const t = useTranslations("logic");
  const locale = useLocale();

  return (
    <motion.section
      id="logic"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-64px" }}
    >
      <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
        <span className="font-mono text-xs text-accent tracking-widest uppercase shrink-0">
          {t("projects_title")}
        </span>
        <div className="flex-1 h-px bg-white/8" />
        {stats && <RepoStatsReadout stats={stats} className="shrink-0" />}
      </motion.div>

      {repos.length === 0 ? (
        <motion.p variants={itemVariants} className="font-mono text-xs text-contrast/24">
          {t("empty_repos")}
        </motion.p>
      ) : (
        <motion.div variants={sectionVariants} className="grid grid-cols-2 gap-4">
          {repos.map((repo) => (
            <motion.div key={repo.id} variants={itemVariants}>
              <motion.div
                initial="rest"
                whileHover="hover"
                className="relative h-44 border border-white/8 hover:border-accent/20 bg-surface flex flex-col gap-4 p-4 overflow-hidden transition-colors duration-200"
              >
                {/* Spring bar on hover */}
                <motion.div
                  variants={accentBarVariants}
                  style={{ transformOrigin: "top" }}
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent"
                />

                {/* Name + links */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex items-baseline gap-2">
                    <p className="font-mono text-xs font-bold text-contrast leading-tight truncate">
                      {repo.name}
                    </p>
                    {repo.fork && (
                      <span className="font-mono text-[10px] text-contrast/24 shrink-0">
                        {t("fork")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {repo.stargazers_count > 0 && (
                      <span className="flex items-center gap-1 font-mono text-[10px] text-contrast/40">
                        <Star size={9} />
                        {repo.stargazers_count}
                      </span>
                    )}
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-contrast/50 hover:text-accent transition-colors p-1 -m-1"
                      title={t("link_repo")}
                    >
                      <GitBranch size={14} />
                    </a>
                    {repo.pages_url && (
                      <a
                        href={repo.pages_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-contrast/50 hover:text-accent transition-colors p-1 -m-1"
                        title={t("link_pages")}
                      >
                        <Globe size={14} />
                      </a>
                    )}
                    {repo.homepage && repo.homepage !== repo.pages_url && (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-contrast/50 hover:text-accent transition-colors p-1 -m-1"
                        title={t("link_live")}
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Topics at rest, description on hover — same slot, fixed height */}
                <div className="relative flex-1 overflow-hidden">
                  {repo.topics.length > 0 && (
                    <motion.div
                      variants={repo.description ? topicsVariants : undefined}
                      className="absolute inset-0 flex flex-wrap items-start content-start gap-1"
                    >
                      {repo.topics.slice(0, 4).map((topic) => (
                        <span
                          key={topic}
                          className="font-mono text-[10px] text-contrast/32 border border-white/8 px-2 py-px leading-4"
                        >
                          {topic}
                        </span>
                      ))}
                    </motion.div>
                  )}
                  {repo.description && (
                    <motion.p
                      variants={descriptionVariants}
                      className="absolute inset-0 font-sans text-xs text-contrast/60 leading-relaxed line-clamp-3"
                    >
                      {repo.description}
                    </motion.p>
                  )}
                </div>

                {/* Footer: language + date */}
                <div className="flex items-center justify-between pt-2 border-t border-white/4">
                  {repo.language ? (
                    <span className="flex items-center gap-2 font-mono text-[10px] text-contrast/40">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          backgroundColor: LANG_COLORS[repo.language] ?? "#38BDF8",
                        }}
                      />
                      {repo.language}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span suppressHydrationWarning className="font-mono text-[10px] text-contrast/24">
                    {relativeTime(repo.pushed_at, locale)}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.section>
  );
}
