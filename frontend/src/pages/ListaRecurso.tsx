import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { chamarApi } from "../api";
import Layout from "../components/Layout";
import Mensagem from "../components/Mensagem";
import Paginacao from "../components/Paginacao";
import type { ColunaConfig, RecursoConfig } from "../config/recursos";

type Registro = { id: number } & Record<string, unknown>;

const LIMITE = 5;

interface TabelaProps {
  caminho: string;
  colunas: ColunaConfig[];
  itens: Registro[];
  aoExcluir: (id: number) => void;
}

function Tabela({ caminho, colunas, itens, aoExcluir }: TabelaProps) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {colunas.map((c) => (
            <th key={c.chave} style={{ textAlign: "left" }}>
              {c.titulo}
            </th>
          ))}
          <th style={{ textAlign: "left" }}>Ações</th>
        </tr>
      </thead>
      <tbody>
        {itens.map((item) => (
          <tr key={item.id}>
            {colunas.map((c) => (
              <td key={c.chave}>
                {c.formatar ? c.formatar(item[c.chave]) : String(item[c.chave] ?? "")}
              </td>
            ))}
            <td>
              <Link to={`${caminho}/${item.id}/editar`}>Editar</Link>{" "}
              <button onClick={() => aoExcluir(item.id)}>Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function ListaRecurso({ config }: { config: RecursoConfig }) {
  const [itens, setItens] = useState<Registro[]>([]);
  const [pagina, setPagina] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const resposta = await chamarApi(`${config.caminho}?pagina=${pagina}&limite=${LIMITE}`);
      const dados = await resposta.json();
      if (!resposta.ok) {
        setErro(dados.erro ?? "Erro ao carregar");
        return;
      }
      setItens(dados.itens);
    } catch {
      setErro("Não foi possível conectar ao servidor");
    } finally {
      setCarregando(false);
    }
  }, [config.caminho, pagina]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function excluir(id: number) {
    if (!window.confirm(`Excluir esta ${config.singular}?`)) return;
    try {
      const resposta = await chamarApi(`${config.caminho}/${id}`, { method: "DELETE" });
      if (!resposta.ok) {
        const dados = await resposta.json().catch(() => ({}));
        setErro(dados.erro ?? "Erro ao excluir");
        return;
      }
      if (itens.length === 1 && pagina > 1) setPagina(pagina - 1);
      else carregar();
    } catch {
      setErro("Não foi possível conectar ao servidor");
    }
  }

  return (
    <Layout titulo={config.titulo}>
      <p>
        <Link to={`${config.caminho}/novo`}>+ Cadastrar {config.singular}</Link>
      </p>

      {carregando && <p>Carregando...</p>}
      <Mensagem tipo="erro" texto={erro} />
      {!carregando && !erro && itens.length === 0 && <p>Nada por aqui ainda.</p>}

      {itens.length > 0 && (
        <Tabela
          caminho={config.caminho}
          colunas={config.colunas}
          itens={itens}
          aoExcluir={excluir}
        />
      )}

      <Paginacao pagina={pagina} temProxima={itens.length === LIMITE} aoMudar={setPagina} />
    </Layout>
  );
}