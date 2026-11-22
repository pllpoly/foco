import { ErroValidacao } from "../errors/ErroValidacao";
import { Dados } from "../repositories/BaseRepository";

export class Meta {
  #materiaId = 0;
  #minutosSemanais = 0;
  #ativa: boolean | undefined;

  constructor(materiaId: number, minutosSemanais: number, ativa?: boolean) {
    this.materiaId = materiaId;
    this.minutosSemanais = minutosSemanais;
    this.#ativa = ativa;
  }

  get materiaId(): number {
    return this.#materiaId;
  }

  set materiaId(valor: number) {
    if (!Number.isInteger(valor) || valor < 1) {
      throw new ErroValidacao("Informe a matéria da meta");
    }
    this.#materiaId = valor;
  }

  get minutosSemanais(): number {
    return this.#minutosSemanais;
  }

  set minutosSemanais(valor: number) {
    if (!Number.isInteger(valor) || valor < 10 || valor > 3000) {
      throw new ErroValidacao(
        "Os minutos semanais devem ser um número inteiro entre 10 e 3000"
      );
    }
    this.#minutosSemanais = valor;
  }

  paraPersistencia(): Dados {
    return {
      materia_id: this.#materiaId,
      minutos_semanais: this.#minutosSemanais,
      ativa: this.#ativa === undefined ? undefined : this.#ativa ? 1 : 0,
    };
  }
}