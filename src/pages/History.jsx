import useUserData from "../hooks/useUserData";
import Navbar from "../components/Navbar";
import PointsCard from "../components/PointsCard";

export default function History() {
  const { user, loading } = useUserData();
  if (loading) return <p>Cargando...</p>;

  return (
    <div className="container">
          <div className="logo">
        <img src="/ecoPuntosLogo.jpg" alt="EcoPuntos" />
    </div>
      <h1>Historial de Reciclaje</h1>
      <PointsCard points={user.points} title="Total puntos acumulados" />

      <div className="history-card">
        {user.history?.length > 0 ? (
          user.history.map((item, i) => (
            <div key={i} className="history-item">
              <span>{new Date(item.date).toLocaleDateString()}</span>
              <span>{item.material}</span>
              <span>{item.points} pts</span>
            </div>
          ))
        ) : (
          <p>No hay historial registrado</p>
        )}
      </div>

      <Navbar />
    </div>
  );
}
