import { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "../styles.css";
import Navbar from "../components/Navbar";
import PointsCard from "../components/PointsCard";
import Toast from "../components/Toast";

export default function Rewards({ uid }) {
  const [points, setPoints] = useState(0);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchPoints = async () => {
      if (!uid) return;
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setPoints(userSnap.data().points || 0);
      }
    };
    fetchPoints();
  }, [uid]);

  const handleRedeem = async (cost) => {
    if (points < cost) {
      setToast({ message: "¡No tienes suficientes puntos!", type: "error" });
      return;
    }

    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { points: points - cost });
    setPoints(points - cost);
    setToast({ message: "Recompensa canjeada correctamente", type: "success" });
  };

  return (
    <div className="container">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <h1>Recompensas</h1>

      <PointsCard points={points} title="Tus puntos acumulados" />

      <div className="card">
        <h2>10% de descuento en Tienda X</h2>
        <button onClick={() => handleRedeem(100)}>Canjear (100 pts)</button>
      </div>
      <div className="card">
        <h2>Entrada cine 2x1</h2>
        <button onClick={() => handleRedeem(200)}>Canjear (200 pts)</button>
      </div>

      <Navbar />
    </div>
  );
}
