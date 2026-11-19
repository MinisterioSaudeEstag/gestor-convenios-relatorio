import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Loader2, Printer } from "lucide-react";

export default function ConvenioRelatorio() {
  const { id } = useParams();
  const [convenio, setConvenio] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/api/convenios`)
      .then((res) => res.json())
      .then((lista) => {
        const c = lista.find((item) => String(item.id) === String(id));
        setConvenio(c);
        setCarregando(false);
      })
      .catch(() => setCarregando(false));
  }, [id]);

  if (carregando) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-8">
      <div className="flex items-center justify-between print:hidden">
        <Link
          to={`/convenio/${id}`}
          className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao convênio
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[12.5px] font-medium text-primary-foreground"
        >
          <Printer className="h-4 w-4" />
          Imprimir / Salvar PDF
        </button>
      </div>

      <div className="rounded-[var(--radius)] border border-border bg-card p-8 shadow-sm">
        <header className="border-b border-border pb-6">
          <p className="label-eyebrow">Ministério da Saúde · Relatório Oficial</p>
          <h1 className="mt-2 text-[24px] font-semibold text-foreground">
            Relatório de Acompanhamento Físico-Financeiro
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Instrumento nº: <strong className="num-mono text-foreground">{convenio?.numero_convenio || convenio?.numero}</strong>
          </p>
        </header>

        <div className="mt-6 space-y-6 text-[13.5vpx] leading-relaxed text-foreground">
          <div>
            <h3 className="text-[14px] font-semibold text-primary">1. Dados Gerais</h3>
            <p className="mt-1"><strong>Entidade Convenente:</strong> {convenio?.convenente || convenio?.entidade}</p>
            <p className="mt-1"><strong>Objeto:</strong> {convenio?.objeto}</p>
          </div>

          <div>
            <h3 className="text-[14px] font-semibold text-primary">2. Dados Financeiros</h3>
            <p className="mt-1">Valor Global: R$ {Number(convenio?.valor_global || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
            <p className="mt-1">Valor Repasse: R$ {Number(convenio?.valor_repasse || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
          </div>

          <div className="rounded-lg bg-muted/40 p-4 border border-border">
            <p className="text-[12px] text-muted-foreground italic">
              Este relatório foi gerado automaticamente pelo Agente Kora com base nas etapas validadas e documentos auditados. Pronto para protocolo no SEI / Transferegov.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}