import type { SelectHTMLAttributes } from "react";

interface CampoSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  rotulo: string;
  erro?: string;
  opcoes: { valor: string; rotulo: string }[];
}

export default function CampoSelect({ rotulo, erro, opcoes, ...props }: CampoSelectProps) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      {rotulo}
      <select {...props} style={{ display: "block", width: "100%" }}>
        <option value="">Selecione...</option>
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.rotulo}
          </option>
        ))}
      </select>
      {erro && <small style={{ color: "crimson" }}>{erro}</small>}
    </label>
  );
}