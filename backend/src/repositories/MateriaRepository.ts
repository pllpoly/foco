import { BaseRepository } from "./BaseRepository";

export interface Materia {
  id: number;
  usuario_id: number;
  nome: string;
  descricao: string | null;
  criado_em: Date;
}

export class MateriaRepository extends BaseRepository<Materia> {
  constructor() {
    super("materias", ["nome", "descricao"]);
  }
}