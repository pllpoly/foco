import { Request } from "express";
import { Meta } from "../repositories/MetaRepository";
import { MetaService } from "../services/MetaService";
import { BaseController } from "./BaseController";

class MetaController extends BaseController<Meta> {
  constructor() {
    super(new MetaService());
  }

  protected filtros(req: Request): Record<string, number> {
    const materiaId = Number(req.query.materiaId);
    return Number.isInteger(materiaId) && materiaId > 0
      ? { materia_id: materiaId }
      : {};
  }
}

export const metaController = new MetaController();