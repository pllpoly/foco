import { Request } from "express";
import { TopicoRegistro } from "../repositories/TopicoRepository";
import { TopicoService } from "../services/TopicoService";
import { BaseController } from "./BaseController";

class TopicoController extends BaseController<TopicoRegistro> {
  constructor() {
    super(new TopicoService());
  }

  protected filtros(req: Request): Record<string, number> {
    const materiaId = Number(req.query.materiaId);
    return Number.isInteger(materiaId) && materiaId > 0
      ? { materia_id: materiaId }
      : {};
  }
}

export const topicoController = new TopicoController();