import React from "react";

const BASE =
  "w-full rounded-lg border border-border bg-card px-3 py-2 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/40 focus:ring-4 focus:ring-primary/10 disabled:opacity-60";

export default function Campo({
  label,
  tipo = "texto",
  valor,
  onChange,
  placeholder,
  obrigatorio,
  dica,
  className = "",
  rows = 3,
}) {
  const id = `campo-${String(label).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  const conteudo = (() => {
    if (tipo === "textarea") {
      return (
        <textarea
          id={id}
          rows={rows}
          value={valor ?? ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${BASE} resize-y leading-relaxed`}
        />
      );
    }
    if (tipo === "moeda") {
      return (
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-muted-foreground">
            R$
          </span>
          <input
            id={id}
            type="number"
            step="0.01"
            min="0"
            value={valor ?? ""}
            placeholder={placeholder || "0,00"}
            onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
            className={`${BASE} num-mono pl-9`}
          />
        </div>
      );
    }
    if (tipo === "numero") {
      return (
        <input
          id={id}
          type="number"
          step="0.01"
          value={valor ?? ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
          className={`${BASE} num-mono`}
        />
      );
    }
    if (tipo === "data") {
      return (
        <input
          id={id}
          type="date"
          value={valor ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className={`${BASE} num-mono`}
        />
      );
    }
    return (
      <input
        id={id}
        type="text"
        value={valor ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={BASE}
      />
    );
  })();

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
        {label}
        {obrigatorio ? <span className="text-destructive">*</span> : null}
      </label>
      {conteudo}
      {dica ? <p className="mt-1 text-[11px] text-muted-foreground/80">{dica}</p> : null}
    </div>
  );
}