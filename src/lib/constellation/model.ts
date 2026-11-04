import { localize } from "@/lib/data/cv";
import type {
  ConstellationData,
  ConstellationModel,
  Level,
  ToolView,
} from "@/lib/constellation/types";

/**
 * The constellation in one language. `levelLabels` holds the five labels of the
 * scale, lowest first (they live in `messages/`, with the rest of the interface).
 */
export function buildModel(
  data: ConstellationData,
  locale: string,
  levelLabels: readonly string[],
): ConstellationModel {
  const label = (level: Level) => levelLabels[level - 1] ?? null;

  return {
    designation: data.designation,
    suns: data.suns.map((sun, index) => ({
      index,
      name: localize(sun.name, locale),
      hint: localize(sun.hint, locale),
    })),
    planets: data.planets.map((planet) => ({
      id: planet.id,
      name: localize(planet.name, locale),
      note: planet.note ? localize(planet.note, locale) : null,
      suns: planet.suns,
      tools: planet.tools.map(
        (tool, index): ToolView => ({
          id: `${planet.id}:${index}`,
          name: tool.name,
          level: tool.level ?? null,
          levelLabel: tool.level ? label(tool.level) : null,
          note: tool.note ? localize(tool.note, locale) : null,
        }),
      ),
    })),
  };
}
