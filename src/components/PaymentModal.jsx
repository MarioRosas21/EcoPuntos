import { useState } from "react";
import "../styles/paymentModal.css";

export default function PaymentModal({ onClose, onConfirm }) {
  const [name, setName] = useState("");
  const [card, setCard] = useState("");
  const [cvv, setCvv] = useState("");

  // Nombre → primera letra mayúscula
  const handleNameChange = (e) => {
    let value = e.target.value;
    if (value.length > 0) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
    }
    setName(value);
  };

  // Tarjeta → solo números, máx 16
  const handleCardChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 16);
    setCard(value);
  };

  // CVV → solo números, máx 3
  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 3);
    setCvv(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (card.length !== 16) {
      alert("El número de tarjeta debe tener 16 dígitos.");
      return;
    }

    if (cvv.length !== 3) {
      alert("El CVV debe tener 3 dígitos.");
      return;
    }

    onConfirm();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card modal-fade">

        <button className="modal-close" onClick={onClose}>✖</button>

        <h2>Desactivar anuncios</h2>
        <p>Ingresa tus datos para desactivar anuncios por $40 al mes.</p>

        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={handleNameChange}
            required
          />

          <input
            type="text"
            inputMode="numeric"
            placeholder="Número de tarjeta (16 dígitos)"
            value={card}
            onChange={handleCardChange}
            required
          />

          <input
            type="text"
            inputMode="numeric"
            placeholder="CVV (3 dígitos)"
            value={cvv}
            onChange={handleCvvChange}
            required
          />

          <button type="submit" className="modal-pay-btn">
            Pagar y desactivar anuncios
          </button>
        </form>
      </div>
    </div>
  );
}
