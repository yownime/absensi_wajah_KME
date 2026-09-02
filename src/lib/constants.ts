export const ENGINE_PARAMS = [
  { id: "temperatureAmbient", name: "Temperature Ambient", unit: "°C", max: 40, type: "number" },
  { id: "dayaNyata", name: "Daya Nyata", unit: "kW", max: 1024, type: "number" },
  { id: "dayaSemu", name: "Daya Semu", unit: "kVA", max: 1024, type: "number" },
  { id: "exhaustTemp", name: "Exhaust Temp", unit: "°C", max: 650, type: "number" },
  { id: "speedEngine", name: "Speed Engine", unit: "RPM", min: 1495, max: 1505, type: "number" },
];

export const LIMBAH_PARAMS = [
  { id: "levelTank1", name: "Level Tank-1", unit: "Liter/mm", type: "number" },
  { id: "levelTank2", name: "Level Tank-2", unit: "Liter/mm", type: "number" },
  { id: "phLiquid", name: "Uji pH Liquid", unit: "pH (0-14)", min: 0, max: 14, type: "number" },
];

export const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = (i + 7) % 24; // 07:00 to 06:00
  return `${h.toString().padStart(2, "0")}:00`;
});
