---
name: novo-crud
description: Cria um CRUD completo no padrão do projeto Foco (tabela SQL, repository, controller e rota). Use quando o usuário pedir um novo recurso ou "criar CRUD de X".
---

# Novo CRUD no padrão do Foco

1. **Tabela SQL** (MySQL) com `usuario_id` (FK para `usuarios`, `ON DELETE CASCADE`)
   e `UNIQUE` adequado ao recurso.
2. **`repositories/XRepository.ts`**: interface do registro e classe
   `extends BaseRepository<X>` chamando `super("tabela", [colunas])`.
   A lista de colunas NÃO inclui `usuario_id`.
3. **`controllers/XController.ts`**: classe `extends BaseController<X>`.
   - Implementar `validar` (conferir `typeof`, tamanhos e limites).
   - Se o recurso depende de outro, conferir que o outro pertence ao usuário logado.
   - Sobrescrever `filtros` se a listagem filtrar por relação.
   - Exportar uma instância.
4. **Rota**: `registrarCrud(app, "/x", xController)` em `app.ts`.
5. **Testes (Bruno)**: 201 ao criar; 400 em duplicado e em dado inválido;
   404 em PUT e DELETE de id inexistente; paginação com `?pagina=&limite=`.

Regras: não repetir SQL do CRUD, não usar `any`, mensagens em português,
dono sempre vindo do token.