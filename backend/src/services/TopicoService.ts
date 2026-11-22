import { ErroValidacao } from "../errors/ErroValidacao";
import { Topico } from "../models/Topico";
import { Dados } from "../repositories/BaseRepository";
import { MateriaRepository } from "../repositories/MateriaRepository";
import { TopicoRegistro, TopicoRepository } from "../repositories/TopicoRepository";
import { BaseService } from "./BaseService";

export class TopicoService extends BaseService<TopicoRegistro> {
  private readonly materias = new MateriaRepository();

  constructor() {
    super(new TopicoRepository(), {
      naoEncontrado: "Tópico não encontrado",
      duplicado: "Essa matéria já tem um tópico com esse título",
    });
  }

  protected async montar(
    corpo: Record<string, unknown>,
    usuarioId: number
  ): Promise<Dados> {
    const { titulo, materiaId, concluido } = corpo;

    if (typeof titulo !== "string") {
      throw new ErroValidacao("Informe o título do tópico");
    }
    if (typeof materiaId !== "number") {
      throw new ErroValidacao("Informe a matéria do tópico");
    }
    if (concluido !== undefined && typeof concluido !== "boolean") {
      throw new ErroValidacao("O campo concluído deve ser verdadeiro ou falso");
    }

    const topico = new Topico(titulo, materiaId, concluido);

    const materia = await this.materias.buscarPorId(materiaId, usuarioId);
    if (!materia) {
      throw new ErroValidacao("Matéria não encontrada");
    }

    return topico.paraPersistencia();
  }
}