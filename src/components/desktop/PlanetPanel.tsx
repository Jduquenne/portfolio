"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ToolRows } from "@/components/shared/constellation/ToolRows";
import { useFitText } from "@/hooks/useFitText";
import type { ConstellationStore } from "@/lib/constellation/store";
import type { ConstellationModel, PlanetView } from "@/lib/constellation/types";
import { fadeUp } from "@/lib/motion";

interface PlanetPanelProps {
  planet: PlanetView;
  model: ConstellationModel;
  store: ConstellationStore;
  tool: string | null;
}

const CORNERS = [
  "-left-px -top-px border-l-2 border-t-2",
  "-right-px -top-px border-r-2 border-t-2",
  "-bottom-px -left-px border-b-2 border-l-2",
  "-bottom-px -right-px border-b-2 border-r-2",
];

/**
 * What a planet is about: the passion in words on the left, its tools on the
 * right. It never scrolls: a text that does not fit is cut instead.
 */
export function PlanetPanel({ planet, model, store, tool }: PlanetPanelProps) {
  const t = useTranslations("passions");
  const panelRef = useRef<HTMLElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);
  useFitText(panelRef, noteRef, planet.id);

  const hasNote = planet.note !== null;
  const hasTools = planet.tools.length > 0;

  return (
    <motion.section
      ref={panelRef}
      data-panel=""
      aria-labelledby="planet-panel-title"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="pointer-events-auto absolute right-0 top-0 max-h-[calc(100%-5rem)] w-full max-w-2xl overflow-hidden border border-white/8 bg-surface/90 p-6 backdrop-blur-sm"
    >
      {CORNERS.map((corner) => (
        <span
          key={corner}
          aria-hidden="true"
          className={`absolute size-3 border-accent ${corner}`}
        />
      ))}
      <button
        type="button"
        onClick={() => store.selectPlanet(null)}
        aria-label={t("close")}
        className="absolute right-2 top-2 inline-flex size-8 items-center justify-center text-contrast/50 transition-colors hover:text-accent"
      >
        <X aria-hidden="true" className="size-4" />
      </button>

      <p className="font-mono text-xs uppercase tracking-widest text-contrast/50">
        {t("panel_eyebrow")}
      </p>
      <h3
        id="planet-panel-title"
        className="mt-1 font-mono text-xl font-bold uppercase tracking-wide text-contrast"
      >
        {planet.name}
      </h3>
      <p className="font-mono text-xs text-accent">
        {planet.suns.map((sun) => model.suns[sun].name).join(" · ")}
      </p>

      {(hasNote || hasTools) && (
        <div
          className={`mt-4 grid gap-6 border-t border-white/8 pt-4 ${hasNote && hasTools ? "grid-cols-[5fr_4fr]" : "grid-cols-1"}`}
        >
          {hasNote && (
            <p ref={noteRef} className="font-sans text-sm leading-relaxed text-contrast/70">
              {planet.note}
            </p>
          )}
          {hasTools && (
            <div>
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-contrast/50">
                {t("tools")}
              </p>
              <ToolRows tools={planet.tools} store={store} active={tool} />
            </div>
          )}
        </div>
      )}
    </motion.section>
  );
}
