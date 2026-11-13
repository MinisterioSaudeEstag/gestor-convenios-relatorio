import {
  QUESTIONARIO_FINANCEIRO,
  QUESTIONARIO_FISICO,
  QUESTIONARIO_LICITACAO,
  ROTULOS_RESPOSTA,
  TEXTO_RECOMENDACAO_SCNES,
  formatarData,
  formatarMoeda,
} from "@/lib/modelo";

const esc = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const textoOuTraco = (v) => (v && String(v).trim() ? esc(v) : '<span class="vazio">Não informado.</span>');

const paragrafos = (v) =>
  String(v || "")
    .split(/\n{2,}/)
    .filter((p) => p.trim())
    .map((p) => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`)
    .join("");

const classeResposta = (r) => (r === "sim" ? "sim" : r === "nao" ? "nao" : "na");

function blocoPerguntas(perguntas, respostas = {}) {
  return perguntas
    .map((q) => {
      const r = respostas[q.id] || {};
      const rotulo = ROTULOS_RESPOSTA[r.resposta];
      return `<div class="questao">
        <p class="questao-titulo"><span class="questao-id">${esc(q.id)}</span> ${esc(q.titulo)}</p>
        ${
          rotulo
            ? `<p class="questao-resposta"><span class="tag ${classeResposta(r.resposta)}">${rotulo}</span></p>`
            : `<p class="questao-resposta"><span class="tag pendente">SEM RESPOSTA REGISTRADA</span></p>`
        }
        <div class="questao-texto">${r.texto ? paragrafos(r.texto) : '<p class="vazio">Sem texto de resposta.</p>'}</div>
      </div>`;
    })
    .join("");
}

function tabelaPlanilha(itens = []) {
  const linhas = itens.filter((i) => i && (i.item || i.quantidade_adquirida));
  if (!linhas.length) return '<p class="vazio">Planilha de equipamentos não informada.</p>';
  const corpo = linhas
    .map((i) => {
      const totalAdq =
        (Number(i.quantidade_adquirida) || 0) * (Number(i.valor_unitario_adquirido) || 0);
      return `<tr>
        <td>${esc(i.item || "—")}</td>
        <td class="num">${esc(i.quantidade_aprovada ?? "—")}</td>
        <td class="num">${i.valor_unitario_aprovado ? formatarMoeda(i.valor_unitario_aprovado) : "—"}</td>
        <td class="num">${esc(i.quantidade_adquirida ?? "—")}</td>
        <td class="num">${i.valor_unitario_adquirido ? formatarMoeda(i.valor_unitario_adquirido) : "—"}</td>
        <td class="num">${totalAdq ? formatarMoeda(totalAdq) : "—"}</td>
        <td>${esc(i.fornecedor || "—")}</td>
        <td>${esc(i.nota_fiscal || "—")}${i.data_nf ? `<br><span class="mini">${formatarData(i.data_nf)}</span>` : ""}</td>
      </tr>`;
    })
    .join("");

  return `<table class="planilha">
    <thead>
      <tr>
        <th>Equipamento</th><th class="num">Qtd. aprov.</th><th class="num">Vlr. unit. aprov.</th>
        <th class="num">Qtd. adquir.</th><th class="num">Vlr. unit. adquir.</th><th class="num">Total adquir.</th>
        <th>Fornecedor</th><th>NF / data</th>
      </tr>
    </thead>
    <tbody>${corpo}</tbody>
  </table>`;
}

const ESTILO = `
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: 'IBM Plex Sans', Arial, Helvetica, sans-serif; color: #1a1f2b; font-size: 11.5pt; line-height: 1.55; margin: 0; padding: 32px 40px 56px; background: #fff; }
  .cabecalho { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; border-bottom: 2.5px solid #0a6640; padding-bottom: 14px; }
  .orgao { font-size: 8.5pt; letter-spacing: .14em; text-transform: uppercase; color: #5a6470; line-height: 1.6; }
  .orgao strong { display: block; color: #0a6640; font-size: 9.5pt; letter-spacing: .12em; }
  .documento { text-align: right; font-size: 8.5pt; color: #5a6470; }
  h1 { font-size: 14.5pt; font-weight: 600; letter-spacing: -.01em; margin: 22px 0 4px; color: #0a6640; }
  .subtitulo { font-size: 10.5pt; color: #5a6470; margin: 0 0 18px; }
  h2 { font-size: 10pt; letter-spacing: .12em; text-transform: uppercase; color: #fff; background: #0a6640; padding: 7px 12px; margin: 26px 0 14px; border-radius: 3px; page-break-after: avoid; }
  h3 { font-size: 10.5pt; margin: 16px 0 6px; color: #0a6640; }
  p { margin: 0 0 9px; text-align: justify; }
  .meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px 22px; margin: 4px 0 6px; }
  .meta div { border-left: 2px solid #c3e6d4; padding-left: 9px; }
  .meta dt { font-size: 7.5pt; letter-spacing: .12em; text-transform: uppercase; color: #5a6470; margin-bottom: 1px; }
  .meta dd { margin: 0; font-size: 10pt; font-weight: 500; }
  .questao { border: 1px solid #d0d5db; border-radius: 5px; padding: 10px 12px; margin-bottom: 10px; page-break-inside: avoid; }
  .questao-titulo { font-size: 10pt; font-weight: 500; margin: 0 0 6px; }
  .questao-id { font-family: 'IBM Plex Mono', monospace; font-size: 8.5pt; font-weight: 600; color: #0a6640; background: #e6f4ee; border: 1px solid #c3e6d4; border-radius: 3px; padding: 1px 5px; margin-right: 4px; }
  .questao-resposta { margin: 0 0 6px; }
  .questao-texto p { font-size: 10pt; margin: 0 0 6px; }
  .tag { display: inline-block; font-family: 'IBM Plex Mono', monospace; font-size: 8pt; font-weight: 600; letter-spacing: .06em; padding: 2px 8px; border-radius: 3px; border: 1px solid; }
  .tag.sim { background: #ecfdf5; border-color: #6ee7b7; color: #065f46; }
  .tag.nao { background: #fef2f2; border-color: #fca5a5; color: #b91c1c; }
  .tag.na { background: #f8fafc; border-color: #cbd5e1; color: #475569; }
  .tag.pendente { background: #fffbeb; border-color: #fcd34d; color: #92400e; }
  .vazio { color: #8a94a3; font-style: italic; font-size: 10pt; }
  .mini { font-size: 8pt; color: #5a6470; }
  table.planilha { width: 100%; border-collapse: collapse; font-size: 8.8pt; margin: 8px 0 4px; }
  table.planilha th { background: #f0f2f4; border: 1px solid #d0d5db; padding: 6px; text-align: left; font-size: 7.8pt; letter-spacing: .04em; text-transform: uppercase; color: #374151; }
  table.planilha td { border: 1px solid #d0d5db; padding: 6px; vertical-align: top; }
  table.planilha td.num, table.planilha th.num { text-align: right; font-variant-numeric: tabular-nums; }
  .equipamento { border-left: 3px solid #c3e6d4; padding: 2px 0 2px 11px; margin-bottom: 10px; page-break-inside: avoid; }
  .equipamento strong { display: block; font-size: 10pt; }
  .equipamento span { display: block; font-size: 9.5pt; color: #5a6470; }
  .destaque { display: flex; gap: 26px; margin: 6px 0 14px; }
  .destaque .bloco { border: 1px solid #d0d5db; border-radius: 5px; padding: 8px 16px; }
  .destaque .rotulo { display: block; font-size: 7.5pt; letter-spacing: .12em; text-transform: uppercase; color: #5a6470; }
  .destaque .valor { display: block; margin-top: 2px; font-family: 'IBM Plex Mono', monospace; font-size: 15pt; font-weight: 600; color: #0a6640; }
  .assinatura { margin-top: 44px; page-break-inside: avoid; }
  .assinatura .local { font-size: 10pt; margin-bottom: 40px; }
  .assinatura .linha { border-top: 1px solid #1a1f2b; width: 320px; padding-top: 5px; font-size: 9.5pt; text-align: center; }
  .rodape { margin-top: 30px; border-top: 1px solid #d0d5db; padding-top: 8px; font-size: 8pt; color: #8a94a3; }
`;

export function gerarHtmlRelatorio(convenio) {
  const c = convenio || {};
  const emissao = new Date().toLocaleDateString("pt-BR");
  const itens = (c.planilha || []).filter((i) => i && (i.item || i.quantidade_adquirida));
  const padFin = c.pad_financeiro || {};
  const crono = c.crono_fisico || {};
  const padFis = c.pad_fisico || {};
  const concl = c.conclusao || {};

  const intro = `
    <p>Trata-se da elaboração de Relatório de Acompanhamento Físico/Financeiro referente ao cumprimento do objeto do convênio nº
    ${textoOuTraco(c.numero)} da ${textoOuTraco(c.entidade)}, cujo objeto é ${esc((c.objeto || "").toUpperCase() || "—")},
    com valor global ${formatarMoeda(c.valor_global)}, sendo ${formatarMoeda(c.valor_concedente)} do concedente e
    ${formatarMoeda(c.valor_contrapartida)} de contrapartida.</p>
    <p>Foi executado ${formatarMoeda(c.valor_executado)}, cuja data de vigência foi de ${formatarData(c.vigencia_inicio)}
    a ${formatarData(c.vigencia_fim)}, em cumprimento ao que determina o ${textoOuTraco(c.oficio_circular)}.</p>
    <p>As informações constantes neste relatório foram obtidas a partir dos dados coletados dos documentos que se encontram no
    Transferegov. Foi elaborada ${textoOuTraco(c.nota_tecnica)}.</p>`;

  const padFinanceiro = `
    <p>As Notas Fiscais/Documentações descritas na ABA – PAD Financeiro demonstram conformidade das aquisições em relação ao
    Plano de Trabalho Aprovado.</p>
    <p><strong>Conforme.</strong> Justificativa: ${textoOuTraco(padFin.justificativa)}</p>
    ${
      itens.length
        ? itens
            .map((i) => {
              const total =
                (Number(i.quantidade_adquirida) || 0) * (Number(i.valor_unitario_adquirido) || 0);
              return `<div class="equipamento">
                <strong>${esc(i.item || "Equipamento")}</strong>
                <span>Quantidade aprovada: ${esc(i.quantidade_aprovada ?? "—")}</span>
                <span>Valor unitário adquirido: ${i.valor_unitario_adquirido ? formatarMoeda(i.valor_unitario_adquirido) : "—"}</span>
                <span>Valor total de aquisição: ${total ? formatarMoeda(total) : "—"}</span>
              </div>`;
            })
            .join("")
        : '<p class="vazio">Nenhum equipamento registrado na planilha.</p>'
    }`;

  const cronoFisico = `
    ${
      crono.percentual_execucao !== undefined && crono.percentual_execucao !== ""
        ? `<p><strong>Execução física: ${esc(crono.percentual_execucao)}%.</strong></p>`
        : ""
    }
    ${crono.texto ? paragrafos(crono.texto) : '<p class="vazio">Texto da execução física não informado.</p>'}`;

  const padFisico = `
    ${
      padFis.resultado
        ? `<p><strong>${padFis.resultado === "conforme" ? "Conforme" : "Não conforme"}.</strong></p>`
        : ""
    }
    ${padFis.texto ? paragrafos(padFis.texto) : '<p class="vazio">Análise física não informada.</p>'}`;

  const conclusao = `
    <div class="destaque">
      <div class="bloco"><span class="rotulo">Execução física</span><span class="valor">${esc(concl.execucao_fisica || "—")}%</span></div>
      <div class="bloco"><span class="rotulo">Execução financeira</span><span class="valor">${esc(concl.execucao_financeira || "—")}%</span></div>
    </div>
    <h3>C1 — Constatações</h3>
    ${concl.constatacoes ? paragrafos(concl.constatacoes) : '<p class="vazio">Nenhuma constatação registrada.</p>'}
    <h3>C2 — Recomendações</h3>
    ${concl.recomendacoes ? paragrafos(concl.recomendacoes) : ""}
    <p>${esc(TEXTO_RECOMENDACAO_SCNES)}</p>`;

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Relatório de Acompanhamento — Convênio ${esc(c.numero || "")}</title>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>${ESTILO}</style>
</head>
<body>
  <div class="cabecalho">
    <div class="orgao"><strong>Ministério da Saúde</strong>Fundo Nacional de Saúde<br>Divisão de Convênios</div>
    <div class="documento">Emitido em ${emissao}<br>${esc(c.processo_sei || "")}</div>
  </div>

  <h1>RELATÓRIO DE ACOMPANHAMENTO FÍSICO/FINANCEIRO</h1>
  <p class="subtitulo">Convênio nº ${esc(c.numero || "—")} — ${esc(c.entidade || "—")}</p>

  <div class="meta">
    <div><dt>Entidade convenente</dt><dd>${esc(c.entidade || "—")}</dd></div>
    <div><dt>CNPJ</dt><dd>${esc(c.cnpj || "—")}</dd></div>
    <div><dt>Município / UF</dt><dd>${esc(c.municipio || "—")}</dd></div>
    <div><dt>Vigência</dt><dd>${formatarData(c.vigencia_inicio)} a ${formatarData(c.vigencia_fim)}</dd></div>
    <div><dt>Valor global</dt><dd>${formatarMoeda(c.valor_global)}</dd></div>
    <div><dt>Responsável técnico</dt><dd>${esc(c.responsavel || "—")}</dd></div>
  </div>

  <h2>I — Aba Dados</h2>
  ${intro}

  <h2>Anexo — Planilha de Equipamentos</h2>
  ${tabelaPlanilha(itens)}

  <h2>II — Questionário Financeiro</h2>
  ${blocoPerguntas(QUESTIONARIO_FINANCEIRO, c.financeiro)}

  <h2>III — PAD Financeiro</h2>
  ${padFinanceiro}

  <h2>IV — Questionário Físico</h2>
  ${blocoPerguntas(QUESTIONARIO_FISICO, c.fisico)}

  <h2>V — Crono Físico</h2>
  ${cronoFisico}

  <h2>VI — PAD Físico</h2>
  ${padFisico}

  <h2>VII — Processos de Licitação</h2>
  ${blocoPerguntas(QUESTIONARIO_LICITACAO, c.licitacao)}

  <h2>VIII — Conclusão</h2>
  ${conclusao}

  <div class="assinatura">
    <p class="local">${esc(c.municipio || "Recife")}, ${emissao}.</p>
    <div class="linha">${esc(c.responsavel || "Responsável técnico")}<br>Divisão de Convênios</div>
  </div>

  <div class="rodape">Documento gerado pelo sistema de Acompanhamento de Convênios — modelo institucional de 8 etapas.</div>
</body>
</html>`;
}

export function nomeArquivoRelatorio(convenio) {
  const base = String(convenio?.numero || "convenio").replace(/[^\w]+/g, "-");
  return `relatorio-acompanhamento-${base}.html`;
}

export function baixarRelatorio(convenio) {
  const html = gerarHtmlRelatorio(convenio);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivoRelatorio(convenio);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}