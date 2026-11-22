import { ErroNaoEncontrado } from "../errors/ErroNaoEncontrado";
import { ErroValidacao } from "../errors/ErroValidacao";
import { BaseRepository, Dados } from "../repositories/BaseRepository";

interface Mensagens {
  naoEncontrado: string;
  duplicado: string;
}

export abstract class BaseService<T extends { id: number }> {
  constructor(
    protected readonly repositorio: BaseRepository<T>,
    protected readonly mensagens: Mensagens
  ) {}

  protected abstract montar(
    corpo: Record<string, unknown>,
    usuarioId: number
  ): Promise<Dados>;

  listar(
    usuarioId: number,
    pagina: number,
    limite: number,
    filtros: Record<string, number>
  ): Promise<T[]> {
    return this.repositorio.listar(usuarioId, pagina, limite, filtros);
  }

  async buscar(id: number, usuarioId: number): Promise<T> {
    const item = await this.repositorio.buscarPorId(id, usuarioId);
    if (!item) {
      throw new ErroNaoEncontrado(this.mensagens.naoEncontrado);
    }
    return item;
  }

  async criar(corpo: Record<string, unknown>, usuarioId: number): Promise<number> {
    const dados = await this.montar(corpo, usuarioId);
    try {
      return await this.repositorio.criar(usuarioId, dados);
    } catch (erro) {
      throw this.traduzir(erro);
    }
  }

  async atualizar(
    id: number,
    corpo: Record<string, unknown>,
    usuarioId: number
  ): Promise<void> {
    const dados = await this.montar(corpo, usuarioId);
    try {
      const atualizado = await this.repositorio.atualizar(id, usuarioId, dados);
      if (!atualizado) {
        throw new ErroNaoEncontrado(this.mensagens.naoEncontrado);
      }
    } catch (erro) {
      throw this.traduzir(erro);
    }
  }

  async excluir(id: number, usuarioId: number): Promise<void> {
    const excluido = await this.repositorio.excluir(id, usuarioId);
    if (!excluido) {
      throw new ErroNaoEncontrado(this.mensagens.naoEncontrado);
    }
  }

  private traduzir(erro: unknown): unknown {
    const e = erro as { code?: string };
    if (e?.code === "ER_DUP_ENTRY") {
      return new ErroValidacao(this.mensagens.duplicado);
    }
    return erro;
  }
}