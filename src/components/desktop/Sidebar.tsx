"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { cv, localize } from "@/lib/data/cv";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

function Divider() {
  return <div className="border-t border-white/8" />;
}

export function Sidebar() {
  const locale = useLocale();
  const t = useTranslations("hero");
  const tc = useTranslations("contact");

  return (
    <motion.aside
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-72 shrink-0 h-full overflow-y-auto bento-scroll bg-surface border-r border-white/8 flex flex-col gap-8 p-8"
    >
      {/* Avatar + identity */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4">
        <div className="relative w-40 h-40 shrink-0">
          <div className="w-full h-full border border-white/12 overflow-hidden">
            <Image
              src="/avatar.png"
              alt={cv.identity.name}
              width={160}
              height={160}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-accent/60" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-accent/60" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-accent/60" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-accent/60" />
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="font-mono font-bold text-contrast leading-tight">
            {cv.identity.name}
          </h1>
          <p className="font-sans text-xs text-contrast/50 leading-relaxed">
            {localize(cv.identity.subtitle, locale)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-accent tracking-widest uppercase">
            {t("available")}
          </span>
          <LanguageSwitcher />
        </div>
      </motion.div>

      <Divider />

      {/* Contact */}
      <motion.div variants={itemVariants} className="flex flex-col gap-3">
        <span className="font-mono text-xs text-contrast/24 tracking-widest uppercase">
          // contact
        </span>
        <div className="flex flex-col gap-2">
          <a
            href={`mailto:${cv.contact.email}`}
            className="font-mono text-xs text-contrast/50 hover:text-accent transition-colors truncate"
          >
            {cv.contact.email}
          </a>
          <a
            href={cv.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-contrast/50 hover:text-accent transition-colors"
          >
            {tc("github")}
          </a>
          <a
            href={cv.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-contrast/50 hover:text-accent transition-colors"
          >
            {tc("linkedin")}
          </a>
        </div>
      </motion.div>

      <Divider />

      {/* Stack */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4">
        <span className="font-mono text-xs text-contrast/24 tracking-widest uppercase">
          // stack
        </span>
        <div className="flex flex-col gap-4">
          {cv.stack.map((category) => (
            <div key={category.label} className="flex flex-col gap-2">
              <span className="font-mono text-xs text-contrast/24 uppercase tracking-widest">
                {category.label}
              </span>
              <div className="flex flex-wrap gap-1">
                {category.items.map((item) => (
                  <span
                    key={item}
                    className="font-mono text-xs px-2 py-0.5 border border-white/8 text-contrast/50 hover:border-accent/30 hover:text-contrast transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.aside>
  );
}
