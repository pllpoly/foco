import type { InputHTMLAttributes } from "react";

interface CampoProps extends InputHTMLAttributes<HTMLInputElement> {
  rotulo: string;
  erro?: string;
}

export default function Campo({ rotulo, erro, ...props }: CampoProps) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      {rotulo}
      <input {...props} style={{ display: "block", width: "100%" }} />
      {erro && <small style={{ color: "crimson" }}>{erro}</small>}
    </label>
  );
}