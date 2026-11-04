"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ToolRows } from "@/components/shared/constellation/ToolRows";
import { useFitText } from "@/hooks/useFitText";
import type { ConstellationStore } from "@/lib/constellation/store";
import type { ConstellationModel, PlanetView } from "@/lib/constellation/types";
import { fadeUp } from "@/lib/motion";

type Tab = "note" | "tools";

interface PlanetSheetProps {
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
 * What a planet is about, as a sheet over the bottom of the stage. The passion
 * in words and its tools take turns (two tabs), so it never has to scroll: a
 * text that still does not fit is cut with an ellipsis.
 */
export function PlanetSheet({ planet, model, store, tool }: PlanetSheetProps) {
  const t = useTranslations("passions");
  const hasNote = planet.note !== null;
  const hasTools = planet.tools.length > 0;
  const [tab, setTab] = useState<Tab>(hasNote ? "note" : "tools");
  const panelRef = useRef<HTMLElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);
  useFitText(panelRef, noteRef, `${planet.id}:${tab}`);

  const showNote = hasNote && (tab === "note" || !hasTools);
  const showTools = hasTools && (tab === "tools" || !hasNote);

  return (
    <motion.section
      ref={panelRef}
      data-panel=""
      aria-labelledby="planet-sheet-title"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="pointer-events-auto absolute inset-x-0 bottom-0 max-h-full overflow-hidden border border-white/8 bg-surface/90 p-4 backdrop-blur-sm"
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
        className="absolute right-0 top-0 inline-flex size-10 items-center justify-center text-contrast/50 transition-colors hover:text-accent"
      >
        <X aria-hidden="true" className="size-4" />
      </button>

      <p className="font-mono text-xs uppercase tracking-widest text-contrast/50">
        {t("panel_eyebrow")}
      </p>
      <h3
        id="planet-sheet-title"
        className="mt-1 pr-8 font-mono text-lg font-bold uppercase tracking-wide text-contrast"
      >
        {planet.name}
      </h3>
      <p className="font-mono text-xs text-accent">
        {planet.suns.map((sun) => model.suns[sun].name).join(" · ")}
      </p>

      {hasNote && hasTools && (
        <div
          role="tablist"
          aria-label={t("details_label")}
          className="mt-2 flex gap-6 border-b border-white/8"
        >
          {(["note", "tools"] as const).map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={tab === item}
              onClick={() => setTab(item)}
              className="-mb-px min-h-10 border-b-2 border-transparent font-mono text-xs uppercase tracking-widest text-contrast/70 transition-colors aria-selected:border-accent aria-selected:text-accent"
            >
              {item === "note" ? t("tab_note") : t("tools")}
            </button>
          ))}
        </div>
      )}

      {(showNote || showTools) && (
        <div className="mt-3">
          {showNote && (
            <p ref={noteRef} className="font-sans text-sm leading-relaxed text-contrast/70">
              {planet.note}
            </p>
          )}
          {showTools && <ToolRows tools={planet.tools} store={store} active={tool} levelLabels={false} />}
        </div>
      )}
    </motion.section>
  );
}
