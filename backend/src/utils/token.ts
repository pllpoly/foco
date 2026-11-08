import jwt from "jsonwebtoken";

const SEGREDO = process.env.JWT_SECRET ?? "segredo-so-para-desenvolvimento";

export function gerarToken(usuarioId: number): string {
  return jwt.sign({ sub: String(usuarioId) }, SEGREDO, { expiresIn: "2h" });
}

export function verificarToken(token: string): number {
  const payload = jwt.verify(token, SEGREDO);
  if (typeof payload === "string" || !payload.sub) {
    throw new Error("Token inválido");
  }
  return Number(payload.sub);
}