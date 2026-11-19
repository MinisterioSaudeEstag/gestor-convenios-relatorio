import React, { useState } from "react"; 
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, UserPlus, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setErro("");

    const isInstitutional = email.endsWith("@saude.gov.br") || email.endsWith("@outlook.com");
    if (!isInstitutional) {
      setErro("Erro: Apenas e-mails institucionais (@saude.gov.br ou @outlook.com) são permitidos.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name: fullName, role: "employee" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao criar conta.");
      }

      alert("Conta criada com sucesso!");
      navigate("/login");
    } catch (err) {
      setErro(err.message || "Ocorreu um erro ao registrar.");
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
          <h1 className="text-2xl font-bold text-foreground">Crie sua conta</h1>
          <p className="text-muted-foreground text-sm mt-2">Preencha os dados para acessar o sistema</p>
        </div>

        {erro && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 text-center">
            {erro}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nome e Sobrenome</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Arthur Vinícius" 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:ring-2 focus:ring-[#004785] outline-none transition-all"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">E-mail Institucional</label>
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            {loading ? "Cadastrando..." : "Criar Conta"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Já possui conta?{" "}
          <Link to="/login" className="text-[#004785] font-semibold hover:underline">
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
}