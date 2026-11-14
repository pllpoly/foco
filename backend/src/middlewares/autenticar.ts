import { NextFunction, Request, Response } from "express";
import { verificarToken } from "../utils/token";

export function autenticar(req: Request, res: Response, next: NextFunction) {
  const cabecalho = req.headers.authorization;//confere a assinatura do token

  if (!cabecalho?.startsWith("Bearer ")) {
    res.status(401).json({ erro: "Token não informado" });
    return;
  }

  try {
    const token = cabecalho.slice(7);
    res.locals.usuarioId = verificarToken(token); //guarda os ids
    next();
  } catch {
    res.status(401).json({ erro: "Token inválido ou expirado" });
  }
}