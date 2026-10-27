"use client";

import { useEffect, useRef } from "react";

/**
 * Lights up the backdrop dot grid and adds a soft halo around the mouse.
 * Writes CSS variables straight to the DOM so pointer moves never re-render React.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = ref.current;
    if (!glow) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      frame = 0;
      glow.style.setProperty("--mx", `${x}px`);
      glow.style.setProperty("--my", `${y}px`);
      glow.style.opacity = "1";
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      glow.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="cursor-glow pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity motion-reduce:hidden"
    >
      <div className="cursor-glow-halo" />
      <div className="cursor-glow-dots" />
    </div>
  );
}
