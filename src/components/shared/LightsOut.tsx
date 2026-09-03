"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import {
  LIGHTS_OUT_DEFAULT_SIZE,
  LIGHTS_OUT_SIZES,
  type Grid,
  isSolved,
  press,
  scramble,
} from "@/lib/lightsOut";
import { cn } from "@/lib/utils";

export function LightsOut({ className }: { className?: string }) {
  const t = useTranslations("toy");
  const [size, setSize] = useState<number>(LIGHTS_OUT_DEFAULT_SIZE);
  const [grid, setGrid] = useState<Grid>(() =>
    scramble(LIGHTS_OUT_DEFAULT_SIZE),
  );
  const [moves, setMoves] = useState(0);

  const solved = isSolved(grid);

  const handlePress = useCallback(
    (index: number) => {
      if (solved) return;
      setGrid((current) => press(size, current, index));
      setMoves((count) => count + 1);
    },
    [size, solved],
  );

  const reset = useCallback(() => {
    setGrid(scramble(size));
    setMoves(0);
  }, [size]);

  const changeSize = useCallback((next: number) => {
    setSize(next);
    setGrid(scramble(next));
    setMoves(0);
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border border-white/8 bg-surface p-4",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
          {t("label")}
        </span>
        <span className="font-mono text-xs text-contrast/32">
          {t("moves", { count: moves })}
        </span>
      </div>

      <div className="flex items-center gap-3 font-mono text-xs">
        {LIGHTS_OUT_SIZES.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={value === size}
            aria-label={t("size", { n: value })}
            onClick={() => changeSize(value)}
            className={cn(
              "transition-colors",
              value === size
                ? "text-accent"
                : "text-contrast/32 hover:text-contrast/60",
            )}
          >
            {value}×{value}
          </button>
        ))}
      </div>

      <div
        role="group"
        aria-label={t("hint")}
        className="grid select-none gap-1"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      >
        {grid.map((lit, index) => (
          <button
            key={index}
            type="button"
            aria-label={t("cell", {
              row: Math.floor(index / size) + 1,
              col: (index % size) + 1,
            })}
            onClick={() => handlePress(index)}
            className={cn(
              "aspect-square transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              lit
                ? "bg-accent shadow-[0_0_10px_rgba(56,189,248,0.35)]"
                : "border border-white/8 bg-white/[0.03] hover:border-accent/30",
            )}
          />
        ))}
      </div>

      <div className="flex items-baseline justify-between gap-4">
        <span
          className={cn(
            "font-mono text-xs",
            solved ? "text-accent" : "text-contrast/32",
          )}
        >
          {solved ? t("solved", { count: moves }) : t("hint")}
        </span>
        <button
          type="button"
          onClick={reset}
          className="font-mono text-xs uppercase tracking-widest text-contrast/50 transition-colors hover:text-accent"
        >
          {t("reset")}
        </button>
      </div>
    </div>
  );
}
