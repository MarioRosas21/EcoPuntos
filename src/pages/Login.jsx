import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/firebase.js";
import Toast from "../components/Toast";
import { Mail, Lock, Eye, EyeOff, Leaf, Sparkles, ArrowRight } from "lucide-react";

import "../styles/login.css";
import logo from "../assets/ecopuntos.jpg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setToast({
        message: "Todos los campos son obligatorios",
        type: "error"
      });
      return;
    }

    setLoading(true);
    try {
      const user = await loginUser(email, password);
      console.log("✅ Bienvenido:", user.email);
      setToast({
        message: "¡Bienvenido de vuelta!",
        type: "success"
      });
      setTimeout(() => navigate("/home"), 1000);
    } catch (error) {
      setToast({
        message: "Usuario o contraseña incorrecta",
        type: "error"
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-page">
      {/* Elementos decorativos de fondo */}
      <div className="login-bg-blob login-bg-blob-1"></div>
      <div className="login-bg-blob login-bg-blob-2"></div>
      <div className="login-bg-blob login-bg-blob-3"></div>

      {/* Partículas flotantes */}
      <div className="floating-particles">
        <Leaf className="particle particle-1" />
        <Leaf className="particle particle-2" />
        <Leaf className="particle particle-3" />
        <Sparkles className="particle particle-4" />
        <Sparkles className="particle particle-5" />
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="login-container">
        <div className="login-card">
          {/* Header con logo */}
          <div className="login-header">
            <div className="logo-wrapper">
              <img src={logo} alt="EcoPuntos" className="login-logo" />
              <div className="logo-glow"></div>
            </div>
            <h1 className="login-welcome">Bienvenido de vuelta</h1>
            <p className="login-subtitle">Inicia sesión para continuar tu viaje ecológico</p>
          </div>

          {/* Formulario */}
          <div className="login-form">
            {/* Input Email */}
            <div className="input-wrapper">
              <div className="input-icon">
                <Mail />
              </div>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="login-input"
              />
            </div>

            {/* Input Password */}
            <div className="input-wrapper">
              <div className="input-icon">
                <Lock />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="login-input"
              />
              <button 
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Olvidé mi contraseña */}
            <div className="forgot-password-wrapper">
              <Link to="/forgot-password" className="forgot-password-link">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón de login */}
            <button 
              className={`login-btn ${loading ? 'loading' : ''}`}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Iniciar sesión
                  <ArrowRight className="btn-arrow" />
                </>
              )}
            </button>

            {/* Separador */}
            <div className="divider">
              <span>o</span>
            </div>

            {/* Link a registro */}
            <div className="register-section">
              <p className="register-text">
                ¿No tienes una cuenta?
              </p>
              <Link to="/register" className="register-link">
                <Sparkles className="sparkle-icon" />
                Crear cuenta nueva
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <div className="eco-badge">
              <Leaf className="eco-leaf" />
              <span>Cuidando el planeta juntos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}