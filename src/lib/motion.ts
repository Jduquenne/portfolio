import type { Transition, Variants } from "framer-motion";

/** Shared spring used for every entrance animation across the site. */
export const spring: Transition = {
  type: "spring",
  stiffness: 90,
  damping: 20,
};

/** A single element fading and rising into place. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: spring },
};

/** A single element fading in from the left — used by the desktop sidebar. */
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { ...spring, stiffness: 100 } },
};

/** Parent variants that reveal children one after another. */
export function stagger(children = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: children, delayChildren } },
  };
}
