---
name: padroes-poo-typescript
description: Confere se o código segue POO, SOLID e TypeScript exigidos pela rubrica (encapsulamento, herança, polimorfismo, generics, sem any, erros customizados, organização em camadas). Use ao revisar a Tech Forge ou ao criar classes.
---

# Padrões de POO e TypeScript

- **Encapsulamento:** estado interno com `#campo`; o construtor inicializa tudo.
- **Acesso controlado:** `get`/`set` só quando houver validação ou transformação.
- **Herança e abstração:** `abstract class` só onde há reuso real (`Sessao`,
  `BaseRepository`, `BaseService`, `BaseController`).
- **Polimorfismo:** as subclasses de `Sessao` sobrescrevem `calcularPontos`;
  quem chama não usa `if` por tipo.
- **TypeScript:** `interface` e `type` para estruturas, Generics para reuso,
  proibido `any`, nenhum arquivo `.js`.
- **SOLID:** uma responsabilidade por camada (S): controller fala HTTP, service
  aplica regras, model guarda a entidade, repository fala com o banco. Novo
  recurso é uma nova classe, sem editar o código existente (O). Subclasses
  substituem a base sem quebrar (L).
- **Exceções:** `ErroValidacao` (400) e `ErroNaoEncontrado` (404), lançados em
  services e models e traduzidos em um único lugar (`BaseController`).
- **Organização e nomenclatura:** pastas `models`, `services`, `repositories`,
  `controllers`; camelCase no código, snake_case só no banco e nas `XRegistro`.

Apontar cada violação com arquivo e linha e sugerir a correção.