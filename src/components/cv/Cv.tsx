"use client";

import Image from "next/image";
import { ArrowLeft, Download } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

const linkBase =
  "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest transition-colors";

export function CvPage() {
  const locale = useLocale();
  const t = useTranslations("cv");

  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const pdfUrl = `${base}/cv-${locale}.pdf`;
  const previewUrl = `${base}/cv-preview-${locale}.webp`;
  const fileName = `Jason_Duquenne_CV_${locale.toUpperCase()}.pdf`;

  return (
    <div className="grid-backdrop min-h-screen w-full px-6 py-10">
      <div className="mx-auto flex w-full max-w-[210mm] flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <a
            href="../"
            className={`${linkBase} text-contrast/50 hover:text-accent`}
          >
            <ArrowLeft size={14} />
            {t("back")}
          </a>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <a
              href={pdfUrl}
              download={fileName}
              className={`${linkBase} border border-white/8 px-3 py-2 text-contrast/50 hover:border-accent/40 hover:text-accent`}
            >
              <Download size={14} />
              {t("download")}
            </a>
          </div>
        </div>

        <a
          href={pdfUrl}
          download={fileName}
          className="block border border-white/8 shadow-2xl"
        >
          <Image
            src={previewUrl}
            alt={fileName}
            width={900}
            height={1273}
            className="h-auto w-full"
            unoptimized
            priority
          />
        </a>
      </div>
    </div>
  );
}
