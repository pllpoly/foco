import Perfil from "./pages/Perfil";
import { AuthProvider } from "./contexts/AuthContext";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import RotaProtegida from "./components/RotaProtegida";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Materias from "./pages/Materias";
import NovaMateria from "./pages/NovaMateria";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
          <Route path="/perfil" element={<RotaProtegida><Perfil /></RotaProtegida>} />
          <Route path="/materias" element={<RotaProtegida><Materias /></RotaProtegida>} />
          <Route path="/materias/nova" element={<RotaProtegida><NovaMateria /></RotaProtegida>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);// AuthProvider: a 'caixa' guarda usuario, entrar e sair