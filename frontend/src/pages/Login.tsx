//chama entrar e coloca usuario na caixa
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { URL_API } from "../api";
import Campo from "../components/Campo";
import Mensagem from "../components/Mensagem";
import { validarEmail } from "../utils/validadores";

export default function Login() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");//useState quando o site abre, a caixa ja nasce com o usuario que estava no localStorage, por isso atualizar a pag nao desloga ninguem

  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const { entrar: registrarLogin } = useAuth();

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
      const resposta = await fetch(`${URL_API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro ?? "Erro ao entrar");
        return;
      }

      registrarLogin(dados.token, dados.usuario);

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
        <Mensagem tipo="sucesso" texto="Cadastro realizado! Faça seu login." />
      )}

      <form onSubmit={entrar} noValidate>
        <Campo rotulo="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <Campo rotulo="Senha" type="password" value={senha}
          onChange={(e) => setSenha(e.target.value)} />

        <Mensagem tipo="erro" texto={erro} />

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