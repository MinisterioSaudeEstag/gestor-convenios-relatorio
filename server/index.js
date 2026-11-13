// server/index.js
import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 3001;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, 
});

app.use(cors());
app.use(express.json());

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
  const { numero_convenio, objeto, orgao_concedente, convenente, valor_global, valor_repasse, valor_contrapartida } = req.body;
  try {
    const query = `
      INSERT INTO convenios (numero_convenio, objeto, orgao_concedente, convenente, valor_global, valor_repasse, valor_contrapartida)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
    `;
    const values = [numero_convenio, objeto, orgao_concedente, convenente, valor_global, valor_repasse, valor_contrapartida || 0];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
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

app.listen(port, () => {
  console.log(`🚀 Servidor backend rodando na porta ${port}`);
});