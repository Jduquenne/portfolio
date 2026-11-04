"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { PlanetSheet } from "@/components/mobile/PlanetSheet";
import { ConstellationStage } from "@/components/shared/constellation/ConstellationStage";
import { PlanetList } from "@/components/shared/constellation/PlanetList";
import { SunTabs } from "@/components/shared/constellation/SunTabs";
import { useConstellation } from "@/hooks/useConstellation";
import { fadeUp, stagger } from "@/lib/motion";

const sectionVariants = stagger(0.1);

export function PassionsSection() {
  const t = useTranslations("passions");
  const { model, layout, store, state } = useConstellation("tall");
  const planet = model.planets.find((item) => item.id === state.planet);

  return (
    <motion.section
      id="passions"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-48px" }}
      className="relative h-full shrink-0 snap-start overflow-hidden"
    >
      <ConstellationStage
        model={model}
        layout={layout}
        store={store}
        compact
        layerClassName="inset-0"
        className="flex h-full flex-col px-6 pb-4 pt-12"
      >
        {(ready) => (
          <>
            <motion.div variants={fadeUp} className="relative flex items-center gap-4">
              <span className="font-mono text-xs text-accent tracking-widest uppercase shrink-0">
                {t("section_label")}
              </span>
              <div className="flex-1 h-px bg-white/8" />
            </motion.div>
            <div className="pointer-events-none relative mt-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-contrast">
              <span aria-hidden="true" className="size-2 rotate-45 bg-accent" />
              {model.designation}
            </div>

            <div className="pointer-events-none relative min-h-0 flex-1">
              <PlanetList
                model={model}
                store={store}
                visible={!ready}
                className="grid grid-cols-2 gap-4 pt-4"
              />
              {ready && !planet && state.sun === null && (
                <p className="pointer-events-none absolute inset-x-0 bottom-2 font-mono text-xs text-contrast/50">
                  {t("touch_hint")}
                </p>
              )}
              {planet && (
                <PlanetSheet key={planet.id} planet={planet} model={model} store={store} tool={state.tool} />
              )}
            </div>

            <SunTabs
              model={model}
              store={store}
              active={state.sun}
              hints={false}
              className="grid grid-cols-2 gap-x-4"
            />
          </>
        )}
      </ConstellationStage>
    </motion.section>
  );
}
