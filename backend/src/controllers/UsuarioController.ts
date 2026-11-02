import { Request, Response } from "express";
import { ErroValidacao } from "../errors/ErroValidacao";
import { Usuario } from "../models/Usuario";
import { UsuarioRepository } from "../repositories/UsuarioRepository";

const repositorio = new UsuarioRepository();

export async function cadastrarUsuario(req: Request, res: Response) {
  try {
    const { nome, email, cpf, senha } = req.body ?? {};

    const campos = [nome, email, cpf, senha];
    if (campos.some((c) => typeof c !== "string" || c.trim() === "")) {
      throw new ErroValidacao("Preencha nome, email, senha e CPF");
    }

    const usuario = new Usuario(nome, email, cpf, senha);
    const id = await repositorio.criar(usuario);

    res.status(201).json({ id, nome: usuario.nome, email: usuario.email });
  } catch (erro) {
    if (erro instanceof ErroValidacao) {
      res.status(400).json({ erro: erro.message });
      return;
    }
    console.error(erro);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
}