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
  if (!checkIn || !checkOut) return 0;
  const start = parseISODate(checkIn);
  const end = parseISODate(checkOut);
  return Math.round((end.getTime() - start.getTime()) / 86400000);
}

function isNovemberHold(iso) {
  const month = iso.slice(5, 7);
  const day = iso.slice(8, 10);
  return month === '11' && ['06', '07', '08', '09', '20', '21', '22'].includes(day);
}

export function defaultStay(now = new Date()) {
  const preferred = parseISODate('2026-10-18');
  const today = parseISODate(todayISO(now));
  let start = preferred >= today
    ? preferred
    : new Date(today.getFullYear(), today.getMonth(), today.getDate() + 21);

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 5);
    const nights = [];
    let cursor = new Date(start);
    while (cursor < end) {
      nights.push(formatISODate(cursor));
      cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1);
    }
    if (!nights.some(isNovemberHold)) {
      return { checkIn: formatISODate(start), checkOut: formatISODate(end) };
    }
    start = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1);
  }

  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 5);
  return { checkIn: formatISODate(start), checkOut: formatISODate(end) };
}

export function formatCardDate(iso) {
  if (!iso) return 'Add date';
  const date = parseISODate(iso);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export function formatDayMonth(iso) {
  if (!iso) return '';
  return parseISODate(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
}

export function dayBeforeLabel(iso) {
  if (!iso) return '';
  const date = parseISODate(iso);
  date.setDate(date.getDate() - 1);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
}

export function formatLongDate(iso) {
  if (!iso) return '';
  return parseISODate(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatMonth(date) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function monthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const days = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: first.getDay() }, () => null);
  for (let day = 1; day <= days; day += 1) cells.push(new Date(year, month, day));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let index = 0; index < cells.length; index += 7) weeks.push(cells.slice(index, index + 7));
  return weeks;
}

export function guestCount(guests) {
  return guests.adults + guests.children;
}

export function guestLabel(guests) {
  const count = guestCount(guests);
  const parts = [`${count} guest${count === 1 ? '' : 's'}`];
  if (guests.infants) parts.push(`${guests.infants} infant${guests.infants === 1 ? '' : 's'}`);
  if (guests.pets) parts.push(`${guests.pets} pet${guests.pets === 1 ? '' : 's'}`);
  return parts.join(', ');
}

export function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}
