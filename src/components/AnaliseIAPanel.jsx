import React, { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import SugestaoIA from "@/components/SugestaoIA";
import { montarPatch } from "@/lib/ia";
import { ETAPAS } from "@/lib/modelo";

export default function AnaliseIAPanel({ convenio, etapa, documentos, onAplicarPatch }) {
  const [ids, setIds] = useState(null);
  const [sugestoes, setSugestoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [analisando, setAnalisando] = useState(false);
  const [aplicando, setAplicando] = useState(false);
  const [erro, setErro] = useState("");

  const selecionados = ids === null ? documentos : documentos.filter((d) => ids.includes(d.id));

  const carregar = async () => {
    setCarregando(true);
    try {
      const response = await fetch(`http://localhost:3001/api/convenios/${convenio.id}/sugestoes?etapa=${etapa}`);
      if (response.ok) {
        const data = await response.json();
        setSugestoes(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error("Erro ao carregar sugestões:", e);
      setSugestoes([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (!convenio?.id) return;
    setIds(null);
    setErro("");
    carregar();
  }, [etapa, convenio?.id]);

  const alternarDoc = (id) => {
    const base = ids === null ? documentos.map((d) => d.id) : ids;
    setIds(base.includes(id) ? base.filter((x) => x !== id) : [...base, id]);
  };

  const analisar = async () => {
    setAnalisando(true);
    setErro("");
    try {
      const etapaAtual = ETAPAS?.find((e) => e.id === etapa);
      const camposEtapa = etapaAtual?.campos?.map((c) => c.chave || c.id || c.name).filter(Boolean) || [];

      const response = await fetch(`http://localhost:3001/api/convenios/${convenio.id}/analisar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          etapa,
          documentosIds: selecionados.map((d) => d.id),
          camposEtapa,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Não foi possível concluir a análise com Gemini.");
      }

      await carregar();
    } catch (e) {
      setErro(e?.message || "Não foi possível concluir a análise.");
    } finally {
      setAnalisando(false);
    }
  };

  const aplicar = async (sugestao, chaves, incluirEquipamentos) => {
    setAplicando(true);
    try {
      const patch = montarPatch(convenio, sugestao, chaves, incluirEquipamentos);
      onAplicarPatch(patch);
      
      await fetch(`http://localhost:3001/api/sugestoes/${sugestao.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "aplicada" }),
      });
      await carregar();
    } catch (e) {
      console.error("Erro ao aplicar sugestão:", e);
    } finally {
      setAplicando(false);
    }
  };

  const descartar = async (sugestao) => {
    try {
      await fetch(`http://localhost:3001/api/sugestoes/${sugestao.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "descartada" }),
      });
      await carregar();
    } catch (e) {
      console.error("Erro ao descartar sugestão:", e);
    }
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h3 className="flex items-center gap-1.5 text-xs font-semibold text-gray-800">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          Análise assistida
        </h3>
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Gemini IA</span>
      </div>

      <div className="space-y-3 px-4 py-3">
        <p className="text-[11.5px] leading-relaxed text-gray-500">
          A IA lê os documentos anexados e devolve os campos desta etapa como sugestão. Nada é gravado no convênio
          sem a sua validação.
        </p>

        {documentos.length ? (
          <div className="max-h-[132px] space-y-0.5 overflow-y-auto rounded-lg border border-gray-200 px-2 py-1.5 bg-gray-50/50">
            {documentos.map((doc) => (
              <label key={doc.id} className="flex cursor-pointer items-center gap-2 py-[3px]">
                <input
                  type="checkbox"
                  checked={selecionados.some((d) => d.id === doc.id)}
                  onChange={() => alternarDoc(doc.id)}
                  className="h-3.5 w-3.5 shrink-0 rounded border-gray-300 text-emerald-700 focus:ring-emerald-600"
                />
                <span className="truncate text-[11px] text-gray-700" title={doc.nome}>
                  {doc.nome}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-gray-200 px-2.5 py-2 text-[11px] text-gray-400 text-center">
            Anexe os documentos do convênio para iniciar a extração.
          </p>
        )}

        <button
          type="button"
          onClick={analisar}
          disabled={analisando || !selecionados.length}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-emerald-800 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-900 disabled:opacity-50"
        >
          {analisando ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Lendo documentos…
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              Analisar {selecionados.length ? `${selecionados.length} documento(s)` : "documentos"}
            </>
          )}
        </button>

        {erro ? <p className="text-[11px] leading-relaxed text-red-600">{erro}</p> : null}

        {carregando ? (
          <p className="py-2 text-center text-[11px] text-gray-400">Carregando sugestões…</p>
        ) : sugestoes.length ? (
          <div className="space-y-2">
            {sugestoes.map((sugestao) => (
              <SugestaoIA
                key={sugestao.id}
                sugestao={sugestao}
                aplicando={aplicando}
                onAplicar={(chaves, equip) => aplicar(sugestao, chaves, equip)}
                onDescartar={() => descartar(sugestao)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}