"use client";

import { useCallback, useRef, useSyncExternalStore, type RefObject } from "react";

const FULLY_VISIBLE = 0.99;

export function useFullyVisible(
  ref: RefObject<Element | null>,
  scrollRootId: string,
): boolean {
  const visible = useRef(true);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const element = ref.current;
      if (!element) return () => {};

      const observer = new IntersectionObserver(
        ([entry]) => {
          const next = entry.intersectionRatio >= FULLY_VISIBLE;
          if (next === visible.current) return;
          visible.current = next;
          onStoreChange();
        },
        {
          root: document.getElementById(scrollRootId),
          threshold: FULLY_VISIBLE,
        },
      );
      observer.observe(element);
      return () => observer.disconnect();
    },
    [ref, scrollRootId],
  );

  return useSyncExternalStore(
    subscribe,
    () => visible.current,
    () => true,
  );
}
