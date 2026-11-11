import { Request } from "express";
import { ErroValidacao } from "../errors/ErroValidacao";
import { criarSessao } from "../models/Sessao";
import { Dados } from "../repositories/BaseRepository";
import { SessaoRegistro, SessaoRepository } from "../repositories/SessaoRepository";
import { TopicoRepository } from "../repositories/TopicoRepository";
import { BaseController } from "./BaseController";

class SessaoController extends BaseController<SessaoRegistro> {
  private readonly topicos = new TopicoRepository();

  constructor() {
    super(new SessaoRepository(), {
      naoEncontrado: "Sessão não encontrada",
      duplicado: "Sessão duplicada",
    });
  }

  protected filtros(req: Request): Record<string, number> {
    const topicoId = Number(req.query.topicoId);
    return Number.isInteger(topicoId) && topicoId > 0
      ? { topico_id: topicoId }
      : {};
  }

  protected async validar(
    corpo: Record<string, unknown>,
    usuarioId: number
  ): Promise<Dados> {
    const { tipo, minutos, topicoId, observacao } = corpo;

    if (typeof topicoId !== "number" || !Number.isInteger(topicoId)) {
      throw new ErroValidacao("Informe o tópico da sessão");
    }
    if (observacao != null && typeof observacao !== "string") {
      throw new ErroValidacao("A observação deve ser um texto");
    }
    if (typeof observacao === "string" && observacao.trim().length > 255) {
      throw new ErroValidacao("A observação deve ter no máximo 255 caracteres");
    }

    const sessao = criarSessao(tipo, minutos);

    const topico = await this.topicos.buscarPorId(topicoId, usuarioId);
    if (!topico) {
      throw new ErroValidacao("Tópico não encontrado");
    }

    return {
      topico_id: topicoId,
      tipo: sessao.tipo,
      minutos: sessao.minutos,
      pontos: sessao.calcularPontos(),
      observacao: typeof observacao === "string" ? observacao.trim() || null : null,
    };
  }
}

export const sessaoController = new SessaoController();