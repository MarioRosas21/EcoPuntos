import "../styles/rewards.css";
import Navbar from "../components/Navbar";
import PointsCard from "../components/PointsCard";
import Toast from "../components/Toast";
import Announcement from "../components/AnnouncementSystem";
import { Gift, Copy, X, Sparkles } from "lucide-react";

import { useState, useEffect } from "react";
import { generateRewardCode } from "../utils/generateCode";
import useUserData from "../hooks/useUserData";
import { redeemReward } from "../services/firebase";

const rewardsList = [
  { title: "Amazon Gift Card", points: 500, logo: "/logos/amazon.png" },
  { title: "Mercado Libre", points: 400, logo: "/logos/mercadoLibre.png" },
  { title: "Uber Eats", points: 300, logo: "/logos/uberEats.png" },
  { title: "Rappi", points: 350, logo: "/logos/rappi.png" },
  { title: "Starbucks", points: 250, logo: "/logos/starbucks.png" },
  { title: "Netflix", points: 600, logo: "/logos/netflix.png" },
  { title: "Cinepolis 2x1", points: 150, logo: "/logos/cinepolis.png" },
{ title: "Spotify Premium 1 día", points: 120, logo: "/logos/spotify.png" },
{ title: "McDonald's – Papas chicas", points: 80, logo: "/logos/mcdonalds.png" },
{ title: "OXXO Café Andatti", points: 60, logo: "/logos/oxxo.png" },
{ title: "Shein Cupón $20", points: 100, logo: "/logos/shein.png" },
{ title: "Roblox – 10 Robux", points: 140, logo: "/logos/roblox.png" },
{ title: "Discord Nitro 24h", points: 200, logo: "/logos/discord.png" },
{ title: "Canva Pro – Plantillas", points: 50, logo: "/logos/canva.png" },
{ title: "Stickers Exclusivos", points: 20, logo: "/logos/stickers.png" },

];

export default function Rewards() {
  const { user, loading } = useUserData();

  const [toast, setToast] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  // Anuncio automático cada 30s
  useEffect(() => {
    const interval = setInterval(() => {
      setShowAnnouncement(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="rewards-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rewards-loading">
        <p>No hay usuario</p>
      </div>
    );
  }

  const points = user?.points || 0;

  // Canjear
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

  // Copiar código
  const copyCode = () => {
    if (modalData?.code) {
      navigator.clipboard.writeText(modalData.code);
      setToast({
        message: "Código copiado al portapapeles",
        type: "success",
      });
    }
  };

  return (
    <div className="rewards-page">
      {/* Elementos decorativos de fondo */}
      <div className="rewards-bg-blob rewards-bg-blob-1"></div>
      <div className="rewards-bg-blob rewards-bg-blob-2"></div>
      <div className="rewards-bg-blob rewards-bg-blob-3"></div>

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

      <div className="rewards-container">
        {/* Header */}
        <div className="rewards-header">
          <div className="rewards-icon-wrapper">
            <Gift className="rewards-icon" />
          </div>
          <h1 className="rewards-title">
            Recompensas de <span className="user-name">{user.name}</span>
          </h1>
          <p className="rewards-subtitle">
            Canjea tus puntos por increíbles premios
          </p>
        </div>

        {/* Tarjeta de puntos */}
        <div className="rewards-points-wrapper">
          <PointsCard points={points} title="Tus puntos acumulados" />
        </div>

        {/* Grid de recompensas */}
        <div className="rewards-grid">
          {rewardsList.map((reward, i) => {
            const canRedeem = points >= reward.points;
            
            return (
              <div key={i} className={`reward-card ${!canRedeem ? 'disabled' : ''}`}>
                {/* Imagen compacta en la esquina */}
                <div className="reward-image-compact">
                  <img src={reward.logo} alt={reward.title} />
                  {!canRedeem && (
                    <div className="lock-overlay">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Contenido principal */}
                <div className="reward-content">
                  <h3 className="reward-title">{reward.title}</h3>
                  
                  <div className="reward-points-display">
                    <Sparkles className="sparkle-icon" />
                    <span className="points-number">{reward.points}</span>
                    <span className="points-label">puntos</span>
                  </div>

                  <button 
                    onClick={() => handleRedeem(reward.title, reward.points)}
                    disabled={!canRedeem}
                    className="reward-action-btn"
                  >
                    {canRedeem ? (
                      <>
                        <Gift className="btn-icon" />
                        Canjear ahora
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="btn-icon">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                        Bloqueado
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Espacio para el navbar */}
        <div className="navbar-spacer"></div>
      </div>

      {/* Modal mejorado */}
      {modalData && (
        <div className="rewards-modal-overlay">
          <div className="rewards-modal">
            <button 
              className="modal-close-btn"
              onClick={() => setModalData(null)}
            >
              <X />
            </button>

            <div className="modal-icon-celebration">
              <Gift className="modal-gift-icon" />
            </div>

            <h2 className="modal-title">¡Felicidades! 🎉</h2>
            <p className="modal-reward-name">{modalData.title}</p>
            <p className="modal-description">Tu código de recompensa:</p>

            <div className="modal-code-box">
              <h3 className="modal-code">{modalData.code}</h3>
              <button onClick={copyCode} className="copy-code-btn">
                <Copy className="copy-icon" />
              </button>
            </div>

            <p className="modal-hint">Usa este código en la app o sitio web oficial</p>

            <button 
              onClick={() => setModalData(null)}
              className="modal-accept-btn"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <Navbar />
    </div>
  );
}