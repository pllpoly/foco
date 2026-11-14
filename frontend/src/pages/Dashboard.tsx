//abre a caixa com useAuth e le o nome, prox telas abrem a mesma caixa dai
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { chamarApi } from "../api";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { usuario, sair } = useAuth();
  const [sessaoValida, setSessaoValida] = useState<boolean | null>(null);

  useEffect(() => {
    chamarApi("/me")
      .then((r) => setSessaoValida(r.ok))
      .catch(() => setSessaoValida(false));
  }, []);

  function aoSair() {
    sair();
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
      <p><Link to="/perfil">Meu perfil</Link></p>
      <button onClick={aoSair}>Sair</button>
    </main>
  );
}