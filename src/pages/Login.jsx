import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/firebase.js";
import Toast from "../components/Toast";

import "../styles/login.css";
import logo from "../assets/ecopuntos.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setToast({
        message: "❌ Todos los campos son obligatorios",
        type: "error"
      });
      return;
    }

    try {
      const user = await loginUser(email, password);
      console.log("✅ Bienvenido:", user.email);
      navigate("/home");
    } catch (error) {
      setToast({
        message: "❌ Usuario o contraseña incorrecta",
        type: "error"
      });
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="login-card">
        <h1>Bienvenido</h1>

        <img src={logo} alt="EcoPuntos" className="login-logo" />

        <h2>Iniciar sesión</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <p className="login-link">Olvidé mi contraseña</p>

        <button className="login-btn" onClick={handleLogin}>
          Entrar
        </button>

        <p className="login-register-text">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="login-link">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
