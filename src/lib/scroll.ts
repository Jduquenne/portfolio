/** Id of the element that scrolls (and receives the skip link) in the two layouts. */
export const SCROLL_ROOT_ID = "main";

/**
 * Vertical padding of the desktop scroll area and the scroll padding that keeps
 * a section title clear of the top edge after a jump. They must stay equal, so
 * they are written once here.
 */
export const DESKTOP_SCROLL_INSET_Y = "py-12 scroll-pt-12";

export const DESKTOP_SCROLL_INSET_X = "px-16";

/**
 * Lets a layer inside the Hero reach the edges of the scroll area: the negative
 * of the two insets above.
 */
export const DESKTOP_HERO_BLEED = "-inset-x-16 -inset-y-12";

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";
}

export function scrollToSection(id: string) {
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
}

export function scrollToTop() {
  document
    .getElementById(SCROLL_ROOT_ID)
    ?.scrollTo({ top: 0, behavior: scrollBehavior() });
}
