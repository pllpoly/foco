import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/database";
import { ErroValidacao } from "../errors/ErroValidacao";
import { Usuario } from "../models/Usuario";

export interface UsuarioRegistro {
  id: number;
  nome: string;
  email: string;
  senha_hash: string;
}

export interface UsuarioPerfil {
  id: number;
  nome: string;
  email: string;
  cpf: string;
}

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

    async buscarPorEmail(email: string): Promise<UsuarioRegistro | null> {
    const [linhas] = await pool.execute<RowDataPacket[]>(
      "SELECT id, nome, email, senha_hash FROM usuarios WHERE email = ?",
      [email.trim().toLowerCase()]
    );
    return (linhas[0] as UsuarioRegistro) ?? null;
  }

  async buscarPorId(id: number): Promise<UsuarioPerfil | null> {
    const [linhas] = await pool.execute<RowDataPacket[]>(
      "SELECT id, nome, email, cpf FROM usuarios WHERE id = ?",
      [id]
    );
    return (linhas[0] as UsuarioPerfil) ?? null;
  }

  async atualizar(
    id: number,
    dados: { nome: string; cpf: string; senha_hash: string }
  ): Promise<void> {
    try {
      await pool.execute(
        "UPDATE usuarios SET nome = ?, cpf = ?, senha_hash = ? WHERE id = ?",
        [dados.nome, dados.cpf, dados.senha_hash, id]
      );
    } catch (erro) {
      const e = erro as { code?: string };
      if (e.code === "ER_DUP_ENTRY") {
        throw new ErroValidacao("CPF já cadastrado");
      }
      throw erro;
    }
  }
}