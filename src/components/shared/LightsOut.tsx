"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const SIZES = [4, 5, 6] as const;
const DEFAULT_SIZE = 5;
const SCRAMBLE_CLICKS = 8;

type Grid = boolean[];

function emptyGrid(size: number): Grid {
  return new Array(size * size).fill(false);
}

function press(size: number, grid: Grid, index: number): Grid {
  const next = grid.slice();
  const row = Math.floor(index / size);
  const col = index % size;
  const flip = (r: number, c: number) => {
    if (r < 0 || r >= size || c < 0 || c >= size) return;
    next[r * size + c] = !next[r * size + c];
  };
  flip(row, col);
  flip(row - 1, col);
  flip(row + 1, col);
  flip(row, col - 1);
  flip(row, col + 1);
  return next;
}

function buildGrid(size: number, clicks: number[]): Grid {
  return clicks.reduce((grid, index) => press(size, grid, index), emptyGrid(size));
}

function scramble(size: number): Grid {
  const clicks = Array.from({ length: SCRAMBLE_CLICKS }, () =>
    Math.floor(Math.random() * size * size),
  );
  const grid = buildGrid(size, clicks);
  return grid.every((cell) => !cell) ? scramble(size) : grid;
}

export function LightsOut({ className }: { className?: string }) {
  const t = useTranslations("toy");
  const [size, setSize] = useState<number>(DEFAULT_SIZE);
  const [grid, setGrid] = useState<Grid>(() => scramble(DEFAULT_SIZE));
  const [moves, setMoves] = useState(0);

  const solved = useMemo(() => grid.every((cell) => !cell), [grid]);

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
        {SIZES.map((value) => (
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
