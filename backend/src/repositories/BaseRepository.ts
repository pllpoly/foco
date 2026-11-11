import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import { ErroValidacao } from "../errors/ErroValidacao";

export type ValorSql = string | number | null;
export type Dados = Record<string, ValorSql | undefined>;

export abstract class BaseRepository<T extends { id: number }> {
  constructor(
    protected readonly tabela: string,
    protected readonly colunas: readonly string[]
  ) {}

  private camposValidos(dados: Dados): string[] {
    const campos = this.colunas.filter((c) => dados[c] !== undefined);
    if (campos.length === 0) {
      throw new ErroValidacao("Nenhum dado válido foi informado");
    }
    return campos;
  }

  async listar(
    usuarioId: number,
    pagina = 1,
    limite = 10,
    filtros: Record<string, number> = {}
  ): Promise<T[]> {
    const lim = Math.min(Math.max(Math.floor(limite), 1), 50);
    const offset = (Math.max(Math.floor(pagina), 1) - 1) * lim;
    const chaves = Object.keys(filtros).filter((c) => this.colunas.includes(c));
    const extra = chaves.map((c) => ` AND ${c} = ?`).join("");

    const [linhas] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM ${this.tabela} WHERE usuario_id = ?${extra} ORDER BY id DESC LIMIT ${lim} OFFSET ${offset}`,
      [usuarioId, ...chaves.map((c) => filtros[c])]
    );
    return linhas as T[];
  }

  async buscarPorId(id: number, usuarioId: number): Promise<T | null> {
    const [linhas] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM ${this.tabela} WHERE id = ? AND usuario_id = ?`,
      [id, usuarioId]
    );
    return (linhas[0] as T) ?? null;
  }

  async criar(usuarioId: number, dados: Dados): Promise<number> {
    const campos = this.camposValidos(dados);
    const sql = `INSERT INTO ${this.tabela} (usuario_id, ${campos.join(", ")}) VALUES (?, ${campos.map(() => "?").join(", ")})`;
    const [resultado] = await pool.execute<ResultSetHeader>(sql, [
      usuarioId,
      ...campos.map((c) => dados[c] as ValorSql),
    ]);
    return resultado.insertId;
  }

  async atualizar(id: number, usuarioId: number, dados: Dados): Promise<boolean> {
    const campos = this.camposValidos(dados);
    const sql = `UPDATE ${this.tabela} SET ${campos.map((c) => `${c} = ?`).join(", ")} WHERE id = ? AND usuario_id = ?`;
    const [resultado] = await pool.execute<ResultSetHeader>(sql, [
      ...campos.map((c) => dados[c] as ValorSql),
      id,
      usuarioId,
    ]);
    return resultado.affectedRows > 0;
  }

  async excluir(id: number, usuarioId: number): Promise<boolean> {
    const [resultado] = await pool.execute<ResultSetHeader>(
      `DELETE FROM ${this.tabela} WHERE id = ? AND usuario_id = ?`,
      [id, usuarioId]
    );
    return resultado.affectedRows > 0;
  }
}