export const ETAPAS = [
  { id: "dados", numeral: "I", romano: "SEÇÃO I", titulo: "Aba Dados", descricao: "Identificação, valores e vigência" },
  { id: "financeiro", numeral: "II", romano: "SEÇÃO II", titulo: "Questionário Financeiro", descricao: "Perguntas Q1 a Q30" },
  { id: "pad_financeiro", numeral: "III", romano: "SEÇÃO III", titulo: "PAD Financeiro", descricao: "Notas fiscais e conformidade" },
  { id: "fisico", numeral: "IV", romano: "SEÇÃO IV", titulo: "Questionário Físico", descricao: "Perguntas F1 a F6" },
  { id: "crono_fisico", numeral: "V", romano: "SEÇÃO V", titulo: "Crono Físico", descricao: "Percentual de execução" },
  { id: "pad_fisico", numeral: "VI", romano: "SEÇÃO VI", titulo: "PAD Físico", descricao: "Resultado da análise física" },
  { id: "licitacao", numeral: "VII", romano: "SEÇÃO VII", titulo: "Processos de Licitação", descricao: "Perguntas L1 a L5" },
  { id: "conclusao", numeral: "VIII", romano: "SEÇÃO VIII", titulo: "Conclusão", descricao: "Constatações e recomendações" },
];

export const ROTULOS_RESPOSTA = {
  sim: "SIM",
  nao: "NÃO",
  na: "NÃO SE APLICA",
};

export const CAMPOS_DADOS = [
  { key: "numero", label: "Nº do convênio", tipo: "texto", obrigatorio: true, placeholder: "000000/2024", col: 1 },
  { key: "processo_sei", label: "Processo SEI", tipo: "texto", obrigatorio: true, placeholder: "25000.000000/2024-00", col: 1 },
  { key: "entidade", label: "Entidade convenente", tipo: "texto", obrigatorio: true, placeholder: "Nome da entidade convenente", col: 2 },
  { key: "cnpj", label: "CNPJ", tipo: "texto", placeholder: "00.000.000/0000-00", col: 1 },
  { key: "municipio", label: "Município / UF", tipo: "texto", placeholder: "Recife / PE", col: 1 },
  { key: "objeto", label: "Objeto do convênio", tipo: "textarea", obrigatorio: true, placeholder: "Descreva o objeto conforme o instrumento", col: 2 },
  { key: "valor_global", label: "Valor global (R$)", tipo: "moeda", obrigatorio: true, col: 1 },
  { key: "valor_concedente", label: "Recurso do concedente (R$)", tipo: "moeda", obrigatorio: true, col: 1 },
  { key: "valor_contrapartida", label: "Contrapartida (R$)", tipo: "moeda", obrigatorio: true, col: 1 },
  { key: "valor_executado", label: "Valor executado (R$)", tipo: "moeda", obrigatorio: true, col: 1 },
  { key: "vigencia_inicio", label: "Vigência — início", tipo: "data", obrigatorio: true, col: 1 },
  { key: "vigencia_fim", label: "Vigência — fim", tipo: "data", obrigatorio: true, col: 1 },
  { key: "oficio_circular", label: "Ofício circular (SEI nº)", tipo: "texto", obrigatorio: true, placeholder: "Nº 000/2024 - CGAC/FNS/SE/MS", col: 1 },
  { key: "nota_tecnica", label: "Nota técnica (SEI nº)", tipo: "texto", obrigatorio: true, placeholder: "Nº 000/2024-COACOM/CGAC/FNS/SE/MS (SEI nº)", col: 1 },
  { key: "responsavel", label: "Responsável técnico", tipo: "texto", placeholder: "Nome do responsável pela análise", col: 2 },
];

const TEXTO_INTRO = [
  "Trata-se da elaboração de Relatório de Acompanhamento Físico/Financeiro referente ao cumprimento do objeto do convênio nº [Nº DO CONVÊNIO/ANO] da [NOME DA ENTIDADE CONVENENTE], cujo objeto é [OBJETO DO CONVÊNIO EM MAIÚSCULAS], com valor global R$ [VALOR GLOBAL], sendo R$ [VALOR CONCEDENTE] do concedente e R$ [VALOR CONTRAPARTIDA] de contrapartida.",
  "Foi executado R$ [VALOR EXECUTADO], cuja data de vigência foi de [DD/MM/AAAA] a [DD/MM/AAAA], em cumprimento ao que determina o [NÚMERO DO OFÍCIO CIRCULAR (SEI)].",
  "As informações constantes neste relatório foram obtidas a partir dos dados coletados dos documentos que se encontram no Transferegov. Foi elaborada NOTA TÉCNICA N. [Nº/ANO-COACOM/CGAC/FNS/SE/MS (SEI Nº)].",
];

export const INTRO_DADOS = TEXTO_INTRO.join("\n\n");

export const QUESTIONARIO_FINANCEIRO = [
  {
    id: "Q1",
    titulo: "O objeto do convênio está sendo/foi executado de acordo com as metas e fases de execução previstas no Plano de Trabalho e/ou no Projeto Básico?",
    tipo: "status",
    modelo:
      "O objeto do convênio foi executado de acordo com as [ÚNICA / Nº DE METAS] meta(s) e [ÚNICA / Nº DE ETAPAS] etapa(s) de execução previstas no Plano de Trabalho. Meta e etapa prevista de [DD/MM/AAAA] a [DD/MM/AAAA]. Execução de [DD/MM/AAAA] a [DD/MM/AAAA] (data da última entrega dos equipamentos).\n\nO convênio foi pactuado para aquisição de [QUANTIDADE] equipamentos. As especificações compatíveis às previstas no Plano de Aplicação Detalhado foram atestadas por Técnicos do Ministério da Saúde como se verifica [NOTA TÉCNICA Nº XX/ANO-COAINF/CGAC/FNS/SE/MS de DD/MM/AAAA, SEI nº XXXXXXXX].",
    orientacao:
      "Plano de Trabalho → Crono Físico: quantidade de metas e etapas, data de início e término. Plano de Aplicação Detalhado: quantidade de equipamentos = somatório das unidades. Inserir a identificação da NT que consta no processo SEI.",
  },
  {
    id: "Q2",
    titulo: "O objeto do convênio está sendo/foi executado de acordo com o cronograma de execução previsto no Plano de Trabalho e/ou no Projeto Básico?",
    tipo: "status",
    modelo:
      "O objeto do convênio foi executado conforme o cronograma de execução previsto no Plano de Trabalho, de [DD/MM/AAAA] a [DD/MM/AAAA], sem alteração das etapas pactuadas.",
    orientacao:
      "Pergunta igual ao Item 1. Responder da mesma forma, referenciando as mesmas informações do Crono Físico.",
  },
  {
    id: "Q3",
    titulo: "O(s) preço(s) praticado(s) na execução do convênio estão de acordo com o Plano de Trabalho aprovado?",
    tipo: "status",
    modelo:
      "A execução física foi de [XX%] com a aquisição de [todos / X] equipamentos previstos com preço [inferior / superior / igual] ao presente no plano de trabalho, conforme Planilha de Equipamentos em Anexo na Aba Dados deste Relatório.",
    orientacao:
      "Execução física = equipamentos adquiridos ÷ equipamentos aprovados × 100. Consultar Plano de Aplicação Detalhado, Notas Fiscais e Movimentações Financeiras do TGOV.",
  },
  {
    id: "Q4",
    titulo:
      "A contrapartida foi depositada na conta específica do convênio ou contrato de repasse, classificada e registrada conforme pactuação?",
    tipo: "status",
    orientacao:
      "Relatórios Financeiros de Aceite de Licitação → Aba Acompanhamento Relatório Instrumento – Acompanhamento. Identificar a data do depósito e comparar com a data do repasse do MS: a contrapartida deve ser depositada no mesmo mês do repasse.",
  },
  {
    id: "Q5",
    titulo: "Existe alguma receita de aplicação financeira computada como contrapartida?",
    tipo: "status",
    modelo:
      "O valor de R$ [VALOR] corresponde ao rendimento da contrapartida depositada integralmente pelo convenente em [DD/MM/AAAA].",
    orientacao:
      "Verificar os valores de rendimento na Aba Saldo Remanescente da Prestação de Contas e no extrato bancário. O rendimento de contrapartida é proporcional aos rendimentos totais e aos valores depositados pelo Ministério.",
  },
  {
    id: "Q6",
    titulo: "A efetivação da contrapartida observou os prazos previstos no cronograma de desembolso?",
    tipo: "status",
    modelo:
      "A contrapartida foi depositada em [DD/MM/AAAA] no valor de R$ [VALOR], sendo o mesmo mês de liberação do recurso pelo Ministério da Saúde.",
    orientacao: "As informações já foram verificadas nas respostas dos Itens 4 e 5 — não é necessário consultar novamente.",
  },
  {
    id: "Q7",
    titulo: "Os recursos foram/estão sendo aplicados no mercado financeiro?",
    tipo: "status",
    modelo:
      "A transferência efetivada pelo FNS/MS foi movimentada na conta específica do Convênio, Agência [AGÊNCIA] e Conta Corrente [CONTA] no [NOME DO BANCO] no valor de R$ [VALOR] em [DD/MM/AAAA] e aplicado no [NOME DO FUNDO/POUPANÇA].\n\nOs rendimentos auferidos no período de [MÊS/ANO] a [MÊS/ANO] foram de R$ [VALOR DOS RENDIMENTOS].",
    orientacao:
      "Verificar os valores de rendimento na Aba Saldo Remanescente da Prestação de Contas e no extrato bancário.",
  },
  {
    id: "Q8",
    titulo:
      "Recursos com previsão de uso superior a 30 dias foram aplicados em caderneta de poupança?",
    tipo: "status",
    orientacao: "Verificar apenas se houve a aplicação correspondente nos extratos bancários inseridos no processo.",
  },
  {
    id: "Q9",
    titulo:
      "Recursos com previsão de uso inferior a 30 dias foram aplicados em fundo de aplicação financeira de curto prazo ou operação de mercado aberto?",
    tipo: "status",
    orientacao: "Verificar apenas se houve a aplicação correspondente nos extratos bancários inseridos no processo.",
  },
  {
    id: "Q10",
    titulo: "Foram pagos valores a título de taxa de administração, gerência ou similar?",
    tipo: "status",
    orientacao:
      "Verificar nos extratos bancários e no TGOV se houve pagamento de taxa administrativa (valores em NF com essa justificativa — ocorrência rara).",
  },
  {
    id: "Q11",
    titulo: "Foram destinados recursos para taxas bancárias, multas, juros ou correção monetária?",
    tipo: "status",
    orientacao: "Verificar nos extratos bancários (valores geralmente pequenos).",
  },
  {
    id: "Q12",
    titulo: "Houve autorização da concedente para esses pagamentos? (aplicável quando Q11 = SIM)",
    tipo: "status",
    sugestao: "na",
    orientacao: "NÃO SE APLICA quando Q11 = NÃO.",
  },
  {
    id: "Q13",
    titulo:
      "Houve notificação de partidos, sindicatos e entidades empresariais sobre a liberação de recursos? (entes municipais / DF)",
    tipo: "status",
    sugestao: "na",
    orientacao:
      "Aplicável apenas a convênios com entes municipais e do Distrito Federal. Para entidades privadas (hospitais, ONGs), a resposta é sempre NÃO SE APLICA.",
  },
  {
    id: "Q14",
    titulo: "A movimentação foi/está sendo realizada em conta corrente específica do convênio?",
    tipo: "status",
    modelo:
      "A transferência efetivada pelo FNS/MS foi movimentada na conta específica do Convênio, Banco nº [CÓDIGO – NOME DO BANCO], Agência [AGÊNCIA] e Conta Corrente [NÚMERO DA CONTA].",
    orientacao: "Os dados são os mesmos levantados na Q7 — basta reaproveitar.",
  },
  {
    id: "Q15",
    titulo:
      "Houve movimentação de valores estranhos à execução do objeto na conta bancária específica? (aplicável quando Q14 = SIM)",
    tipo: "status",
    orientacao:
      "Se SIM, descrever detalhadamente o que foi observado, indicando os locais e as datas das movimentações irregulares.",
  },
  {
    id: "Q16",
    titulo: "Houve autorização de OBTV (Ordem Bancária de Transferência Voluntária)?",
    tipo: "status",
    orientacao: "Execução → Limites OBTV para Convenente. Para convênios de equipamentos, geralmente NÃO.",
  },
  {
    id: "Q17",
    titulo: "Os pagamentos foram realizados por meio de OBTV?",
    tipo: "status",
    sugestao: "na",
    orientacao: "Normalmente NÃO SE APLICA quando Q16 = NÃO.",
  },
  {
    id: "Q18",
    titulo: "Houve pagamento por OBTV em desacordo com a autorização da concedente?",
    tipo: "status",
    sugestao: "na",
    orientacao: "Normalmente NÃO SE APLICA quando Q16 = NÃO.",
  },
  {
    id: "Q19",
    titulo: "Houve pagamento em espécie (direto no caixa)?",
    tipo: "status",
    orientacao: "Ocorrência raríssima — a resposta esperada é NÃO.",
  },
  {
    id: "Q20",
    titulo: "O pagamento em espécie foi autorizado pela concedente? (aplicável quando Q19 = SIM)",
    tipo: "status",
    sugestao: "na",
    orientacao: "NÃO SE APLICA quando Q19 = NÃO.",
  },
  {
    id: "Q21",
    titulo: "Os pagamentos estão suportados por comprovantes de despesas no mesmo valor?",
    tipo: "status",
    modelo: "Os documentos comprobatórios das despesas estão descritos na Planilha de Equipamentos na aba Dados deste relatório.",
    orientacao: "Conferir notas fiscais e comprovantes de pagamento com os valores informados no extrato.",
  },
  {
    id: "Q22",
    titulo: "Houve pagamento fora do prazo de vigência do convênio?",
    tipo: "status",
    modelo: "O final da vigência do Convênio foi em [DD/MM/AAAA] e o pagamento da última despesa realizada foi em [DD/MM/AAAA].",
    orientacao: "Comparar a data do último pagamento com o fim da vigência.",
  },
  {
    id: "Q23",
    titulo: "Houve autorização da concedente para pagamento fora do prazo? (aplicável quando Q22 = SIM)",
    tipo: "status",
    sugestao: "na",
    orientacao: "Como concedente, nunca autorizamos pagamento fora da vigência. Se isso tiver ocorrido, a resposta é NÃO.",
  },
  {
    id: "Q24",
    titulo: "As despesas foram executadas de acordo com as classificações do Plano de Aplicação?",
    tipo: "status",
    modelo: "Natureza da despesa – [CÓDIGO DA NATUREZA (ex: 44905208)].",
    orientacao:
      "Plano de Trabalho → Plano de Aplicação Detalhado. Para equipamentos, a natureza de despesa é sempre a mesma.",
  },
  {
    id: "Q25",
    titulo: "A execução das despesas cumpriu os preceitos legais?",
    tipo: "status",
    orientacao: "Caso exista alguma situação irregular, descrevê-la aqui.",
  },
  {
    id: "Q26",
    titulo: "A documentação comprobatória das despesas está identificada com o número e título do convênio?",
    tipo: "status",
    orientacao: "Verificar se as NFs constam o número do convênio (pode estar manuscrito).",
  },
  {
    id: "Q27",
    titulo: "Os extratos bancários demonstram o correto pagamento das despesas do convênio?",
    tipo: "status",
    modelo:
      "Os extratos apresentados compreenderam o período de [MÊS/ANO] a [MÊS/ANO]. A análise desses documentos demonstrou adequadamente o cumprimento da legislação vigente e o devido pagamento da despesa executada com recursos do Convênio.",
    orientacao: "Conferir cada débito do extrato com a nota fiscal e o comprovante correspondente.",
  },
  {
    id: "Q28",
    titulo: "Os documentos sobre a execução do convênio foram disponibilizados de forma integral?",
    tipo: "status",
    modelo:
      "A documentação referente à execução do referido Convênio foi toda apresentada, com exceção de [DESCREVER DOCUMENTO(S) AUSENTE(S)].",
    orientacao: "Listar pendências documentais identificadas na análise.",
  },
  {
    id: "Q29",
    titulo: "O recolhimento do saldo do convênio ocorreu em tempo hábil?",
    tipo: "status",
    modelo:
      "A Prestação de Contas foi enviada em [DD/MM/AAAA] com o devido recolhimento do saldo remanescente em [DD/MM/AAAA] no valor de R$ [VALOR].",
    orientacao:
      "O saldo remanescente deve ser recolhido antes do envio da Prestação de Contas. Verificar na Aba Saldo Remanescente.",
  },
  {
    id: "Q30",
    titulo: "O saldo está conciliado?",
    tipo: "status",
    modelo:
      "Receitas totais: R$ [TOTAL RECEITAS] resultante da soma de R$ [RECURSO DO CONCEDENTE] (recurso liberado pelo Concedente) + R$ [CONTRAPARTIDA] (contrapartida) + R$ [RENDIMENTOS] (rendimentos).\n\nDespesas totais: R$ [PAGAMENTOS] de pagamentos realizados + R$ [SALDO DEVOLVIDO] de saldo devolvido (rendimentos do concedente R$ [VALOR] + rendimentos do convenente R$ [VALOR] + saldo restante em conta R$ [VALOR]).\n\nO saldo nesta data atual [DD/MM/AAAA] está conciliado com as Abas Extratos Bancários e Rendimento de Aplicação do Transferegov zerados.",
    orientacao: "Somar receitas e despesas e confrontar com as abas Extratos Bancários e Rendimento de Aplicação do TGOV.",
  },
];

export const QUESTIONARIO_FISICO = [
  {
    id: "F1",
    titulo:
      "As etapas foram/estão sendo executadas de acordo com a quantidade e períodos programados conforme Plano de Trabalho aprovado?",
    tipo: "status",
    modelo: "Os itens foram adquiridos de acordo com o plano de trabalho.",
    orientacao: "Se NÃO: identificar quais equipamentos não estão em conformidade e descrever a divergência.",
  },
  {
    id: "F2",
    titulo:
      "O objeto do convênio está sendo/foi executado na mesma localidade e endereço especificados no Projeto e Plano de Trabalho aprovado?",
    tipo: "status",
    sugestao: "sim",
    modelo: "Os itens adquiridos estão localizados na unidade de saúde definida no plano de trabalho aprovado.",
    orientacao:
      "A verificação da localização é feita durante a elaboração da planilha para envio. Só encaminhamos se a localização de GPS estiver com o endereço da entidade confirmado.",
  },
  {
    id: "F3",
    titulo: "A fornecedora que está realizando ou realizou o objeto do convênio é a mesma que celebrou o contrato?",
    tipo: "status",
    modelo:
      "O pagamento foi realizado para o respectivo fornecedor, conforme planilha anexa na aba dados deste Relatório.",
    orientacao:
      "O contrato deve estar inserido na plataforma. Caso não esteja, registrar constatações e emitir recomendações no relatório.",
  },
  {
    id: "F4",
    titulo: "O objeto do convênio em execução/executado obteve aprovação das instâncias legais pertinentes?",
    tipo: "status",
    sugestao: "na",
    orientacao: "Questionamento destinado a convênios de obra. Para aquisição de equipamentos, sempre NÃO SE APLICA.",
  },
  {
    id: "F5",
    titulo:
      "Foi utilizado algum tipo de identificação para promover a publicidade quanto às informações e recursos do convênio?",
    tipo: "status",
    modelo:
      "Há plaquetas com Patrimônio e a identificação do convênio conforme descrito na planilha anexa a este relatório.",
    orientacao: "Verificar registro fotográfico das plaquetas de identificação dos equipamentos.",
  },
  {
    id: "F6",
    titulo:
      "As informações e os documentos relativos ao convênio, bem como os locais de execução do objeto, estão à disposição para acesso da concedente e dos órgãos de controle?",
    tipo: "status",
    sugestao: "sim",
    orientacao: "Como os documentos e informações estão disponíveis no TGOV, a resposta é sempre SIM.",
  },
];

export const QUESTIONARIO_LICITACAO = [
  {
    id: "L1",
    titulo:
      "O prazo de execução do objeto está compatível com o estabelecido no edital de licitação e no respectivo termo de contrato?",
    tipo: "status",
    modelo:
      "O Convênio esteve vigente entre [DD/MM/AAAA] e [DD/MM/AAAA]. Todos os contratos firmados tinham vigência de um ano e prazo de entrega de até 30 dias.\n\nContrato nº [XX/AAAA] – As [QUANTIDADE] unidades do item [NOME DO EQUIPAMENTO] foram recebidas pela entidade em [DD/MM/AAAA] conforme NF nº [NÚMERO] emitida em [DD/MM/AAAA], portanto, [dentro / APÓS] do prazo previsto pelo contrato.",
    orientacao:
      "Ordem cronológica obrigatória: edital → propostas → homologação → NF → pagamento. O processo licitatório deve ter ocorrido antes da emissão da NF.",
  },
  {
    id: "L2",
    titulo: "O prazo estabelecido para o certame foi obedecido?",
    tipo: "status",
    modelo: "Todos os prazos das etapas para realização do processo licitatório foram cumpridos.",
    orientacao: "Conferir as datas de publicação do edital, recebimento das propostas e homologação.",
  },
  {
    id: "L3",
    titulo: "O convenente forneceu declaração expressa atestando o atendimento às disposições legais aplicáveis?",
    tipo: "status",
    modelo:
      "O Parecer Jurídico foi assinado pelos membros da Assessoria Jurídica em [DD/MM/AAAA]. O certame foi homologado em [DD/MM/AAAA], cuja publicação foi feita no DOU nº [NÚMERO], Seção [X], pág. [XXX], do dia [DD/MM/AAAA]. A Declaração de Compatibilidade das Especificações foi assinada em [DD/MM/AAAA] e a Declaração de Conformidade Legal foi assinada pela Superintendente Geral em [DD/MM/AAAA]. Todos os documentos foram inseridos na aba Processo de Execução do Transferegov em [DD/MM/AAAA].",
    orientacao: "Mencionar cada documento com a respectiva data de assinatura.",
  },
  {
    id: "L4",
    titulo: "Os preços propostos pelo licitante vencedor possuem compatibilidade com os preços de referência?",
    tipo: "status",
    modelo:
      "As despesas estão descritas na Planilha de equipamentos na aba Dados deste relatório. Os preços licitados são iguais ou inferiores aos preços do plano de trabalho aprovado.",
    orientacao:
      "SIM: preços licitados ≤ preços do plano de trabalho aprovado. NÃO: listar os itens com preços superiores ao plano de trabalho.",
  },
  {
    id: "L5",
    titulo: "Existe enquadramento entre o objeto conveniado e o efetivamente licitado?",
    tipo: "status",
    modelo:
      "Quanto à análise, sua execução física foi realizada por meio da [NOTA TÉCNICA Nº XX/ANO-COAINF/CGAC/FNS/SE/MS (SEI nº XXXXXXXX)]. Foi apresentado pelo Convenente o Parecer de avaliação das propostas bem como a Declaração de Conformidade dos equipamentos.",
    orientacao:
      "Incluir parecer da engenharia clínica, declaração de compatibilidade da especificação e nota técnica nº (SEI nº) — todos com datas.",
  },
];

export const TEXTO_RECOMENDACAO_SCNES =
  "Orientamos cadastrar os equipamentos no Sistema de Cadastro Nacional de Estabelecimento de Saúde – SCNES agregado ao CNES do respectivo estabelecimento de saúde em cumprimento à recomendação proferida pelo Tribunal de Contas da União/TCU, Acórdão nº. 247/2010 – Plenário item 9.3.";

export const TIPOS_DOCUMENTO = [
  { value: "plano_trabalho", label: "Plano de Trabalho" },
  { value: "nota_fiscal", label: "Nota fiscal" },
  { value: "extrato_bancario", label: "Extrato bancário" },
  { value: "contrato", label: "Contrato" },
  { value: "edital", label: "Edital / licitação" },
  { value: "parecer", label: "Parecer / declaração" },
  { value: "prestacao_contas", label: "Prestação de contas" },
  { value: "outro", label: "Outro documento" },
];

export const QUESTIONARIOS = {
  financeiro: QUESTIONARIO_FINANCEIRO,
  fisico: QUESTIONARIO_FISICO,
  licitacao: QUESTIONARIO_LICITACAO,
};

const temValor = (v) => v !== undefined && v !== null && String(v).trim() !== "";

const pctDe = (feitos, total) => (total ? Math.round((feitos / total) * 100) : 0);

export function statusDe(pct) {
  if (pct >= 100) return "concluida";
  if (pct > 0) return "em_andamento";
  return "pendente";
}

export function calcularProgresso(convenio) {
  const c = convenio || {};
  const valores = {};

  const obrigatoriosDados = CAMPOS_DADOS.filter((f) => f.obrigatorio);
  valores.dados = pctDe(
    obrigatoriosDados.filter((f) => temValor(c[f.key])).length,
    obrigatoriosDados.length
  );

  ["financeiro", "fisico", "licitacao"].forEach((etapa) => {
    const respostas = c[etapa] || {};
    const perguntas = QUESTIONARIOS[etapa];
    const respondidas = perguntas.filter((q) => {
      const r = respostas[q.id];
      return r && temValor(r.resposta) && (!q.modelo || temValor(r.texto));
    }).length;
    valores[etapa] = pctDe(respondidas, perguntas.length);
  });

  const itens = (c.planilha || []).filter((i) => temValor(i.item));
  const padFin = c.pad_financeiro || {};
  valores.pad_financeiro = pctDe(
    (itens.length ? 1 : 0) + (temValor(padFin.justificativa) ? 1 : 0),
    2
  );

  const crono = c.crono_fisico || {};
  valores.crono_fisico = pctDe(
    (temValor(crono.percentual_execucao) ? 1 : 0) + (temValor(crono.texto) ? 1 : 0),
    2
  );

  const padFis = c.pad_fisico || {};
  valores.pad_fisico = pctDe(
    (temValor(padFis.resultado) ? 1 : 0) + (temValor(padFis.texto) ? 1 : 0),
    2
  );

  const concl = c.conclusao || {};
  const camposConclusao = [
    concl.execucao_fisica,
    concl.execucao_financeira,
    concl.constatacoes,
    concl.recomendacoes,
  ];
  valores.conclusao = pctDe(camposConclusao.filter(temValor).length, 4);

  return ETAPAS.map((etapa) => {
    const pct = valores[etapa.id] ?? 0;
    return { id: etapa.id, pct, status: statusDe(pct) };
  });
}

export function progressoGeral(convenio) {
  const etapas = calcularProgresso(convenio);
  const soma = etapas.reduce((acc, e) => acc + e.pct, 0);
  return Math.round(soma / etapas.length);
}

export function pendenciasDaEtapa(convenio, etapaId) {
  const c = convenio || {};
  const pendencias = [];

  if (etapaId === "dados") {
    CAMPOS_DADOS.filter((f) => f.obrigatorio && !temValor(c[f.key])).forEach((f) =>
      pendencias.push(f.label)
    );
  } else if (QUESTIONARIOS[etapaId]) {
    QUESTIONARIOS[etapaId].forEach((q) => {
      const r = (c[etapaId] || {})[q.id] || {};
      if (!temValor(r.resposta)) pendencias.push(`${q.id} — resposta`);
      else if (q.modelo && !temValor(r.texto)) pendencias.push(`${q.id} — texto da resposta`);
    });
  } else if (etapaId === "pad_financeiro") {
    if (!(c.planilha || []).filter((i) => temValor(i.item)).length)
      pendencias.push("Planilha de equipamentos (Aba Dados)");
    if (!temValor((c.pad_financeiro || {}).justificativa)) pendencias.push("Justificativa");
  } else if (etapaId === "crono_fisico") {
    if (!temValor((c.crono_fisico || {}).percentual_execucao)) pendencias.push("Percentual executado");
    if (!temValor((c.crono_fisico || {}).texto)) pendencias.push("Texto da execução física");
  } else if (etapaId === "pad_fisico") {
    if (!temValor((c.pad_fisico || {}).resultado)) pendencias.push("Resultado da análise");
    if (!temValor((c.pad_fisico || {}).texto)) pendencias.push("Descrição da análise");
  } else if (etapaId === "conclusao") {
    const concl = c.conclusao || {};
    if (!temValor(concl.execucao_fisica)) pendencias.push("Execução física (%)");
    if (!temValor(concl.execucao_financeira)) pendencias.push("Execução financeira (%)");
    if (!temValor(concl.constatacoes)) pendencias.push("Constatações");
    if (!temValor(concl.recomendacoes)) pendencias.push("Recomendações");
  }

  return pendencias;
}

export function respostasIniciais(etapaId) {
  const respostas = {};
  (QUESTIONARIOS[etapaId] || []).forEach((q) => {
    respostas[q.id] = { resposta: q.sugestao || "", texto: "" };
  });
  return respostas;
}

export const formatarMoeda = (valor) => {
  const n = Number(valor);
  if (!valor && valor !== 0) return "—";
  if (Number.isNaN(n)) return String(valor);
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export const formatarData = (valor) => {
  if (!valor) return "—";
  const d = new Date(`${valor}T12:00:00`);
  if (Number.isNaN(d.getTime())) return String(valor);
  return d.toLocaleDateString("pt-BR");
};