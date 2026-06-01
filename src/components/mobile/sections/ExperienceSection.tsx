"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { cv, localize } from "@/lib/data/cv";

const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
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
      className="h-screen snap-start overflow-y-auto shrink-0 bento-scroll"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-48px" }}
    >
      <div className="flex flex-col px-6 pt-12 pb-14">
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
            <motion.div key={i} variants={itemVariants} className="flex gap-4">
              <div className="flex flex-col items-center pt-1.5 shrink-0">
                <div className="w-1.5 h-1.5 bg-accent shrink-0" />
                {i < cv.experiences.length - 1 && (
                  <div className="w-px flex-1 bg-white/8 my-2" />
                )}
              </div>
              <div className="flex-1 pb-8">
                <span className="font-mono text-xs text-contrast/24 mb-1 block">
                  {exp.current
                    ? `${exp.period} — ${t("present")}`
                    : exp.period}
                </span>
                <div className="flex flex-col mb-2">
                  <span className="font-mono text-sm font-bold text-contrast">
                    {localize(exp.role, locale)}
                  </span>
                  <span className="font-mono text-xs text-contrast/40">
                    @ {exp.company}
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
      </div>
    </motion.section>
  );
}
