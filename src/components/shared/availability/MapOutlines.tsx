import { memo } from "react";
import { toPathData } from "@/lib/availability/geo/shape";
import type { OutlineId, World } from "@/lib/availability/engine/world";
import type { MapRegistry } from "@/lib/availability/render/handles";

interface MapOutlinesProps {
  world: World;
  registry: MapRegistry;
}

const OUTLINE_IDS: readonly OutlineId[] = ["france", "corsica", "region", "radius"];

export const MapOutlines = memo(function MapOutlines({ world, registry }: MapOutlinesProps) {
  const { franceFill, radiusFill, outline } = registry;

  return (
    <>
      <path
        ref={franceFill}
        d={toPathData(world.outlines.france.points, true)}
        fill="var(--color-accent)"
        fillOpacity={0}
        stroke="none"
      />
      <circle
        ref={radiusFill}
        cx={world.origin.position[0]}
        cy={world.origin.position[1]}
        r={world.radiusUnits}
        fill="var(--color-accent)"
        fillOpacity={0}
        stroke="none"
      />
      {OUTLINE_IDS.map((id) => (
        <path
          key={id}
          ref={outline(id)}
          d={toPathData(world.outlines[id].points)}
          fill="none"
          stroke="var(--color-accent)"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{ visibility: "hidden" }}
        />
      ))}
    </>
  );
});
