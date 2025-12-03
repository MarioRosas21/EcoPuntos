import Navbar from "../components/Navbar";
import { Lightbulb, Megaphone, Play, Sparkles, Leaf } from "lucide-react";
import "../styles/know.css";

export default function Know() {

  const facts = [
    {
      type: "dato",
      title: "El reciclaje reduce un 70% la contaminación",
      description: "Usar materiales reciclados requiere menos energía que producir nuevos."
    },
    {
      type: "anuncio",
      title: "Nueva campaña ecológica",
      description: "Participa este mes y gana puntos extra registrando artículos.",
      highlight: true
    },
    {
      type: "dato",
      title: "Una botella de plástico tarda 450 años en degradarse",
      description: "El plástico es uno de los materiales más contaminantes. ¡Recicla siempre!"
    },
    {
      type: "video",
      title: "Cómo separar basura correctamente",
      url: "https://www.youtube.com/embed/wlsXGwu4Mt8"
    },
    {
      type: "dato",
      title: "Reciclar una tonelada de papel salva 17 árboles",
      description: "El papel reciclado reduce significativamente la deforestación."
    }
  ];

  return (
    <div className="know-page">
      {/* Elementos decorativos de fondo */}
      <div className="know-bg-blob know-bg-blob-1"></div>
      <div className="know-bg-blob know-bg-blob-2"></div>
      <div className="know-bg-blob know-bg-blob-3"></div>

      <div className="know-container">
        {/* Logo mejorado */}
        <div className="know-header">
          <div className="know-logo-wrapper">
            <img src="/ecoPuntosLogo.jpg" alt="EcoPuntos" />
            <div className="know-logo-badge">
              <Leaf className="leaf-badge-icon" />
            </div>
          </div>

          <div className="know-title-wrapper">
            <div className="know-title-icon">
              <Lightbulb className="bulb-icon" />
            </div>
            <h1 className="know-title">¿Sabías que?</h1>
          </div>
          <p className="know-subtitle">Aprende datos interesantes sobre el reciclaje</p>
        </div>

        {/* Lista de hechos */}
        <div className="know-list">
          {facts.map((item, i) => (
            <div key={i} className={`know-card ${item.type}`}>
              {/* Icono según tipo */}
              <div className="know-card-icon">
                {item.type === "dato" && <Lightbulb className="card-icon" />}
                {item.type === "anuncio" && <Megaphone className="card-icon" />}
                {item.type === "video" && <Play className="card-icon" />}
              </div>

              <h3>{item.title}</h3>

              {item.type !== "video" && (
                <p>{item.description}</p>
              )}

              {item.type === "video" && (
                <div className="know-video-container">
                  <iframe
                    src={item.url}
                    title={item.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}

              {item.highlight && (
                <span className="badge">
                  <Sparkles className="badge-icon" />
                  Nuevo
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Espacio para el navbar */}
        <div className="navbar-spacer"></div>
      </div>

      <Navbar />
    </div>
  );
}