"use client";

import { useLayoutEffect, type RefObject } from "react";

const MIN_LINES = 2;

/**
 * Keeps a panel from ever scrolling: if its content is taller than the room it
 * has, the text is cut with an ellipsis, one line at a time. `key` changes when
 * the content does.
 */
export function useFitText(
  panelRef: RefObject<HTMLElement | null>,
  textRef: RefObject<HTMLElement | null>,
  key: string,
): void {
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const text = textRef.current;
    if (!panel || !text) return;

    const fit = () => {
      for (const property of ["display", "-webkit-box-orient", "-webkit-line-clamp", "overflow"]) {
        text.style.removeProperty(property);
      }
      const lineHeight = parseFloat(getComputedStyle(text).lineHeight) || 20;
      let lines = Math.max(MIN_LINES, Math.round(text.scrollHeight / lineHeight));
      while (panel.scrollHeight > panel.clientHeight + 1 && lines > MIN_LINES) {
        lines -= 1;
        text.style.setProperty("display", "-webkit-box");
        text.style.setProperty("-webkit-box-orient", "vertical");
        text.style.setProperty("-webkit-line-clamp", String(lines));
        text.style.setProperty("overflow", "hidden");
      }
    };

    fit();
    const observer = new ResizeObserver(fit);
    if (panel.parentElement) observer.observe(panel.parentElement);
    return () => observer.disconnect();
  }, [panelRef, textRef, key]);
}
