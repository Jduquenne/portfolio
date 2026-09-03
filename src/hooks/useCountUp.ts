"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Ramps a number from 0 to `target` with an ease-out curve once `start` is true.
 * Respects reduced-motion by resolving straight to the target with no animation.
 */
export function useCountUp(target: number, start: boolean, duration = 900) {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start || reduceMotion) return;

    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    };

    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [target, start, duration, reduceMotion]);

  if (!start) return 0;
  return reduceMotion ? target : value;
}
