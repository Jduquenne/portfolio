"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useLocale, useTranslations } from "next-intl";
import { buildCvData } from "@/components/cv/cvData";
import { CvLoading } from "@/components/cv/CvLoading";

const CvPdf = dynamic(
  () => import("@/components/cv/CvPdf").then((m) => m.CvPdf),
  { ssr: false, loading: () => <CvLoading /> },
);

export function CvPage() {
  const locale = useLocale();
  const t = useTranslations("cv");

  const data = useMemo(() => buildCvData(locale, t), [locale, t]);
  const fileName = `Jason_Duquenne_CV_${locale.toUpperCase()}.pdf`;

  return (
    <div className="grid-backdrop min-h-screen w-full px-6 py-10">
      <div className="mx-auto w-full max-w-[210mm]">
        <CvPdf
          data={data}
          fileName={fileName}
          downloadLabel={t("download")}
          backHref="../"
          backLabel={t("back")}
        />
      </div>
    </div>
  );
}
