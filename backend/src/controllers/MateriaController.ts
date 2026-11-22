import { Materia } from "../repositories/MateriaRepository";
import { MateriaService } from "../services/MateriaService";
import { BaseController } from "./BaseController";

class MateriaController extends BaseController<Materia> {
  constructor() {
    super(new MateriaService());
  }
}

export const materiaController = new MateriaController();