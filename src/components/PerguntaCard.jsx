import React from "react";
import { ChevronDown, Wand2 } from "lucide-react";
import { ROTULOS_RESPOSTA } from "@/lib/modelo";

const ESTILO_OPCAO = {
  sim: "border-emerald-600/70 bg-emerald-50 text-emerald-800",
  nao: "border-red-500/70 bg-red-50 text-red-700",
  na: "border-slate-400/70 bg-slate-100 text-slate-600",
};

export default function PerguntaCard({ pergunta, resposta = {}, onResposta }) {
  const selecionada = resposta.resposta || "";

  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-border bg-card">
      <div className="flex gap-3 border-b border-border bg-muted/50 px-4 py-3">
        <span className="num-mono mt-[1px] h-fit shrink-0 rounded border border-primary/25 bg-primary/5 px-1.5 py-[1px] text-[10.5px] font-semibold text-primary">
          {pergunta.id}
        </span>
        <p className="text-[13px] font-medium leading-snug text-foreground">{pergunta.titulo}</p>
      </div>

      <div className="space-y-3 px-4 py-4">
        <div className="flex flex-wrap gap-1.5">
          {["sim", "nao", "na"].map((opcao) => {
            const ativa = selecionada === opcao;
            return (
              <button
                key={opcao}
                type="button"
                aria-pressed={ativa}
                onClick={() => onResposta("resposta", ativa ? "" : opcao)}
                className={`rounded-full border px-3 py-1 text-[11.5px] font-medium transition-all ${
                  ativa
                    ? ESTILO_OPCAO[opcao]
                    : "border-border bg-card text-muted-foreground hover:border-foreground/25 hover:text-foreground"
                }`}
              >
                {ROTULOS_RESPOSTA[opcao]}
              </button>
            );
          })}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-medium text-muted-foreground">Texto da resposta</span>
            {pergunta.modelo ? (
              <button
                type="button"
                onClick={() => onResposta("texto", pergunta.modelo)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
              >
                <Wand2 className="h-3 w-3" />
                Usar modelo
              </button>
            ) : null}
          </div>
          <textarea
            rows={pergunta.modelo ? 4 : 2}
            value={resposta.texto ?? ""}
            onChange={(e) => onResposta("texto", e.target.value)}
            placeholder={
              pergunta.modelo
                ? "Preencha conforme o modelo — substitua os campos entre colchetes."
                : "Justifique a resposta com base nos documentos analisados."
            }
            className="w-full resize-y rounded-lg border border-border bg-card px-3 py-2 text-[13px] leading-relaxed outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
          />
        </div>

        {pergunta.orientacao ? (
          <details className="group rounded-lg border border-border/70 bg-muted/40 px-3 py-2">
            <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[11.5px] font-medium text-muted-foreground">
              <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
              Orientação do modelo
            </summary>
            <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{pergunta.orientacao}</p>
          </details>
        ) : null}
      </div>
    </div>
  );
}