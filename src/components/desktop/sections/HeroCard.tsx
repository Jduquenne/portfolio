"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      type: "spring" as const,
      stiffness: 80,
      damping: 20,
    },
  }),
};

export function HeroCard() {
  const t = useTranslations("hero");

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center px-16"
    >
      <motion.p
        custom={0}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="font-mono text-xs text-accent tracking-widest uppercase mb-8"
      >
        {t("available")}
      </motion.p>

      <motion.h1
        custom={1}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="font-mono text-8xl font-bold text-contrast leading-none tracking-tight mb-8"
      >
        Jason Duquenne
      </motion.h1>

      <motion.p
        custom={2}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="font-sans text-xl text-contrast/60 max-w-xl mb-4"
      >
        {t("tagline")}
      </motion.p>

      <motion.p
        custom={3}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="font-sans text-contrast/32 max-w-lg mb-16"
      >
        {t("description")}
      </motion.p>

      <motion.div
        custom={4}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="flex gap-4"
      >
        <a
          href="#logic"
          className="font-mono text-sm px-8 py-4 bg-accent text-base hover:bg-accent/90 transition-colors"
        >
          {t("view_work")}
        </a>
        <a
          href="#contact"
          className="font-mono text-sm px-8 py-4 border border-white/16 text-contrast/60 hover:text-contrast hover:border-white/32 transition-colors"
        >
          {t("contact")}
        </a>
      </motion.div>
    </section>
  );
}
