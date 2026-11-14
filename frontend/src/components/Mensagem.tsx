interface MensagemProps {
  tipo: "erro" | "sucesso";
  texto: string;
}

export default function Mensagem({ tipo, texto }: MensagemProps) {
  if (!texto) return null;
  return <p style={{ color: tipo === "erro" ? "crimson" : "green" }}>{texto}</p>;
}