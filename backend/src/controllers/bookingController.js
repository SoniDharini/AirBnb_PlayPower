import { quoteBooking, reserveBooking } from '../services/bookingService.js';

export function createQuote(req, res) {
  res.json(quoteBooking(req.body || {}));
}

export function createReservation(req, res) {
  const booking = reserveBooking(req.body || {});
  res.status(201).json(booking);
}
