import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/firebase.js";
import "../styles.css";
import Toast from "../components/Toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setToast({ message: "❌ Todos los campos son obligatorios", type: "error" });
      return;
    }
    if (password !== confirmPassword) {
      setToast({ message: "❌ Las contraseñas no coinciden", type: "error" });
      return;
    }

    try {
      await registerUser(email, password, name);
      setToast({ message: "¡Registro exitoso!", type: "success" });
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      setToast({ message: "❌ Error al registrar: " + error.message, type: "error" });
    }
  };

  return (
    <div className="auth-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="auth-card">
        <h1>Registro</h1>
        <input type="text" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
        <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
        <input type="password" placeholder="Confirmar contraseña" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        <button onClick={handleRegister}>Registrarse</button>
        <p>
          ¿Ya tienes cuenta? <Link to="/" className="link">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
