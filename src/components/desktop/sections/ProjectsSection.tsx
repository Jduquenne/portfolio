"use client";

import { motion } from "framer-motion";
import { ExternalLink, GitBranch, Globe, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { GitHubRepo } from "@/types";
import { LANG_COLORS } from "@/lib/languages";
import { relativeTime } from "@/lib/utils";

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

interface ProjectsSectionProps {
  repos: GitHubRepo[];
}

export function ProjectsSection({ repos }: ProjectsSectionProps) {
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
      </motion.div>

      {repos.length === 0 ? (
        <motion.p variants={itemVariants} className="font-mono text-xs text-contrast/24">
          {t("empty_repos", { topic: "portfolio" })}
        </motion.p>
      ) : (
        <motion.div variants={sectionVariants} className="grid grid-cols-2 gap-4">
          {repos.map((repo) => (
            <motion.div key={repo.id} variants={itemVariants}>
              <motion.div
                initial="rest"
                whileHover="hover"
                className="relative h-full border border-white/8 hover:border-accent/20 bg-surface flex flex-col gap-3 p-4 overflow-hidden transition-colors duration-200"
              >
                {/* Spring bar on hover */}
                <motion.div
                  variants={accentBarVariants}
                  style={{ transformOrigin: "top" }}
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent"
                />

                {/* Name + links */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex flex-col">
                    <p className="font-mono text-xs font-bold text-contrast leading-tight truncate">
                      {repo.name}
                    </p>
                    {repo.fork && (
                      <p className="font-mono text-[10px] text-contrast/24 leading-none mt-1">
                        fork
                      </p>
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
                      className="text-contrast/24 hover:text-accent transition-colors"
                      title="GitHub"
                    >
                      <GitBranch size={12} />
                    </a>
                    {repo.pages_url && (
                      <a
                        href={repo.pages_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-contrast/24 hover:text-accent transition-colors"
                        title="GitHub Pages"
                      >
                        <Globe size={12} />
                      </a>
                    )}
                    {repo.homepage && repo.homepage !== repo.pages_url && (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-contrast/24 hover:text-accent transition-colors"
                        title="Live"
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Description */}
                {repo.description && (
                  <p className="font-sans text-xs text-contrast/50 leading-relaxed line-clamp-2">
                    {repo.description}
                  </p>
                )}

                {/* Topics */}
                {repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {repo.topics.slice(0, 4).map((topic) => (
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
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/4">
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
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.section>
  );
}
