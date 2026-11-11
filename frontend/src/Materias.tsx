import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { chamarApi } from "./api";

interface Materia {
  id: number;
  nome: string;
  descricao: string | null;
}

const LIMITE = 5;

export default function Materias() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [pagina, setPagina] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    setCarregando(true);
    setErro("");

    chamarApi(`/materias?pagina=${pagina}&limite=${LIMITE}`)
      .then(async (resposta) => {
        const dados = await resposta.json();
        if (!resposta.ok) {
          setErro(dados.erro ?? "Erro ao carregar as matérias");
          return;
        }
        setMaterias(dados.itens);
      })
      .catch(() => setErro("Não foi possível conectar ao servidor"))
      .finally(() => setCarregando(false));
  }, [pagina]);

  const temProxima = materias.length === LIMITE;

  return (
    <main style={{ maxWidth: 600, margin: "40px auto" }}>
      <h1>Minhas matérias</h1>

      {carregando && <p>Carregando...</p>}
      {erro && <p style={{ color: "crimson" }}>{erro}</p>}

      {!carregando && !erro && materias.length === 0 && (
        <p>Nenhuma matéria nesta página.</p>
      )}

      <ul>
        {materias.map((m) => (
          <li key={m.id}>
            <strong>{m.nome}</strong>
            {m.descricao && <span> — {m.descricao}</span>}
          </li>
        ))}
      </ul>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button onClick={() => setPagina(pagina - 1)} disabled={pagina === 1}>
          Anterior
        </button>
        <span>Página {pagina}</span>
        <button onClick={() => setPagina(pagina + 1)} disabled={!temProxima}>
          Próxima
        </button>
      </div>

      <p>
        <Link to="/materias/nova">Cadastrar matéria</Link> |{" "}
        <Link to="/dashboard">Voltar ao dashboard</Link>
      </p>
    </main>
  );
}