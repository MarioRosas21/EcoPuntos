import { Link } from "react-router-dom";
import "../styles.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/profile">👤</Link>
      <Link to="/home">🏠</Link>
      <Link to="/rewards">🎁</Link>
      <Link to="/history">📜</Link>
    </nav>
  );
}
