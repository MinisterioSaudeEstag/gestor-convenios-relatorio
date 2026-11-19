import React, { useState } from "react"; 
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock, Mail, LogIn, Loader2 } from "lucide-react";
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
      const response = await fetch("http://localhost:3001/api/auth/login", {
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-border/60 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#004785] rounded-2xl mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl overflow-hidden shadow-sm">
            <img src="/logo-chronotask.jpeg" alt="Logo-chronotask" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Bem-vindo ao Convênios MS</h1>
          <p className="text-muted-foreground text-sm mt-2">Entre com seu e-mail institucional</p>
        </div>

        <div className="space-y-6">
          {erro && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 text-center">
              {erro}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="email" 
                  placeholder="nome@saude.gov.br" 
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-[#004785] outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-[#004785] outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-[#004785] hover:bg-[#003566] text-white py-6 gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
              {loading ? "Entrando..." : "Acessar Sistema"}
            </Button>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link to="/register" className="text-[#004785] font-semibold hover:underline">
            Cadastre-se aqui
          </Link>
        </div>
      </div>
    </div>
  );
}