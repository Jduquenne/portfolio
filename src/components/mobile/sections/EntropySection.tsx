"use client";

import { motion } from "framer-motion";
import { passions } from "@/lib/data/passions";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 20 },
  },
};

export function EntropySection() {
  return (
    <section
      id="entropy"
      className="min-h-screen snap-start flex flex-col px-8 pt-24 pb-32 gap-12"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-col gap-12"
      >
        <motion.p
          variants={itemVariants}
          className="font-mono text-xs text-accent tracking-widest uppercase"
        >
          // entropy
        </motion.p>

        <motion.h2
          variants={itemVariants}
          className="font-mono text-xl font-bold text-contrast"
        >
          A 90s kid with too many passions to pick one.
        </motion.h2>

        <div className="flex flex-col gap-4">
          {passions.map((passion) => (
            <motion.div
              key={passion.title}
              variants={itemVariants}
              className="p-6 bg-surface border border-white/8 flex items-center gap-6"
            >
              <span className="font-mono text-4xl font-bold text-contrast leading-none w-24 shrink-0">
                {passion.stat}
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-sm font-bold text-contrast">
                  {passion.title}
                </span>
                <span className="font-mono text-xs text-contrast/40">
                  {passion.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
