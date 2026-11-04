"use client";

import { useTranslations } from "next-intl";
import type { ConstellationStore } from "@/lib/constellation/store";
import type { ConstellationModel } from "@/lib/constellation/types";
import { cn } from "@/lib/utils";

interface PlanetListProps {
  model: ConstellationModel;
  store: ConstellationStore;
  /** Shown as a grid while the 3D scene is not there; hidden from the eye, but still reachable, once it is. */
  visible: boolean;
  /** How the groups sit when the list is visible. */
  className?: string;
}

/**
 * The same passions as plain buttons, grouped by step. It is what the visitor
 * uses before the scene has loaded, without WebGL or with data saving on, and
 * with a keyboard or a screen reader once it has.
 */
export function PlanetList({ model, store, visible, className }: PlanetListProps) {
  const t = useTranslations("passions");

  return (
    <nav
      aria-label={t("list_label")}
      className={cn(visible ? "pointer-events-auto" : "sr-only", visible && className)}
    >
      {model.suns.map((sun) => (
        <div key={sun.index} className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">
            {sun.name}
          </span>
          <ul className="flex flex-col">
            {model.planets
              .filter((planet) => planet.suns.includes(sun.index))
              .map((planet) => (
                <li key={planet.id}>
                  <button
                    type="button"
                    onClick={() => store.selectPlanet(planet.id)}
                    onFocus={() => store.selectPlanet(planet.id)}
                    className="w-full border-b border-white/8 py-2 text-left font-mono text-xs text-contrast/70 transition-colors hover:text-accent"
                  >
                    {planet.name}
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
