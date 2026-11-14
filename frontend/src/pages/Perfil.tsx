import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { chamarApi } from "../api";
import Campo from "../components/Campo";
import Mensagem from "../components/Mensagem";
import { useAuth } from "../contexts/AuthContext";
import { nivelSenha, validarCpf } from "../utils/validadores";

type Erros = Partial<
  Record<"nome" | "cpf" | "senha" | "confirmarSenha" | "api", string>
>;

export default function Perfil() {
  const { usuario, atualizarUsuario } = useAuth();
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erros, setErros] = useState<Erros>({});
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    chamarApi("/usuarios/me")
      .then(async (resposta) => {
        if (!resposta.ok) return;
        const dados = await resposta.json();
        setNome(dados.nome);
        setCpf(dados.cpf);
      })
      .catch(() => setErros({ api: "Não foi possível carregar o perfil" }));
  }, []);

  function validar(): Erros {
    const e: Erros = {};
    if (nome.trim().length < 3) e.nome = "O nome deve ter pelo menos 3 caracteres";
    if (!validarCpf(cpf)) e.cpf = "CPF inválido";
    if (!senha) {
      e.senha = "Informe a senha";
    } else if (nivelSenha(senha) === "fraca") {
      e.senha = "Senha fraca: use 8+ caracteres com maiúscula, minúscula, número e símbolo";
    }
    if (senha !== confirmarSenha) e.confirmarSenha = "As senhas não conferem";
    return e;
  }

  async function salvar(evento: FormEvent) {
    evento.preventDefault();
    setMensagem("");
    const e = validar();
    setErros(e);
    if (Object.keys(e).length > 0 || !usuario) return;

    setEnviando(true);
    try {
      const resposta = await chamarApi(`/usuarios/${usuario.id}`, {
        method: "PUT",
        body: JSON.stringify({ nome, email: usuario.email, cpf, senha }),
      });
      const dados = await resposta.json();

      if (!resposta.ok) {
        setErros({ api: dados.erro ?? "Erro ao salvar" });
        return;
      }

      atualizarUsuario({ id: dados.id, nome: dados.nome, email: dados.email });
      setMensagem("Perfil atualizado!");
      setSenha("");
      setConfirmarSenha("");
    } catch {
      setErros({ api: "Não foi possível conectar ao servidor" });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main style={{ maxWidth: 400, margin: "40px auto" }}>
      <h1>Meu perfil</h1>
      <form onSubmit={salvar} noValidate>
        <Campo rotulo="Nome" value={nome} erro={erros.nome}
          onChange={(e) => setNome(e.target.value)} />
        <Campo rotulo="Email (não pode ser alterado)" value={usuario?.email ?? ""}
          readOnly />
        <Campo rotulo="CPF" value={cpf} erro={erros.cpf}
          onChange={(e) => setCpf(e.target.value)} />
        <Campo rotulo="Senha" type="password" value={senha} erro={erros.senha}
          onChange={(e) => setSenha(e.target.value)} />
        <Campo rotulo="Confirmar senha" type="password" value={confirmarSenha}
          erro={erros.confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)} />

        <Mensagem tipo="erro" texto={erros.api ?? ""} />
        <Mensagem tipo="sucesso" texto={mensagem} />

        <button type="submit" disabled={enviando}>
          {enviando ? "Salvando..." : "Salvar"}
        </button>
      </form>
      <p><Link to="/dashboard">Voltar ao dashboard</Link></p>
    </main>
  );
}