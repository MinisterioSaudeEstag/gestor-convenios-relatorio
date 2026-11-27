import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock, Mail, LogIn, Loader2, FileCheck2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setErro("");

    try {
      const apiBase = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao autenticar.");
      }

      login(data.user);
      navigate("/");
    } catch (err) {
      setErro(err.message || "Ocorreu um erro inesperado ao entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
  <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
    <div className="mb-8 flex flex-col items-center text-center">
      <LogoMarca size="lg" className="mb-4" />
      <h1 className="text-xl font-bold tracking-tight text-foreground">
        Convênios MS · Relatórios
      </h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Entre com seu e-mail institucional para acessar o sistema
      </p>
    </div>

        <div className="space-y-6">
          {erro && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-center text-xs text-red-700">
              {erro}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="nome@saude.gov.br"
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full gap-2 rounded-lg bg-primary py-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-[#085533]"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {loading ? "Entrando..." : "Acessar Sistema"}
            </Button>
          </form>
        </div>

        <div className="mt-6 border-t border-border/60 pt-5 text-center text-xs text-muted-foreground">
          Não tem conta?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Cadastre-se aqui
          </Link>
        </div>
      </div>
    </div>
  );
}