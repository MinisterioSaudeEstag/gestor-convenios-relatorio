import React from "react";

export default function LogoMarca({
  size = "md",
  showText = false,
  subtitle = "Acompanhamento de Convênios",
  className = "",
}) {
  const tamanhos = {
    sm: "h-8 w-8 rounded-lg",
    md: "h-12 w-12 rounded-xl",
    lg: "h-16 w-16 rounded-2xl",
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        className={`flex shrink-0 items-center justify-center overflow-hidden border border-primary/20 bg-white shadow-xs ${
          tamanhos[size] || tamanhos.md
        }`}
      >
        <img
          src="/logo-relatorio.png"
          alt="Logo Convênios MS - Relatórios"
          className="h-full w-full object-contain p-1"
        />
      </div>

      {showText && (
        <div className="text-left leading-tight">
          <span className="block text-sm font-bold tracking-tight text-foreground">
            Convênios MS
          </span>
          {subtitle ? (
            <span className="block text-[11px] text-muted-foreground">
              {subtitle}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}