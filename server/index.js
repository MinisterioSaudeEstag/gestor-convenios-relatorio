import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 3001;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

app.use(cors());
app.use(express.json({ limit: '25mb' }));

app.post('/api/auth/register', async (req, res) => {
  const { email, password, full_name, role } = req.body;
  try {
    const check = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (check.rows.length > 0) {
      return res.status(400).json({ error: 'E-mail já cadastrado no sistema.' });
    }

    const query = `
      INSERT INTO usuarios (email, password, full_name, role)
      VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role;
    `;

    const { rows } = await pool.query(query, [email, password, full_name, role || 'employee']);
    res.status(201).json({ success: true, user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1 AND password = $2', [email, password]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
    }
    const user = rows[0];
    res.json({
      success: true,
      user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- HEALTHCHECK ---
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'Conectado ao NeonDB com sucesso!', timestamp: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao conectar ao banco de dados' });
  }
});

app.get('/api/convenios', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM convenios ORDER BY criado_em DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/convenios', async (req, res) => {
  const {
    numero_convenio,
    objeto,
    orgao_concedente,
    convenente,
    valor_global,
    valor_repasse,
    valor_contrapartida,
  } = req.body;
  try {
    const query = `
      INSERT INTO convenios (numero_convenio, objeto, orgao_concedente, convenente, valor_global, valor_repasse, valor_contrapartida)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;
    const values = [
      numero_convenio,
      objeto,
      orgao_concedente,
      convenente,
      valor_global,
      valor_repasse,
      valor_contrapartida || 0,
    ];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/convenios/:id', async (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  try {
    const keys = Object.keys(fields);
    if (keys.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo fornecido para atualização.' });
    }

    const setQuery = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const values = keys.map((key) => {
      const val = fields[key];
      return typeof val === 'object' && val !== null ? JSON.stringify(val) : val;
    });

    values.push(id);
    const query = `UPDATE convenios SET ${setQuery}, atualizado_em = CURRENT_TIMESTAMP WHERE id = $${values.length} RETURNING *;`;

    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Convênio não encontrado.' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar convênio:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/convenios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM convenios WHERE id = $1', [id]);
    res.json({ success: true, message: 'Convênio excluído com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/convenios/:id/documentos', async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM documentos WHERE convenio_id = $1', [id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/documentos', async (req, res) => {
  const { convenio_id, nome, tipo, file_uri, mime, tamanho } = req.body;
  try {
    const query = `
      INSERT INTO documentos (convenio_id, nome, tipo, file_uri, mime, tamanho)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;
    const { rows } = await pool.query(query, [convenio_id, nome, tipo, file_uri, mime, tamanho]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/documentos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM documentos WHERE id = $1', [id]);
    res.json({ success: true, message: 'Documento excluído com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/convenios/:id/sugestoes', async (req, res) => {
  const { id } = req.params;
  const { etapa } = req.query;
  try {
    let query = 'SELECT * FROM sugestoes_ia WHERE convenio_id = $1 AND status = $2';
    let params = [id, 'pendente'];
    if (etapa) {
      query += ' AND etapa = $3';
      params.push(etapa);
    }
    query += ' ORDER BY criado_em DESC';
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sugestoes', async (req, res) => {
  const { convenio_id, etapa, dados, status } = req.body;
  try {
    const query = `
      INSERT INTO sugestoes_ia (convenio_id, etapa, dados, status)
      VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const { rows } = await pool.query(query, [
      convenio_id,
      etapa,
      JSON.stringify(dados),
      status || 'pendente',
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/sugestoes/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const query = 'UPDATE sugestoes_ia SET status = $1 WHERE id = $2 RETURNING *;';
    const { rows } = await pool.query(query, [status, id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/convenios/:id/analisar', async (req, res) => {
  const { id } = req.params;
  const { etapa, documentosIds = [], camposEtapa = [] } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY não configurada no arquivo .env do servidor.',
    });
  }

  try {
    const convRes = await pool.query('SELECT * FROM convenios WHERE id = $1', [id]);
    if (convRes.rows.length === 0) {
      return res.status(404).json({ error: 'Convênio não encontrado.' });
    }
    const convenio = convRes.rows[0];

    let docsQuery = 'SELECT id, nome, tipo, file_uri, mime FROM documentos WHERE convenio_id = $1';
    const docsParams = [id];
    if (Array.isArray(documentosIds) && documentosIds.length > 0) {
      docsQuery += ' AND id = ANY($2)';
      docsParams.push(documentosIds);
    }
    const docsRes = await pool.query(docsQuery, docsParams);

    const metadadosDocs = docsRes.rows.map(({ id: docId, nome, tipo, mime }) => ({
      id: docId,
      nome,
      tipo,
      mime,
    }));

    const parts = [
      {
        text: `
Você é um analista técnico especializado em convênios e transferências voluntárias do Ministério da Saúde (TransfereGov / SEI).
Sua tarefa é analisar o convênio e os documentos selecionados para sugerir valores precisos para preencher a etapa "${etapa}" do Relatório de Acompanhamento Físico/Financeiro.

Dados atuais do convênio no banco:
${JSON.stringify(convenio, null, 2)}

Documentos selecionados:
${JSON.stringify(metadadosDocs, null, 2)}

${camposEtapa.length ? `Chaves esperadas para esta etapa: ${JSON.stringify(camposEtapa)}` : ''}

Regras obrigatórias:
1. Retorne APENAS um objeto JSON válido contendo os campos sugeridos (chave -> valor).
2. Não invente dados numéricos, datas ou valores que não constem nos documentos ou no convênio; omita chaves que não puder inferir com segurança.
3. Use datas no formato YYYY-MM-DD e números sem formatação de moeda (ex.: 150000.00).
4. Se a etapa envolver equipamentos, você pode incluir a chave "equipamentos" como array de objetos quando aplicável.
`,
      },
    ];

    for (const doc of docsRes.rows) {
      if (typeof doc.file_uri === 'string' && doc.file_uri.startsWith('data:')) {
        const match = doc.file_uri.match(/^data:(.*?);base64,(.+)$/);
        if (match) {
          const mimeType = match[1] || doc.mime || 'application/octet-stream';
          const base64Data = match[2];

          if (mimeType === 'application/pdf' || mimeType.startsWith('image/')) {
            parts.push({
              inlineData: {
                mimeType,
                data: base64Data,
              },
            });
          } else if (mimeType.startsWith('text/') || mimeType === 'application/json') {
            const textoDecodificado = Buffer.from(base64Data, 'base64').toString('utf-8');
            parts.push({
              text: `\n--- Conteúdo do documento "${doc.nome}" ---\n${textoDecodificado.slice(0, 30000)}\n`,
            });
          }
        }
      }
    }

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: parts,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const dadosExtraidos = JSON.parse(response.text || '{}');

    const insertQuery = `
      INSERT INTO sugestoes_ia (convenio_id, etapa, dados, status)
      VALUES ($1, $2, $3, 'pendente')
      RETURNING *;
    `;
    const { rows } = await pool.query(insertQuery, [
      id,
      etapa,
      JSON.stringify(dadosExtraidos),
    ]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Erro na análise com Gemini:', err);
    res.status(500).json({ error: err.message || 'Falha ao processar análise com Gemini.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor backend rodando na porta ${port}`);
});