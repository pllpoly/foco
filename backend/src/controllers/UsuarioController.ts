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

export async function verPerfil(_req: Request, res: Response) {
  try {
    const usuarioId = res.locals.usuarioId as number;
    const perfil = await repositorio.buscarPorId(usuarioId);
    if (!perfil) {
      res.status(404).json({ erro: "Usuário não encontrado" });
      return;
    }
    res.json(perfil);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
}

export async function editarUsuario(req: Request, res: Response) {
  try {
    const usuarioId = res.locals.usuarioId as number;

    if (Number(req.params.id) !== usuarioId) {
      res.status(403).json({ erro: "Você só pode editar o seu próprio usuário" });
      return;
    }

    const { nome, email, cpf, senha } = req.body ?? {};

    const campos = [nome, cpf, senha];
    if (campos.some((c) => typeof c !== "string" || c.trim() === "")) {
      throw new ErroValidacao("Preencha nome, CPF e senha");
    }

    const atual = await repositorio.buscarPorId(usuarioId);
    if (!atual) {
      res.status(404).json({ erro: "Usuário não encontrado" });
      return;
    }

    if (
      email !== undefined &&
      (typeof email !== "string" || email.trim().toLowerCase() !== atual.email)
    ) {
      throw new ErroValidacao("Não é permitido alterar o email");
    }

    const usuario = new Usuario(nome, atual.email, cpf, senha);
    const dados = usuario.paraPersistencia();
    await repositorio.atualizar(usuarioId, {
      nome: dados.nome,
      cpf: dados.cpf,
      senha_hash: dados.senha_hash,
    });

    res.json({ id: usuarioId, nome: dados.nome, email: atual.email });
  } catch (erro) {
    if (erro instanceof ErroValidacao) {
      res.status(400).json({ erro: erro.message });
      return;
    }
    console.error(erro);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }
}