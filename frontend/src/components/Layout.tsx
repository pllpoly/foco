import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { recursos } from "../config/recursos";
import { useAuth } from "../contexts/AuthContext";

export default function Layout({ titulo, children }: { titulo: string; children: ReactNode }) {
  const { usuario, sair } = useAuth();
  const navigate = useNavigate();

  function aoSair() {
    sair();
    navigate("/login");
  }

  return (
    <div>
      <header
        style={{
          display: "flex",
          gap: 16,
          alignItems: "center",
          flexWrap: "wrap",
          padding: "12px 24px",
          borderBottom: "1px solid #ccc",
        }}
      >
        <strong>Foco</strong>
        <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link to="/dashboard">Início</Link>
          {recursos.map((r) => (
            <Link key={r.caminho} to={r.caminho}>
              {r.titulo}
            </Link>
          ))}
          <Link to="/perfil">Perfil</Link>
        </nav>
        <span style={{ marginLeft: "auto" }}>Olá, {usuario?.nome}</span>
        <button onClick={aoSair}>Sair</button>
      </header>

      <main style={{ maxWidth: 800, margin: "24px auto", padding: "0 16px" }}>
        <h1>{titulo}</h1>
        {children}
      </main>
    </div>
  );
}