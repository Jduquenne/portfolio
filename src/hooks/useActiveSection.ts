"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { SectionId } from "@/types";

const SCROLL_ROOT_ID = "main";
const VISIBLE_THRESHOLDS = [0.25, 0.5, 0.75];

function createActiveSectionStore(ids: readonly SectionId[]) {
  let active: SectionId | null = null;

  return {
    subscribe(onChange: () => void) {
      const ratios = new Map<string, number>();
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            ratios.set(entry.target.id, entry.intersectionRatio);
          }

          let best: SectionId | null = null;
          let bestRatio = 0;
          for (const id of ids) {
            const ratio = ratios.get(id) ?? 0;
            if (ratio > bestRatio) {
              best = id;
              bestRatio = ratio;
            }
          }

          if (best && best !== active) {
            active = best;
            onChange();
          }
        },
        {
          root: document.getElementById(SCROLL_ROOT_ID),
          threshold: VISIBLE_THRESHOLDS,
        },
      );

      for (const id of ids) {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      }

      return () => observer.disconnect();
    },
    getSnapshot: () => active,
  };
}

/** The section currently most visible inside the `#main` scroll container. */
export function useActiveSection(ids: readonly SectionId[]): SectionId | null {
  const store = useMemo(() => createActiveSectionStore(ids), [ids]);
  return useSyncExternalStore(store.subscribe, store.getSnapshot, () => null);
}
