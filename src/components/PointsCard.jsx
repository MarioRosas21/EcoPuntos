import React from "react";

export default function PointsCard({ points, title = "Tus puntos acumulados" }) {
  return (
    <div className="points-card">
      <p className="points-title">{title}</p>
      <h1 className="points-value">{points} pts</h1>
    </div>
  );
}
