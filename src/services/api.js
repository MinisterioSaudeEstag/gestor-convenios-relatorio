const API_URL = 'http://localhost:3001/api';

export async function listarConvenios() {
  const response = await fetch(`${API_URL}/convenios`);
  if (!response.ok) throw new Error('Erro ao buscar convênios');
  return response.json();
}

export async function criarConvenio(dados) {
  const response = await fetch(`${API_URL}/convenios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!response.ok) throw new Error('Erro ao criar convênio');
  return response.json();
}

export async function listarDocumentos(convenioId) {
  const response = await fetch(`${API_URL}/convenios/${convenioId}/documentos`);
  if (!response.ok) throw new Error('Erro ao buscar documentos');
  return response.json();
}

export async function enviarDocumento(dados) {
  const response = await fetch(`${API_URL}/documentos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!response.ok) throw new Error('Erro ao salvar documento');
  return response.json();
}