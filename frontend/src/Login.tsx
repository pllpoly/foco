import { validarEmail } from "./validadores";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function entrar(evento: FormEvent) {
    evento.preventDefault();
    setErro("");

    if (!email.trim() || !senha) {
      setErro("Informe email e senha");
      return;
    }

        if (!validarEmail(email)) {
      setErro("Email inválido");
      return;
    }
    
    setEnviando(true);
    try {
      const resposta = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro ?? "Erro ao entrar");
        return;
      }

      localStorage.setItem("token", dados.token);
      localStorage.setItem("usuario", JSON.stringify(dados.usuario));
      navigate("/dashboard");
    } catch {
      setErro("Não foi possível conectar ao servidor");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: "40px auto" }}>
      <h1>Login</h1>

      {state?.cadastrado && (
        <p style={{ color: "green" }}>Cadastro realizado! Faça seu login.</p>
      )}

      <form onSubmit={entrar} noValidate>
        <label style={{ display: "block", marginBottom: 12 }}>
          Email
          <input
            style={{ display: "block", width: "100%" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          Senha
          <input
            style={{ display: "block", width: "100%" }}
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </label>

        {erro && <p style={{ color: "crimson" }}>{erro}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p>
        Não tem conta? <Link to="/">Cadastre-se</Link>
      </p>
    </main>
  );
}