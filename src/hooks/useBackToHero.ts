"use client";

import { useEffect } from "react";
import { scrollToTop } from "@/lib/scroll";

const AWAY_FLAG = "awayFromHero";

function isAway(state: unknown): boolean {
  return typeof state === "object" && state !== null && AWAY_FLAG in state;
}

/**
 * Scrolling is not navigation, so the browser Back button leaves the site. This
 * gives it a stop: one history entry is added the first time the visitor leaves
 * the Hero, and going back to the entry before it scrolls to the top.
 */
export function useBackToHero(onHero: boolean) {
  useEffect(() => {
    const state = window.history.state;
    if (!isAway(state)) return;
    const rest = { ...state };
    delete rest[AWAY_FLAG];
    window.history.replaceState(rest, "");
  }, []);

  useEffect(() => {
    if (onHero || isAway(window.history.state)) return;
    window.history.pushState({ [AWAY_FLAG]: true }, "");
  }, [onHero]);

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      if (!isAway(event.state)) scrollToTop();
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
}
