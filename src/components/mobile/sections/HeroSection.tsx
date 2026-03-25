"use client";

import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
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
          ● Available for work
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="font-mono text-6xl font-bold text-contrast leading-none tracking-tight"
        >
          Jason D.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="font-sans text-base text-contrast/60 max-w-xs"
        >
          Fullstack developer. 3D / Three.js. Game dev.
        </motion.p>

        <motion.div variants={itemVariants} className="flex gap-4 pt-4">
          <a
            href="#logic"
            className="font-mono text-sm px-6 py-4 bg-accent text-base"
          >
            View Work
          </a>
          <a
            href="#contact"
            className="font-mono text-sm px-6 py-4 border border-white/16 text-contrast/60"
          >
            Contact
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
