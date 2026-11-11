---
name: padroes-poo-typescript
description: Confere se o código segue POO, SOLID e TypeScript exigidos pela rubrica (encapsulamento, herança, polimorfismo, generics, sem any, erros customizados). Use ao revisar a Tech Forge ou ao criar classes.
---

# Padrões de POO e TypeScript

- **Encapsulamento:** estado interno com `#campo`; construtor inicializa tudo.
- **Acesso controlado:** `get`/`set` só quando houver validação ou transformação.
- **Herança e abstração:** `abstract class` só onde há reuso real (`Sessao`,
  `BaseRepository`, `BaseController`).
- **Polimorfismo:** subclasses sobrescrevem o método abstrato (`calcularPontos`);
  quem chama não usa `if` por tipo.
- **TypeScript:** `interface` e `type` para estruturas, `Generics` para reuso,
  proibido `any`.
- **SOLID:** uma responsabilidade por classe (S); novo tipo = nova classe, sem editar
  o código existente (O); subclasses substituem a base sem quebrar (L).
- **Exceções:** erros customizados (`ErroValidacao`), arquivos organizados em pastas.

Apontar cada violação com arquivo e linha e sugerir a correção.