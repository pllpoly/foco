import { ErroValidacao } from "../errors/ErroValidacao";

export type TipoSessao = "leitura" | "exercicio" | "revisao";

export abstract class Sessao {
  #minutos = 0;
  abstract readonly tipo: TipoSessao;

  constructor(minutos: number) {
    this.minutos = minutos;
  }

  get minutos(): number {
    return this.#minutos;
  }

  set minutos(valor: number) {
    if (!Number.isInteger(valor) || valor < 1 || valor > 600) {
      throw new ErroValidacao("Os minutos devem ser um número inteiro entre 1 e 600");
    }
    this.#minutos = valor;
  }

  abstract calcularPontos(): number;
}

export class Leitura extends Sessao {
  readonly tipo = "leitura" as const;

  calcularPontos(): number {
    return this.minutos;
  }
}

export class Exercicio extends Sessao {
  readonly tipo = "exercicio" as const;

  calcularPontos(): number {
    return this.minutos * 2;
  }
}

export class Revisao extends Sessao {
  readonly tipo = "revisao" as const;

  calcularPontos(): number {
    return Math.round(this.minutos * 1.5);
  }
}

export function criarSessao(tipo: unknown, minutos: unknown): Sessao {
  if (typeof minutos !== "number") {
    throw new ErroValidacao("Informe os minutos da sessão");
  }
  switch (tipo) {
    case "leitura":
      return new Leitura(minutos);
    case "exercicio":
      return new Exercicio(minutos);
    case "revisao":
      return new Revisao(minutos);
    default:
      throw new ErroValidacao("Tipo inválido: use leitura, exercicio ou revisao");
  }
}