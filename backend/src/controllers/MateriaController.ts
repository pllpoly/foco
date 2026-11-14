//valida o nome (tamanho, tipo) e entrega os dados limpos ao repository

import { ErroValidacao } from "../errors/ErroValidacao";
import { Dados } from "../repositories/BaseRepository";
import { Materia, MateriaRepository } from "../repositories/MateriaRepository";
import { BaseController } from "./BaseController";

class MateriaController extends BaseController<Materia> {
  constructor() {
    super(new MateriaRepository(), {
      naoEncontrado: "Matéria não encontrada",
      duplicado: "Você já tem uma matéria com esse nome",
    });
  }

  protected async validar(corpo: Record<string, unknown>): Promise<Dados> {
    const { nome, descricao } = corpo;

    if (typeof nome !== "string" || nome.trim().length < 2) {
      throw new ErroValidacao("O nome da matéria deve ter pelo menos 2 caracteres");
    }
    if (nome.trim().length > 100) {
      throw new ErroValidacao("O nome da matéria deve ter no máximo 100 caracteres");
    }
    if (descricao != null && typeof descricao !== "string") {
      throw new ErroValidacao("A descrição deve ser um texto");
    }
    if (typeof descricao === "string" && descricao.trim().length > 255) {
      throw new ErroValidacao("A descrição deve ter no máximo 255 caracteres");
    }

    return {
      nome: nome.trim(),
      descricao: typeof descricao === "string" ? descricao.trim() || null : null,
    };
  }
}

export const materiaController = new MateriaController();