import { memo } from "react";
import type { MapRegistry } from "@/lib/availability/render/handles";

interface MapPenProps {
  registry: MapRegistry;
}

/** The glowing point that draws the map, and the dotted line of its rapid moves. */
export const MapPen = memo(function MapPen({ registry }: MapPenProps) {
  const { trail, group, halo, core } = registry.pen;

  return (
    <>
      <line ref={trail} stroke="var(--color-accent)" strokeOpacity={0} strokeDasharray="2 4" />
      <g ref={group} style={{ display: "none" }}>
        <circle ref={halo} fill="var(--color-accent)" fillOpacity={0.22} />
        <circle ref={core} fill="var(--color-accent)" />
      </g>
    </>
  );
});
