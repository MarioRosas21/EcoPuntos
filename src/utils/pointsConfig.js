// utils/pointsConfig.js
export const pointsPerMaterial = {
  plastico: 15,   // puntos por kg
  vidrio: 10,
  papel: 8,
  carton: 12,
  aluminio: 20
};

export function calculatePoints(material, kg) {
  return (pointsPerMaterial[material] || 0) * kg;
}
