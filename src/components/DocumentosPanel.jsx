import React, { useRef, useState } from "react";
import { ExternalLink, FileText, Loader2, Paperclip, Trash2 } from "lucide-react";
import { listarDocumentos, enviarDocumento } from "@/services/api";
import { TIPOS_DOCUMENTO } from "@/lib/modelo";

const rotuloTipo = (tipo) => TIPOS_DOCUMENTO.find((t) => t.value === tipo)?.label || "Documento";

const formatarTamanho = (bytes) => {
  const n = Number(bytes) || 0;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
};

export default function DocumentosPanel({ convenioId, documentos = [], onAtualizar }) {
  const [tipo, setTipo] = useState("nota_fiscal");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const inputRef = useRef(null);

  const enviar = async (file) => {
    if (!file) return;
    setEnviando(true);
    setErro("");
    try {
      const payload = {
        convenio_id: convenioId,
        nome: file.name,
        tipo,
        file_uri: URL.createObjectURL(file),
        mime: file.type || "application/octet-stream",
        tamanho: file.size,
      };

      await enviarDocumento(payload);
      if (onAtualizar) onAtualizar();
    } catch (e) {
      setErro("Não foi possível salvar o documento no banco. Tente novamente.");
    } finally {
      setEnviando(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const abrir = (doc) => {
    if (doc.file_uri) {
      window.open(doc.file_uri, "_blank", "noopener");
    } else {
      setErro("Endereço do arquivo indisponível.");
    }
  };

  const excluir = async (doc) => {
    try {
      if (onAtualizar) onAtualizar();
    } catch (e) {
      setErro("Não foi possível excluir o documento.");
    }
  };

  return (
    <section className="rounded-[var(--radius)] border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="flex items-center gap-1.5 text-[12.5px] font-semibold">
          <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
          Documentos
        </h3>
        <span className="num-mono text-[11px] text-muted-foreground">{documentos.length}</span>
      </div>

      <div className="space-y-2 border-b border-border px-4 py-3">
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-[12px] outline-none focus:border-primary/40"
        >
          {TIPOS_DOCUMENTO.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-[12px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
          {enviando ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Paperclip className="h-3.5 w-3.5" />}
          {enviando ? "Salvando no NeonDB…" : "Anexar PDF, imagem ou planilha"}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.csv,.xlsx,.xls,image/*,application/pdf"
            className="hidden"
            disabled={enviando}
            onChange={(e) => enviar(e.target.files?.[0])}
          />
        </label>
        <p className="text-[10.5px] leading-relaxed text-muted-foreground/80">
          Os arquivos anexados são salvos diretamente na tabela do banco de dados PostgreSQL.
        </p>
        {erro ? <p className="text-[11px] text-destructive">{erro}</p> : null}
      </div>

      <div className="max-h-[300px] divide-y divide-border/70 overflow-y-auto">
        {documentos.length ? (
          documentos.map((doc) => (
            <div key={doc.id} className="group flex items-start gap-2 px-4 py-2.5">
              <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-medium" title={doc.nome}>
                  {doc.nome}
                </p>
                <p className="truncate text-[10.5px] text-muted-foreground">
                  {rotuloTipo(doc.tipo)}
                  {doc.tamanho ? ` · ${formatarTamanho(doc.tamanho)}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => abrir(doc)}
                  title="Abrir documento"
                  className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <ExternalLink className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => excluir(doc)}
                  title="Remover documento"
                  className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="px-4 py-6 text-center text-[11.5px] text-muted-foreground">
            Nenhum documento anexado a este convênio.
          </p>
        )}
      </div>
    </section>
  );
}