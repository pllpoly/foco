import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { recursos } from "../config/recursos";
import { useAuth } from "../contexts/AuthContext";

function classeMenu({ isActive }: { isActive: boolean }) {
  return isActive ? "ativo" : undefined;
}

export default function Layout({ titulo, children }: { titulo: string; children: ReactNode }) {
  const { usuario, sair } = useAuth();
  const navigate = useNavigate();

  function aoSair() {
    sair();
    navigate("/login");
  }

  return (
    <div className="pagina">
      <header className="topo">
        <span className="marca">Foco</span>
        <nav className="menu">
          <NavLink to="/dashboard" className={classeMenu}>
            Dashboard
          </NavLink>
          {recursos.map((r) => (
            <NavLink key={r.caminho} to={r.caminho} className={classeMenu}>
              {r.titulo}
            </NavLink>
          ))}
          <NavLink to="/perfil" className={classeMenu}>
            Perfil
          </NavLink>
        </nav>
        <div className="usuario">
          <span>Olá, {usuario?.nome}</span>
          <button onClick={aoSair}>Sair</button>
        </div>
      </header>

      <main className="conteudo">
        <h1>{titulo}</h1>
        {children}
      </main>
    </div>
  );
}