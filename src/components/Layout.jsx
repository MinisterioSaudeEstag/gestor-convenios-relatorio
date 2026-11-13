import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FileCheck2, LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const noPainel = pathname === "/";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-6 px-5 lg:px-8">
          <Link to="/" className="group flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary text-primary-foreground shadow-sm transition-transform group-hover:-translate-y-px">
              <FileCheck2 className="h-[18px] w-[18px]" strokeWidth={2} />
            </span>
            <span className="leading-tight">
              <span className="block text-[13px] font-semibold tracking-tight">Convênios</span>
              <span className="block text-[9.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Relatório físico/financeiro
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <Link
              to="/"
              className={`rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${
                noPainel
                  ? "bg-accent font-medium text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Painel
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden text-right leading-tight sm:block">
              <p className="max-w-[220px] truncate text-[12.5px] font-medium">{user?.full_name || user?.email}</p>
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {user?.role === "admin" ? "Administrador" : "Analista"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              title="Sair"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1280px] px-5 py-8 lg:px-8 lg:py-10">
        <Outlet />
      </main>

      <footer className="mx-auto max-w-[1280px] px-5 pb-10 pt-4 lg:px-8">
        <p className="text-[11px] text-muted-foreground">
          Divisão de Convênios · Relatório de Acompanhamento Físico/Financeiro — modelo institucional de 8 etapas.
        </p>
      </footer>
    </div>
  );
}