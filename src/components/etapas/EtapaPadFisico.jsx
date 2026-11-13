import React from "react";
import Campo from "@/components/Campo";

const OPCOES = [
  { value: "conforme", label: "Conforme" },
  { value: "nao_conforme", label: "Não conforme" },
];

export default function EtapaPadFisico({ convenio, onChange }) {
  const pad = convenio.pad_fisico || {};

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[13px] font-semibold">Resultado da análise física</h3>
        <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-muted-foreground">
          Se conforme, registre que não foram identificadas inconformidades. Se não conforme, descreva cada item em
          desacordo com referência ao Plano de Trabalho.
        </p>
      </div>

      <div>
        <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">
          Resultado <span className="text-destructive">*</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {OPCOES.map((opcao) => {
            const ativa = pad.resultado === opcao.value;
            return (
              <button
                key={opcao.value}
                type="button"
                onClick={() => onChange({ pad_fisico: { ...pad, resultado: opcao.value } })}
                className={`rounded-full border px-4 py-1.5 text-[12px] font-medium transition-all ${
                  ativa
                    ? opcao.value === "conforme"
                      ? "border-emerald-600/70 bg-emerald-50 text-emerald-800"
                      : "border-red-500/70 bg-red-50 text-red-700"
                    : "border-border bg-card text-muted-foreground hover:border-foreground/25 hover:text-foreground"
                }`}
              >
                {opcao.label}
              </button>
            );
          })}
        </div>
      </div>

      <Campo
        label="Descrição da análise"
        tipo="textarea"
        rows={5}
        obrigatorio
        valor={pad.texto}
        onChange={(valor) => onChange({ pad_fisico: { ...pad, texto: valor } })}
        placeholder="Não foram identificadas inconformidades na execução desse item."
      />
    </div>
  );
}