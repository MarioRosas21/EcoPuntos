import { useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { db } from "../services/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { Scan, Leaf, Calendar, Award, TrendingUp } from "lucide-react";

import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import PointsCard from "../components/PointsCard";
import useUserData from "../hooks/useUserData";
import AnnouncementSystem from "../components/AnnouncementSystem";

import "../styles/home.css";

export default function Home() {
  const { user, loading } = useUserData();
  const [toast, setToast] = useState(null);
  const [qrScanner, setQrScanner] = useState(null);


  if (loading) {
    return (
      <div className="home-loading-container">
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="home-loading-container">
        <p>No hay usuario</p>
      </div>
    );
  }

  const points = user?.points || 0;
  const recentItems = user?.history?.slice(-3).reverse() || [];

const handleScanQR = () => {
  // Si ya está abierto → cerrarlo
  if (qrScanner) {
    qrScanner.clear();
    document.getElementById("qr-reader").innerHTML = ""; // limpia UI
    setQrScanner(null);
    return;
  }

  // Crear nuevo scanner
  const scanner = new Html5QrcodeScanner("qr-reader", {
    fps: 10,
    qrbox: 250,
  });

  // Guardar instancia
  setQrScanner(scanner);

  scanner.render(
    async (decodedText) => {
      try {
        const data = JSON.parse(decodedText);
        const qrId = data.id || decodedText;
        const puntos = data.puntos || 0;

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const currentData = userSnap.data();
          const yaRegistrado = currentData.history?.some(
            (item) => item.qrId === qrId
          );

          if (yaRegistrado) {
            setToast({ message: "QR ya registrado", type: "error" });
          } else {
            const nuevosPuntos = (currentData.points || 0) + puntos;
            const nuevoRegistro = {
              qrId,
              material: data.material || "Material desconocido",
              points: puntos,
              date: data.fecha || new Date().toISOString(),
            };

            await updateDoc(userRef, {
              points: nuevosPuntos,
              history: arrayUnion(nuevoRegistro),
            });

            setToast({
              message: "¡Registro exitoso de artículo!",
              type: "success",
            });
          }
        }
      } catch (error) {
        console.error("Error al leer el QR:", error);
        setToast({
          message: "¡Registro fallido de artículo!",
          type: "error",
        });
      }

      // Cerrar al leer un QR
      scanner.clear();
      document.getElementById("qr-reader").innerHTML = "";
      setQrScanner(null);
    },
    (err) => {
      console.warn(err);
    }
  );
};


  return (
    <div className="home-page">
      {/* Elementos decorativos de fondo */}
      <div className="home-bg-blob home-bg-blob-1"></div>
      <div className="home-bg-blob home-bg-blob-2"></div>
      <div className="home-bg-blob home-bg-blob-3"></div>

      {/* Sistema global de anuncios */}
      <AnnouncementSystem />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Contenido scrollable */}
      <main className="home-scroll">
        <div className="home-container">
          {/* Header con logo */}
          <header className="home-header">
            <div className="home-logo-box">
              <div className="home-logo-wrapper">
                <img src="/ecoPuntosLogo.jpg" alt="EcoPuntos" />
              </div>
              <div className="home-leaf-icon">
                <Leaf />
              </div>
            </div>
            <h2 className="home-welcome">
              Bienvenido <span className="user-name">{user.name}</span>
            </h2>
          </header>

          {/* Tarjeta de puntos mejorada */}
          <div className="home-points-wrapper">
            <PointsCard points={points} title="Tus puntos acumulados" />
          </div>

          {/* Artículos recientes */}
          <section className="home-section home-recent-card">
            <div className="section-header">
              <div className="section-icon">
                <TrendingUp />
              </div>
              <h3>Artículos recientes</h3>
            </div>
            <ul className="recent-items-list">
              {recentItems.length > 0 ? (
                recentItems.map((item, index) => (
                  <li key={index} className="recent-item">
                    <div className="item-icon">
                      <Leaf />
                    </div>
                    <div className="item-info">
                      <span className="item-material">{item.material}</span>
                      <span className="item-date">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="item-points">+{item.points}</span>
                  </li>
                ))
              ) : (
                <li className="empty-state">
                  <Leaf className="empty-icon" />
                  <p>No hay artículos recientes</p>
                  <p className="empty-hint">Escanea tu primer QR para comenzar</p>
                </li>
              )}
            </ul>
          </section>

          {/* Reto diario */}
          <section className="home-section home-daily-challenge">
            <div className="challenge-icon-wrapper">
              <Award className="challenge-icon" />
            </div>
            <div className="challenge-content">
              <h3>Reto diario</h3>
              <p>Registra 3 artículos hoy y gana <strong>15 pts extra</strong></p>
            </div>
            <div className="challenge-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '33%'}}></div>
              </div>
              <span className="progress-text">1/3</span>
            </div>
          </section>

          {/* Sección QR */}
          <section className="home-section home-qr-section">
            <div className="qr-header">
              <Scan className="qr-icon" />
              <h3>Escanear QR</h3>
            </div>
            <p className="qr-help-text">
              Toca el botón verde para abrir la cámara y registrar un nuevo artículo reciclado.
            </p>
            <button className="home-fab" onClick={handleScanQR}>
              <Scan className="fab-icon" />
              <span>Escanear</span>
            </button>
            <div id="qr-reader" className="qr-reader-container"></div>
          </section>

          {/* Espacio para el navbar */}
          <div className="navbar-spacer"></div>
        </div>
      </main>

      {/* Navbar fijo */}
      <Navbar />
    </div>
  );
}