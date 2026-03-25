"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 20,
    },
  },
};

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section
      id="hero"
      className="h-screen snap-start flex flex-col justify-end px-8 pb-32"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-4"
      >
        <motion.p
          variants={itemVariants}
          className="font-mono text-xs text-accent tracking-widest uppercase"
        >
          {t("available")}
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="font-mono text-6xl font-bold text-contrast leading-none tracking-tight"
        >
          Jason Duquenne
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="font-sans text-contrast/60 max-w-xs"
        >
          {t("tagline")}
        </motion.p>

        <motion.div variants={itemVariants} className="flex gap-4 pt-4">
          <a
            href="#logic"
            className="font-mono text-sm px-6 py-4 bg-accent text-base"
          >
            {t("view_work")}
          </a>
          <a
            href="#contact"
            className="font-mono text-sm px-6 py-4 border border-white/16 text-contrast/60"
          >
            {t("contact")}
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
