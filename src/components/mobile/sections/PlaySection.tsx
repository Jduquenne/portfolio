"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { LightsOut } from "@/components/shared/LightsOut";
import { fadeUp, stagger } from "@/lib/motion";

const sectionVariants = stagger(0.08);

export function PlaySection() {
  const t = useTranslations("toy");

  return (
    <motion.section
      id="play"
      className="h-screen snap-start overflow-y-auto shrink-0 bento-scroll"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-48px" }}
    >
      <div className="flex min-h-full flex-col justify-center gap-8 px-6 pt-12 pb-14">
        <motion.div variants={fadeUp} className="flex items-center gap-4">
          <span className="font-mono text-xs text-accent tracking-widest uppercase shrink-0">
            {t("section_label")}
          </span>
          <div className="flex-1 h-px bg-white/8" />
        </motion.div>

        <motion.div variants={fadeUp}>
          <LightsOut />
        </motion.div>
      </div>
    </motion.section>
  );
}
