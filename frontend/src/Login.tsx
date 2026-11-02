import { Link, useLocation } from "react-router-dom";

export default function Login() {
  const { state } = useLocation();
  return (
    <main style={{ maxWidth: 400, margin: "40px auto" }}>
      <h1>Login</h1>
      {state?.cadastrado && (
        <p style={{ color: "green" }}>Cadastro realizado! Faça seu login.</p>
      )}
      <p>(A tela de login será feita na próxima sprint)</p>
      <Link to="/">Voltar ao cadastro</Link>
    </main>
  );
}