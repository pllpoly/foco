# Foco: planner de estudos

Aplicação web para organizar o tempo de estudo da faculdade.

**Persona:** estudante universitário que quer organizar melhor o tempo dedicado
aos estudos. Ele vê as horas estudadas por matéria e por semana, compara com as
metas e registra as sessões de estudo (leitura, exercício e revisão).

## Funcionalidades

- Cadastro, login (JWT) e edição de perfil (o email não pode ser alterado)
- 4 CRUDs autenticados, com paginação: matérias, tópicos, sessões e metas
- Pontuação por tipo de sessão (leitura, exercício e revisão), com polimorfismo
- Validação de CPF, email e nível de senha no front e no back-end

## Tecnologias

- **Back-end:** Node.js, Express, TypeScript, MySQL (mysql2), JWT
- **Front-end:** React, TypeScript, Vite, react-router-dom
- **Infra:** Docker Compose, Nginx (proxy reverso), MySQL com volume

## Arquitetura

```
Navegador ──► http://localhost:8080
                  │
           ┌──────▼──────┐
           │    nginx    │  único serviço com porta aberta
           └──┬───────┬──┘
     /api/ →  │       │  / (telas)
          ┌───▼──┐ ┌──▼──┐
          │ api  │ │ web │
          └───┬──┘ └─────┘
              │  rede interna (internal: true)
          ┌───▼──┐
          │  db  │  volume db_data
          └──────┘
```

Só o Nginx publica porta. O banco, a API e o front ficam na rede interna do
Docker e não são acessíveis de fora.

## Como rodar

Pré-requisito: Docker Desktop instalado e aberto.

1. Crie o arquivo `.env` a partir do exemplo:

```powershell
copy .env.example .env
```

2. Abra o `.env` e preencha os três valores: `DB_ROOT_PASSWORD` (uma senha
   para o banco), `DB_NAME` (pode manter `foco`) e `JWT_SECRET` (um texto
   longo e aleatório, por exemplo gerado com
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).

3. Suba tudo:

```powershell
docker compose up -d --build
```

4. Abra http://localhost:8080 e crie uma conta.

Para desligar (os dados do banco são mantidos no volume):

```powershell
docker compose down
```

Use `docker compose down -v` apenas se quiser apagar também os dados do banco.

## Verificando o isolamento

- `docker compose ps`: só o `nginx` mostra uma porta publicada (`8080->80`)
- http://localhost:3000/health não abre (a API não está exposta)
- http://localhost:8080/api/health responde com o estado da API e do banco

## API (todas as rotas, exceto cadastro e login, exigem `Authorization: Bearer <token>`)

Dentro do Docker, a API fica em `/api` (por exemplo, `/api/materias`).

| Método | Rota | O que faz |
|---|---|---|
| POST | `/usuarios` | Cadastra um usuário |
| POST | `/login` | Autentica e devolve o token JWT |
| GET | `/usuarios/me` | Dados do usuário logado |
| PUT | `/usuarios/:id` | Edita o próprio usuário |
| GET, POST | `/materias`, `/topicos`, `/sessoes`, `/metas` | Lista (`?pagina=&limite=`) e cadastra |
| GET, PUT, DELETE | `/materias/:id` (e os demais recursos) | Busca, edita e exclui |

## Estrutura de pastas

```
backend/src
  config/        conexão com o banco
  controllers/   camada HTTP (herdam de BaseController)
  services/      regras de negócio (herdam de BaseService)
  models/        entidades (Usuario, Materia, Topico, Meta, Sessao)
  repositories/  acesso ao banco (herdam de BaseRepository)
  errors/        ErroValidacao e ErroNaoEncontrado
  middlewares/   autenticação por token
  routes/        registro das rotas dos CRUDs
  utils/         validadores, senha e token
frontend/src
  pages/         telas
  components/    componentes reutilizáveis
  contexts/      usuário logado (AuthContext)
  config/        descrição dos recursos que alimenta as telas genéricas
db/init          schema criado na primeira subida do banco
nginx            configuração do proxy reverso
```

## Desenvolvimento local

Para abrir o banco no DBeaver (porta 3307, só no seu computador):

```powershell
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d db
```

## Agentes de IA

- `AGENTS.md`: regras do projeto, convenções de código e guardrails
- `.claude/skills/`: 3 skills do projeto (`novo-crud`, `revisar-seguranca` e
  `padroes-poo-typescript`)
- `.claude/settings.json` e `.claude/hooks/`: bloqueio de leitura e edição do
  `.env`, e de comandos destrutivos

## Decisões técnicas

- Senhas guardadas com hash (scrypt com sal aleatório), nunca em texto puro
- O dono dos dados vem sempre do token, nunca do corpo da requisição
- SQL sempre com placeholders (`?`), contra injeção de SQL
- `BaseRepository` e `BaseController` genéricos: um CRUD novo precisa de poucos
  arquivos curtos
- `Sessao` é uma classe abstrata, e cada tipo (`Leitura`, `Exercicio`,
  `Revisao`) calcula os próprios pontos (polimorfismo)
- Camadas com responsabilidade única: controller (HTTP), service (regras),
  model (entidade com campos privados) e repository (SQL)
## Prints de evidência

//