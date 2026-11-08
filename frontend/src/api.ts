const URL_API = "http://localhost:3000";

export async function chamarApi(caminho: string, opcoes: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const resposta = await fetch(`${URL_API}${caminho}`, {
    ...opcoes,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opcoes.headers,
    },
  });

  if (resposta.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/login";
  }

  return resposta;
}