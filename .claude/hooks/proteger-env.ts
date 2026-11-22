let entrada = "";

process.stdin.on("data", (pedaco: Buffer) => {
  entrada += pedaco.toString();
});

process.stdin.on("end", () => {
  try {
    const dados = JSON.parse(entrada) as {
      tool_input?: { file_path?: string; command?: string };
    };
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
