"use client";

import { LevelPips } from "@/components/shared/constellation/LevelPips";
import type { ConstellationStore } from "@/lib/constellation/store";
import type { ToolView } from "@/lib/constellation/types";

interface ToolRowsProps {
  tools: readonly ToolView[];
  store: ConstellationStore;
  /** The tool lit in the scene. */
  active: string | null;
  /** The level in words under each tool. Left out where height is short. */
  levelLabels?: boolean;
}

/** The tools of a planet. Hovering or pressing a row lights its diamond in the scene. */
export function ToolRows({ tools, store, active, levelLabels = true }: ToolRowsProps) {
  return (
    <ul>
      {tools.map((tool) => (
        <li key={tool.id} className="border-b border-white/8 last:border-b-0">
          <button
            type="button"
            aria-pressed={active === tool.id}
            onMouseEnter={() => store.hoverTool(tool.id)}
            onMouseLeave={() => store.hoverTool(null)}
            onClick={() => store.hoverTool(active === tool.id ? null : tool.id)}
            className="grid w-full grid-cols-[1fr_auto] items-center gap-x-4 px-2 py-2 text-left font-mono text-xs transition-colors hover:bg-accent/10 aria-pressed:bg-accent/10"
          >
            <span className="min-w-0 break-words text-contrast">{tool.name}</span>
            {tool.level ? <LevelPips level={tool.level} /> : <span />}
            {levelLabels && tool.levelLabel && (
              <span className="col-span-2 text-contrast/50">{tool.levelLabel}</span>
            )}
            {tool.note && (
              <span className="col-span-2 mt-1 font-sans text-contrast/70">{tool.note}</span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}
