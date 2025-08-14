import "../styles.css";

export default function QRScanner({ onScan }) {
  const handleScan = () => {
    const fakeCode = "QR123456";
    alert("Código escaneado: " + fakeCode);
    if (onScan) onScan(fakeCode);
  };

  return (
    <div className="card">
      <p>Escanea un código QR para sumar puntos.</p>
      <button onClick={handleScan}>Escanear QR</button>
    </div>
  );
}
