import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { chamarApi } from "../api";
import Campo from "../components/Campo";
import CampoCheckbox from "../components/CampoCheckbox";
import CampoSelect from "../components/CampoSelect";
import Layout from "../components/Layout";
import Mensagem from "../components/Mensagem";
import type { CampoConfig, RecursoConfig } from "../config/recursos";

type Valores = Record<string, string | boolean>;
type Opcao = { valor: string; rotulo: string };

function valoresIniciais(campos: CampoConfig[]): Valores {
  const valores: Valores = {};
  for (const c of campos) {
    valores[c.nome] = c.tipo === "checkbox" ? (c.padrao ?? false) : "";
  }
  return valores;
}

function validar(campos: CampoConfig[], valores: Valores): Record<string, string> {
  const erros: Record<string, string> = {};
  for (const c of campos) {
    const texto = String(valores[c.nome]).trim();
    if (c.obrigatorio && c.tipo !== "checkbox" && texto === "") {
      erros[c.nome] = `Informe: ${c.rotulo.toLowerCase()}`;
    } else if (c.tipo === "numero" && texto !== "" && !Number.isInteger(Number(texto))) {
      erros[c.nome] = "Informe um número inteiro";
    }
  }
  return erros;
}

function montarCorpo(campos: CampoConfig[], valores: Valores) {
  const corpo: Record<string, unknown> = {};
  for (const c of campos) {
    const valor = valores[c.nome];
    if (c.tipo === "checkbox") {
      corpo[c.nome] = Boolean(valor);
    } else if (c.tipo === "numero" || (c.tipo === "selecao" && c.relacao)) {
      corpo[c.nome] = valor === "" ? undefined : Number(valor);
    } else {
      corpo[c.nome] = String(valor).trim();
    }
  }
  return corpo;
}

export default function FormRecurso({ config }: { config: RecursoConfig }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [valores, setValores] = useState<Valores>(() => valoresIniciais(config.campos));
  const [errosCampos, setErrosCampos] = useState<Record<string, string>>({});
  const [opcoesRelacao, setOpcoesRelacao] = useState<Record<string, Opcao[]>>({});
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    config.campos.forEach(async (c) => {
      if (!c.relacao) return;
      try {
        const resposta = await chamarApi(`${c.relacao.caminho}?limite=50`);
        if (!resposta.ok) return;
        const dados = await resposta.json();
        const campoRotulo = c.relacao.campoRotulo;
        const opcoes = (dados.itens as Record<string, unknown>[]).map((item) => ({
          valor: String(item.id),
          rotulo: String(item[campoRotulo]),
        }));
        setOpcoesRelacao((anterior) => ({ ...anterior, [c.nome]: opcoes }));
      } catch {
        // sem opções: o campo fica vazio e o usuário vê o aviso ao salvar
      }
    });
  }, [config]);

  useEffect(() => {
    if (!id) return;
    chamarApi(`${config.caminho}/${id}`)
      .then(async (resposta) => {
        const dados = await resposta.json();
        if (!resposta.ok) {
          setErro(dados.erro ?? "Não encontrado");
          return;
        }
        const carregados = valoresIniciais(config.campos);
        for (const c of config.campos) {
          const bruto = dados[c.chave ?? c.nome];
          carregados[c.nome] =
            c.tipo === "checkbox" ? bruto === 1 || bruto === true : String(bruto ?? "");
        }
        setValores(carregados);
      })
      .catch(() => setErro("Não foi possível conectar ao servidor"));
  }, [id, config]);

  function mudar(nome: string, valor: string | boolean) {
    setValores((anterior) => ({ ...anterior, [nome]: valor }));
  }

  async function salvar(evento: FormEvent) {
    evento.preventDefault();
    setErro("");
    const erros = validar(config.campos, valores);
    setErrosCampos(erros);
    if (Object.keys(erros).length > 0) return;

    setEnviando(true);
    try {
      const resposta = await chamarApi(id ? `${config.caminho}/${id}` : config.caminho, {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(montarCorpo(config.campos, valores)),
      });
      const dados = await resposta.json();
      if (!resposta.ok) {
        setErro(dados.erro ?? "Erro ao salvar");
        return;
      }
      navigate(config.caminho);
    } catch {
      setErro("Não foi possível conectar ao servidor");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Layout titulo={`${id ? "Editar" : "Cadastrar"} ${config.singular}`}>
      <form onSubmit={salvar} noValidate style={{ maxWidth: 400 }}>
        {config.campos.map((c) => {
          if (c.tipo === "checkbox") {
            return (
              <CampoCheckbox
                key={c.nome}
                rotulo={c.rotulo}
                checked={Boolean(valores[c.nome])}
                onChange={(e) => mudar(c.nome, e.target.checked)}
              />
            );
          }
          if (c.tipo === "selecao") {
            return (
              <CampoSelect
                key={c.nome}
                rotulo={c.rotulo}
                erro={errosCampos[c.nome]}
                opcoes={c.opcoes ?? opcoesRelacao[c.nome] ?? []}
                value={String(valores[c.nome])}
                onChange={(e) => mudar(c.nome, e.target.value)}
              />
            );
          }
          return (
            <Campo
              key={c.nome}
              rotulo={c.rotulo}
              erro={errosCampos[c.nome]}
              type={c.tipo === "numero" ? "number" : "text"}
              value={String(valores[c.nome])}
              onChange={(e) => mudar(c.nome, e.target.value)}
            />
          );
        })}

        <Mensagem tipo="erro" texto={erro} />

        <button type="submit" disabled={enviando}>
          {enviando ? "Salvando..." : "Salvar"}
        </button>
      </form>
      <p>
        <Link to={config.caminho}>Voltar à lista</Link>
      </p>
    </Layout>
  );
}