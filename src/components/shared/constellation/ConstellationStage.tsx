"use client";

import { useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { ConstellationLabels } from "@/components/shared/constellation/ConstellationLabels";
import { useConstellationEngine } from "@/hooks/useConstellationEngine";
import { useNearScreen } from "@/hooks/useNearScreen";
import type { ConstellationStore } from "@/lib/constellation/store";
import type { ConstellationModel, Layout } from "@/lib/constellation/types";
import { dataSaverOn } from "@/lib/dataSaver";
import { cn } from "@/lib/utils";

/** How far before the stage reaches the screen the 3D library is requested. */
const LOAD_MARGIN_PX = 600;

interface ConstellationStageProps {
  model: ConstellationModel;
  layout: Layout;
  store: ConstellationStore;
  compact: boolean;
  /** Where the canvas sits: a layout decides how far it bleeds past the stage. */
  layerClassName: string;
  /** What is drawn over the canvas: header, tabs, panel, the list. Gets `ready`. */
  children: (ready: boolean) => ReactNode;
  className?: string;
}

/**
 * The canvas, the names written over it and the leader line, as one decorative
 * layer under the interface. The 3D library is only requested when the stage is
 * near the screen, and not at all with data saving on.
 */
export function ConstellationStage({
  model,
  layout,
  store,
  compact,
  layerClassName,
  children,
  className,
}: ConstellationStageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const near = useNearScreen(rootRef, LOAD_MARGIN_PX);
  const reducedMotion = useReducedMotion() === true;
  const [saveData] = useState(dataSaverOn);

  const status = useConstellationEngine({
    rootRef,
    model,
    layout,
    store,
    compact,
    reducedMotion,
    enabled: near && !saveData,
  });
  const ready = status === "ready";

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <div
        aria-hidden="true"
        className={cn(
          "constellation-veil pointer-events-none absolute transition-opacity duration-500",
          ready ? "opacity-100" : "opacity-0",
          layerClassName,
        )}
      >
        <canvas
          data-constellation-canvas=""
          className={cn(
            "absolute inset-0 size-full touch-pan-y",
            ready ? "pointer-events-auto" : "pointer-events-none",
          )}
        />
        <ConstellationLabels model={model} />
        <svg
          data-leader=""
          focusable="false"
          className="pointer-events-none absolute inset-0 hidden size-full"
        >
          <polyline fill="none" strokeWidth={1} className="stroke-accent/70" />
          <circle r={3} className="fill-accent" />
        </svg>
      </div>
      {children(ready)}
    </div>
  );
}
