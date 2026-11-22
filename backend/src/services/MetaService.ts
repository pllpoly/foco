import { ErroValidacao } from "../errors/ErroValidacao";
import { Dados } from "../repositories/BaseRepository";
import { MateriaRepository } from "../repositories/MateriaRepository";
import { Meta, MetaRepository } from "../repositories/MetaRepository";
import { BaseService } from "./BaseService";

export class MetaService extends BaseService<Meta> {
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

    if (typeof materiaId !== "number" || !Number.isInteger(materiaId)) {
      throw new ErroValidacao("Informe a matéria da meta");
    }
    if (
      typeof minutosSemanais !== "number" ||
      !Number.isInteger(minutosSemanais) ||
      minutosSemanais < 10 ||
      minutosSemanais > 3000
    ) {
      throw new ErroValidacao(
        "Os minutos semanais devem ser um número inteiro entre 10 e 3000"
      );
    }
    if (ativa !== undefined && typeof ativa !== "boolean") {
      throw new ErroValidacao("O campo ativa deve ser verdadeiro ou falso");
    }

    const materia = await this.materias.buscarPorId(materiaId, usuarioId);
    if (!materia) {
      throw new ErroValidacao("Matéria não encontrada");
    }

    return {
      materia_id: materiaId,
      minutos_semanais: minutosSemanais,
      ativa: ativa === undefined ? undefined : ativa ? 1 : 0,
    };
  }
}