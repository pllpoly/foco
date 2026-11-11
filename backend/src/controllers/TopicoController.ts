import { Request } from "express";
import { ErroValidacao } from "../errors/ErroValidacao";
import { Dados } from "../repositories/BaseRepository";
import { MateriaRepository } from "../repositories/MateriaRepository";
import { Topico, TopicoRepository } from "../repositories/TopicoRepository";
import { BaseController } from "./BaseController";

class TopicoController extends BaseController<Topico> {
  private readonly materias = new MateriaRepository();

  constructor() {
    super(new TopicoRepository(), {
      naoEncontrado: "Tópico não encontrado",
      duplicado: "Essa matéria já tem um tópico com esse título",
    });
  }

  protected filtros(req: Request): Record<string, number> {
    const materiaId = Number(req.query.materiaId);
    return Number.isInteger(materiaId) && materiaId > 0
      ? { materia_id: materiaId }
      : {};
  }

  protected async validar(
    corpo: Record<string, unknown>,
    usuarioId: number
  ): Promise<Dados> {
    const { titulo, materiaId, concluido } = corpo;

    if (typeof titulo !== "string" || titulo.trim().length < 2) {
      throw new ErroValidacao("O título deve ter pelo menos 2 caracteres");
    }
    if (titulo.trim().length > 150) {
      throw new ErroValidacao("O título deve ter no máximo 150 caracteres");
    }
    if (typeof materiaId !== "number" || !Number.isInteger(materiaId)) {
      throw new ErroValidacao("Informe a matéria do tópico");
    }
    if (concluido !== undefined && typeof concluido !== "boolean") {
      throw new ErroValidacao("O campo concluído deve ser verdadeiro ou falso");
    }

    const materia = await this.materias.buscarPorId(materiaId, usuarioId);
    if (!materia) {
      throw new ErroValidacao("Matéria não encontrada");
    }

    return {
      materia_id: materiaId,
      titulo: titulo.trim(),
      concluido: concluido === undefined ? undefined : concluido ? 1 : 0,
    };
  }
}

export const topicoController = new TopicoController();