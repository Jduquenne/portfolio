import { memo } from "react";
import { useLocale } from "next-intl";
import { ORIGIN } from "@/lib/availability/data/config";
import { localize } from "@/lib/data/cv";
import type { MapRegistry } from "@/lib/availability/render/handles";

interface MapOriginProps {
  registry: MapRegistry;
}

export const MapOrigin = memo(function MapOrigin({ registry }: MapOriginProps) {
  const locale = useLocale();
  const { group, ring, dot, label } = registry.origin;

  return (
    <g ref={group} style={{ display: "none", pointerEvents: "none" }}>
      <circle ref={ring} fill="none" stroke="var(--color-accent)" />
      <circle ref={dot} fill="var(--color-accent)" />
      <text
        ref={label}
        fill="var(--color-accent)"
        fontWeight={700}
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        {localize(ORIGIN.name, locale)}
      </text>
    </g>
  );
});
