import { Request, Response } from "express";
import { ErroNaoEncontrado } from "../errors/ErroNaoEncontrado";
import { ErroValidacao } from "../errors/ErroValidacao";
import { BaseService } from "../services/BaseService";

export abstract class BaseController<T extends { id: number }> {
  constructor(protected readonly servico: BaseService<T>) {}

  protected filtros(_req: Request): Record<string, number> {
    return {};
  }

  private responderErro(erro: unknown, res: Response) {
    if (erro instanceof ErroValidacao) {
      res.status(400).json({ erro: erro.message });
      return;
    }
    if (erro instanceof ErroNaoEncontrado) {
      res.status(404).json({ erro: erro.message });
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
      const itens = await this.servico.listar(
        usuarioId,
        pagina,
        limite,
        this.filtros(req)
      );
      res.json({ pagina, limite, itens });
    } catch (erro) {
      this.responderErro(erro, res);
    }
  };

  buscar = async (req: Request, res: Response) => {
    try {
      const usuarioId = res.locals.usuarioId as number;
      res.json(await this.servico.buscar(this.lerId(req), usuarioId));
    } catch (erro) {
      this.responderErro(erro, res);
    }
  };

  criar = async (req: Request, res: Response) => {
    try {
      const usuarioId = res.locals.usuarioId as number;
      const id = await this.servico.criar(req.body ?? {}, usuarioId);
      res.status(201).json({ id });
    } catch (erro) {
      this.responderErro(erro, res);
    }
  };

  atualizar = async (req: Request, res: Response) => {
    try {
      const usuarioId = res.locals.usuarioId as number;
      const id = this.lerId(req);
      await this.servico.atualizar(id, req.body ?? {}, usuarioId);
      res.json({ id });
    } catch (erro) {
      this.responderErro(erro, res);
    }
  };

  excluir = async (req: Request, res: Response) => {
    try {
      const usuarioId = res.locals.usuarioId as number;
      await this.servico.excluir(this.lerId(req), usuarioId);
      res.status(204).send();
    } catch (erro) {
      this.responderErro(erro, res);
    }
  };
}