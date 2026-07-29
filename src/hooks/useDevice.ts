"use client";

import { useSyncExternalStore } from "react";

const DESKTOP_BREAKPOINT = 1024;
const QUERY = `(min-width: ${DESKTOP_BREAKPOINT}px)`;

let mediaQueryList: MediaQueryList | null = null;

function getMediaQueryList() {
  mediaQueryList ??= window.matchMedia(QUERY);
  return mediaQueryList;
}

function subscribe(onStoreChange: () => void) {
  const mql = getMediaQueryList();
  mql.addEventListener("change", onStoreChange);
  return () => mql.removeEventListener("change", onStoreChange);
}

function getSnapshot(): boolean {
  return getMediaQueryList().matches;
}

function getServerSnapshot(): boolean | null {
  return null;
}

export function useDevice() {
  const isDesktop = useSyncExternalStore<boolean | null>(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return { isDesktop, isMobile: isDesktop === false };
}
