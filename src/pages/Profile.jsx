import { useState } from "react";
import useUserData from "../hooks/useUserData";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import { getAuth, updatePassword } from "firebase/auth";

export default function Profile() {
  const { user, loading } = useUserData();
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  if (loading) return <p>Cargando...</p>;

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      setToast({ message: "La contraseña debe tener al menos 6 caracteres", type: "error" });
      return;
    }

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      await updatePassword(currentUser, newPassword);

      setToast({ message: "Contraseña actualizada correctamente", type: "success" });
      setModalOpen(false);
      setNewPassword("");
    } catch (error) {
      console.error(error);
      setToast({ message: "Error al actualizar la contraseña", type: "error" });
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

      <h1>Perfil</h1>
      <div className="card profile-card">
        <p><strong>Nombre:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <div className="password-field">
          <strong>Contraseña:</strong>
          <input
            type={showPassword ? "text" : "password"}
            value={user.password || "********"}
            readOnly
          />
          <button 
            className="toggle-password" 
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        <button className="reset-password" onClick={() => setModalOpen(true)}>
          Restablecer contraseña
        </button>
      </div>

      {/* Modal para restablecer contraseña */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Ingrese nueva contraseña</h3>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="reset-password" onClick={handleResetPassword}>
                Guardar
              </button>
              <button className="toggle-password" onClick={() => setModalOpen(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
}
