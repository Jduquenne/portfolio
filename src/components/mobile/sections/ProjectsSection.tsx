"use client";

import { motion } from "framer-motion";
import { ExternalLink, GitBranch, Globe, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { GitHubRepo } from "@/types";
import { LANG_COLORS } from "@/lib/languages";
import { relativeTime } from "@/lib/utils";

const sectionVariants = {
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

interface ProjectsSectionProps {
  repos: GitHubRepo[];
}

export function ProjectsSection({ repos }: ProjectsSectionProps) {
  const t = useTranslations("logic");
  const locale = useLocale();

  return (
    <motion.section
      id="projects"
      className="h-screen snap-start overflow-y-auto shrink-0 bento-scroll"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-48px" }}
    >
      <div className="flex flex-col gap-4 px-6 pt-12 pb-16">
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <span className="font-mono text-xs text-accent tracking-widest uppercase shrink-0">
            {t("projects_title")}
          </span>
          <div className="flex-1 h-px bg-white/8" />
        </motion.div>

        {repos.length === 0 ? (
          <motion.p variants={itemVariants} className="font-mono text-xs text-contrast/24">
            {t("empty_repos", { topic: "portfolio" })}
          </motion.p>
        ) : (
          repos.map((repo) => (
            <motion.div
              key={repo.id}
              variants={itemVariants}
              className="border border-white/8 bg-surface flex flex-col"
            >
              {/* Top row: name + stars + links */}
              <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <p className="font-mono text-xs font-bold text-contrast truncate">
                    {repo.name}
                  </p>
                  {repo.fork && (
                    <span className="font-mono text-[10px] text-contrast/24 shrink-0">
                      {t("fork")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  {repo.stargazers_count > 0 && (
                    <span className="flex items-center gap-1 font-mono text-[10px] text-contrast/40">
                      <Star size={10} />
                      {repo.stargazers_count}
                    </span>
                  )}
                  <div className="flex items-center gap-4">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-contrast/32 active:text-accent transition-colors p-1 -m-1"
                      title={t("link_repo")}
                    >
                      <GitBranch size={16} />
                    </a>
                    {repo.pages_url && (
                      <a
                        href={repo.pages_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-contrast/32 active:text-accent transition-colors p-1 -m-1"
                        title={t("link_pages")}
                      >
                        <Globe size={16} />
                      </a>
                    )}
                    {repo.homepage && repo.homepage !== repo.pages_url && (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-contrast/32 active:text-accent transition-colors p-1 -m-1"
                        title={t("link_live")}
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {repo.description && (
                <p className="font-sans text-sm text-contrast/50 leading-relaxed px-4 pb-2">
                  {repo.description}
                </p>
              )}

              {/* Topics */}
              {repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-1 px-4 pb-2">
                  {repo.topics.slice(0, 5).map((topic) => (
                    <span
                      key={topic}
                      className="font-mono text-[10px] text-contrast/32 border border-white/8 px-2 py-px leading-4"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer: language + date */}
              <div className="flex items-center justify-between px-4 py-2 mt-auto border-t border-white/4">
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
                  {relativeTime(repo.updated_at, locale)}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.section>
  );
}
