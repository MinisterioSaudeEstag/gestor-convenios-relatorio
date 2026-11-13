import React from "react";
import Campo from "@/components/Campo";
import { formatarMoeda } from "@/lib/modelo";

export default function EtapaPadFinanceiro({ convenio, onChange }) {
  const pad = convenio.pad_financeiro || {};
  const itens = (convenio.planilha || []).filter((i) => i && i.item);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[13px] font-semibold">Conformidade das notas fiscais</h3>
        <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-muted-foreground">
          As Notas Fiscais/Documentações descritas na Aba PAD Financeiro demonstram conformidade das aquisições em
          relação ao Plano de Trabalho aprovado. Registre a justificativa da análise.
        </p>
      </div>

      <Campo
        label="Justificativa da análise"
        tipo="textarea"
        rows={4}
        obrigatorio
        valor={pad.justificativa}
        onChange={(valor) => onChange({ pad_financeiro: { ...pad, justificativa: valor } })}
        placeholder="Ex.: as notas fiscais apresentadas guardam correspondência com os itens e valores do Plano de Aplicação Detalhado aprovado."
      />

      <div>
        <p className="label-eyebrow">Equipamentos considerados</p>
        {itens.length ? (
          <div className="mt-2 space-y-2">
            {itens.map((item, i) => {
              const total =
                (Number(item.quantidade_adquirida) || 0) * (Number(item.valor_unitario_adquirido) || 0);
              return (
                <div key={i} className="rounded-lg border border-border bg-card px-3.5 py-2.5">
                  <p className="text-[12.5px] font-medium">{item.item}</p>
                  <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-[11.5px] text-muted-foreground">
                    <span>Qtd. aprovada: <strong className="num-mono text-foreground">{item.quantidade_aprovada ?? "—"}</strong></span>
                    <span>Valor unit. adquirido: <strong className="num-mono text-foreground">{item.valor_unitario_adquirido ? formatarMoeda(item.valor_unitario_adquirido) : "—"}</strong></span>
                    <span>Total: <strong className="num-mono text-foreground">{total ? formatarMoeda(total) : "—"}</strong></span>
                    {item.nota_fiscal ? <span>NF: <strong className="num-mono text-foreground">{item.nota_fiscal}</strong></span> : null}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-2 rounded-lg border border-dashed border-border px-3.5 py-3 text-[12px] text-muted-foreground">
            Nenhum equipamento na planilha da Aba Dados. Preencha a planilha para que os blocos do PAD Financeiro
            sejam gerados automaticamente.
          </p>
        )}
      </div>
    </div>
  );
}