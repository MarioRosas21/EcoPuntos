import { useEffect, useState } from "react";

export default function useAnnouncements(interval = 20000) {
  const [announcement, setAnnouncement] = useState(null);

  const anuncios = [
    "♻️ ¿Sabías que reciclar una lata ahorra energía por 3 horas de TV?",
    "🌱 Gana puntos extra si registras 5 artículos hoy.",
    "🔥 Nuevo reto ecológico disponible esta semana.",
    "🚮 Separar orgánicos reduce la contaminación hasta un 50%."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const random = anuncios[Math.floor(Math.random() * anuncios.length)];
      setAnnouncement(random);
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return { announcement, setAnnouncement };
}
