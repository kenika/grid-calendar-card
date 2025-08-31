export const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));

export const isHHMMSS = (v?: string) => /^\d{2}:\d{2}:\d{2}$/.test(String(v || ""));

export const toMinutes = (hhmmss: string) => {
  const [H, M, S] = hhmmss.split(":").map(Number);
  return H * 60 + M + (S || 0) / 60;
};

export const addMinutes = (d: Date, mins: number) => {
  const x = new Date(d);
  x.setMinutes(x.getMinutes() + mins);
  return x;
};

export const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const sameYMD = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const colorToHex = (raw?: string) => {
  const t = String(raw || "").trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(t)) return t.toLowerCase();
  if (/^rgba?\(/.test(t) || /^var\(--/.test(t)) return null;
  return "#3366cc";
};

export const fgOn = (hex: string) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const [r, g, b] = m
    ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)]
    : [51, 102, 204];
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? "#111" : "#fff";
};

export const rgba = (hex: string, a = 0.55) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const [r, g, b] = m
    ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)]
    : [51, 102, 204];
  return `rgba(${r},${g},${b},${a})`;
};

export const dayKey = (d: Date) => {
  const x = startOfDay(d);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const dd = String(x.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
};

export const condIcon = (raw?: string) => {
  const c = String(raw || "").toLowerCase().replace(/\s+/g, "");
  const map: Record<string, string> = {
    "clear-night": "mdi:weather-night",
    cloudy: "mdi:weather-cloudy",
    fog: "mdi:weather-fog",
    hail: "mdi:weather-hail",
    lightning: "mdi:weather-lightning",
    "lightning-rainy": "mdi:weather-lightning-rainy",
    partlycloudy: "mdi:weather-partly-cloudy",
    pouring: "mdi:weather-pouring",
    rainy: "mdi:weather-rainy",
    snowy: "mdi:weather-snowy",
    "snowy-rainy": "mdi:weather-snowy-rainy",
    sunny: "mdi:weather-sunny",
    windy: "mdi:weather-windy",
    "windy-variant": "mdi:weather-windy-variant",
    exceptional: "mdi:weather-alert",
  };
  const norm = c
    .replace("overcast", "cloudy")
    .replace("partlysunny", "partlycloudy")
    .replace("mostlycloudy", "partlycloudy")
    .replace("drizzle", "rainy");
  return map[norm] || map[c] || "mdi:weather-cloudy";
};
