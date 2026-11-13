import React from "react";
import { ETAPAS } from "@/lib/modelo";

export default function EtapaPipeline({ progresso = [] }) {
  return (
    <div className="flex items-center gap-[3px]">
      {progresso.map((etapa, i) => {
        const meta = ETAPAS[i];
        const cor =
          etapa.pct >= 100
            ? "bg-primary"
            : etapa.pct > 0
            ? "bg-primary/35"
            : "bg-border";
        return (
          <span
            key={etapa.id}
            title={`${meta ? meta.titulo : etapa.id} — ${etapa.pct}%`}
            className={`h-[6px] w-5 rounded-full transition-colors duration-300 ${cor}`}
          />
        );
      })}
    </div>
  );
}