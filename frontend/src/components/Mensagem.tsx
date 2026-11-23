interface MensagemProps {
  tipo: "erro" | "sucesso";
  texto: string;
}

export default function Mensagem({ tipo, texto }: MensagemProps) {
  if (!texto) return null;
  return (
    <p className={tipo === "erro" ? "mensagem-erro" : "mensagem-sucesso"}>{texto}</p>
  );
}