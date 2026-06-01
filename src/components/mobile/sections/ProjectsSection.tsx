"use client";

import { motion } from "framer-motion";
import { ExternalLink, GitBranch, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import type { GitHubRepo } from "@/types";

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

  return (
    <motion.section
      id="projects"
      className="h-screen snap-start overflow-y-auto shrink-0 bento-scroll"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-48px" }}
    >
      <div className="flex flex-col gap-4 px-6 pt-12 pb-14">
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4"
        >
          <span className="font-mono text-xs text-accent tracking-widest uppercase shrink-0">
            {t("projects_title")}
          </span>
          <div className="flex-1 h-px bg-white/8" />
        </motion.div>

        {repos.length === 0 ? (
          <motion.p
            variants={itemVariants}
            className="font-mono text-xs text-contrast/24"
          >
            {t("empty_repos", { topic: "portfolio" })}
          </motion.p>
        ) : (
          repos.map((repo) => (
            <motion.div
              key={repo.id}
              variants={itemVariants}
              className="p-4 bg-surface border border-white/8 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-xs font-bold text-contrast">
                  {repo.name}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  {repo.stargazers_count > 0 && (
                    <span className="flex items-center gap-1 font-mono text-xs text-contrast/24">
                      <Star size={10} />
                      {repo.stargazers_count}
                    </span>
                  )}
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-contrast/32 hover:text-accent transition-colors"
                  >
                    <GitBranch size={14} />
                  </a>
                  {repo.homepage && (
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-contrast/32 hover:text-accent transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
              {repo.description && (
                <p className="font-sans text-sm text-contrast/60 leading-relaxed">
                  {repo.description}
                </p>
              )}
              {repo.language && (
                <span className="font-mono text-xs text-accent/60">
                  {repo.language}
                </span>
              )}
            </motion.div>
          ))
        )}
      </div>
    </motion.section>
  );
}
