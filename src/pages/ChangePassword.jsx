import "../styles.css";

export default function ChangePassword() {
  return (
    <div className="container">
      <h1>Cambiar Contraseña</h1>
      <div className="card">
        <input type="password" placeholder="Contraseña actual" />
        <input type="password" placeholder="Nueva contraseña" />
        <input type="password" placeholder="Confirmar nueva contraseña" />
        <button>Actualizar</button>
      </div>
    </div>
  );
}
