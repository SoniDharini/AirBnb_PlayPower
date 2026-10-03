export function formatINR(amount, digits = 0) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatNightly(amount) {
  const digits = Number.isInteger(amount) ? 0 : 2;
  return formatINR(amount, digits);
}

export function discountFor(subtotal, claimed) {
  if (!claimed || !subtotal) return 0;
  return Math.round(subtotal * 0.1);
}
