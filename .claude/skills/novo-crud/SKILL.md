---
name: novo-crud
description: Cria um CRUD completo no padrão do projeto Foco (tabela, model, repository, service, controller e rota). Use quando o usuário pedir um novo recurso ou "criar CRUD de X".
---

# Novo CRUD no padrão do Foco

Use `Materia` como modelo de estilo. Crie, nesta ordem:

1. **Tabela SQL** (MySQL) com `usuario_id` (FK para `usuarios`, `ON DELETE CASCADE`)
   e `UNIQUE` adequado. Acrescente também em `db/init/01-schema.sql`.
2. **`models/X.ts`**: classe com campos privados `#`, `get`/`set` só onde houver
   regra (lançando `ErroValidacao`) e `paraPersistencia(): Dados`.
3. **`repositories/XRepository.ts`**: interface `XRegistro` (colunas do banco,
   em snake_case) e classe `extends BaseRepository<XRegistro>` chamando
   `super("tabela", [colunas])`. A lista de colunas NÃO inclui `usuario_id`.
4. **`services/XService.ts`**: classe `extends BaseService<XRegistro>` com
   `super(new XRepository(), { naoEncontrado, duplicado })`. O método `montar`
   confere os tipos do corpo, cria o model e, se houver relação, confere que o
   recurso relacionado pertence ao usuário (senão `ErroValidacao`). Devolve
   `model.paraPersistencia()`.
5. **`controllers/XController.ts`**: classe `extends BaseController<XRegistro>`
   com `super(new XService())`. Sobrescreva `filtros` só se a listagem filtrar por
   relação. Exporte uma instância.
6. **Rota**: `registrarCrud(app, "/x", xController)` em `app.ts`.
7. **Front**: acrescentar a descrição do recurso em `frontend/src/config/recursos.ts`.
8. **Testes**: 201 ao criar; 400 em duplicado e em dado inválido; 404 em PUT e
   DELETE de id inexistente; paginação com `?pagina=&limite=`.

Regras: não repetir SQL de CRUD, não usar `any`, mensagens em português, dono
sempre vindo do token, nenhuma regra de negócio dentro do controller.