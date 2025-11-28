import { NavLink } from "react-router-dom";
import "../styles/home.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink
        to="/profile"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        <img
          src="/iconos/profile.png"
          alt="Perfil"
          className="navbar-icon"
        />
      </NavLink>

      <NavLink
        to="/home"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        <img src="/iconos/home.png" alt="Inicio" className="navbar-icon" />
      </NavLink>

      <NavLink
        to="/rewards"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        <img
          src="/iconos/rewards.png"
          alt="Recompensas"
          className="navbar-icon"
        />
      </NavLink>

      
      {/*<NavLink
        to="/history"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        <img
          src="/iconos/history.png"
          alt="Historial"
          className="navbar-icon"
        />
      </NavLink>
      */}

      <NavLink
        to="/know"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        <img
          src="/iconos/info.png"
          alt="¿Sabías que?"
          className="navbar-icon"
        />
      </NavLink>
    </nav>
  );
}
