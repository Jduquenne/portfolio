"use client";

import { motion } from "framer-motion";
import { ExternalLink, GitBranch, Star } from "lucide-react";
import { stack } from "@/lib/data/stack";
import type { GitHubRepo } from "@/types";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 20 },
  },
};

interface LogicSectionProps {
  repos: GitHubRepo[];
}

export function LogicSection({ repos }: LogicSectionProps) {
  return (
    <section
      id="logic"
      className="min-h-screen snap-start flex flex-col px-8 pt-24 pb-32 gap-12 overflow-y-auto"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-col gap-12"
      >
        <motion.p
          variants={itemVariants}
          className="font-mono text-xs text-accent tracking-widest uppercase"
        >
          // logic
        </motion.p>

        {/* Stack */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <h2 className="font-mono text-xl font-bold text-contrast">Stack</h2>
          <div className="flex flex-col gap-6">
            {stack.map((category) => (
              <div key={category.label} className="flex flex-col gap-2">
                <span className="font-mono text-xs text-contrast/32 tracking-widest uppercase">
                  {category.label}
                </span>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="font-mono text-xs px-3 py-2 border border-white/8 text-contrast/60"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Projects */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <h2 className="font-mono text-xl font-bold text-contrast">
            Projects
          </h2>
          {repos.length === 0 ? (
            <p className="font-mono text-xs text-contrast/32">
              Add the <span className="text-accent">portfolio</span> topic to
              your GitHub repos.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  className="p-6 bg-surface border border-white/8 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-contrast">
                      {repo.name}
                    </span>
                    <div className="flex items-center gap-3">
                      {repo.stargazers_count > 0 && (
                        <span className="flex items-center gap-1 font-mono text-xs text-contrast/32">
                          <Star size={12} />
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
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
