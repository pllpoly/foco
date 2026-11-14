import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { URL_API } from "../api";
import Campo from "../components/Campo";
import Mensagem from "../components/Mensagem";
import { validarCpf, validarEmail } from "../utils/validadores";

type Erros = Partial<
  Record<"nome" | "email" | "cpf" | "senha" | "confirmarSenha" | "api", string>
>;

export default function Cadastro() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [enviando, setEnviando] = useState(false);

  function validar(): Erros {
    const e: Erros = {};
    if (!nome.trim()) e.nome = "Informe o nome";
    if (!validarEmail(email)) e.email = "Email inválido";
    if (!validarCpf(cpf)) e.cpf = "CPF inválido";
    if (!senha) e.senha = "Informe a senha";
    if (senha !== confirmarSenha) e.confirmarSenha = "As senhas não conferem";
    return e;
  }

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    const e = validar();
    setErros(e);
    if (Object.keys(e).length > 0) return;

    setEnviando(true);
    try {
      const resposta = await fetch(`${URL_API}/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, cpf, senha }),
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        setErros({ api: dados.erro ?? "Erro ao cadastrar" });
        return;
      }
      navigate("/login", { state: { cadastrado: true } });
    } catch {
      setErros({ api: "Não foi possível conectar ao servidor" });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: "40px auto" }}>
      <h1>Criar conta</h1>
      <form onSubmit={enviar} noValidate>
        <Campo rotulo="Nome" value={nome} erro={erros.nome}
          onChange={(e) => setNome(e.target.value)} />
        <Campo rotulo="Email" value={email} erro={erros.email}
          onChange={(e) => setEmail(e.target.value)} />
        <Campo rotulo="CPF" value={cpf} erro={erros.cpf}
          onChange={(e) => setCpf(e.target.value)} />
        <Campo rotulo="Senha" type="password" value={senha} erro={erros.senha}
          onChange={(e) => setSenha(e.target.value)} />
        <Campo rotulo="Confirmar senha" type="password" value={confirmarSenha}
          erro={erros.confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)} />

        <Mensagem tipo="erro" texto={erros.api ?? ""} />

        <button type="submit" disabled={enviando}>
          {enviando ? "Enviando..." : "Cadastrar"}
        </button>
      </form>
      <p>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </main>
  );
}