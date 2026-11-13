import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Building2 } from "lucide-react";
import EtapaPipeline from "@/components/EtapaPipeline";
import { calcularProgresso, formatarMoeda, progressoGeral } from "@/lib/modelo";

export default function ConvenioCard({ convenio }) {
  const progresso = calcularProgresso(convenio);
  const geral = progressoGeral(convenio);
  const concluidas = progresso.filter((e) => e.pct >= 100).length;
  const concluido = geral >= 100;

  return (
    <Link
      to={`/convenio/${convenio.id}`}
      className="group block rounded-[var(--radius)] border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_16px_36px_-24px_rgba(10,102,64,0.45)]"
    >
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0">
          <div className="mb-1.5 flex items-center gap-2.5">
            <span className="num-mono text-[11px] tracking-[0.06em] text-muted-foreground">
              {convenio.numero || "sem número"}
            </span>
            <span
              className={`rounded-full px-2 py-[2px] text-[9.5px] font-semibold uppercase tracking-[0.1em] ${
                concluido
                  ? "bg-primary/10 text-primary"
                  : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200/70"
              }`}
            >
              {concluido ? "Concluído" : "Em análise"}
            </span>
          </div>
          <h3 className="truncate text-[15px] font-semibold tracking-tight text-foreground">
            {convenio.entidade || "Entidade não informada"}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-[13px] text-muted-foreground">
            {convenio.objeto || "Objeto não informado"}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <div className="num-mono text-[22px] font-semibold leading-none text-foreground">
            {geral}
            <span className="text-[13px] font-normal text-muted-foreground">%</span>
          </div>
          <div className="mt-1 flex items-center justify-end gap-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            preenchido
            <ArrowUpRight className="h-3 w-3 -translate-y-px opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-60" />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-3">
        <EtapaPipeline progresso={progresso} />
        <div className="flex items-center gap-3 text-[11.5px] text-muted-foreground">
          <span className="num-mono">
            {concluidas}/8 etapas
          </span>
          <span className="h-3 w-px bg-border" />
          <span className="num-mono">{formatarMoeda(convenio.valor_global)}</span>
        </div>
      </div>

      {convenio.municipio ? (
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
          <Building2 className="h-3 w-3" />
          {convenio.municipio}
        </div>
      ) : null}
    </Link>
  );
}