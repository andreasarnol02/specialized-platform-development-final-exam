// Manual formatting helpers. No Intl / toLocaleString (Hermes quirks).

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

// id-ID short date: "9 Agu 2026".
export const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const day = date.getDate();
  const month = MONTHS_SHORT[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

// Avatar initial: first char of the name, uppercased, "A" fallback.
export const getInitial = (name) => String(name?.[0] || "A").toUpperCase();

// Duration in minutes -> label: "45 menit", "1 jam 30 menit", "2 jam".
export const formatDuration = (value) => {
  const total = Math.round(Number(value) || 0);
  if (total <= 0) return "";
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (hours === 0) return `${minutes} menit`;
  if (minutes === 0) return `${hours} jam`;
  return `${hours} jam ${minutes} menit`;
};
