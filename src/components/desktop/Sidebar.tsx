"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { LocaleToggle } from "@/components/desktop/LocaleToggle";
import { SidebarContact } from "@/components/desktop/SidebarContact";
import { SidebarLink } from "@/components/desktop/SidebarLink";
import { SidebarSection } from "@/components/desktop/SidebarSection";
import { AvailabilityBadge } from "@/components/shared/AvailabilityBadge";
import { cv, localize } from "@/lib/data/cv";
import { fadeInLeft, stagger } from "@/lib/motion";
import { age } from "@/lib/utils";

const containerVariants = stagger(0.08);

export function Sidebar() {
  const locale = useLocale();
  const tc = useTranslations("contact");
  const tl = useTranslations("logic");
  const tcv = useTranslations("cv");

  return (
    <motion.aside
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-72 shrink-0 h-full overflow-y-auto bento-scroll bg-surface border-r border-white/8 flex flex-col gap-8 px-8 py-12"
    >
      {/* Photo and identity: the photo spans the column, like everything below it */}
      <motion.div variants={fadeInLeft} className="flex flex-col gap-6">
        <div className="relative aspect-square w-full">
          <div className="h-full w-full overflow-hidden border border-white/12">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/avatar.webp`}
              alt={cv.identity.name}
              width={448}
              height={448}
              sizes="224px"
              className="h-full w-full object-cover"
              priority
              loading="eager"
            />
          </div>
          <div className="absolute left-0 top-0 size-4 border-l border-t border-accent/60" />
          <div className="absolute right-0 top-0 size-4 border-r border-t border-accent/60" />
          <div className="absolute bottom-0 left-0 size-4 border-b border-l border-accent/60" />
          <div className="absolute bottom-0 right-0 size-4 border-b border-r border-accent/60" />
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="font-mono text-xl font-bold text-contrast">
            {cv.identity.name}
          </h1>
          <p className="font-sans text-xs leading-relaxed text-contrast/70">
            {localize(cv.identity.subtitle, locale)}
          </p>
          <p className="font-mono text-xs text-contrast/50">
            {tcv("age", { years: age(cv.identity.birthDate) })}
          </p>
        </div>
      </motion.div>

      <motion.div variants={fadeInLeft} className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <AvailabilityBadge />
          <LocaleToggle />
        </div>
        <SidebarContact />
      </motion.div>

      <motion.div variants={fadeInLeft}>
        <SidebarSection label={tc("section_label")}>
          <div className="flex flex-col">
            <SidebarLink label={tc("github")} href={cv.contact.github} external />
            <SidebarLink
              label={tc("linkedin")}
              href={cv.contact.linkedin}
              external
            />
            <SidebarLink label={tc("cv")} href="/cv" />
          </div>
        </SidebarSection>
      </motion.div>

      <motion.div variants={fadeInLeft}>
        <SidebarSection label={tl("stack_label")}>
          <div className="flex flex-col gap-4">
            {cv.stack.map((category) => (
              <div key={category.label.en} className="flex flex-col gap-2">
                <span className="font-mono text-xs uppercase tracking-widest text-contrast/50">
                  {localize(category.label, locale)}
                </span>
                <div className="flex flex-wrap gap-1">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="border border-white/8 px-2 py-1 font-mono text-xs text-contrast/70 transition-colors hover:border-accent/30 hover:text-contrast"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SidebarSection>
      </motion.div>
    </motion.aside>
  );
}
