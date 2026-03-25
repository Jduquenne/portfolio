"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { contact } from "@/lib/data/contact";

const sectionVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 80, damping: 20 },
  },
};

export function ContactCard() {
  return (
    <section
      id="contact"
      className="min-h-screen px-16 py-16 flex flex-col justify-center"
    >
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col gap-16 max-w-2xl"
      >
        <motion.p
          variants={itemVariants}
          className="font-mono text-xs text-accent tracking-widest uppercase"
        >
          // contact
        </motion.p>

        <motion.h2
          variants={itemVariants}
          className="font-mono text-6xl font-bold text-contrast leading-tight"
        >
          Let's build
          <br />
          something.
        </motion.h2>

        <motion.a
          variants={itemVariants}
          href={`mailto:${contact.email}`}
          className="group flex items-center gap-4 font-mono text-xl text-contrast/60 hover:text-accent transition-colors w-fit"
        >
          {contact.email}
          <ArrowUpRight
            size={20}
            className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
          />
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
