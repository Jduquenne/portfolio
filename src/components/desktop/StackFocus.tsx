"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface StackFocusValue {
  /** The technology the page is showing: hovered first, else pinned */
  active: string | null;
  pinned: string | null;
  hover: (tech: string | null) => void;
  togglePin: (tech: string) => void;
}

const StackFocusContext = createContext<StackFocusValue | null>(null);

/**
 * Lets the sidebar's stack and the experiences answer each other. Scoped to the
 * desktop layout: hovering a technology lights up the experiences that use it,
 * a click pins it, Escape lets go.
 */
export function StackFocusProvider({ children }: { children: ReactNode }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);

  useEffect(() => {
    if (!pinned) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) setPinned(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pinned]);

  const value = useMemo<StackFocusValue>(
    () => ({
      active: hovered ?? pinned,
      pinned,
      hover: setHovered,
      togglePin: (tech) => setPinned((current) => (current === tech ? null : tech)),
    }),
    [hovered, pinned],
  );

  return (
    <StackFocusContext.Provider value={value}>
      {children}
    </StackFocusContext.Provider>
  );
}

export function useStackFocus(): StackFocusValue {
  const value = useContext(StackFocusContext);
  if (!value) throw new Error("useStackFocus needs a StackFocusProvider");
  return value;
}
