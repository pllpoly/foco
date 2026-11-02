import cors from "cors";
import express from "express";
import { pool } from "./config/database";
import { cadastrarUsuario } from "./controllers/UsuarioController";

export const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ api: "ok", banco: rows });
  } catch (erro) {
    res.status(500).json({ api: "ok", banco: "sem conexão" });
  }
});

app.post("/usuarios", cadastrarUsuario);