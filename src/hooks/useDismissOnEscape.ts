"use client";

import { useEffect } from "react";

const OPEN_DIALOG = '[role="dialog"], [aria-modal="true"]';

/** Escape dismisses something here only when nothing else already claimed it. */
export function useDismissOnEscape(dismiss: () => void): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      if (document.querySelector(OPEN_DIALOG)) return;
      dismiss();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dismiss]);
}
