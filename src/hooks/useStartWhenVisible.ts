"use client";

import { useEffect, type RefObject } from "react";
import { SCROLL_ROOT_ID } from "@/lib/scroll";

const VISIBLE_SHARE = 0.6;

/** Calls `onVisible` once, the first time most of the element is on screen. */
export function useStartWhenVisible(
  ref: RefObject<Element | null>,
  onVisible: () => void,
): void {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        onVisible();
      },
      { root: document.getElementById(SCROLL_ROOT_ID), threshold: VISIBLE_SHARE },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, onVisible]);
}
