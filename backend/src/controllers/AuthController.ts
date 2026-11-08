import { Request, Response } from "express";
import { UsuarioRepository } from "../repositories/UsuarioRepository";
import { verificarSenha } from "../utils/senha";
import { gerarToken } from "../utils/token";

const repositorio = new UsuarioRepository();

export async function login(req: Request, res: Response) {
  try {
    const { email, senha } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof senha !== "string" ||
      !email.trim() ||
      !senha
    ) {
      res.status(400).json({ erro: "Informe email e senha" });
      return;
    }

    const usuario = await repositorio.buscarPorEmail(email);

    if (!usuario || !verificarSenha(senha, usuario.senha_hash)) {
      res.status(401).json({ erro: "Email ou senha incorretos" });
      return;
    }

    res.json({
      token: gerarToken(usuario.id),
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
}