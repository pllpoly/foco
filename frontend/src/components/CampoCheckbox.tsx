import type { InputHTMLAttributes } from "react";

interface CampoCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  rotulo: string;
}

export default function CampoCheckbox({ rotulo, ...props }: CampoCheckboxProps) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <input type="checkbox" {...props} /> {rotulo}
    </label>
  );
}