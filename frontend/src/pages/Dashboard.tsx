import { useEffect, useState } from "react";
import { chamarApi } from "../api";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { usuario } = useAuth();
  const [sessaoValida, setSessaoValida] = useState<boolean | null>(null);

  useEffect(() => {
    chamarApi("/me")
      .then((r) => setSessaoValida(r.ok))
      .catch(() => setSessaoValida(false));
  }, []);

  return (
    <Layout titulo="Foco">
      <p>Olá, {usuario?.nome ?? "visitante"}!</p>
      <p>
        {sessaoValida === null && "Conferindo sessão..."}
        {sessaoValida === true && "Sessão confirmada pelo servidor ✅"}
        {sessaoValida === false && "Não foi possível confirmar a sessão"}
      </p>
      <p>Use o menu acima para cuidar das suas matérias, tópicos, sessões e metas.</p>
    </Layout>
  );
}