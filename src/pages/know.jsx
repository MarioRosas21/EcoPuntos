import Navbar from "../components/Navbar";
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
        type: "video",
        title: "Cómo separar basura correctamente",
        url: "https://www.youtube.com/embed/wlsXGwu4Mt8"
    },

  ];

  return (
    <div className="know-page">

      <div className="know-container">
        <div className="know-logo">
          <img src="/ecoPuntosLogo.jpg" alt="EcoPuntos" />
        </div>

        <h1 className="know-title">¿Sabías que?</h1>

        <div className="know-list">
          {facts.map((item, i) => (
            <div key={i} className={`know-card ${item.type}`}>

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

              {item.highlight && <span className="badge">Nuevo</span>}
            </div>
          ))}
        </div>
      </div>

      <Navbar />
    </div>
  );
}
