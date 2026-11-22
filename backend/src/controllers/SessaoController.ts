import { Request } from "express";
import { SessaoRegistro } from "../repositories/SessaoRepository";
import { SessaoService } from "../services/SessaoService";
import { BaseController } from "./BaseController";

class SessaoController extends BaseController<SessaoRegistro> {
  constructor() {
    super(new SessaoService());
  }

  protected filtros(req: Request): Record<string, number> {
    const topicoId = Number(req.query.topicoId);
    return Number.isInteger(topicoId) && topicoId > 0
      ? { topico_id: topicoId }
      : {};
  }
}

export const sessaoController = new SessaoController();