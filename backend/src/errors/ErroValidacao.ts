export class ErroValidacao extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "ErroValidacao";
  }
}