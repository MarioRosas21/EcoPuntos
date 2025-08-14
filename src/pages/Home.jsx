import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Html5QrcodeScanner } from "html5-qrcode";
import { db } from "../services/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import "../styles.css";
import Navbar from "../components/Navbar";
import Toast from "../components/Toast";
import PointsCard from "../components/PointsCard";


export default function Home() {
  const [userName, setUserName] = useState("");
  const [points, setPoints] = useState(0);
  const [recentItems, setRecentItems] = useState([]);
  const [uid, setUid] = useState("");
  const [toast, setToast] = useState(null);

  // Cargar datos del usuario al iniciar sesión
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserName(data.name || "Usuario");
          setPoints(data.points || 0);
          if (data.history && data.history.length > 0) {
            const ultimosTres = [...data.history].reverse().slice(0, 3);
            setRecentItems(ultimosTres);
          }
        }
      }
    });
  }, []);

  // Escanear QR y guardar en Firestore
  const handleScanQR = () => {
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      async (decodedText) => {
        try {
          const data = JSON.parse(decodedText);
          const qrId = data.id || decodedText; // identificador único del QR
          const puntos = data.puntos || 0;

          const userRef = doc(db, "users", uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const currentData = userSnap.data();

            // Validar si el QR ya fue registrado
            const yaRegistrado = currentData.history?.some(
              (item) => item.qrId === qrId
            );

            if (yaRegistrado) {
              setToast({ message: "QR ya registrado", type: "error" });
            } else {
              const nuevosPuntos = (currentData.points || 0) + puntos;

              const nuevoRegistro = {
                qrId, // guardamos el id único
                material: data.material || "Material desconocido",
                points: puntos,
                date: data.fecha || new Date().toISOString(),
              };

              await updateDoc(userRef, {
                points: nuevosPuntos,
                history: arrayUnion(nuevoRegistro),
              });

              setPoints(nuevosPuntos);
              setRecentItems(prev => [nuevoRegistro, ...prev].slice(0, 3));

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
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="logo">
        <img src="../assets/ecoPuntosLogo.jpg" alt="EcoPuntos" />
      </div>

      <h2>Bienvenido {userName}</h2>


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

      <button className="fab" onClick={handleScanQR}>
        ➕
      </button>

      <div id="qr-reader" style={{ width: "100%" }}></div>

      <Navbar />
    </div>
  );
}
