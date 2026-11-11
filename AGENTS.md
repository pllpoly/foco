# Foco: planner de estudos

Aplicação web para organizar estudos: matérias, tópicos, sessões de estudo
(leitura, exercício e revisão) e metas semanais.

Persona: (preencha com a persona/cliente do seu projeto)

## Stack
- Back-end: Node 20+, Express, TypeScript, MySQL (mysql2), JWT
- Front-end: React + TypeScript (Vite) e react-router-dom
- Infra: Docker Compose (MySQL, API, front e Nginx)

## Estrutura
- backend/src: config, controllers, repositories, models, errors, middlewares, routes, utils
- frontend/src: pages, components, contexts e api.ts

## Comandos
- Banco: `docker compose up -d db` (na raiz)
- API: `npm run dev` em backend/ (precisa de DB_PASSWORD no ambiente)
- Front: `npm run dev` em frontend/

## Convenções de código
- TypeScript estrito. Nunca usar `any`.
- Campos privados com `#`. Getters e setters só quando houver regra ou transformação.
- Erro causado pelo usuário: lançar `ErroValidacao` (resposta 400).
- Todo SQL usa placeholders `?`. Nunca concatenar valores do usuário.
- Toda rota de dados passa por `autenticar`. O dono do dado vem de `res.locals.usuarioId`, nunca do corpo.
- Novos CRUDs herdam de `BaseRepository` e `BaseController` (skill `novo-crud`).
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