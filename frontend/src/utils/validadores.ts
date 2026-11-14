export function somenteDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}

export function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validarCpf(cpf: string): boolean {
  const d = somenteDigitos(cpf);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;

  const digito = (base: string, pesoInicial: number): number => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += Number(base[i]) * (pesoInicial - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return (
    digito(d.slice(0, 9), 10) === Number(d[9]) &&
    digito(d.slice(0, 10), 11) === Number(d[10])
  );
}

export type NivelSenha = "fraca" | "média" | "forte";

export function nivelSenha(senha: string): NivelSenha {
  const criterios = [
    senha.length >= 8,
    /[a-z]/.test(senha),
    /[A-Z]/.test(senha),
    /\d/.test(senha),
    /[^A-Za-z0-9]/.test(senha),
  ];
  const pontos = criterios.filter(Boolean).length;
  if (pontos <= 2) return "fraca";
  if (pontos <= 4) return "média";
  return "forte";
}