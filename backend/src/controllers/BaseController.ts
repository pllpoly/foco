import { Request, Response } from "express";
import { ErroValidacao } from "../errors/ErroValidacao";
import { BaseRepository, Dados } from "../repositories/BaseRepository";

interface Textos {
  naoEncontrado: string;
  duplicado: string;
}

export abstract class BaseController<T extends { id: number }> {
  constructor(
    protected readonly repositorio: BaseRepository<T>,
    protected readonly textos: Textos
  ) {}

  protected abstract validar(
    corpo: Record<string, unknown>,
    usuarioId: number
  ): Promise<Dados>;

  protected filtros(_req: Request): Record<string, number> {
    return {};
  }

  private tratarErro(erro: unknown, res: Response) {
    if (erro instanceof ErroValidacao) {
      res.status(400).json({ erro: erro.message });
      return;
    }
    const e = erro as { code?: string };
    if (e.code === "ER_DUP_ENTRY") {
      res.status(400).json({ erro: this.textos.duplicado });
      return;
    }
    console.error(erro);
    res.status(500).json({ erro: "Erro interno do servidor" });
  }

  private lerId(req: Request): number {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      throw new ErroValidacao("Id inválido");
    }
    return id;
  }

  listar = async (req: Request, res: Response) => {
    try {
      const usuarioId = res.locals.usuarioId as number;
      const pagina = Number(req.query.pagina) || 1;
      const limite = Number(req.query.limite) || 10;
      const itens = await this.repositorio.listar(
        usuarioId,
        pagina,
        limite,
        this.filtros(req)
      );
      res.json({ pagina, limite, itens });
    } catch (erro) {
      this.tratarErro(erro, res);
    }
  };

  buscar = async (req: Request, res: Response) => {
    try {
      const usuarioId = res.locals.usuarioId as number;
      const item = await this.repositorio.buscarPorId(this.lerId(req), usuarioId);
      if (!item) {
        res.status(404).json({ erro: this.textos.naoEncontrado });
        return;
      }
      res.json(item);
    } catch (erro) {
      this.tratarErro(erro, res);
    }
  };

  criar = async (req: Request, res: Response) => {
    try {
      const usuarioId = res.locals.usuarioId as number;
      const dados = await this.validar(req.body ?? {}, usuarioId);
      const id = await this.repositorio.criar(usuarioId, dados);
      res.status(201).json({ id });
    } catch (erro) {
      this.tratarErro(erro, res);
    }
  };

  atualizar = async (req: Request, res: Response) => {
    try {
      const usuarioId = res.locals.usuarioId as number;
      const id = this.lerId(req);
      const dados = await this.validar(req.body ?? {}, usuarioId);
      const atualizado = await this.repositorio.atualizar(id, usuarioId, dados);
      if (!atualizado) {
        res.status(404).json({ erro: this.textos.naoEncontrado });
        return;
      }
      res.json({ id });
    } catch (erro) {
      this.tratarErro(erro, res);
    }
  };

  excluir = async (req: Request, res: Response) => {
    try {
      const usuarioId = res.locals.usuarioId as number;
      const excluido = await this.repositorio.excluir(this.lerId(req), usuarioId);
      if (!excluido) {
        res.status(404).json({ erro: this.textos.naoEncontrado });
        return;
      }
      res.status(204).send();
    } catch (erro) {
      this.tratarErro(erro, res);
    }
  };
}