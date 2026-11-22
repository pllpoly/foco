import { BaseRepository } from "./BaseRepository";

export interface MateriaRegistro {
  id: number;
  usuario_id: number;
  nome: string;
  descricao: string | null;
  criado_em: Date;
}

export class MateriaRepository extends BaseRepository<MateriaRegistro> {
  constructor() {
    super("materias", ["nome", "descricao"]);
  }
}