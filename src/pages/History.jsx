import useUserData from "../hooks/useUserData";
import Navbar from "../components/Navbar";
import PointsCard from "../components/PointsCard";

export default function History() {
  const { user, loading } = useUserData();
  if (loading) return <p>Cargando...</p>;

  return (
    <div className="container">
      <h1>Historial de Reciclaje</h1>
<PointsCard points={user.points} title="Total puntos acumulados" />
      <div className="card">
        {user.history?.length > 0 ? (
          user.history.map((item, i) => (
            <p key={i}>
              {new Date(item.date).toLocaleDateString()} - {item.material} - {item.points} pts
            </p>
          ))
        ) : (
          <p>No hay historial registrado</p>
        )}
      </div>
      <Navbar />
    </div>
  );
}
