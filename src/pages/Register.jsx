import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/firebase.js";
import Toast from "../components/Toast";
import { User, Mail, Lock, Eye, EyeOff, Leaf, Sparkles, ArrowRight, CheckCircle } from "lucide-react";

import "../styles/register.css";
import logo from "../assets/ecopuntos.jpg";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validación de contraseña
  const passwordRequirements = {
    minLength: password.length >= 6,
    hasNumber: /\d/.test(password),
    match: password === confirmPassword && password.length > 0
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setToast({ message: "Todos los campos son obligatorios", type: "error" });
      return;
    }
    
    if (!passwordRequirements.minLength) {
      setToast({ message: "La contraseña debe tener al menos 6 caracteres", type: "error" });
      return;
    }

    if (password !== confirmPassword) {
      setToast({ message: "Las contraseñas no coinciden", type: "error" });
      return;
    }

    setLoading(true);
    try {
      await registerUser(email, password, name);
      setToast({ message: "¡Registro exitoso! Bienvenido a EcoPuntos", type: "success" });
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      setToast({ message: "Error al registrar: " + error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  return (
    <div className="register-page">
      {/* Elementos decorativos de fondo */}
      <div className="register-bg-blob register-bg-blob-1"></div>
      <div className="register-bg-blob register-bg-blob-2"></div>
      <div className="register-bg-blob register-bg-blob-3"></div>

      {/* Partículas flotantes */}
      <div className="floating-particles">
        <Leaf className="particle particle-1" />
        <Leaf className="particle particle-2" />
        <Leaf className="particle particle-3" />
        <Sparkles className="particle particle-4" />
        <Sparkles className="particle particle-5" />
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="register-container">
        <div className="register-card">
          {/* Header con logo */}
          <div className="register-header">
            <div className="logo-wrapper">
              <img src={logo} alt="EcoPuntos" className="register-logo" />
              <div className="logo-glow"></div>
            </div>
            <h1 className="register-welcome">Únete a EcoPuntos</h1>
            <p className="register-subtitle">Comienza tu viaje hacia un planeta más verde</p>
          </div>

          {/* Formulario */}
          <div className="register-form">
            {/* Input Nombre */}
            <div className="input-wrapper">
              <div className="input-icon">
                <User />
              </div>
              <input
                type="text"
                placeholder="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="register-input"
              />
            </div>

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
                className="register-input"
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
                className="register-input"
              />
              <button 
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Input Confirmar Password */}
            <div className="input-wrapper">
              <div className="input-icon">
                <Lock />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="register-input"
              />
              <button 
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Requisitos de contraseña */}
            {password.length > 0 && (
              <div className="password-requirements">
                <div className={`requirement ${passwordRequirements.minLength ? 'met' : ''}`}>
                  <CheckCircle className="requirement-icon" />
                  <span>Mínimo 6 caracteres</span>
                </div>
                <div className={`requirement ${passwordRequirements.match ? 'met' : ''}`}>
                  <CheckCircle className="requirement-icon" />
                  <span>Las contraseñas coinciden</span>
                </div>
              </div>
            )}

            {/* Botón de registro */}
            <button 
              className={`register-btn ${loading ? 'loading' : ''}`}
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear cuenta
                  <ArrowRight className="btn-arrow" />
                </>
              )}
            </button>

            {/* Separador */}
            <div className="divider">
              <span>o</span>
            </div>

            {/* Link a login */}
            <div className="login-section">
              <p className="login-text">
                ¿Ya tienes una cuenta?
              </p>
              <Link to="/" className="login-link">
                <Leaf className="leaf-icon" />
                Iniciar sesión
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="register-footer">
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