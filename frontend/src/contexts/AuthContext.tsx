import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
}

interface AuthContextoTipo {
  usuario: Usuario | null;
  entrar: (token: string, usuario: Usuario) => void;
  atualizarUsuario: (usuario: Usuario) => void;
  sair: () => void;
}

const AuthContext = createContext<AuthContextoTipo | null>(null);

function lerUsuarioSalvo(): Usuario | null {
  try {
    const texto = localStorage.getItem("usuario");
    return texto ? (JSON.parse(texto) as Usuario) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(lerUsuarioSalvo);//ao abrir o site, copia do caderno para a lousa(entrar e atualizar usuario)

  function entrar(token: string, novo: Usuario) {
    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(novo));
    setUsuario(novo);
  }

  //escreve os dois
  function atualizarUsuario(novo: Usuario) {
    localStorage.setItem("usuario", JSON.stringify(novo));//caderno
    setUsuario(novo);//lousa
  }

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, entrar, atualizarUsuario, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

//a tela abre a caixa
export function useAuth(): AuthContextoTipo {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return contexto;
}