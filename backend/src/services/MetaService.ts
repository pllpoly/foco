import { ErroValidacao } from "../errors/ErroValidacao";
import { Meta } from "../models/Meta";
import { Dados } from "../repositories/BaseRepository";
import { MateriaRepository } from "../repositories/MateriaRepository";
import { MetaRegistro, MetaRepository } from "../repositories/MetaRepository";
import { BaseService } from "./BaseService";

export class MetaService extends BaseService<MetaRegistro> {
  private readonly materias = new MateriaRepository();

  constructor() {
    super(new MetaRepository(), {
      naoEncontrado: "Meta não encontrada",
      duplicado: "Essa matéria já tem uma meta",
    });
  }

  protected async montar(
    corpo: Record<string, unknown>,
    usuarioId: number
  ): Promise<Dados> {
    const { materiaId, minutosSemanais, ativa } = corpo;

    if (typeof materiaId !== "number") {
      throw new ErroValidacao("Informe a matéria da meta");
    }
    if (typeof minutosSemanais !== "number") {
      throw new ErroValidacao("Informe os minutos semanais");
    }
    if (ativa !== undefined && typeof ativa !== "boolean") {
      throw new ErroValidacao("O campo ativa deve ser verdadeiro ou falso");
    }

    const meta = new Meta(materiaId, minutosSemanais, ativa);

    const materia = await this.materias.buscarPorId(materiaId, usuarioId);
    if (!materia) {
      throw new ErroValidacao("Matéria não encontrada");
    }

    return meta.paraPersistencia();
  }
}