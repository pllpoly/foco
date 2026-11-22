---
name: revisar-seguranca
description: Revisa o código do Foco procurando falhas de segurança (rotas sem autenticação, SQL sem placeholders, vazamento de dados, segredos). Use ao pedir revisão de segurança ou antes de commit e entrega.
---

# Checklist de segurança

- [ ] Toda rota de dados usa `autenticar`.
- [ ] O `usuario_id` vem de `res.locals.usuarioId`, nunca do `req.body`.
- [ ] Todo SQL usa `?` para valores; só tabela e colunas fixas entram no texto.
- [ ] Nenhuma resposta devolve `senha_hash`.
- [ ] Login devolve a mesma mensagem para email inexistente e senha errada.
- [ ] Editar ou excluir id inexistente ou de outro usuário lança `ErroNaoEncontrado` (404).
- [ ] Editar usuário só funciona no próprio usuário (403) e não permite trocar o email.
- [ ] `.env` está no `.gitignore` e nada de segredo aparece no código ou nos logs.
- [ ] `JWT_SECRET` vem do ambiente (o compose recusa subir sem ele).
- [ ] Erros 500 não expõem detalhes técnicos ao usuário.
- [ ] Só o Nginx publica porta no `docker-compose.yml`.

Entregar a lista com o que passou, o que falhou (arquivo e linha) e a correção sugerida.