import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/firebase.js"; // tu función de Firebase
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
      const uid = await registerUser(email, password, name);
      setToast({ message: "¡Registro exitoso de usuario!", type: "success" });

      setTimeout(() => {
        navigate("/"); // redirige al login después de mostrar el toast
      }, 1500);
      
      console.log("✅ Usuario registrado con UID:", uid);
    } catch (error) {
      setToast({ message: "❌ Error al registrar: " + error.message, type: "error" });
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

      <h1>Registro</h1>
      <div className="card">
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
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
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button onClick={handleRegister}>Registrarse</button>
        <p>
          ¿Ya tienes cuenta? <Link to="/" className="link">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
