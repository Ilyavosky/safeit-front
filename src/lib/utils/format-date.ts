const DATE = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric" });
const DATE_TIME = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(value?: string | null) {
  return value ? DATE.format(new Date(value)) : undefined;
}

export function formatDateTime(value?: string | null) {
  return value ? DATE_TIME.format(new Date(value)) : undefined;
}

export function formatDuration(start?: string | null, end?: string | null) {
  if (!start || !end) return undefined;
  const seconds = Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 1000));
  if (seconds < 60) return `${seconds} s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ${seconds % 60} s`;
  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}
