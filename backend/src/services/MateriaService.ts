import { ErroValidacao } from "../errors/ErroValidacao";
import { Materia } from "../models/Materia";
import { Dados } from "../repositories/BaseRepository";
import { MateriaRegistro, MateriaRepository } from "../repositories/MateriaRepository";
import { BaseService } from "./BaseService";

export class MateriaService extends BaseService<MateriaRegistro> {
  constructor() {
    super(new MateriaRepository(), {
      naoEncontrado: "Matéria não encontrada",
      duplicado: "Você já tem uma matéria com esse nome",
    });
  }

  protected async montar(corpo: Record<string, unknown>): Promise<Dados> {
    const { nome, descricao } = corpo;

    if (typeof nome !== "string") {
      throw new ErroValidacao("Informe o nome da matéria");
    }
    if (descricao != null && typeof descricao !== "string") {
      throw new ErroValidacao("A descrição deve ser um texto");
    }

    return new Materia(nome, descricao ?? null).paraPersistencia();
  }
}