import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { ETAPAS, calcularProgresso, pendenciasDaEtapa } from "@/lib/modelo";
import { baixarRelatorio, gerarHtmlRelatorio, nomeArquivoRelatorio } from "@/lib/gerarRelatorio";

export default function Relatorio() {
  const { id } = useParams();
  const [convenio, setConvenio] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    const carregarConvenio = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/convenios`);
        const lista = await response.json();
        const c = lista.find((item) => String(item.id) === String(id));
        if (!ativo) return;
        setConvenio(c || null);
      } catch (e) {
        console.error("Erro ao carregar convênio para relatório:", e);
      } finally {
        if (ativo) setCarregando(false);
      }
    };
    carregarConvenio();
    return () => {
      ativo = false;
    };
  }, [id]);

  const html = useMemo(() => (convenio ? gerarHtmlRelatorio(convenio) : ""), [convenio]);

  const pendencias = useMemo(() => {
    if (!convenio) return [];
    return calcularProgresso(convenio)
      .filter((e) => e.pct < 100)
      .map((e) => ({
        id: e.id,
        pct: e.pct,
        itens: pendenciasDaEtapa(convenio, e.id).length,
      }));
  }, [convenio]);

  if (carregando) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!convenio) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <p className="text-[14px] font-medium text-foreground">Convênio não encontrado.</p>
        <Link to="/" className="mt-4 inline-block text-[12.5px] text-primary hover:underline">
          Voltar ao painel inicial
        </Link>
      </div>
    );
  }

  return (
    <div className="rise space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            to={`/convenio/${id}`}
            className="inline-flex items-center gap-1.5 text-[11.5px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar ao formulário
          </Link>
          <h1 className="mt-2 text-[21px] font-semibold tracking-[-0.02em] sm:text-[24px]">Relatório final</h1>
          <p className="mt-1 text-[12.5px] text-muted-foreground">
            Convênio {convenio.numero_convenio || convenio.numero} — {convenio.convenente || convenio.entidade}
          </p>
        </div>
        <button
          type="button"
          onClick={() => baixarRelatorio(convenio)}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-[12.5px] font-medium text-primary-foreground transition-colors hover:bg-[#085533]"
        >
          <Download className="h-3.5 w-3.5" />
          Baixar HTML
        </button>
      </div>

      {pendencias.length ? (
        <div className="rounded-[var(--radius)] border border-amber-200 bg-amber-50/70 px-4 py-3">
          <p className="text-[12px] font-medium text-amber-800">
            {pendencias.length} etapa(s) com pendências — o relatório será gerado com os campos em branco
            sinalizados.
          </p>
          <p className="mt-1 text-[11.5px] leading-relaxed text-amber-700">
            {pendencias
              .map((p) => `${ETAPAS.find((e) => e.id === p.id)?.titulo || p.id} (${p.items ?? p.itens} item(ns))`)
              .join(" · ")}
          </p>
        </div>
      ) : null}

      <div className="rounded-[var(--radius)] border border-border bg-card p-2">
        <iframe
          title="Prévia do relatório"
          srcDoc={html}
          className="h-[78vh] w-full rounded-md border-0 bg-white"
        />
      </div>

      <p className="text-[11px] text-muted-foreground">
        Arquivo gerado: <span className="num-mono">{nomeArquivoRelatorio(convenio)}</span> — pronto para anexar ao
        processo no Transferegov/SEI.
      </p>
    </div>
  );
}