import { Link } from "react-router-dom";
import "../styles.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/profile">
        <img src="/iconos/profile.png" alt="Perfil" className="navbar-icon" />
      </Link>
      <Link to="/home">
        <img src="/iconos/home.png" alt="Inicio" className="navbar-icon" />
      </Link>
      <Link to="/rewards">
        <img src="/iconos/rewards.png" alt="Recompensas" className="navbar-icon" />
      </Link>
      <Link to="/history">
        <img src="/iconos/history.png" alt="Historial" className="navbar-icon" />
      </Link>
    </nav>
  );
}
