# Foco: planner de estudos

Aplicação web para organizar o tempo de estudo da faculdade: matérias, tópicos,
sessões de estudo (leitura, exercício e revisão) e metas semanais.

Persona: estudante universitário que quer organizar melhor o tempo dedicado aos estudos da faculdade e gostaria de uma forma prática e funcional de ter esse controle. Ele precisa ver quantas horas estudou por matéria e por semana, comparar com as metas e registrar as sessões de estudo.

## Stack
- Back-end: Node 20+, Express, TypeScript, MySQL (mysql2), JWT
- Front-end: React + TypeScript (Vite) e react-router-dom
- Infra: Docker Compose (MySQL, API, front e Nginx como proxy reverso)

## Arquitetura do back-end
Fluxo de um pedido: rota, controller, service, model, repository, banco.
- `controllers/`: só HTTP. Lê o pedido, chama o service e devolve o status.
  Herdam de `BaseController`.
- `services/`: regras que envolvem mais de uma coisa (por exemplo, conferir que
  a matéria pertence ao usuário). Herdam de `BaseService`.
- `models/`: entidades com campos privados `#`, `get`/`set` só quando há regra e
  o método `paraPersistencia()`.
- `repositories/`: só SQL, sempre com placeholders `?`. Herdam de `BaseRepository`.
- `errors/`: `ErroValidacao` (resposta 400) e `ErroNaoEncontrado` (resposta 404).
- `middlewares/`: `autenticar` confere o token JWT.
- `routes/`: `registrarCrud` liga as 5 rotas de cada recurso.

## Nomenclatura
- TypeScript em camelCase; classes em PascalCase.
- snake_case somente nas colunas do banco e nas interfaces `XRegistro`, que
  descrevem uma linha do banco.
- `XRegistro` é a linha do banco; a classe `X` é a entidade com as regras.

## Comandos
- Tudo no ar: `docker compose up -d --build` na raiz; conferir com `docker compose ps`.
- Site: http://localhost:8080 (somente o Nginx tem porta aberta).
- Banco no DBeaver (porta 3307, só local):
  `docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d db`.
- Compilar para conferir tipos: `npm run build` em backend/ ou frontend/.

## Convenções de código
- TypeScript estrito. Nunca usar `any`. Sem arquivos `.js` no projeto.
- Todo SQL usa placeholders `?`. Nunca concatenar valores do usuário.
- Toda rota de dados passa por `autenticar`. O dono do dado vem de
  `res.locals.usuarioId`, nunca do corpo do pedido.
- Erro causado pelo usuário: lançar `ErroValidacao`. Recurso inexistente ou de
  outro usuário: lançar `ErroNaoEncontrado`.
- Novos CRUDs seguem o padrão de `Materia` (skill `novo-crud`).
- Textos de erro e mensagens em português.

## Guardrails (limites do agente)
- NUNCA ler, abrir, imprimir ou citar o conteúdo de `.env` ou de qualquer
  arquivo de segredos. Se precisar de uma variável, pergunte o nome dela ao
  usuário e use `.env.example` como referência.
- NUNCA escrever senhas, tokens ou segredos em código, logs, commits ou respostas.
- Pedir confirmação antes de qualquer comando destrutivo: `docker compose down -v`,
  `DROP`, `TRUNCATE`, `rm -rf`, `git push --force`, `git reset --hard`.
- Trabalhar apenas no banco local de desenvolvimento.
- Avisar antes de instalar dependências novas.
- Não fazer commit nem push sem pedido explícito do usuário.
- Se um pedido violar uma regra acima, explicar o motivo e propor uma alternativa.

## Skills do projeto
- `novo-crud`: cria um CRUD completo no padrão do projeto
- `revisar-seguranca`: checklist de segurança antes de commit ou entrega
- `padroes-poo-typescript`: confere POO, SOLID e TypeScript da rubrica