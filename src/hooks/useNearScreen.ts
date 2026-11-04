"use client";

import { useEffect, useState, type RefObject } from "react";
import { SCROLL_ROOT_ID } from "@/lib/scroll";

/** True from the moment the element comes within `marginPx` of the scroll area. */
export function useNearScreen(
  ref: RefObject<Element | null>,
  marginPx: number,
): boolean {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || near) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setNear(true);
      },
      {
        root: document.getElementById(SCROLL_ROOT_ID),
        rootMargin: `${marginPx}px 0px`,
      },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, near, marginPx]);

  return near;
}
