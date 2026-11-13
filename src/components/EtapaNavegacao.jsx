import React from "react";
import { Check } from "lucide-react";
import { ETAPAS } from "@/lib/modelo";

export default function EtapaNavegacao({ progresso, etapaAtual, etapasValidadas = {}, onSelecionar }) {
  return (
    <nav className="flex gap-1 overflow-x-auto pb-1 lg:sticky lg:top-24 lg:flex-col lg:overflow-visible lg:pb-0">
      {ETAPAS.map((etapa, i) => {
        const info = progresso[i] || { pct: 0 };
        const ativa = etapaAtual === etapa.id;
        const validada = Boolean(etapasValidadas[etapa.id]);
        return (
          <button
            key={etapa.id}
            type="button"
            onClick={() => onSelecionar(etapa.id)}
            className={`group flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors lg:w-full ${
              ativa ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted/70"
            }`}
          >
            <span
              className={`num-mono flex h-5 w-5 shrink-0 items-center justify-center rounded text-[9.5px] font-semibold ${
                info.pct >= 100
                  ? "bg-primary text-primary-foreground"
                  : ativa
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {info.pct >= 100 ? <Check className="h-3 w-3" strokeWidth={3} /> : etapa.numeral}
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block truncate text-[12.5px] ${ativa ? "font-medium" : ""}`}>
                {etapa.titulo}
              </span>
              <span className="hidden text-[10px] text-muted-foreground lg:block">
                {validada ? "validada" : info.pct > 0 ? `${info.pct}% preenchido` : etapa.descricao}
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}