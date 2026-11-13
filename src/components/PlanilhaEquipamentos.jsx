import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { formatarMoeda } from "@/lib/modelo";

const linha = "w-full rounded-md border border-border bg-card px-2 py-1.5 text-[12px] outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/40 focus:ring-4 focus:ring-primary/10";

const ItemNumerico = ({ label, valor, onChange }) => (
  <label className="block">
    <span className="mb-1 block text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">{label}</span>
    <input
      type="number"
      step="0.01"
      min="0"
      value={valor ?? ""}
      onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
      className={`${linha} num-mono`}
    />
  </label>
);

export default function PlanilhaEquipamentos({ itens = [], onChange }) {
  const atualizar = (indice, campo, valor) => {
    const proximo = itens.map((item, i) => (i === indice ? { ...item, [campo]: valor } : item));
    onChange(proximo);
  };

  const adicionar = () =>
    onChange([
      ...itens,
      {
        item: "",
        quantidade_aprovada: null,
        valor_unitario_aprovado: null,
        quantidade_adquirida: null,
        valor_unitario_adquirido: null,
        fornecedor: "",
        nota_fiscal: "",
        data_nf: "",
      },
    ]);

  const remover = (indice) => onChange(itens.filter((_, i) => i !== indice));

  return (
    <div className="space-y-3">
      {itens.map((item, i) => {
        const total = (Number(item.quantidade_adquirida) || 0) * (Number(item.valor_unitario_adquirido) || 0);
        return (
          <div key={i} className="rounded-[var(--radius)] border border-border bg-muted/25 p-3">
            <div className="flex items-start gap-2">
              <input
                value={item.item ?? ""}
                onChange={(e) => atualizar(i, "item", e.target.value)}
                placeholder="Nome do equipamento"
                className={`${linha} font-medium`}
              />
              <button
                type="button"
                onClick={() => remover(i)}
                title="Remover item"
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <ItemNumerico
                label="Qtd. aprovada"
                valor={item.quantidade_aprovada}
                onChange={(v) => atualizar(i, "quantidade_aprovada", v)}
              />
              <ItemNumerico
                label="Valor unit. aprov."
                valor={item.valor_unitario_aprovado}
                onChange={(v) => atualizar(i, "valor_unitario_aprovado", v)}
              />
              <ItemNumerico
                label="Qtd. adquirida"
                valor={item.quantidade_adquirida}
                onChange={(v) => atualizar(i, "quantidade_adquirida", v)}
              />
              <ItemNumerico
                label="Valor unit. adquir."
                valor={item.valor_unitario_adquirido}
                onChange={(v) => atualizar(i, "valor_unitario_adquirido", v)}
              />
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <input
                value={item.fornecedor ?? ""}
                onChange={(e) => atualizar(i, "fornecedor", e.target.value)}
                placeholder="Fornecedor"
                className={linha}
              />
              <input
                value={item.nota_fiscal ?? ""}
                onChange={(e) => atualizar(i, "nota_fiscal", e.target.value)}
                placeholder="Nota fiscal"
                className={linha}
              />
              <input
                type="date"
                value={item.data_nf ?? ""}
                onChange={(e) => atualizar(i, "data_nf", e.target.value)}
                className={`${linha} num-mono`}
              />
            </div>

            {total ? (
              <p className="num-mono mt-2 text-right text-[11.5px] text-muted-foreground">
                Total adquirido: <span className="font-semibold text-foreground">{formatarMoeda(total)}</span>
              </p>
            ) : null}
          </div>
        );
      })}

      <button
        type="button"
        onClick={adicionar}
        className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3.5 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        <Plus className="h-3.5 w-3.5" />
        Adicionar equipamento
      </button>
    </div>
  );
}