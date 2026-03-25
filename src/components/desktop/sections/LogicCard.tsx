"use client";

import { motion } from "framer-motion";
import { ExternalLink, GitBranch, Star } from "lucide-react";
import { stack } from "@/lib/data/stack";
import type { GitHubRepo } from "@/types";

const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 20 },
  },
};

interface LogicCardProps {
  repos: GitHubRepo[];
}

export function LogicCard({ repos }: LogicCardProps) {
  return (
    <section id="logic" className="min-h-screen px-16 py-16">
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col gap-16"
      >
        <motion.p
          variants={itemVariants}
          className="font-mono text-xs text-accent tracking-widest uppercase"
        >
          // logic
        </motion.p>

        <div className="grid grid-cols-2 gap-16">
          {/* Stack */}
          <motion.div variants={itemVariants} className="flex flex-col gap-8">
            <h2 className="font-mono text-2xl font-bold text-contrast">
              Stack
            </h2>
            <div className="flex flex-col gap-8">
              {stack.map((category) => (
                <div key={category.label} className="flex flex-col gap-3">
                  <span className="font-mono text-xs text-contrast/32 tracking-widest uppercase">
                    {category.label}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((item) => (
                      <span
                        key={item}
                        className="font-mono text-xs px-3 py-2 border border-white/8 text-contrast/60 hover:border-accent/40 hover:text-contrast transition-colors"
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
          <motion.div variants={itemVariants} className="flex flex-col gap-8">
            <h2 className="font-mono text-2xl font-bold text-contrast">
              Projects
            </h2>
            {repos.length === 0 ? (
              <p className="font-mono text-xs text-contrast/32">
                Add the{" "}
                <span className="text-accent">portfolio</span> topic to your
                GitHub repos to display them here.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {repos.map((repo) => (
                  <div
                    key={repo.id}
                    className="p-6 bg-surface border border-white/8 hover:border-white/16 transition-colors flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-contrast">
                        {repo.name}
                      </span>
                      <div className="flex items-center gap-4">
                        {repo.stargazers_count > 0 && (
                          <span className="flex items-center gap-1 font-mono text-xs text-contrast/32">
                            <Star size={12} />
                            {repo.stargazers_count}
                          </span>
                        )}
                        <div className="flex items-center gap-2">
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
        </div>
      </motion.div>
    </section>
  );
}
