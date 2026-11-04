import { memo } from "react";
import { useLocale } from "next-intl";
import { localize } from "@/lib/data/cv";
import type { World } from "@/lib/availability/engine/world";
import type { MapRegistry } from "@/lib/availability/render/handles";

export interface HoverPoint {
  x: number;
  y: number;
}

interface MapCitiesProps {
  world: World;
  registry: MapRegistry;
  /** Left out when the map picks the city itself, from the tap position. */
  onSelect?: (cityId: string) => void;
  /** Left out where there is no pointer to hover with. */
  onHover?: (cityId: string | null, point?: HoverPoint) => void;
}

const LABEL_FONT = "var(--font-geist-mono), ui-monospace, monospace";

export const MapCities = memo(function MapCities({
  world,
  registry,
  onSelect,
  onHover,
}: MapCitiesProps) {
  const locale = useLocale();

  return (
    <>
      {world.cities.map((city) => {
        const { group, hit, dot, label } = registry.city(city.id);
        return (
          <g
            key={city.id}
            ref={group}
            style={{ display: "none", pointerEvents: "none" }}
            onClick={onSelect ? () => onSelect(city.id) : undefined}
            onPointerEnter={
              onHover ? (event) => onHover(city.id, { x: event.clientX, y: event.clientY }) : undefined
            }
            onPointerLeave={onHover ? () => onHover(null) : undefined}
          >
            <circle ref={hit} fill="transparent" />
            <circle ref={dot} fill="var(--color-accent)" />
            <text ref={label} fill="var(--color-contrast)" fontFamily={LABEL_FONT}>
              {localize(city.source.name, locale)}
            </text>
          </g>
        );
      })}
    </>
  );
});
