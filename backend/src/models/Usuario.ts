import { randomBytes, scryptSync } from "node:crypto";
import { ErroValidacao } from "../errors/ErroValidacao";
import {
  nivelSenha,
  somenteDigitos,
  validarCpf,
  validarEmail,
} from "../utils/validadores";

export class Usuario {
  #nome = "";
  #email = "";
  #cpf = "";
  #senhaHash = "";

  constructor(
    nome: string,
    email: string,
    cpf: string,
    senha: string,
    readonly id?: number
  ) {
    this.nome = nome;
    this.email = email;
    this.cpf = cpf;
    this.definirSenha(senha);
  }

  get nome(): string {
    return this.#nome;
  }
  set nome(valor: string) {
    const limpo = valor.trim();
    if (limpo.length < 3) {
      throw new ErroValidacao("O nome deve ter pelo menos 3 caracteres");
    }
    this.#nome = limpo;
  }

  get email(): string {
    return this.#email;
  }
  set email(valor: string) {
    const limpo = valor.trim().toLowerCase();
    if (!validarEmail(limpo)) {
      throw new ErroValidacao("Email inválido");
    }
    this.#email = limpo;
  }

  get cpf(): string {
    return this.#cpf;
  }
  set cpf(valor: string) {
    if (!validarCpf(valor)) {
      throw new ErroValidacao("CPF inválido");
    }
    this.#cpf = somenteDigitos(valor);
  }

  definirSenha(senha: string): void {
    if (nivelSenha(senha) === "fraca") {
      throw new ErroValidacao(
        "Senha fraca: use 8+ caracteres com maiúscula, minúscula, número e símbolo"
      );
    }
    const sal = randomBytes(16).toString("hex");
    const hash = scryptSync(senha, sal, 64).toString("hex");
    this.#senhaHash = `${sal}:${hash}`;
  }

  paraPersistencia() {
    return {
      nome: this.#nome,
      email: this.#email,
      cpf: this.#cpf,
      senha_hash: this.#senhaHash,
    };
  }
}