"use client";

import { useEffect, useRef, useState } from "react";
import { cv } from "@/lib/data/cv";

export type CopyState = "idle" | "copied" | "failed";

const RESET_DELAY_MS = 2000;
const FAILED_RESET_DELAY_MS = 8000;

/** Copies the contact email, then falls back to "idle" on its own. */
export function useCopyEmail() {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    let failed = false;
    try {
      await navigator.clipboard.writeText(cv.contact.email);
      setState("copied");
    } catch {
      failed = true;
      setState("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(
      () => setState("idle"),
      failed ? FAILED_RESET_DELAY_MS : RESET_DELAY_MS,
    );
  };

  return { state, copy };
}
