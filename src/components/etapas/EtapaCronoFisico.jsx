import React from "react";
import { Calculator } from "lucide-react";
import Campo from "@/components/Campo";

export default function EtapaCronoFisico({ convenio, onChange }) {
  const crono = convenio.crono_fisico || {};
  const itens = (convenio.planilha || []).filter((i) => i && i.item);
  const aprovados = itens.reduce((acc, i) => acc + (Number(i.quantidade_aprovada) || 0), 0);
  const adquiridos = itens.reduce((acc, i) => acc + (Number(i.quantidade_adquirida) || 0), 0);

  const calcular = () => {
    const pct = aprovados ? Math.round((adquiridos / aprovados) * 10000) / 100 : null;
    const texto = `A execução física foi de ${pct ?? "[XX%]"}% com a aquisição de ${
      adquiridos || "[X]"
    } dos ${aprovados || "[X]"} equipamentos previstos, conforme Planilha de Equipamentos em Anexo na Aba Dados deste Relatório.`;
    onChange({ crono_fisico: { ...crono, percentual_execucao: pct, texto } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[13px] font-semibold">Execução física</h3>
        <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-muted-foreground">
          Equipamentos adquiridos ÷ equipamentos aprovados × 100. Se todos foram adquiridos, a execução é de 100%.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[180px_1fr] sm:items-start">
        <Campo
          label="Percentual executado (%)"
          tipo="numero"
          obrigatorio
          valor={crono.percentual_execucao}
          onChange={(valor) =>
            onChange({ crono_fisico: { ...crono, percentual_execucao: valor } })
          }
        />
        <button
          type="button"
          onClick={calcular}
          disabled={!aprovados}
          className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
        >
          <Calculator className="h-3.5 w-3.5" />
          Calcular pela planilha
          {aprovados ? (
            <span className="num-mono text-[11px] text-foreground/60">
              ({adquiridos}/{aprovados})
            </span>
          ) : null}
        </button>
      </div>

      <Campo
        label="Texto da execução física"
        tipo="textarea"
        rows={5}
        obrigatorio
        valor={crono.texto}
        onChange={(valor) => onChange({ crono_fisico: { ...crono, texto: valor } })}
        placeholder="A execução física foi de XX% com a aquisição de todos os equipamentos previstos, conforme Planilha de Equipamentos em Anexo na Aba Dados deste Relatório."
      />
    </div>
  );
}