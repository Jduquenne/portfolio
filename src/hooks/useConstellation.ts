"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import { computeLayout } from "@/lib/constellation/layout";
import { buildModel } from "@/lib/constellation/model";
import {
  createConstellationStore,
  type ConstellationStore,
} from "@/lib/constellation/store";
import type {
  ConstellationModel,
  ConstellationState,
  Layout,
  LayoutKind,
} from "@/lib/constellation/types";
import { constellation } from "@/lib/data/constellation";

const LEVELS = [1, 2, 3, 4, 5] as const;

/** The constellation in the visitor's language, its layout, and what is chosen. */
export function useConstellation(kind: LayoutKind): {
  model: ConstellationModel;
  layout: Layout;
  store: ConstellationStore;
  state: ConstellationState;
} {
  const locale = useLocale();
  const t = useTranslations("passions");
  const [store] = useState(createConstellationStore);

  const model = useMemo(
    () =>
      buildModel(
        constellation,
        locale,
        LEVELS.map((level) => t(`level_${level}`)),
      ),
    [locale, t],
  );
  const layout = useMemo(() => computeLayout(model, kind), [model, kind]);
  const state = useSyncExternalStore(store.subscribe, store.getState, store.getState);

  return { model, layout, store, state };
}
