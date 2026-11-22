import { ErroValidacao } from "../errors/ErroValidacao";
import { Dados } from "../repositories/BaseRepository";

export class Topico {
  #titulo = "";
  #materiaId = 0;
  #concluido: boolean | undefined;

  constructor(titulo: string, materiaId: number, concluido?: boolean) {
    this.titulo = titulo;
    this.materiaId = materiaId;
    this.#concluido = concluido;
  }

  get titulo(): string {
    return this.#titulo;
  }

  set titulo(valor: string) {
    const limpo = valor.trim();
    if (limpo.length < 2) {
      throw new ErroValidacao("O título deve ter pelo menos 2 caracteres");
    }
    if (limpo.length > 150) {
      throw new ErroValidacao("O título deve ter no máximo 150 caracteres");
    }
    this.#titulo = limpo;
  }

  get materiaId(): number {
    return this.#materiaId;
  }

  set materiaId(valor: number) {
    if (!Number.isInteger(valor) || valor < 1) {
      throw new ErroValidacao("Informe a matéria do tópico");
    }
    this.#materiaId = valor;
  }

  paraPersistencia(): Dados {
    return {
      materia_id: this.#materiaId,
      titulo: this.#titulo,
      concluido: this.#concluido === undefined ? undefined : this.#concluido ? 1 : 0,
    };
  }
}