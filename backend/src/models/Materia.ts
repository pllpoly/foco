import { ErroValidacao } from "../errors/ErroValidacao";
import { Dados } from "../repositories/BaseRepository";

export class Materia {
  #nome = "";
  #descricao: string | null = null;

  constructor(nome: string, descricao: string | null = null) {
    this.nome = nome;
    this.descricao = descricao;
  }

  get nome(): string {
    return this.#nome;
  }

  set nome(valor: string) {
    const limpo = valor.trim();
    if (limpo.length < 2) {
      throw new ErroValidacao("O nome da matéria deve ter pelo menos 2 caracteres");
    }
    if (limpo.length > 100) {
      throw new ErroValidacao("O nome da matéria deve ter no máximo 100 caracteres");
    }
    this.#nome = limpo;
  }

  get descricao(): string | null {
    return this.#descricao;
  }

  set descricao(valor: string | null) {
    const limpo = valor?.trim() || null;
    if (limpo !== null && limpo.length > 255) {
      throw new ErroValidacao("A descrição deve ter no máximo 255 caracteres");
    }
    this.#descricao = limpo;
  }

  paraPersistencia(): Dados {
    return { nome: this.#nome, descricao: this.#descricao };
  }
}