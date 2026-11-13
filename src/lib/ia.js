import { CAMPOS_DADOS, QUESTIONARIOS } from "@/lib/modelo";

const ROTULOS_EXTRAS = {
  percentual_execucao: "Percentual executado (%)",
  texto: "Texto da resposta",
  justificativa: "Justificativa",
  resultado: "Resultado da análise",
  execucao_fisica: "Execução física (%)",
  execucao_financeira: "Execução financeira (%)",
  constatacoes: "Constatações",
  recomendacoes: "Recomendações",
};

export function rotuloCampo(etapa, chave) {
  if (etapa === "dados") {
    const meta = CAMPOS_DADOS.find((f) => f.key === chave);
    return meta ? meta.label : chave;
  }
  if (QUESTIONARIOS[etapa]) {
    const [id, sub] = chave.split(".");
    const pergunta = QUESTIONARIOS[etapa].find((q) => q.id === id);
    const nome = pergunta ? `${id} · ${pergunta.titulo}` : id;
    const sufixo = sub === "resposta" ? "resposta" : sub === "texto" ? "texto" : sub;
    return `${nome} (${sufixo})`;
  }
  return ROTULOS_EXTRAS[chave] || chave;
}

export function valorExibivel(etapa, chave, valor) {
  if (valor === undefined || valor === null || String(valor).trim() === "") return "—";
  const v = String(valor);
  if (etapa !== "dados" && chave.endsWith(".resposta")) {
    return { sim: "SIM", nao: "NÃO", na: "NÃO SE APLICA" }[v] || v;
  }
  return v;
}

/** Converte "R$ 1.234,56" / "1,234.56" / 1234.56 em número. */
export function parseNumero(valor) {
  if (valor === null || valor === undefined || valor === "") return undefined;
  if (typeof valor === "number") return valor;
  const limpo = String(valor)
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");
  const n = Number(limpo);
  return Number.isNaN(n) ? undefined : n;
}

export function normalizarData(valor) {
  if (!valor) return "";
  const v = String(valor).trim();
  const br = v.match(/^(\d{2})[/.-](\d{2})[/.-](\d{4})$/);
  if (br) return `${br[3]}-${br[2]}-${br[1]}`;
  const iso = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  return v;
}

/** Monta o patch a ser salvo no convênio a partir da sugestão validada. */
export function montarPatch(convenio, sugestao, selecionados, aplicarEquipamentos) {
  const etapa = sugestao.etapa;
  const campos = sugestao.campos || {};
  const patch = {};

  if (QUESTIONARIOS[etapa]) {
    const atual = { ...(convenio[etapa] || {}) };
    selecionados.forEach((chave) => {
      const [id, sub] = chave.split(".");
      if (!sub) return;
      atual[id] = { ...(atual[id] || {}), [sub]: campos[chave] };
    });
    patch[etapa] = atual;
    return patch;
  }

  if (etapa === "dados") {
    selecionados.forEach((chave) => {
      const meta = CAMPOS_DADOS.find((f) => f.key === chave);
      let valor = campos[chave];
      if (meta?.tipo === "moeda") valor = parseNumero(valor) ?? valor;
      if (meta?.tipo === "data") valor = normalizarData(valor);
      patch[chave] = valor;
    });
    if (aplicarEquipamentos && (sugestao.equipamentos || []).length) {
      patch.planilha = sugestao.equipamentos.map((item) => ({
        item: item.item || "",
        quantidade_aprovada: parseNumero(item.quantidade_aprovada) ?? null,
        valor_unitario_aprovado: parseNumero(item.valor_unitario_aprovado) ?? null,
        quantidade_adquirida: parseNumero(item.quantidade_adquirida) ?? null,
        valor_unitario_adquirido: parseNumero(item.valor_unitario_adquirido) ?? null,
        fornecedor: item.fornecedor || "",
        nota_fiscal: item.nota_fiscal || "",
        data_nf: normalizarData(item.data_nf),
        data_pagamento: "",
      }));
    }
    return patch;
  }

  const atual = { ...(convenio[etapa] || {}) };
  selecionados.forEach((chave) => {
    atual[chave] = campos[chave];
  });
  patch[etapa] = atual;
  return patch;
}