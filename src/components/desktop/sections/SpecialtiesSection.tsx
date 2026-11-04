"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { PlanetList } from "@/components/shared/constellation/PlanetList";
import { ConstellationStage } from "@/components/shared/constellation/ConstellationStage";
import { SunTabs } from "@/components/shared/constellation/SunTabs";
import { PlanetPanel } from "@/components/desktop/PlanetPanel";
import { useConstellation } from "@/hooks/useConstellation";
import { useDismissOnEscape } from "@/hooks/useDismissOnEscape";
import { fadeUp, stagger } from "@/lib/motion";
import { DESKTOP_HERO_BLEED } from "@/lib/scroll";

const sectionVariants = stagger(0.1);

export function SpecialtiesSection() {
  const t = useTranslations("passions");
  const { model, layout, store, state } = useConstellation("wide");
  useDismissOnEscape(() => store.selectPlanet(null));

  const planet = model.planets.find((item) => item.id === state.planet);

  return (
    <motion.section
      id="passions"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-64px" }}
      className="flex min-h-full flex-col gap-8"
    >
      <motion.div variants={fadeUp} className="flex items-center gap-4">
        <span className="font-mono text-xs text-accent tracking-widest uppercase shrink-0">
          {t("section_label")}
        </span>
        <div className="flex-1 h-px bg-white/8" />
      </motion.div>

      <ConstellationStage
        model={model}
        layout={layout}
        store={store}
        compact={false}
        layerClassName={DESKTOP_HERO_BLEED}
        className="flex min-h-96 flex-1 flex-col justify-between"
      >
        {(ready) => (
          <>
            <div className="pointer-events-none relative flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-contrast">
              <span aria-hidden="true" className="size-2 rotate-45 bg-accent" />
              {model.designation}
            </div>
            <PlanetList
              model={model}
              store={store}
              visible={!ready}
              className="relative grid grid-cols-4 gap-8"
            />
            {planet && (
              <PlanetPanel key={planet.id} planet={planet} model={model} store={store} tool={state.tool} />
            )}
            <SunTabs model={model} store={store} active={state.sun} />
          </>
        )}
      </ConstellationStage>
    </motion.section>
  );
}
