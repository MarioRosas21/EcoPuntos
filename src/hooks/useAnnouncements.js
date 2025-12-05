// useAnnouncements.js
import { useEffect, useState } from "react";

export default function useAnnouncements(interval = 20000) {
  const [announcement, setAnnouncement] = useState(null);
  const [paid, setPaid] = useState(false); 

  const anuncios = [
    "♻️ ¿Sabías que reciclar una lata ahorra energía por 3 horas de TV?",
    "🌱 Gana puntos extra si registras 5 artículos hoy.",
    "🔥 Nuevo reto ecológico disponible esta semana.",
    "🚮 Separar orgánicos reduce la contaminación hasta un 50%"
  ];

  useEffect(() => {
    const noAdsUntil = localStorage.getItem("noAdsUntil");

    // Si aún estamos dentro de los 30 segundos sin anuncios
    if (noAdsUntil && Date.now() < Number(noAdsUntil)) {
      setAnnouncement(null); 
      return; 
    }

    // SI NO ESTÁN DESACTIVADOS → generar anuncios normal
    const timer = setInterval(() => {
      const random = anuncios[Math.floor(Math.random() * anuncios.length)];
      setAnnouncement(random);
    }, interval);

    return () => clearInterval(timer);

  }, [interval, paid]);

  // 🚫 DESACTIVAR ANUNCIOS POR 30 SEGUNDOS
  const disableAdsForMonth = () => {
    const thirtySeconds = 30 * 1000; 
    const expiry = Date.now() + thirtySeconds;

    localStorage.setItem("noAdsUntil", expiry);

    setAnnouncement(null); 
    setPaid(true);         
  };

  return { announcement, setAnnouncement, disableAdsForMonth };
}
