import React, { useEffect, useState } from "react";
import { AlertTriangle, CheckCheck, Sparkles, X } from "lucide-react";
import { CAMPOS_DADOS, QUESTIONARIOS } from "@/lib/modelo";

const CONFIANCA = {
  alta: "bg-emerald-50 text-emerald-700 border-emerald-200",
  media: "bg-amber-50 text-amber-700 border-amber-200",
  baixa: "bg-red-50 text-red-700 border-red-200",
};

const rotuloCurto = (etapa, chave) => {
  if (etapa === "dados") {
    const meta = CAMPOS_DADOS.find((f) => f.key === chave);
    return meta ? meta.label : chave;
  }
  const [id, sub] = String(chave).split(".");
  return sub ? `${id} · ${sub === "resposta" ? "resposta" : "texto"}` : chave;
};

const rotuloLongo = (etapa, chave) => {
  if (etapa === "dados") return chave;
  const [id] = String(chave).split(".");
  const pergunta = (QUESTIONARIOS[etapa] || []).find((q) => q.id === id);
  return pergunta ? pergunta.titulo : "";
};

const parseDadosSugestao = (sugestao) => {
  let raw = sugestao?.dados;
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw);
    } catch {
      raw = {};
    }
  }
  const base = raw && typeof raw === "object" ? raw : {};
  return {
    campos: base.campos && typeof base.campos === "object" ? base.campos : (sugestao?.campos || {}),
    confianca: base.confianca || sugestao?.confianca || "media",
    resumo: base.resumo || sugestao?.resumo || "",
    lacunas: Array.isArray(base.lacunas) ? base.lacunas : (sugestao?.lacunas || []),
    equipamentos: Array.isArray(base.equipamentos) ? base.equipamentos : (sugestao?.equipamentos || []),
  };
};

export default function SugestaoIA({ sugestao, onAplicar, onDescartar, aplicando }) {
  const normalizada = parseDadosSugestao(sugestao);
  const campos = normalizada.campos;
  const chaves = Object.keys(campos);
  const equipamentos = normalizada.equipamentos;
  const [selecionados, setSelecionados] = useState(chaves);
  const [incluirEquipamentos, setIncluirEquipamentos] = useState(true);

  useEffect(() => {
    setSelecionados(Object.keys(parseDadosSugestao(sugestao).campos));
    setIncluirEquipamentos(true);
  }, [sugestao?.id]);

  const alternar = (chave) => {
    setSelecionados((prev) =>
      prev.includes(chave) ? prev.filter((c) => c !== chave) : [...prev, chave]
    );
  };

  return (
    <div className="rounded-[var(--radius)] border border-primary/25 bg-primary/[0.03]">
      <div className="flex items-start justify-between gap-2 border-b border-primary/15 px-3.5 py-2.5">
        <div className="flex items-center gap-1.5 text-[11.5px] font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Sugestão de preenchimento
        </div>
        <span
          className={`rounded-full border px-2 py-[1px] text-[9.5px] font-semibold uppercase tracking-[0.08em] ${
            CONFIANCA[normalizada.confianca] || CONFIANCA.media
          }`}
        >
          confiança {normalizada.confianca || "media"}
        </span>
      </div>

      <div className="space-y-3 px-3.5 py-3">
        {normalizada.resumo ? (
          <p className="text-[11.5px] leading-relaxed text-foreground/80">{normalizada.resumo}</p>
        ) : null}

        {normalizada.lacunas.length ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50/70 px-2.5 py-2">
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-amber-700">
              <AlertTriangle className="h-3 w-3" />
              Não encontrado nos documentos
            </p>
            <ul className="mt-1 space-y-0.5">
              {normalizada.lacunas.map((lacuna, i) => (
                <li key={i} className="text-[11px] leading-relaxed text-amber-800">
                  · {lacuna}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {chaves.length ? (
          <div className="max-h-[320px] space-y-1 overflow-y-auto pr-1">
            {chaves.map((chave) => {
              const marcado = selecionados.includes(chave);
              const longo = rotuloLongo(sugestao.etapa, chave);
              return (
                <label
                  key={chave}
                  className="flex cursor-pointer items-start gap-2 rounded-md px-1.5 py-1 hover:bg-card"
                >
                  <input
                    type="checkbox"
                    checked={marcado}
                    onChange={() => alternar(chave)}
                    className="mt-[3px] h-3.5 w-3.5 shrink-0 accent-[#0a6640]"
                  />
                  <span className="min-w-0">
                    <span className="block text-[11px] font-medium text-foreground">
                      {rotuloCurto(sugestao.etapa, chave)}
                    </span>
                    {longo ? (
                      <span className="block truncate text-[10px] text-muted-foreground" title={longo}>
                        {longo}
                      </span>
                    ) : null}
                    <span className="mt-0.5 block break-words text-[11.5px] text-foreground/70">
                      {String(campos[chave]).length > 220
                        ? `${String(campos[chave]).slice(0, 220)}…`
                        : campos[chave]}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        ) : (
          <p className="text-[11.5px] text-muted-foreground">
            Nenhum campo pôde ser comprovado pela documentação enviada.
          </p>
        )}

        {equipamentos.length ? (
          <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-border bg-card px-2.5 py-2">
            <input
              type="checkbox"
              checked={incluirEquipamentos}
              onChange={(e) => setIncluirEquipamentos(e.target.checked)}
              className="mt-[3px] h-3.5 w-3.5 shrink-0 accent-[#0a6640]"
            />
            <span className="text-[11px] text-foreground">
              Substituir a planilha de equipamentos por{" "}
              <strong className="font-semibold">{equipamentos.length} itens</strong> extraídos
            </span>
          </label>
        ) : null}

        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <button
            type="button"
            disabled={aplicando || (!selecionados.length && !(equipamentos.length && incluirEquipamentos))}
            onClick={() => onAplicar(selecionados, Boolean(equipamentos.length && incluirEquipamentos))}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[11.5px] font-medium text-primary-foreground transition-colors hover:bg-[#085533] disabled:opacity-50"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Aplicar selecionados
          </button>
          <button
            type="button"
            disabled={aplicando}
            onClick={onDescartar}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-[11.5px] font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5" />
            Descartar
          </button>
        </div>
      </div>
    </div>
  );
}