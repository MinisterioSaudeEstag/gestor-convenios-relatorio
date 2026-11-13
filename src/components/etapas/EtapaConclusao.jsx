import React from "react";
import { Calculator } from "lucide-react";
import Campo from "@/components/Campo";
import { TEXTO_RECOMENDACAO_SCNES } from "@/lib/modelo";

export default function EtapaConclusao({ convenio, onChange }) {
  const concl = convenio.conclusao || {};
  const atualizar = (campo, valor) => onChange({ conclusao: { ...concl, [campo]: valor } });

  const usarCalculados = () => {
    const crono = convenio.crono_fisico || {};
    const fisica = crono.percentual_execucao;
    const global = Number(convenio.valor_global) || 0;
    const executado = Number(convenio.valor_executado) || 0;
    const financeira = global ? (executado / global) * 100 : null;
    onChange({
      conclusao: {
        ...concl,
        execucao_fisica: fisica !== undefined && fisica !== null ? String(fisica).replace(".", ",") : concl.execucao_fisica,
        execucao_financeira:
          financeira !== null
            ? financeira.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : concl.execucao_financeira,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[13px] font-semibold">Percentuais e conclusão</h3>
        <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-muted-foreground">
          Registre a execução física e financeira, as constatações identificadas e as recomendações correspondentes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Campo
          label="Execução física (%)"
          obrigatorio
          valor={concl.execucao_fisica}
          onChange={(v) => atualizar("execucao_fisica", v)}
          placeholder="100"
        />
        <Campo
          label="Execução financeira (%)"
          obrigatorio
          valor={concl.execucao_financeira}
          onChange={(v) => atualizar("execucao_financeira", v)}
          placeholder="95,16"
        />
      </div>

      <button
        type="button"
        onClick={usarCalculados}
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        <Calculator className="h-3.5 w-3.5" />
        Calcular a partir dos valores e do crono físico
      </button>

      <Campo
        label="C1 — Constatações"
        tipo="textarea"
        rows={4}
        obrigatorio
        valor={concl.constatacoes}
        onChange={(v) => atualizar("constatacoes", v)}
        placeholder="Se não há constatações, registre que não foram identificadas irregularidades na execução do convênio."
      />

      <Campo
        label="C2 — Recomendações"
        tipo="textarea"
        rows={4}
        obrigatorio
        valor={concl.recomendacoes}
        onChange={(v) => atualizar("recomendacoes", v)}
        placeholder="Uma recomendação para cada constatação registrada."
        dica="A recomendação obrigatória do Acórdão TCU nº 247/2010 (cadastro no SCNES) é incluída automaticamente no relatório final."
      />

      <div className="rounded-[var(--radius)] border border-border bg-muted/40 px-4 py-3">
        <p className="label-eyebrow">Recomendação fixa do modelo</p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{TEXTO_RECOMENDACAO_SCNES}</p>
      </div>
    </div>
  );
}