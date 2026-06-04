"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { cv, localize } from "@/lib/data/cv";
import { formatDuration } from "@/lib/utils";

const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 90, damping: 20 },
  },
};

export function ExperienceSection() {
  const locale = useLocale();
  const t = useTranslations("experience");

  return (
    <motion.section
      id="experience"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-64px" }}
    >
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-4 mb-8"
      >
        <span className="font-mono text-xs text-accent tracking-widest uppercase shrink-0">
          {t("section_label")}
        </span>
        <div className="flex-1 h-px bg-white/8" />
      </motion.div>

      <div className="flex flex-col">
        {cv.experiences.map((exp, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="flex gap-6"
          >
            <div className="flex flex-col items-center pt-1.5 shrink-0">
              <div className="w-1.5 h-1.5 bg-accent shrink-0" />
              {i < cv.experiences.length - 1 && (
                <div className="w-px flex-1 bg-white/8 my-2" />
              )}
            </div>

            <div className="flex-1 pb-10">
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-mono text-sm font-bold text-contrast">
                    {localize(exp.role, locale)}
                  </span>
                  {exp.website ? (
                    <a
                      href={exp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-contrast/32 hover:text-accent transition-colors"
                    >
                      @ {exp.company}
                    </a>
                  ) : (
                    <span className="font-mono text-xs text-contrast/32">
                      @ {exp.company}
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs text-contrast/24 shrink-0">
                  {exp.current ? `${exp.period} — ${t("present")}` : exp.period}
                  {!exp.current && formatDuration(exp.period, locale) && (
                    <span className="text-accent/50">
                      {" · "}{formatDuration(exp.period, locale)}
                    </span>
                  )}
                </span>
              </div>

              <p className="font-sans text-sm text-contrast/55 leading-relaxed mb-3">
                {localize(exp.description, locale)}
              </p>

              <div className="flex flex-wrap gap-1">
                {exp.stack.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-xs px-2 py-0.5 border border-white/8 text-contrast/40"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
