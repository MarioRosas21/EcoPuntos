import "../styles.css";
import Navbar from "../components/Navbar";
import PointsCard from "../components/PointsCard";
import Toast from "../components/Toast";
import { useState } from "react";
import { generateRewardCode } from "../utils/generateCode";
import useUserData from "../hooks/useUserData";
import { redeemReward } from "../services/firebase"; // 👈 Importa la función

const rewardsList = [
  { title: "Amazon Gift Card", points: 500, logo: "/logos/amazon.png" },
  { title: "Mercado Libre", points: 400, logo: "/logos/mercadoLibre.png" },
  { title: "Uber Eats", points: 300, logo: "/logos/uberEats.png" },
  { title: "Rappi", points: 350, logo: "/logos/rappi.png" },
  { title: "Starbucks", points: 250, logo: "/logos/starbucks.png" },
  { title: "Netflix", points: 600, logo: "/logos/netflix.png" },
];

export default function Rewards() {
  const { user, loading } = useUserData();
  const [toast, setToast] = useState(null);
  const [modalData, setModalData] = useState(null);

  if (loading) return <p>Cargando...</p>;
  if (!user) return <p>No hay usuario</p>;

  const points = user?.points || 0;

  const handleRedeem = async (title, cost) => {
    console.log("🎁 Intentando canjear:", { title, cost, pointsDisponibles: points });

    if (points < cost) {
      setToast({ message: "¡No tienes suficientes puntos!", type: "error" });
      return;
    }

    try {
      // Generar el código primero
      const code = generateRewardCode();
      console.log("🔑 Código generado:", code);

      // Llamar a la función del servicio
      await redeemReward(user.uid, cost, title, code);
      
      console.log("✅ Canje exitoso");

      // Mostrar el modal con el código
      setModalData({ title, code });
      setToast({ message: "Recompensa canjeada correctamente", type: "success" });
      
    } catch (error) {
      console.error("❌ Error al canjear:", error);
      setToast({ 
        message: error.message === "Puntos insuficientes" 
          ? "¡No tienes suficientes puntos!" 
          : "Error al canjear la recompensa", 
        type: "error" 
      });
    }
  };

  const copyCode = () => {
    if (modalData?.code) {
      navigator.clipboard.writeText(modalData.code);
      setToast({ message: "Código copiado al portapapeles", type: "success" });
    }
  };
  
  const closeModal = () => setModalData(null);

  return (
    <div className="container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1>Recompensas de {user.name}</h1>
      <PointsCard points={points} title="Tus puntos acumulados" />

      <div className="rewards-grid">
        {rewardsList.map((reward, i) => (
          <div key={i} className="reward-card">
            <img src={reward.logo} alt={reward.title} />
            <h3>{reward.title}</h3>
            <p>{reward.points} pts</p>
            <button onClick={() => handleRedeem(reward.title, reward.points)}>
              Canjear
            </button>
          </div>
        ))}
      </div>

      {modalData && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>🎉 {modalData.title}</h2>
            <p>Tu código de recompensa:</p>
            <h3 className="reward-code">{modalData.code}</h3>
            <button onClick={copyCode}>Copiar código</button>
            <button onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
}