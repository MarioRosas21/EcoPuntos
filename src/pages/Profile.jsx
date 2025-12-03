import { useState } from "react";
import { Eye, EyeOff, LogOut, Lock, Mail, User, Leaf, Droplets } from "lucide-react";
import useUserData from "../hooks/useUserData";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import { getAuth, updatePassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../../src/styles/Profile.css";

export default function Profile() {
  const { user, loading } = useUserData();
  const [toast, setToast] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      setToast({
        message: "La contraseña debe tener al menos 6 caracteres",
        type: "error",
      });
      return;
    }

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      await updatePassword(currentUser, newPassword);

      setToast({
        message: "Contraseña actualizada correctamente",
        type: "success",
      });
      setModalOpen(false);
      setNewPassword("");
    } catch (error) {
      console.error(error);
      setToast({
        message: "Error al actualizar la contraseña",
        type: "error",
      });
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);

      navigate("/");
    } catch (error) {
      console.error(error);
      setToast({
        message: "Error al cerrar sesión",
        type: "error",
      });
    }
  };

  return (
    <div className="profile-page">
      {/* Background decorativo */}
      <div className="bg-blob bg-blob-1"></div>
      <div className="bg-blob bg-blob-2"></div>
      <div className="bg-blob bg-blob-3"></div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="profile-container">
        {/* Header con logo y botón logout */}
        <div className="profile-header">
          <div className="logo-box">
            <div className="logo-icon">
              <Leaf className="leaf-icon" />
              <Droplets className="droplet-icon" />
            </div>
            <span className="logo-text">EcoPuntos</span>
          </div>

          <button onClick={handleLogout} className="logout-btn">
            <LogOut className="icon" />
            Cerrar Sesión
          </button>
        </div>

        {/* Título */}
        <h1 className="profile-title">
          <div className="title-icon">
            <User className="user-icon" />
          </div>
          Mi Perfil
        </h1>

        {/* Card */}
        <div className="profile-card">
          <div className="avatar-container">
            <div className="avatar">
              <div className="avatar-circle">
                <User className="avatar-icon" />
              </div>
              <div className="avatar-badge">
                <Leaf className="badge-icon" />
              </div>
            </div>
          </div>

          <div className="profile-fields">
            <div className="field-group">
              <label className="field-label">
                <User className="label-icon" />
                Nombre
              </label>
              <div className="field-value">
                <p className="value-text">{user.name}</p>
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">
                <Mail className="label-icon" />
                Correo Electrónico
              </label>
              <div className="field-value">
                <p className="value-text">{user.email}</p>
              </div>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="change-password-btn"
            >
              <Lock className="icon" />
              Cambiar Contraseña
            </button>
          </div>
        </div>

        <div className="eco-indicator">
          <div className="eco-badge">
            <Leaf className="eco-leaf" />
            <span className="eco-text">Cuidando el planeta juntos</span>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon-container">
              <div className="modal-icon">
                <Lock className="lock-icon" />
              </div>
            </div>

            <h3 className="modal-title">Nueva Contraseña</h3>
            <p className="modal-description">
              Ingresa una contraseña segura de al menos 6 caracteres
            </p>

            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="modal-input"
            />

            <div className="modal-buttons">
              <button
                onClick={() => setModalOpen(false)}
                className="modal-cancel-btn"
              >
                Cancelar
              </button>
              <button
                onClick={handleResetPassword}
                className="modal-save-btn"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
}
