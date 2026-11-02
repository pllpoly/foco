import { ResultSetHeader } from "mysql2";
import { pool } from "../config/database";
import { ErroValidacao } from "../errors/ErroValidacao";
import { Usuario } from "../models/Usuario";

export class UsuarioRepository {
  async criar(usuario: Usuario): Promise<number> {
    const dados = usuario.paraPersistencia();

    try {
      const [resultado] = await pool.execute<ResultSetHeader>(
        "INSERT INTO usuarios (nome, email, cpf, senha_hash) VALUES (?, ?, ?, ?)",
        [dados.nome, dados.email, dados.cpf, dados.senha_hash]
      );
      return resultado.insertId;
    } catch (erro) {
      const e = erro as { code?: string; sqlMessage?: string };
      if (e.code === "ER_DUP_ENTRY") {
        const campo = e.sqlMessage?.includes("usuarios.cpf") ? "CPF" : "Email";
        throw new ErroValidacao(`${campo} já cadastrado`);
      }
      throw erro;
    }
  }
}