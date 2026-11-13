// Montagem do prompt de extração enviado ao modelo, por etapa do relatório.

export const PERGUNTAS_IA = {
  financeiro: [
    ["Q1", "Execução do objeto de acordo com as metas e fases do Plano de Trabalho"],
    ["Q2", "Execução de acordo com o cronograma previsto no Plano de Trabalho"],
    ["Q3", "Preços praticados de acordo com o Plano de Trabalho aprovado"],
    ["Q4", "Contrapartida depositada em conta específica e registrada conforme pactuação"],
    ["Q5", "Receita de aplicação financeira computada como contrapartida"],
    ["Q6", "Efetivação da contrapartida dentro dos prazos do cronograma de desembolso"],
    ["Q7", "Recursos aplicados no mercado financeiro"],
    ["Q8", "Recursos de uso superior a 30 dias aplicados em poupança"],
    ["Q9", "Recursos de uso inferior a 30 dias aplicados em fundo de curto prazo"],
    ["Q10", "Pagamento de taxa de administração, gerência ou similar"],
    ["Q11", "Recursos destinados a taxas bancárias, multas, juros ou correção monetária"],
    ["Q12", "Autorização da concedente para taxas/multas (quando Q11 = SIM)"],
    ["Q13", "Notificação de partidos, sindicatos e entidades empresariais (entes municipais/DF)"],
    ["Q14", "Movimentação em conta corrente específica do convênio"],
    ["Q15", "Movimentação de valores estranhos ao objeto na conta específica"],
    ["Q16", "Autorização de OBTV"],
    ["Q17", "Pagamentos realizados por meio de OBTV"],
    ["Q18", "Pagamento por OBTV em desacordo com a autorização"],
    ["Q19", "Pagamento em espécie (direto no caixa)"],
    ["Q20", "Autorização da concedente para pagamento em espécie"],
    ["Q21", "Pagamentos suportados por comprovantes de despesas no mesmo valor"],
    ["Q22", "Pagamento fora do prazo de vigência do convênio"],
    ["Q23", "Autorização da concedente para pagamento fora do prazo"],
    ["Q24", "Despesas executadas conforme as classificações do Plano de Aplicação"],
    ["Q25", "Execução das despesas cumpriu os preceitos legais"],
    ["Q26", "Documentação comprobatória identificada com o número e título do convênio"],
    ["Q27", "Extratos bancários demonstram o correto pagamento das despesas"],
    ["Q28", "Documentos da execução disponibilizados de forma integral"],
    ["Q29", "Recolhimento do saldo remanescente em tempo hábil"],
    ["Q30", "Saldo conciliado entre receitas e despesas"],
  ],
  fisico: [
    ["F1", "Etapas executadas conforme quantidade e períodos programados"],
    ["F2", "Execução na mesma localidade e endereço do Plano de Trabalho"],
    ["F3", "Fornecedora é a mesma que celebrou o contrato"],
    ["F4", "Aprovação pelas instâncias legais pertinentes (obras)"],
    ["F5", "Identificação e publicidade quanto às informações e recursos do convênio"],
    ["F6", "Documentos e locais de execução à disposição da concedente e dos órgãos de controle"],
  ],
  licitacao: [
    ["L1", "Prazo de execução compatível com edital e termo de contrato"],
    ["L2", "Prazo estabelecido para o certame foi obedecido"],
    ["L3", "Declaração expressa de atendimento às disposições legais aplicáveis"],
    ["L4", "Preços do licitante vencedor compatíveis com os preços de referência"],
    ["L5", "Enquadramento entre o objeto conveniado e o efetivamente licitado"],
  ],
};

export const CAMPOS_DADOS_IA = {
  numero: "número do convênio, como consta no instrumento (ex.: 893401/2023)",
  entidade: "nome da entidade convenente",
  cnpj: "CNPJ da convenente",
  municipio: "município / UF da execução",
  objeto: "objeto do convênio, texto integral",
  valor_global: "valor global aprovado, apenas números (ex.: 1240000.00)",
  valor_concedente: "valor do concedente, apenas números",
  valor_contrapartida: "valor da contrapartida, apenas números",
  valor_executado: "valor efetivamente executado/pago, apenas números",
  vigencia_inicio: "início da vigência no formato AAAA-MM-DD",
  vigencia_fim: "fim da vigência no formato AAAA-MM-DD",
  oficio_circular: "identificação do ofício circular (SEI)",
  nota_tecnica: "identificação da nota técnica (SEI)",
  processo_sei: "número do processo SEI",
};

const REGRAS = `REGRAS OBRIGATÓRIAS:
- Preencha somente campos comprovados pela documentação anexada. Nunca invente, estime ou complete dados por analogia.
- Se um dado não estiver visível nos documentos, NÃO inclua o campo e registre a pendência em "lacunas".
- Datas em textos corridos no formato DD/MM/AAAA. Campos de data isolados no formato AAAA-MM-DD.
- Valores monetários: apenas números com ponto decimal (ex.: 1240000.00), sem "R$" e sem separador de milhar.
- Respostas de questionário: "sim", "nao" ou "na" (não se aplica). Justifique no texto o documento que embasa a conclusão.
- Escreva os textos em linguagem formal de relatório oficial, em terceira pessoa, sem opinião.
- Em "resumo", descreva em até 3 frases o que os documentos permitem concluir.
- Em "confianca", indique alta, media ou baixa conforme a clareza da documentação.
- Em "lacunas", liste os dados necessários que não foram encontrados.`;

export function montarPrompt(etapa, convenio, nomesDocumentos = []) {
  const c = convenio || {};
  const contexto = `Convênio ${c.numero || "(sem número)"} — ${c.entidade || "(entidade não informada)"}. Objeto: ${
    c.objeto || "(não informado)"
  }.`;
  const docs = nomesDocumentos.length ? nomesDocumentos.join("; ") : "documentos anexados";

  if (etapa === "dados") {
    const campos = Object.entries(CAMPOS_DADOS_IA)
      .map(([k, v]) => `- ${k}: ${v}`)
      .join("\n");
    return `Você é analista de convênios do Ministério da Saúde. Analise os documentos anexados e extraia os dados da ABA DADOS do Relatório de Acompanhamento Físico/Financeiro.

${contexto}
Documentos analisados: ${docs}

Campos a preencher em "campos":
${campos}

Se os documentos permitirem, preencha também "equipamentos": lista dos itens adquiridos/aprovados com as chaves item, quantidade_aprovada, valor_unitario_aprovado, quantidade_adquirida, valor_unitario_adquirido, fornecedor, nota_fiscal, data_nf (AAAA-MM-DD). Use apenas itens realmente listados nos documentos.

${REGRAS}`;
  }

  const lista = (PERGUNTAS_IA[etapa] || []).map(([id, titulo]) => `- ${id}: ${titulo}`).join("\n");
  const rotulo =
    etapa === "financeiro"
      ? "QUESTIONÁRIO FINANCEIRO (Q1 a Q30)"
      : etapa === "fisico"
      ? "QUESTIONÁRIO FÍSICO (F1 a F6)"
      : etapa === "licitacao"
      ? "PROCESSOS DE LICITAÇÃO (L1 a L5)"
      : etapa.toUpperCase();

  return `Você é analista de convênios do Ministério da Saúde. Analise os documentos anexados e responda o ${rotulo} do Relatório de Acompanhamento Físico/Financeiro.

${contexto}
Documentos analisados: ${docs}

Para cada pergunta, retorne em "campos" as chaves "<ID>.resposta" (sim, nao ou na) e "<ID>.texto" (resposta redigida, citando datas, valores e documentos). Preencha apenas as perguntas que a documentação permitir responder.
${lista}

${REGRAS}`;
}