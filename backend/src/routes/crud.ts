import { Express } from "express";
import { BaseController } from "../controllers/BaseController";
import { autenticar } from "../middlewares/autenticar";

export function registrarCrud(
  app: Express,
  caminho: string,
  c: BaseController<{ id: number }>
) {
  app.get(caminho, autenticar, c.listar);
  app.get(`${caminho}/:id`, autenticar, c.buscar);
  app.post(caminho, autenticar, c.criar);
  app.put(`${caminho}/:id`, autenticar, c.atualizar);
  app.delete(`${caminho}/:id`, autenticar, c.excluir);
}