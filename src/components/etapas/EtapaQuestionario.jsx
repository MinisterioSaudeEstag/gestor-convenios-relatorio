import React from "react";
import PerguntaCard from "@/components/PerguntaCard";

export default function EtapaQuestionario({ etapa, perguntas, respostas, onResposta }) {
  return (
    <div className="space-y-3">
      {perguntas.map((pergunta) => (
        <PerguntaCard
          key={pergunta.id}
          pergunta={pergunta}
          resposta={respostas?.[pergunta.id] || {}}
          onResposta={(campo, valor) => onResposta(etapa, pergunta.id, campo, valor)}
        />
      ))}
    </div>
  );
}