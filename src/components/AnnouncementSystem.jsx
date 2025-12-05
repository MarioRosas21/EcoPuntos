import { useEffect, useState } from "react";
import useAnnouncements from "../hooks/useAnnouncements";
import PaymentModal from "./PaymentModal";
import Toast from "./Toast";
import "../styles/announcement.css";

export default function AnnouncementSystem() {
  const { announcement, setAnnouncement, disableAdsForMonth } = useAnnouncements();

  const [showCloseButton, setShowCloseButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);

  const DELAY_MS = 5000;

  // Mostrar botón X después de 5 segundos
  useEffect(() => {
    if (announcement) {
      setShowCloseButton(false);
      const timer = setTimeout(() => setShowCloseButton(true), DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, [announcement]);

  // Pago exitoso
  const handlePaymentSuccess = () => {
    disableAdsForMonth();        
    setAnnouncement(null);       
    setShowModal(false);
    setToast("Anuncios desactivados por 30 segundos ❤️");
  };

  const text = announcement?.text || announcement;
  const image = announcement?.image;

  return (
    <>
      {/* Mostrar anuncio solo si existe */}
      {announcement && (
        <div className="announcement-wrapper">
          <div className="announcement-card">

            <button
              className="remove-announcements-btn"
              onClick={() => setShowModal(true)}
            >
              Quitar anuncios
            </button>

            {image && (
              <div className="announcement-image-container">
                <img src={image} alt="Anuncio" className="announcement-image" />
              </div>
            )}

            <p className="announcement-text">{text}</p>

            {showCloseButton && (
              <button
                className="announcement-close"
                onClick={() => setAnnouncement(null)}
              >
                ✖
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <PaymentModal
          onClose={() => setShowModal(false)}
          onConfirm={handlePaymentSuccess}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast message={toast} type="success" onClose={() => setToast(null)} />
      )}
    </>
  );
}
