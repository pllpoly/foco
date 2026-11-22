import { BaseRepository } from "./BaseRepository";

export interface MetaRegistro {
  id: number;
  usuario_id: number;
  materia_id: number;
  minutos_semanais: number;
  ativa: number;
  criado_em: Date;
}

export class MetaRepository extends BaseRepository<MetaRegistro> {
  constructor() {
    super("metas", ["materia_id", "minutos_semanais", "ativa"]);
  }
}