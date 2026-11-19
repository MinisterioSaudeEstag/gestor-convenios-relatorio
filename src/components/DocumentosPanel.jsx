import React, { useRef, useState } from "react";
import { ExternalLink, FileText, Loader2, Paperclip, Trash2 } from "lucide-react";
import { enviarDocumento } from "@/services/api";

const formatarTamanho = (bytes) => {
  const n = Number(bytes) || 0;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
};

const lerArquivoComoDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Falha ao ler o arquivo local."));
    reader.readAsDataURL(file);
  });

export default function DocumentosPanel({ convenioId, documentos = [], onAtualizar }) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const inputRef = useRef(null);

  const enviar = async (file) => {
    if (!file) return;
    setEnviando(true);
    setErro("");
    try {
      if (file.size > 10 * 1024 * 1024) {
        setErro("Arquivo muito grande para análise direta (máx. 10 MB).");
        return;
      }

      const dataUrl = await lerArquivoComoDataUrl(file);

      const payload = {
        convenio_id: convenioId,
        nome: file.name,
        tipo: "geral",
        file_uri: dataUrl,
        mime: file.type || "application/octet-stream",
        tamanho: file.size,
      };

      await enviarDocumento(payload);
      if (onAtualizar) onAtualizar();
    } catch (e) {
      setErro("Não foi possível salvar o documento. Tente novamente.");
    } finally {
      setEnviando(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const abrir = (doc) => {
    if (!doc.file_uri) {
      setErro("Endereço do arquivo indisponível.");
      return;
    }

    if (doc.file_uri.startsWith("data:")) {
      const [header, base64Data] = doc.file_uri.split(",");
      const mimeMatch = header.match(/data:(.*?);base64/);
      const mimeType = mimeMatch?.[1] || doc.mime || "application/octet-stream";
      const byteChars = atob(base64Data);
      const byteNumbers = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        byteNumbers[i] = byteChars.charCodeAt(i);
      }
      const blob = new Blob([new Uint8Array(byteNumbers)], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank", "noopener");
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
      return;
    }

    window.open(doc.file_uri, "_blank", "noopener");
  };

  const excluir = async (doc) => {
    if (!window.confirm(`Deseja remover o documento "${doc.nome}"?`)) return;
    try {
      const res = await fetch(`http://localhost:3001/api/documentos/${doc.id}`, {
        method: "DELETE",
      });
      if (res.ok && onAtualizar) {
        onAtualizar();
      }
    } catch (e) {
      setErro("Não foi possível excluir o documento.");
    }
  };

  return (
    <section className="rounded-[var(--radius)] border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="flex items-center gap-1.5 text-[12.5px] font-semibold">
          <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
          Documentos (Análise IA)
        </h3>
        <span className="num-mono text-[11px] text-muted-foreground">{documentos.length}</span>
      </div>

      <div className="space-y-2 border-b border-border px-4 py-3">
        <label className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2.5 text-[12px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
          {enviando ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Paperclip className="h-3.5 w-3.5" />}
          {enviando ? "Enviando arquivo…" : "Anexar qualquer documento"}
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            disabled={enviando}
            onChange={(e) => enviar(e.target.files?.[0])}
          />
        </label>
        <p className="text-[10.5px] leading-relaxed text-muted-foreground/80">
          Envie relatórios, notas ou extratos. A IA lerá o conteúdo para cruzar com as etapas.
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
                  {doc.tamanho ? formatarTamanho(doc.tamanho) : "Arquivo anexado"}
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
            Nenhum documento anexado.
          </p>
        )}
      </div>
    </section>
  );
}