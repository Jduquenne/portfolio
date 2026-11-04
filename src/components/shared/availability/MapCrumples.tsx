import { memo } from "react";
import type { MapRegistry } from "@/lib/availability/render/handles";

interface MapCrumplesProps {
  registry: MapRegistry;
  slots: number;
}

/** A small pool of slots for the lines that crumple into paper and fly away. */
export const MapCrumples = memo(function MapCrumples({ registry, slots }: MapCrumplesProps) {
  return (
    <>
      {Array.from({ length: slots }, (_, slot) => {
        const { group, ball, path } = registry.crumple(slot);
        return (
          <g key={slot} ref={group} style={{ display: "none" }}>
            <polygon
              ref={ball}
              fill="var(--color-surface)"
              stroke="var(--color-accent)"
              strokeLinejoin="round"
              fillOpacity={0}
              strokeOpacity={0}
            />
            <path
              ref={path}
              fill="none"
              stroke="var(--color-accent)"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
        );
      })}
    </>
  );
});
