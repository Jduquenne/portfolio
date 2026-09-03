"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { cv, localize } from "@/lib/data/cv";
import { fadeUp, stagger } from "@/lib/motion";

const sectionVariants = stagger(0.1);

export function SpecialtiesSection() {
  const locale = useLocale();
  const t = useTranslations("passions");

  return (
    <motion.section
      id="passions"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-64px" }}
    >
      <motion.div
        variants={fadeUp}
        className="flex items-center gap-4 mb-8"
      >
        <span className="font-mono text-xs text-accent tracking-widest uppercase shrink-0">
          {t("section_label")}
        </span>
        <div className="flex-1 h-px bg-white/8" />
      </motion.div>

      <motion.div
        variants={sectionVariants}
        className="grid grid-cols-3 gap-4"
      >
        {cv.passions.map((passion) => (
          <motion.div
            key={passion.stat}
            variants={fadeUp}
            className="p-6 bg-surface border border-white/8 hover:border-accent/20 transition-colors flex flex-col justify-between gap-8"
          >
            <span className="font-mono text-5xl font-bold text-contrast leading-none">
              {passion.stat}
            </span>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-sm font-bold text-contrast">
                {localize(passion.title, locale)}
              </span>
              <span className="font-mono text-xs text-contrast/40 tracking-wide">
                {localize(passion.label, locale)}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
