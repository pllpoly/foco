import { scryptSync, timingSafeEqual } from "node:crypto";

export function verificarSenha(senha: string, guardado: string): boolean {
  const [sal, hash] = guardado.split(":");
  if (!sal || !hash) return false;

  const esperado = Buffer.from(hash, "hex");
  const calculado = scryptSync(senha, sal, esperado.length);
  return timingSafeEqual(esperado, calculado);
}