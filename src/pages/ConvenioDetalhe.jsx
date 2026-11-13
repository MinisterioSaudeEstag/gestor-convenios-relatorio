import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, FileText, Loader2, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import EtapaNavegacao from "@/components/EtapaNavegacao";
import DocumentosPanel from "@/components/DocumentosPanel";
import AnaliseIAPanel from "@/components/AnaliseIAPanel";
import EtapaDados from "@/components/etapas/EtapaDados";
import EtapaQuestionario from "@/components/etapas/EtapaQuestionario";
import EtapaPadFinanceiro from "@/components/etapas/EtapaPadFinanceiro";
import EtapaCronoFisico from "@/components/etapas/EtapaCronoFisico";
import EtapaPadFisico from "@/components/etapas/EtapaPadFisico";
import EtapaConclusao from "@/components/etapas/EtapaConclusao";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  ETAPAS,
  QUESTIONARIO_FINANCEIRO,
  QUESTIONARIO_FISICO,
  QUESTIONARIO_LICITACAO,
  calcularProgresso,
  pendenciasDaEtapa,
  progressoGeral,
} from "@/lib/modelo";
import { listarDocumentos } from "@/services/api";

export default function ConvenioDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [convenio, setConvenio] = useState(null);
  const [documentos, setDocumentos] = useState([]);
  const [etapa, setEtapa] = useState("dados");
  const [carregando, setCarregando] = useState(true);
  const [pendencias, setPendencias] = useState(null);
  const [estadoSalvo, setEstadoSalvo] = useState("idle");
  const pendente = useRef({});
  const timer = useRef(null);

  const carregarDocs = async () => {
    try {
      const res = await listarDocumentos(id);
      setDocumentos(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error("Erro ao carregar documentos:", e);
    }
  };

  useEffect(() => {
    let ativo = true;
    const carregar = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/convenios`);
        const lista = await response.json();
        const c = lista.find((item) => String(item.id) === String(id));
        
        if (!ativo || !c) return;
        setConvenio(c);
        const progresso = calcularProgresso(c);
        const primeira = progresso.find((p) => p.pct < 100) || progresso[progresso.length - 1];
        setEtapa(primeira.id);
        await carregarDocs();
        if (ativo) setCarregando(false);
      } catch (e) {
        console.error("Erro ao carregar convênio:", e);
      }
    };
    carregar();
    return () => {
      ativo = false;
      clearTimeout(timer.current);
    };
  }, [id]);

  const salvar = async () => {
    const patch = pendente.current;
    pendente.current = {};
    if (!Object.keys(patch).length) return;
    setEstadoSalvo("salvando");
    try {
      await fetch(`http://localhost:3001/api/convenios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      setEstadoSalvo("salvo");
      setTimeout(() => setEstadoSalvo("idle"), 1600);
    } catch (e) {
      console.error("Erro ao salvar:", e);
      setEstadoSalvo("idle");
    }
  };

  const alterar = (patch) => {
    setConvenio((prev) => ({ ...prev, ...patch }));
    pendente.current = { ...pendente.current, ...patch };
    clearTimeout(timer.current);
    timer.current = setTimeout(salvar, 700);
  };

  const atualizarResposta = (etapaId, perguntaId, campo, valor) => {
    const atual = convenio[etapaId] || {};
    alterar({
      [etapaId]: { ...atual, [perguntaId]: { ...(atual[perguntaId] || {}), [campo]: valor } },
    });
  };

  const validar = () => {
    const faltando = pendenciasDaEtapa(convenio, etapa);
    if (faltando.length) {
      setPendencias(faltando);
      return false;
    }
    alterar({
      etapas: {
        ...(convenio.etapas || {}),
        [etapa]: { validada_em: new Date().toISOString(), por: user?.email || "" },
      },
    });
    return true;
  };

  const avancar = () => {
    if (!validar()) return;
    const indice = ETAPAS.findIndex((e) => e.id === etapa);
    if (indice < ETAPAS.length - 1) setEtapa(ETAPAS[indice + 1].id);
    else navigate(`/convenio/${id}/relatorio`);
  };

  const excluir = async () => {
    if (!window.confirm("Excluir este convênio e todos os seus documentos?")) return;
    try {
      await fetch(`http://localhost:3001/api/convenios/${id}`, { method: 'DELETE' });
      navigate("/");
    } catch (e) {
      console.error("Erro ao excluir convênio:", e);
    }
  };

  if (carregando || !convenio) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const progresso = calcularProgresso(convenio);
  const geral = progressoGeral(convenio);
  const meta = ETAPAS.find((e) => e.id === etapa);
  const infoEtapa = progresso.find((p) => p.id === etapa);
  const indice = ETAPAS.findIndex((e) => e.id === etapa);

  const renderEtapa = () => {
    if (etapa === "dados") return <EtapaDados convenio={convenio} onChange={alterar} />;
    if (etapa === "financeiro")
      return (
        <EtapaQuestionario
          etapa="financeiro"
          perguntas={QUESTIONARIO_FINANCEIRO}
          respostas={convenio.financeiro || {}}
          onResposta={atualizarResposta}
        />
      );
    if (etapa === "fisico")
      return (
        <EtapaQuestionario
          etapa="fisico"
          perguntas={QUESTIONARIO_FISICO}
          respostas={convenio.fisico || {}}
          onResposta={atualizarResposta}
        />
      );
    if (etapa === "licitacao")
      return (
        <EtapaQuestionario
          etapa="licitacao"
          perguntas={QUESTIONARIO_LICITACAO}
          respostas={convenio.licitacao || {}}
          onResposta={atualizarResposta}
        />
      );
    if (etapa === "pad_financeiro") return <EtapaPadFinanceiro convenio={convenio} onChange={alterar} />;
    if (etapa === "crono_fisico") return <EtapaCronoFisico convenio={convenio} onChange={alterar} />;
    if (etapa === "pad_fisico") return <EtapaPadFisico convenio={convenio} onChange={alterar} />;
    if (etapa === "conclusao") return <EtapaConclusao convenio={convenio} onChange={alterar} />;
    return null;
  };

  return (
    <div className="rise space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[11.5px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Convênios
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="num-mono text-[11.5px] tracking-[0.05em] text-muted-foreground">
              {convenio.numero_convenio || convenio.numero}
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-[2px] text-[9.5px] font-semibold uppercase tracking-[0.1em] text-primary">
              {geral}% preenchido
            </span>
          </div>
          <h1 className="mt-1 max-w-2xl truncate text-[21px] font-semibold tracking-[-0.02em] sm:text-[24px]">
            {convenio.convenente || convenio.entidade}
          </h1>
          <p className="mt-1 line-clamp-2 max-w-2xl text-[12.5px] leading-relaxed text-muted-foreground">
            {convenio.objeto || "Objeto não informado."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-[10.5px] text-muted-foreground sm:block">
            {estadoSalvo === "salvando" ? "Salvando…" : estadoSalvo === "salvo" ? "Salvo" : ""}
          </span>
          <button
            type="button"
            onClick={excluir}
            title="Excluir convênio"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <Link
            to={`/convenio/${id}/relatorio`}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[12.5px] font-medium text-primary-foreground transition-colors hover:bg-[#085533]"
          >
            <FileText className="h-3.5 w-3.5" />
            Relatório final
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[206px_minmax(0,1fr)]">
        <EtapaNavegacao
          progresso={progresso}
          etapaAtual={etapa}
          etapasValidadas={convenio.etapas || {}}
          onSelecionar={setEtapa}
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_318px] xl:items-start">
          <div className="min-w-0">
            <div className="rounded-[var(--radius)] border border-border bg-card p-5 sm:p-6">
              <header className="flex items-start justify-between gap-4 border-b border-border pb-4">
                <div>
                  <p className="num-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {meta.romano}
                  </p>
                  <h2 className="mt-1 text-[16px] font-semibold tracking-tight">{meta.titulo}</h2>
                </div>
                <span className="num-mono shrink-0 rounded-full border border-border px-2.5 py-1 text-[10.5px] text-muted-foreground">
                  {infoEtapa?.pct ?? 0}%
                </span>
              </header>

              <div className="mt-5">{renderEtapa()}</div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                disabled={indice === 0}
                onClick={() => setEtapa(ETAPAS[indice - 1].id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-[12.5px] font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Anterior
              </button>

<button
                type="button"
                onClick={avancar}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-[12.5px] font-medium text-primary-foreground transition-colors hover:bg-[#085533]"
              >
                {indice === ETAPAS.length - 1 ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Validar e gerar relatório
                  </>
                ) : (
                  <>
                    Validar e avançar
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          <aside className="space-y-4">
            <AnaliseIAPanel
              convenio={convenio}
              etapa={etapa}
              documentos={documentos}
              onAplicarPatch={alterar}
            />
            <DocumentosPanel convenioId={id} documentos={documentos} onAtualizar={carregarDocs} />
          </aside>
        </div>
      </div>

      <Dialog open={Boolean(pendencias)} onOpenChange={(open) => !open && setPendencias(null)}>
        <DialogContent className="max-w-md">
          <DialogTitle className="flex items-center gap-2 text-[15px] font-semibold">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            Etapa incompleta
          </DialogTitle>
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
            Para avançar, conclua os itens abaixo nesta etapa:
          </p>
          <ul className="mt-3 max-h-[240px] space-y-1 overflow-y-auto rounded-lg border border-border bg-muted/40 px-3 py-2">
            {(pendencias || []).map((p) => (
              <li key={p} className="text-[12px] text-foreground/80">
                · {p}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setPendencias(null)}
              className="rounded-full bg-primary px-4 py-2 text-[12.5px] font-medium text-primary-foreground transition-colors hover:bg-[#085533]"
            >
              Entendi
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}