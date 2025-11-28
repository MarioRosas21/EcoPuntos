import { useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { db } from "../services/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import PointsCard from "../components/PointsCard";
import useUserData from "../hooks/useUserData";
import AnnouncementSystem from "../components/AnnouncementSystem";   // ⬅️ IMPORTANTE

import "../styles/home.css";

export default function Home() {
  const { user, loading } = useUserData();
  const [toast, setToast] = useState(null);

  if (loading) return <p className="home-loading">Cargando...</p>;
  if (!user) return <p className="home-loading">No hay usuario</p>;

  const points = user?.points || 0;
  const recentItems = user?.history?.slice(-3).reverse() || [];

  const handleScanQR = () => {
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: 250,
    });

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

        scanner.clear();
      },
      (err) => {
        console.warn(err);
      }
    );
  };

  return (
    <div className="home-page">

      {/* 🔔 SISTEMA GLOBAL DE ANUNCIOS */}
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
          <header className="home-header">
            <div className="home-logo">
              <img src="/ecoPuntosLogo.jpg" alt="EcoPuntos" />
            </div>
            <h2 className="home-title">Bienvenido {user.name}</h2>
          </header>

          <PointsCard points={points} title="Tus puntos acumulados" />

          <section className="home-section recent-card">
            <h3>Artículos recientes</h3>
            <ul>
              {recentItems.length > 0 ? (
                recentItems.map((item, index) => (
                  <li key={index}>
                    <span className="item-material">{item.material}</span>
                    <span className="item-points">{item.points} pts</span>
                    <span className="item-date">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </li>
                ))
              ) : (
                <li>No hay artículos recientes</li>
              )}
            </ul>
          </section>

          <section className="home-section daily-challenge">
            <h3>Reto diario</h3>
            <p>Registra 3 artículos hoy y gana 15 pts extra</p>
          </section>

          <section className="home-section qr-section">
            <h3>Escanear QR</h3>
            <p className="qr-help-text">
              Toca el botón "+" para abrir la cámara y registrar un nuevo artículo.
            </p>
            <button className="fab" onClick={handleScanQR}>
              ➕
            </button>
            <div id="qr-reader" className="qr-reader-container"></div>
          </section>
        </div>
      </main>

      {/* Navbar fijo */}
      <Navbar />
    </div>
  );
}
