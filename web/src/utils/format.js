export const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatDuration = (minutes) => {
  const total = Number(minutes);
  if (!Number.isFinite(total) || total <= 0) return "";
  if (total < 60) return `${total} menit`;
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  return rest === 0 ? `${hours} jam` : `${hours} jam ${rest} menit`;
};
