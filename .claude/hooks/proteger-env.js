let entrada = "";
process.stdin.on("data", (pedaco) => (entrada += pedaco));
process.stdin.on("end", () => {
  try {
    const dados = JSON.parse(entrada);
    const alvo = String(
      dados.tool_input?.file_path ?? dados.tool_input?.command ?? ""
    );
    const mencionaEnv = /(^|[\\/\s])\.env($|[.\s"'])/.test(alvo);
    if (mencionaEnv && !alvo.includes(".env.example")) {
      console.error("Bloqueado: o agente não pode acessar arquivos .env.");
      process.exit(2);
    }
  } catch {
    // entrada inesperada: deixa seguir, as regras de permissão continuam valendo
  }
  process.exit(0);
});