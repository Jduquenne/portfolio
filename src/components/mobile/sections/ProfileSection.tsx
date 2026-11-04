"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { ContactLinks } from "@/components/mobile/ContactLinks";
import { ProfileIdentity } from "@/components/mobile/ProfileIdentity";
import { WorkLocationLink } from "@/components/mobile/WorkLocationLink";
import { ContactAction } from "@/components/shared/ContactAction";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { cv, localize } from "@/lib/data/cv";
import { fadeUp, stagger } from "@/lib/motion";

const containerVariants = stagger(0.08);

/**
 * The first screen. Three groups spread over its height, so nothing is left
 * empty at the bottom: who he is, where he can work, how to reach him.
 */
export function ProfileSection() {
  const locale = useLocale();

  return (
    <section
      id="profile"
      className="h-full snap-start overflow-y-auto shrink-0 bento-scroll"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative flex min-h-full flex-col justify-between gap-6 px-6 pt-12 pb-6"
      >
        <motion.div variants={fadeUp} className="absolute top-2 right-4">
          <LanguageSwitcher />
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-col gap-6">
          <ProfileIdentity />
          <p className="font-mono text-xl text-balance text-contrast [@media(min-height:820px)]:text-2xl">
            {localize(cv.identity.description, locale)}
            <span className="hero-caret" aria-hidden="true" />
          </p>
        </motion.div>

        <motion.div variants={fadeUp}>
          <WorkLocationLink />
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-col gap-6">
          <ContactAction />
          <ContactLinks />
        </motion.div>
      </motion.div>
    </section>
  );
}
