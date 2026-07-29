"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { cv, localize } from "@/lib/data/cv";

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

export function StackSection() {
  const locale = useLocale();
  const t = useTranslations("logic");

  return (
    <motion.section
      id="stack"
      className="h-screen snap-start overflow-y-auto shrink-0 bento-scroll"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-48px" }}
    >
      <div className="flex flex-col gap-6 px-6 pt-12 pb-14">
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-4"
        >
          <span className="font-mono text-xs text-accent tracking-widest uppercase shrink-0">
            {t("section_label")}
          </span>
          <div className="flex-1 h-px bg-white/8" />
        </motion.div>

        {cv.stack.map((category) => (
          <motion.div
            key={category.label.en}
            variants={itemVariants}
            className="flex flex-col gap-2"
          >
            <span className="font-mono text-xs text-contrast/24 tracking-widest uppercase">
              {localize(category.label, locale)}
            </span>
            <div className="flex flex-wrap gap-2">
              {category.items.map((item) => (
                <span
                  key={item}
                  className="font-mono text-xs px-3 py-1.5 border border-white/8 text-contrast/60"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
