import { base44 } from "@/api/base44Client";
import { montarPrompt } from "@/lib/promptIA";

const SCHEMA = {
  type: "object",
  properties: {
    resumo: { type: "string" },
    confianca: { type: "string", enum: ["alta", "media", "baixa"] },
    campos: { type: "object", additionalProperties: { type: "string" } },
    equipamentos: {
      type: "array",
      items: { type: "object", additionalProperties: { type: "string" } },
    },
    lacunas: { type: "array", items: { type: "string" } },
  },
  required: ["resumo", "confianca", "campos", "lacunas"],
};

export async function analisarDocumentos({ convenio, etapa, documentos }) {
  if (!documentos.length) {
    throw new Error("Anexe ao menos um documento para a análise.");
  }

  const urls = [];
  for (const doc of documentos) {
    const res = await base44.integrations.Core.CreateFileSignedUrl({
      file_uri: doc.file_uri,
      expires_in: 900,
    });
    if (res?.signed_url) urls.push(res.signed_url);
  }

  if (!urls.length) {
    throw new Error("Não foi possível abrir os documentos enviados.");
  }

  const resultado = await base44.integrations.Core.InvokeLLM({
    prompt: montarPrompt(etapa, convenio, documentos.map((d) => d.nome)),
    file_urls: urls,
    response_json_schema: SCHEMA,
  });

  const dados = typeof resultado === "string" ? JSON.parse(resultado) : resultado;

  const sugestao = await base44.entities.SugestaoIA.create({
    convenio_id: convenio.id,
    etapa,
    resumo: dados?.resumo || "",
    confianca: dados?.confianca || "media",
    campos: dados?.campos || {},
    equipamentos: dados?.equipamentos || [],
    lacunas: dados?.lacunas || [],
    documentos: documentos.map((d) => d.nome),
    status: "pendente",
  });

  await Promise.all(
    documentos.map((d) =>
      base44.entities.Documento.update(d.id, { status: "analisado" }).catch(() => null)
    )
  );

  return sugestao;
}