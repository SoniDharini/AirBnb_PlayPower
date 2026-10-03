const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(value) {
  if (typeof value !== 'string' || !ISO_DATE.test(value)) return false;
  const date = parseISODate(value);
  return formatISODate(date) === value;
}

export function parseISODate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayISO(now = new Date()) {
  return formatISODate(now);
}

export function nightsBetween(checkIn, checkOut) {
  const start = parseISODate(checkIn);
  const end = parseISODate(checkOut);
  const ms = end.getTime() - start.getTime();
  return Math.round(ms / 86400000);
}

function isNovemberHold(iso) {
  const month = iso.slice(5, 7);
  const day = iso.slice(8, 10);
  return month === '11' && ['06', '07', '08', '09', '20', '21', '22'].includes(day);
}

export function defaultStay(now = new Date(), nights = 5) {
  const preferred = parseISODate('2026-10-18');
  const today = parseISODate(todayISO(now));
  let start = preferred >= today
    ? preferred
    : new Date(today.getFullYear(), today.getMonth(), today.getDate() + 21);

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + nights);
    const occupied = nightsInRange(formatISODate(start), formatISODate(end));
    if (!occupied.some(isNovemberHold)) {
      return { checkIn: formatISODate(start), checkOut: formatISODate(end) };
    }
    start = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1);
  }

  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + nights);
  return { checkIn: formatISODate(start), checkOut: formatISODate(end) };
}

export function expandBlockedDates(stored = [], now = new Date()) {
  const extra = [];
  const startYear = now.getFullYear();
  for (let year = startYear; year <= startYear + 2; year += 1) {
    [6, 7, 8, 9, 20, 21, 22].forEach((day) => {
      extra.push(`${year}-11-${String(day).padStart(2, '0')}`);
    });
  }
  return [...new Set([...stored, ...extra])];
}

export function nightsInRange(checkIn, checkOut) {
  const nights = [];
  let cursor = parseISODate(checkIn);
  const end = parseISODate(checkOut);
  while (cursor < end) {
    nights.push(formatISODate(cursor));
    cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1);
  }
  return nights;
}
