import { BaseRepository } from "./BaseRepository";

export interface SessaoRegistro {
  id: number;
  usuario_id: number;
  topico_id: number;
  tipo: "leitura" | "exercicio" | "revisao";
  minutos: number;
  pontos: number;
  observacao: string | null;
  criado_em: Date;
}

export class SessaoRepository extends BaseRepository<SessaoRegistro> {
  constructor() {
    super("sessoes", ["topico_id", "tipo", "minutos", "pontos", "observacao"]);
  }
}