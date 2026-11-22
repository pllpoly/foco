import { BaseRepository } from "./BaseRepository";

export interface TopicoRegistro {
  id: number;
  usuario_id: number;
  materia_id: number;
  titulo: string;
  concluido: number;
  criado_em: Date;
}

export class TopicoRepository extends BaseRepository<TopicoRegistro> {
  constructor() {
    super("topicos", ["materia_id", "titulo", "concluido"]);
  }
}