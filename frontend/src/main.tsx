import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import RotaProtegida from "./components/RotaProtegida";
import { recursos } from "./config/recursos";
import { AuthProvider } from "./contexts/AuthContext";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import FormRecurso from "./pages/FormRecurso";
import ListaRecurso from "./pages/ListaRecurso";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
          <Route path="/perfil" element={<RotaProtegida><Perfil /></RotaProtegida>} />

          {recursos.flatMap((r) => [
            <Route
              key={`${r.caminho}-lista`}
              path={r.caminho}
              element={<RotaProtegida><ListaRecurso key={r.caminho} config={r} /></RotaProtegida>}
            />,
            <Route
              key={`${r.caminho}-novo`}
              path={`${r.caminho}/novo`}
              element={<RotaProtegida><FormRecurso key={`${r.caminho}-novo`} config={r} /></RotaProtegida>}
            />,
            <Route
              key={`${r.caminho}-editar`}
              path={`${r.caminho}/:id/editar`}
              element={<RotaProtegida><FormRecurso key={`${r.caminho}-editar`} config={r} /></RotaProtegida>}
            />,
          ])}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);