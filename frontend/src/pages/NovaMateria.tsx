//cadastrar materia
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { chamarApi } from "../api";

export default function NovaMateria() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function salvar(evento: FormEvent) {
    evento.preventDefault();
    setErro("");
    setMensagem("");

    if (nome.trim().length < 2) {
      setErro("O nome deve ter pelo menos 2 caracteres");
      return;
    }

    setEnviando(true);
    try {
      const resposta = await chamarApi("/materias", {
        method: "POST",
        body: JSON.stringify({ nome, descricao }),
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro ?? "Erro ao salvar");
        return;
      }

      setMensagem(`Matéria "${nome.trim}" cadastrada!`);
      setNome("");
      setDescricao("");
    } catch {
      setErro("Não foi possível conectar ao servidor");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: "40px auto" }}>
      <h1>Nova matéria</h1>

      <form onSubmit={salvar} noValidate>
        <label style={{ display: "block", marginBottom: 12 }}>
          Nome
          <input
            style={{ display: "block", width: "100%" }}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          Descrição (opcional)
          <input
            style={{ display: "block", width: "100%" }}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </label>

        {erro && <p style={{ color: "crimson" }}>{erro}</p>}
        {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? "Salvando..." : "Salvar"}
        </button>
      </form>

      <p>
        <Link to="/dashboard">Voltar ao dashboard</Link>
      </p>
    </main>
  );
}