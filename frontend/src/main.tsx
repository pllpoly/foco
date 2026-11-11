import Materias from "./Materias";
import NovaMateria from "./NovaMateria";
import RotaProtegida from "./RotaProtegida";
import Dashboard from "./Dashboard";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App";
import Login from "./Login";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <RotaProtegida>
              <Dashboard />
            </RotaProtegida>
          } />

        <Route
          path="/materias"
          element={
            <RotaProtegida>
              <Materias />
            </RotaProtegida>
          } />
          
        <Route
          path="/materias/nova"
          element={
            <RotaProtegida>
              <NovaMateria />
            </RotaProtegida>
          }/>
      </Routes>    
    </BrowserRouter>
  </StrictMode>
);