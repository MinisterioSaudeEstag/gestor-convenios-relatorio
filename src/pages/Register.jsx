import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, UserPlus, Loader2, FileCheck2 } from "lucide-react";

const DOMINIOS_PERMITIDOS = ["@saude.gov.br", "@outlook.com"];

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    const nomeLimpo = fullName.trim();
    const emailLimpo = email.trim().toLowerCase();

    if (nomeLimpo.split(/\s+/).length < 2) {
      setErro("Informe seu nome e sobrenome.");
      return;
    }

    const dominioValido = DOMINIOS_PERMITIDOS.some((dom) => emailLimpo.endsWith(dom));
    if (!dominioValido) {
      setErro("Apenas e-mails institucionais (@saude.gov.br ou @outlook.com) são permitidos.");
      return;
    }

    if (password.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const apiBase = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${apiBase}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailLimpo,
          password,
          full_name: nomeLimpo,
          role: "employee",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar conta.");
      }

      setSucesso("Conta criada com sucesso! Redirecionando para o login...");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setErro(err.message || "Ocorreu um erro ao registrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-xs">
            <FileCheck2 className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Crie sua conta
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Preencha os dados para acessar o sistema de relatórios
          </p>
        </div>

        {erro && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-center text-xs text-red-700">
            {erro}
          </div>
        )}

        {sucesso && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-center text-xs text-emerald-700">
            {sucesso}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Nome e Sobrenome
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Ex.: Maria Silva"
                className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              E-mail Institucional
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
                placeholder="Mínimo de 6 caracteres"
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
              <UserPlus className="h-4 w-4" />
            )}
            {loading ? "Cadastrando..." : "Criar Conta"}
          </Button>
        </form>

        <div className="mt-6 border-t border-border/60 pt-5 text-center text-xs text-muted-foreground">
          Já possui conta?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}