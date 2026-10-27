"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

const MotionLink = motion.create(Link);

const nudge = { type: "spring" as const, stiffness: 300, damping: 30 };

// The arrow leans the way the link goes: up and right out of the site, right inside it
const externalArrow = {
  rest: { x: 0, y: 0, opacity: 0.5 },
  hover: { x: 2, y: -2, opacity: 1, transition: nudge },
};
const internalArrow = {
  rest: { x: 0, opacity: 0.5 },
  hover: { x: 4, opacity: 1, transition: nudge },
};

const ROW =
  "flex items-center justify-between border-b border-white/8 py-2 font-mono text-xs text-contrast/70 transition-colors last:border-b-0 hover:border-accent/30 hover:text-accent focus-visible:text-accent";

interface SidebarLinkProps {
  label: string;
  href: string;
  external?: boolean;
}

export function SidebarLink({ label, href, external = false }: SidebarLinkProps) {
  const arrow = (
    <motion.span variants={external ? externalArrow : internalArrow} className="flex">
      {external ? <ArrowUpRight size={16} /> : <ArrowRight size={16} />}
    </motion.span>
  );

  return external ? (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
      className={ROW}
    >
      {label}
      {arrow}
    </motion.a>
  ) : (
    <MotionLink
      href={href}
      initial="rest"
      whileHover="hover"
      whileFocus="hover"
      className={ROW}
    >
      {label}
      {arrow}
    </MotionLink>
  );
}
