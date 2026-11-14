export interface CampoConfig {
  nome: string; // nome enviado no corpo do pedido (topicoController vai ler dps) ex: materiaId (envia)- TS
  chave?: string; // chave que a API devolve ex: materia_id, no caso a api devolve dessa forma para se feito alterações, do jeito que esta no banco (recebe)- SQLtradução acontece no validar
  rotulo: string;
  tipo: "texto" | "numero" | "selecao" | "checkbox";
  obrigatorio?: boolean;
  padrao?: boolean;
  opcoes?: { valor: string; rotulo: string }[];
  relacao?: { caminho: string; campoRotulo: string };
}

export interface ColunaConfig {
  chave: string;
  titulo: string;
  formatar?: (valor: unknown) => string;
}

export interface RecursoConfig {
  caminho: string;
  titulo: string;
  singular: string;
  colunas: ColunaConfig[];
  campos: CampoConfig[];
}

const simNao = (valor: unknown) => (valor === 1 || valor === true ? "Sim" : "Não");

export const recursos: RecursoConfig[] = [
  {
    caminho: "/materias",
    titulo: "Matérias",
    singular: "matéria",
    colunas: [
      { chave: "nome", titulo: "Nome" },
      { chave: "descricao", titulo: "Descrição" },
    ],
    campos: [
      { nome: "nome", rotulo: "Nome", tipo: "texto", obrigatorio: true },
      { nome: "descricao", rotulo: "Descrição (opcional)", tipo: "texto" },
    ],
  },
  {
    caminho: "/topicos",
    titulo: "Tópicos",
    singular: "tópico",
    colunas: [
      { chave: "titulo", titulo: "Título" },
      { chave: "materia_id", titulo: "Matéria (id)" },
      { chave: "concluido", titulo: "Concluído", formatar: simNao },
    ],
    campos: [
      { nome: "titulo", rotulo: "Título", tipo: "texto", obrigatorio: true },
      {
        nome: "materiaId",// ida (oq enviamos) ao salvar post e put
        chave: "materia_id",// volta (oq a api devolve) ao carregar um resgistro para edição
        rotulo: "Matéria",// texto que aparece na tela
        tipo: "selecao",
        obrigatorio: true,
        relacao: { caminho: "/materias", campoRotulo: "nome" },
      },
      { nome: "concluido", rotulo: "Concluído", tipo: "checkbox" },
    ],
  },
  {
    caminho: "/sessoes",
    titulo: "Sessões",
    singular: "sessão",
    colunas: [
      { chave: "tipo", titulo: "Tipo" },
      { chave: "minutos", titulo: "Minutos" },
      { chave: "pontos", titulo: "Pontos" },
      { chave: "topico_id", titulo: "Tópico (id)" },
    ],
    campos: [
      {
        nome: "topicoId",
        chave: "topico_id",
        rotulo: "Tópico",
        tipo: "selecao",
        obrigatorio: true,
        relacao: { caminho: "/topicos", campoRotulo: "titulo" },
      },
      {
        nome: "tipo",
        rotulo: "Tipo",
        tipo: "selecao",
        obrigatorio: true,
        opcoes: [
          { valor: "leitura", rotulo: "Leitura" },
          { valor: "exercicio", rotulo: "Exercício" },
          { valor: "revisao", rotulo: "Revisão" },
        ],
      },
      { nome: "minutos", rotulo: "Minutos", tipo: "numero", obrigatorio: true },
      { nome: "observacao", rotulo: "Observação (opcional)", tipo: "texto" },
    ],
  },
  {
    caminho: "/metas",
    titulo: "Metas",
    singular: "meta",
    colunas: [
      { chave: "materia_id", titulo: "Matéria (id)" },
      { chave: "minutos_semanais", titulo: "Minutos por semana" },
      { chave: "ativa", titulo: "Ativa", formatar: simNao },
    ],
    campos: [
      {
        nome: "materiaId",
        chave: "materia_id",
        rotulo: "Matéria",
        tipo: "selecao",
        obrigatorio: true,
        relacao: { caminho: "/materias", campoRotulo: "nome" },
      },
      {
        nome: "minutosSemanais",
        chave: "minutos_semanais",
        rotulo: "Minutos por semana",
        tipo: "numero",
        obrigatorio: true,
      },
      { nome: "ativa", rotulo: "Ativa", tipo: "checkbox", padrao: true },
    ],
  },
];