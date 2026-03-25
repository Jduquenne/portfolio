"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { contact } from "@/lib/data/contact";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 20 },
  },
};

export function ContactSection() {
  return (
    <section
      id="contact"
      className="h-screen snap-start flex flex-col justify-end px-8 pb-32"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-col gap-10"
      >
        <motion.p
          variants={itemVariants}
          className="font-mono text-xs text-accent tracking-widest uppercase"
        >
          // contact
        </motion.p>

        <motion.h2
          variants={itemVariants}
          className="font-mono text-5xl font-bold text-contrast leading-tight"
        >
          Let's build
          <br />
          something.
        </motion.h2>

        <motion.a
          variants={itemVariants}
          href={`mailto:${contact.email}`}
          className="flex items-center gap-3 font-mono text-base text-contrast/60 hover:text-accent transition-colors w-fit"
        >
          {contact.email}
          <ArrowUpRight size={16} />
        </motion.a>

        <motion.div variants={itemVariants} className="flex items-center gap-8">
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-contrast/32 hover:text-contrast tracking-widest uppercase transition-colors"
          >
            GitHub
          </a>
          <span className="text-contrast/16 font-mono">—</span>
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-contrast/32 hover:text-contrast tracking-widest uppercase transition-colors"
          >
            LinkedIn
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
