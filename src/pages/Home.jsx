// src/pages/Home.jsx
import { useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { db } from "../services/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import PointsCard from "../components/PointsCard";
import { useAuth } from "../context/AuthContext";


export default function Home() {
  const { user, loading } = useAuth();
  const [points, setPoints] = useState(user?.points || 0);
  const [recentItems, setRecentItems] = useState(user?.history?.slice(-3).reverse() || []);
  const [toast, setToast] = useState(null);

  if (loading) return <p>Cargando...</p>;
  if (!user) return <p>No hay usuario</p>;

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
            const yaRegistrado = currentData.history?.some((item) => item.qrId === qrId);

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

              setPoints(nuevosPuntos);
              setRecentItems((prev) => [nuevoRegistro, ...prev].slice(0, 3));
              setToast({ message: "¡Registro exitoso de artículo!", type: "success" });
            }
          }
        } catch (error) {
          console.error("Error al leer el QR:", error);
          setToast({ message: "¡Registro fallido de artículo!", type: "error" });
        }

        scanner.clear();
      },
      (err) => {
        console.warn(err);
      }
    );
  };

return (
  <div className="home-container">
    {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    <div className="logo">
        <img src="/ecoPuntosLogo.jpg" alt="EcoPuntos" />
    </div>
    <h2>Bienvenido {user.name}</h2>
    <PointsCard points={points} title="Tus puntos acumulados" />

    <div className="recent-card">
      <h3>Artículos recientes</h3>
      <ul>
        {recentItems.length > 0 ? (
          recentItems.map((item, index) => (
            <li key={index}>
              {item.material} – {item.points} pts –{" "}
              {new Date(item.date).toLocaleDateString()}
            </li>
          ))
        ) : (
          <li>No hay artículos recientes</li>
        )}
      </ul>
    </div>

    <div className="daily-challenge">
      <h3>Reto diario</h3>
      <p>Registra 3 artículos hoy y gana 15 pts extra</p>
    </div>

    <button className="fab" onClick={handleScanQR}>➕</button>
    <div id="qr-reader" style={{ width: "100%" }}></div>

    <Navbar />
  </div>
);

}
