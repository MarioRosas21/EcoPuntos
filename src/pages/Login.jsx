import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/firebase.js";
import "../styles.css";
import Toast from "../components/Toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setToast({ message: "❌ Todos los campos son obligatorios", type: "error" });
      return;
    }

    try {
      const user = await loginUser(email, password);
      console.log("✅ Bienvenido:", user.email);
      navigate("/home"); // redirige al home
    } catch (error) {
      setToast({ message: "❌ Usuario o contraseña incorrecta", type: "error" });
      console.error(error);
    }
  };

  return (
    <div className="container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <h1>Bienvenido</h1>
      <div className="card">
        <h2>Iniciar sesión</h2>
        <input
          type="text"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="link">Olvidé mi contraseña</p>
        <button onClick={handleLogin}>Entrar</button>
        <p>
          ¿No tienes cuenta? <Link to="/register" className="link">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
