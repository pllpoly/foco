import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { chamarApi } from "./api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [sessaoValida, setSessaoValida] = useState<boolean | null>(null);

  const texto = localStorage.getItem("usuario");
  const usuario = texto ? JSON.parse(texto) : null;

  useEffect(() => {
    chamarApi("/me")
      .then((r) => setSessaoValida(r.ok))
      .catch(() => setSessaoValida(false));
  }, []);

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  }

  return (
    <main style={{ maxWidth: 600, margin: "40px auto" }}>
      <h1>Foco</h1>
      <p>Olá, {usuario?.nome ?? "visitante"}!</p>
      <p>
        {sessaoValida === null && "Conferindo sessão..."}
        {sessaoValida === true && "Sessão confirmada pelo servidor ✅"}
        {sessaoValida === false && "Não foi possível confirmar a sessão"}
      </p>
      <p><Link to="/materias">Minhas matérias</Link></p>
      <p><Link to="/materias/nova">Cadastrar matéria</Link></p>
      <button onClick={sair}>Sair</button>
    </main>
  );
}