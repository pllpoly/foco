import cors from "cors";
import express from "express";
import { pool } from "./config/database";
import { autenticar } from "./middlewares/autenticar";
import { login } from "./controllers/AuthController";
import { materiaController } from "./controllers/MateriaController";
import { metaController } from "./controllers/MetaController";
import { sessaoController } from "./controllers/SessaoController";
import { topicoController } from "./controllers/TopicoController";
import {
  cadastrarUsuario,
  editarUsuario,
  verPerfil,
} from "./controllers/UsuarioController";
import { registrarCrud } from "./routes/crud"; //escreve lista de combinacoes 'se chegar tal pedido chame tal funcao', ele escreve a lista a partir do momento que a api liga, nao quando o pedido chega

export const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ api: "ok", banco: rows });
  } catch {
    res.status(500).json({ api: "ok", banco: "sem conexão" });
  }
});

app.post("/usuarios", cadastrarUsuario);
app.post("/login", login);

app.get("/me", autenticar, (_req, res) => {
  res.json({ usuarioId: res.locals.usuarioId });
});

app.get("/usuarios/me", autenticar, verPerfil);
app.put("/usuarios/:id", autenticar, editarUsuario);

registrarCrud(app, "/materias", materiaController); //aqui a materia é escrita, ele escreve os pedidos de materias e aponta para o MateriaController
registrarCrud(app, "/topicos", topicoController);
registrarCrud(app, "/sessoes", sessaoController);
registrarCrud(app, "/metas", metaController);