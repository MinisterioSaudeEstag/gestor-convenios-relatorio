import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus, Search, SlidersHorizontal } from "lucide-react";
import ConvenioCard from "@/components/ConvenioCard";
import NovoConvenioDialog from "@/components/NovoConvenioDialog";
import { listarConvenios } from "@/services/api";
import { calcularProgresso, formatarMoeda, progressoGeral } from "@/lib/modelo";

const FILTROS = [
  { value: "todos", label: "Todos" },
  { value: "analise", label: "Em análise" },
  { value: "concluidos", label: "Concluídos" },
];

export default function Home() {
  const navigate = useNavigate();
  const [convenios, setConvenios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [novoAberto, setNovoAberto] = useState(false);

  const carregarDados = async () => {
    try {
      setCarregando(true);
      const dados = await listarConvenios();
      setConvenios(Array.isArray(dados) ? dados : []);
    } catch (e) {
      console.error("Erro ao carregar convênios do NeonDB:", e);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return convenios.filter((c) => {
      const bateBusca =
        !termo ||
        [c.numero_convenio, c.convenente, c.objeto, c.municipio]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(termo));
      const geral = progressoGeral(c);
      const bateFiltro =
        filtro === "todos" ||
        (filtro === "concluidos" && geral >= 100) ||
        (filtro === "analise" && geral < 100);
      return bateBusca && bateFiltro;
    });
  }, [convenios, busca, filtro]);

  const stats = useMemo(() => {
    const emAnalise = convenios.filter((c) => progressoGeral(c) < 100).length;
    const etapasConcluidas = convenios.reduce(
      (acc, c) => acc + calcularProgresso(c).filter((e) => e.pct >= 100).length,
      0
    );
    const valorTotal = convenios.reduce((acc, c) => acc + (Number(c.valor_global) || 0), 0);
    return [
      { label: "Convênios no painel", value: convenios.length },
      { label: "Em análise", value: emAnalise },
      { label: "Etapas concluídas", value: `${etapasConcluidas}/${convenios.length * 8 || 0}` },
      { label: "Valor global", value: formatarMoeda(valorTotal) },
    ];
  }, [convenios]);

  return (
    <div className="rise space-y-8">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label-eyebrow">Divisão de Convênios (NeonDB)</p>
          <h1 className="mt-2 text-[26px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[32px]">
            Relatório de Acompanhamento
            <span className="block text-primary">Físico / Financeiro</span>
          </h1>
          <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-muted-foreground">
            Preencha as 8 etapas do modelo, anexe os documentos e gere o relatório final integrado ao banco de dados.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setNovoAberto(true)}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-medium text-primary-foreground shadow-sm transition-all hover:-translate-y-px hover:bg-[#085533] active:translate-y-0"
        >
          <Plus className="h-4 w-4" strokeWidth={2.2} />
          Novo convênio
        </button>
      </header>

      <section className="grid grid-cols-2 divide-border overflow-hidden rounded-[var(--radius)] border border-border bg-card sm:grid-cols-4 sm:divide-x">
        {stats.map((s) => (
          <div key={s.label} className="px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {s.label}
            </p>
            <p className="num-mono mt-1.5 text-[19px] font-semibold tracking-tight">{s.value}</p>
          </div>
        ))}
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-[320px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nº, entidade ou objeto"
            className="h-10 w-full rounded-full border border-border bg-card pl-10 pr-4 text-[13px] outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
          />
        </div>
        <div className="flex items-center gap-1 self-start rounded-full border border-border bg-card p-1">
          <SlidersHorizontal className="ml-2 mr-1 h-3.5 w-3.5 text-muted-foreground" />
          {FILTROS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFiltro(f.value)}
              className={`rounded-full px-3 py-1.5 text-[12px] transition-colors ${
                filtro === f.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <section className="space-y-3">
        {carregando ? (
          <div className="flex items-center justify-center rounded-[var(--radius)] border border-border bg-card py-20">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : lista.length ? (
          lista.map((c) => <ConvenioCard key={c.id} convenio={c} />)
        ) : (
          <div className="rounded-[var(--radius)] border border-dashed border-border bg-card/60 px-6 py-16 text-center">
            <p className="text-[14px] font-medium">
              {convenios.length ? "Nenhum convênio encontrado" : "Nenhum convênio cadastrado"}
            </p>
            <p className="mx-auto mt-1 max-w-sm text-[12.5px] leading-relaxed text-muted-foreground">
              {convenios.length
                ? "Ajuste a busca ou o filtro para localizar o instrumento."
                : "Cadastre o primeiro convênio para iniciar a análise das 8 etapas."}
            </p>
            {!convenios.length ? (
              <button
                type="button"
                onClick={() => setNovoAberto(true)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[12.5px] font-medium text-primary-foreground transition-colors hover:bg-[#085533]"
              >
                <Plus className="h-3.5 w-3.5" />
                Novo convênio
              </button>
            ) : null}
          </div>
        )}
      </section>

      <NovoConvenioDialog
        open={novoAberto}
        onOpenChange={setNovoAberto}
        onCriado={(id) => {
          carregarDados();
          navigate(`/convenio/${id}`);
        }}
      />
    </div>
  );
}