import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Campo from "@/components/Campo";
import { criarConvenio } from "@/services/api";

export default function NovoConvenioDialog({ open, onOpenChange, onCriado }) {
  const [numero, setNumero] = useState("");
  const [entidade, setEntidade] = useState("");
  const [objeto, setObjeto] = useState("");
  const [valorGlobal, setValorGlobal] = useState("");
  const [valorRepasse, setValorRepasse] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const criar = async (e) => {
    e.preventDefault();
    if (!numero.trim() || !entidade.trim()) {
      setErro("Informe o número do convênio e a entidade convenente.");
      return;
    }
    setSalvando(true);
    setErro("");
    try {
      const payload = {
        numero_convenio: numero.trim(),
        convenente: entidade.trim(),
        objeto: objeto.trim(),
        orgao_concedente: "Ministério da Saúde",
        valor_global: parseFloat(valorGlobal) || 0.0,
        valor_repasse: parseFloat(valorRepasse) || 0.0,
        valor_contrapartida: 0.0,
      };

      const convenioCriado = await criarConvenio(payload);
      
      setNumero("");
      setEntidade("");
      setObjeto("");
      setValorGlobal("");
      setValorRepasse("");
      
      // Correção do nome da função de fechar o dialog
      onOpenChange(false);
      
      if (onCriado) onCriado(convenioCriado.id);
    } catch (e2) {
      setErro("Não foi possível salvar o convênio no NeonDB. Verifique se o servidor backend está rodando na porta 3001.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogTitle className="text-[16px] font-semibold tracking-tight text-gray-900">Novo convênio (NeonDB)</DialogTitle>
        <p className="mt-1 text-[12.5px] leading-relaxed text-gray-500">
          Cadastre o instrumento para salvar diretamente no banco de dados e iniciar o monitoramento.
        </p>

        <form onSubmit={criar} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Campo label="Nº do convênio" obrigatorio valor={numero} onChange={setNumero} placeholder="000000/2026" />
            <Campo label="Entidade convenente" obrigatorio valor={entidade} onChange={setEntidade} placeholder="Nome da entidade" className="sm:col-span-1" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Campo label="Valor Global (R$)" valor={valorGlobal} onChange={setValorGlobal} placeholder="0.00" />
            <Campo label="Valor Repasse (R$)" valor={valorRepasse} onChange={setValorRepasse} placeholder="0.00" />
          </div>
          <Campo
            label="Objeto do convênio"
            tipo="textarea"
            rows={3}
            valor={objeto}
            onChange={setObjeto}
            placeholder="Ex.: aquisição de equipamentos e materiais permanentes..."
          />
          {erro ? <p className="text-[11.5px] text-red-600">{erro}</p> : null}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-full border border-gray-200 px-4 py-2 text-[12.5px] font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-800 px-5 py-2 text-[12.5px] font-medium text-white transition-colors hover:bg-emerald-900 disabled:opacity-60"
            >
              {salvando ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Salvar Convênio
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}