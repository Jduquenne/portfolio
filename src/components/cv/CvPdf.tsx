"use client";

import { useMemo } from "react";
import { usePDF } from "@react-pdf/renderer";
import { ArrowLeft, Download } from "lucide-react";
import { CvDocument, type CvData } from "@/components/cv/CvDocument";
import { CvLoading } from "@/components/cv/CvLoading";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

interface CvPdfProps {
  data: CvData;
  fileName: string;
  downloadLabel: string;
  backHref: string;
  backLabel: string;
}

const linkBase =
  "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest transition-colors";

export function CvPdf({
  data,
  fileName,
  downloadLabel,
  backHref,
  backLabel,
}: CvPdfProps) {
  const document = useMemo(() => <CvDocument data={data} />, [data]);
  const [instance] = usePDF({ document });

  const url = instance.error ? null : instance.url;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <a
          href={backHref}
          className={`${linkBase} text-contrast/50 hover:text-accent`}
        >
          <ArrowLeft size={14} />
          {backLabel}
        </a>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          {url ? (
            <a
              href={url}
              download={fileName}
              className={`${linkBase} border border-white/8 px-3 py-2 text-contrast/50 hover:border-accent/40 hover:text-accent`}
            >
              <Download size={14} />
              {downloadLabel}
            </a>
          ) : (
            <span
              className={`${linkBase} border border-white/8 px-3 py-2 text-contrast/20`}
            >
              <Download size={14} />
              {downloadLabel}
            </span>
          )}
        </div>
      </div>

      {instance.error ? (
        <CvLoading error />
      ) : url ? (
        <iframe
          src={`${url}#toolbar=0`}
          title={fileName}
          className="h-[82vh] w-full border border-white/8 bg-white"
        />
      ) : (
        <CvLoading />
      )}
    </div>
  );
}
