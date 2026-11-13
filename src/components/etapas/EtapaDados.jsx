import React from "react";
import Campo from "@/components/Campo";
import PlanilhaEquipamentos from "@/components/PlanilhaEquipamentos";
import { CAMPOS_DADOS, formatarData, formatarMoeda } from "@/lib/modelo";

function PreviaIntro({ convenio }) {
  return (
    <details className="rounded-[var(--radius)] border border-border bg-muted/30 px-4 py-3">
      <summary className="cursor-pointer text-[11.5px] font-medium text-muted-foreground">
        Prévia do texto de abertura do relatório
      </summary>
      <div className="mt-2 space-y-2 text-[12.5px] leading-relaxed text-muted-foreground">
        <p>
          Trata-se da elaboração de Relatório de Acompanhamento Físico/Financeiro referente ao cumprimento do
          objeto do convênio nº <strong className="font-medium text-foreground">{convenio.numero || "—"}</strong> da{" "}
          <strong className="font-medium text-foreground">{convenio.entidade || "—"}</strong>, cujo objeto é{" "}
          <strong className="font-medium text-foreground">{convenio.objeto || "—"}</strong>, com valor global{" "}
          {formatarMoeda(convenio.valor_global)}, sendo {formatarMoeda(convenio.valor_concedente)} do concedente e{" "}
          {formatarMoeda(convenio.valor_contrapartida)} de contrapartida.
        </p>
        <p>
          Foi executado {formatarMoeda(convenio.valor_executado)}, cuja data de vigência foi de{" "}
          {formatarData(convenio.vigencia_inicio)} a {formatarData(convenio.vigencia_fim)}, em cumprimento ao que
          determina o {convenio.oficio_circular || "—"}.
        </p>
      </div>
    </details>
  );
}

export default function EtapaDados({ convenio, onChange }) {
  return (
    <div className="space-y-7">
      <section>
        <h3 className="text-[13px] font-semibold">Identificação, valores e vigência</h3>
        <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-muted-foreground">
          Dados da Aba Dados do Transferegov: número do convênio, entidade, objeto, valores aprovados e período de
          vigência. O valor executado corresponde ao somatório das notas fiscais pagas.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CAMPOS_DADOS.map((campo) => (
            <Campo
              key={campo.key}
              label={campo.label}
              tipo={campo.tipo}
              placeholder={campo.placeholder}
              obrigatorio={campo.obrigatorio}
              valor={convenio[campo.key]}
              onChange={(valor) => onChange({ [campo.key]: valor })}
              className={campo.col === 2 ? "sm:col-span-2" : ""}
            />
          ))}
        </div>
      </section>

      <PreviaIntro convenio={convenio} />

      <section>
        <h3 className="text-[13px] font-semibold">Planilha de equipamentos</h3>
        <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-muted-foreground">
          Itens aprovados no Plano de Aplicação e efetivamente adquiridos. É a base da execução física, do PAD
          Financeiro e do anexo do relatório.
        </p>
        <div className="mt-4">
          <PlanilhaEquipamentos
            itens={convenio.planilha || []}
            onChange={(planilha) => onChange({ planilha })}
          />
        </div>
      </section>
    </div>
  );
}