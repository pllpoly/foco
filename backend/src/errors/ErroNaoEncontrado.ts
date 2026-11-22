export class ErroNaoEncontrado extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "ErroNaoEncontrado";
  }
}