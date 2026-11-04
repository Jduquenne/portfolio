import { LevelPips } from "@/components/shared/constellation/LevelPips";
import type { ConstellationModel } from "@/lib/constellation/types";

const LABEL =
  "absolute left-0 top-0 whitespace-nowrap font-mono opacity-0 transition-opacity will-change-transform";

interface ConstellationLabelsProps {
  model: ConstellationModel;
}

/**
 * The names written over the scene. The scene finds each one by its `data-node`
 * and moves it every frame, so these elements carry no position of their own.
 */
export function ConstellationLabels({ model }: ConstellationLabelsProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {model.suns.map((sun) => (
        <span
          key={sun.index}
          data-node={`sun-${sun.index}`}
          className={`${LABEL} text-sm font-bold uppercase tracking-widest text-contrast`}
        >
          {sun.name}
        </span>
      ))}
      {model.planets.map((planet) => (
        <span
          key={planet.id}
          data-node={planet.id}
          className={`${LABEL} text-xs uppercase tracking-wider text-contrast`}
        >
          {planet.name}
        </span>
      ))}
      {model.planets.flatMap((planet) =>
        planet.tools.map((tool) => (
          <span
            key={tool.id}
            data-node={tool.id}
            className={`${LABEL} flex items-center gap-2 text-xs text-accent`}
          >
            {tool.name}
            {tool.level && <LevelPips level={tool.level} />}
          </span>
        )),
      )}
    </div>
  );
}
