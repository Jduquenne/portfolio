import { memo } from "react";
import { toPathData } from "@/lib/availability/geo/shape";
import type { World } from "@/lib/availability/engine/world";
import type { MapRegistry } from "@/lib/availability/render/handles";

interface MapRoutesProps {
  world: World;
  registry: MapRegistry;
}

export const MapRoutes = memo(function MapRoutes({ world, registry }: MapRoutesProps) {
  const { route } = registry;

  return (
    <>
      {world.cities.map((city) =>
        city.route ? (
          <path
            key={city.id}
            ref={route(city.id)}
            d={toPathData(city.route.shape.points)}
            fill="none"
            stroke="var(--color-accent)"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1}
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ visibility: "hidden" }}
          />
        ) : null,
      )}
    </>
  );
});
