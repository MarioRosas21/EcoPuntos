import "../styles/rewards.css";
import Navbar from "../components/Navbar";
import PointsCard from "../components/PointsCard";
import Toast from "../components/Toast";
import Announcement from "../components/AnnouncementSystem";

import { useState, useEffect } from "react";
import { generateRewardCode } from "../utils/generateCode";
import useUserData from "../hooks/useUserData";
import { redeemReward } from "../services/firebase";
//Cambio para que funcione el push
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
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  // =============================
  // ANUNCIO AUTOMÁTICO CADA 30s
  // =============================
  useEffect(() => {
    const interval = setInterval(() => {
      setShowAnnouncement(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // =============================
  // RETURN CONDICIONALES
  // =============================
  if (loading) return <p>Cargando...</p>;
  if (!user) return <p>No hay usuario</p>;

  const points = user?.points || 0;

  // =============================
  // CANJEAR
  // =============================
  const handleRedeem = async (title, cost) => {
    if (points < cost) {
      setToast({ message: "¡No tienes suficientes puntos!", type: "error" });
      return;
    }

    try {
      const code = generateRewardCode();
      await redeemReward(user.uid, cost, title, code);

      setModalData({ title, code });
      setToast({
        message: "Recompensa canjeada correctamente",
        type: "success",
      });
    } catch (error) {
      setToast({
        message:
          error.message === "Puntos insuficientes"
            ? "¡No tienes suficientes puntos!"
            : "Error al canjear la recompensa",
        type: "error",
      });
    }
  };

  // =============================
  // COPIAR CÓDIGO
  // =============================
  const copyCode = () => {
    if (modalData?.code) {
      navigator.clipboard.writeText(modalData.code);
      setToast({
        message: "Código copiado al portapapeles",
        type: "success",
      });
    }
  };

  // =============================
  // RENDER
  // =============================
  return (
    <div className="rewards-container">

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Anuncio */}
      {showAnnouncement && (
        <Announcement
          message="🎁 ¡Aprovecha tus puntos! Nuevas recompensas disponibles."
          onClose={() => setShowAnnouncement(false)}
        />
      )}

      {/* TÍTULO */}
      <h1 className="rewards-title">Recompensas de {user.name}</h1>

      {/* TARJETA DE PUNTOS */}
      <PointsCard points={points} title="Tus puntos acumulados" />

      {/* GRID DE RECOMPENSAS */}
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

      {/* MODAL */}
      {modalData && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>🎉 {modalData.title}</h2>
            <p>Tu código de recompensa:</p>

            <h3 className="reward-code">{modalData.code}</h3>

            <button onClick={copyCode}>Copiar código</button>
            <button onClick={() => setModalData(null)}>Cerrar</button>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <Navbar />
    </div>
  );
}
