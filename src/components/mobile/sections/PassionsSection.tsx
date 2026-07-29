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

export function PassionsSection() {
  const locale = useLocale();
  const t = useTranslations("passions");

  return (
    <motion.section
      id="passions"
      className="h-screen snap-start overflow-y-auto shrink-0 bento-scroll"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-48px" }}
    >
      <div className="flex flex-col gap-4 px-6 pt-12 pb-14">
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4 mb-4"
        >
          <span className="font-mono text-xs text-accent tracking-widest uppercase shrink-0">
            {t("section_label")}
          </span>
          <div className="flex-1 h-px bg-white/8" />
        </motion.div>

        {cv.passions.map((passion) => (
          <motion.div
            key={passion.stat}
            variants={itemVariants}
            className="p-4 bg-surface border border-white/8 flex items-center gap-4"
          >
            <span className="font-mono text-2xl font-bold text-contrast leading-none w-20 shrink-0 whitespace-nowrap">
              {passion.stat}
            </span>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-sm font-bold text-contrast">
                {localize(passion.title, locale)}
              </span>
              <span className="font-mono text-xs text-contrast/40 leading-relaxed">
                {localize(passion.label, locale)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
