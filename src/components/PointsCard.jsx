import React from "react";
import "../styles.css";

export default function PointsCard({ points, title = "Tus puntos acumulados" }) {
  return (
    <div className="points-card">
      <p>{title}</p>
      <h1>{points} pts</h1>
    </div>
  );
}
