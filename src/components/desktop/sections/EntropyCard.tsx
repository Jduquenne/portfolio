"use client";

import { motion } from "framer-motion";
import { passions } from "@/lib/data/passions";

const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 20 },
  },
};

export function EntropyCard() {
  return (
    <section id="entropy" className="min-h-screen px-16 py-16">
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col gap-16"
      >
        <motion.p
          variants={cardVariants}
          className="font-mono text-xs text-accent tracking-widest uppercase"
        >
          // entropy
        </motion.p>

        <motion.h2
          variants={cardVariants}
          className="font-mono text-2xl font-bold text-contrast max-w-sm"
        >
          A 90s kid with too many passions to pick one.
        </motion.h2>

        <div className="grid grid-cols-3 gap-4">
          {passions.map((passion) => (
            <motion.div
              key={passion.title}
              variants={cardVariants}
              whileHover={{ borderColor: "rgba(56,189,248,0.3)", y: -4 }}
              className="group p-8 bg-surface border border-white/8 flex flex-col gap-8 cursor-default transition-colors"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-6xl font-bold text-contrast leading-none">
                  {passion.stat}
                </span>
                {passion.year && (
                  <span className="font-mono text-xs text-contrast/24 mt-2">
                    {passion.year}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-mono text-base font-bold text-contrast group-hover:text-accent transition-colors">
                  {passion.title}
                </span>
                <span className="font-mono text-xs text-contrast/40 tracking-wide">
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
