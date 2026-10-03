import client from './client';

export function fetchListing(id) {
  return client.get(`/listings/${id}`).then((response) => response.data);
}

export function fetchAvailability(id) {
  return client.get(`/listings/${id}/availability`).then((response) => response.data);
}

export function fetchQuote(payload) {
  return client.post('/bookings/quote', payload).then((response) => response.data);
}

export function createBooking(payload) {
  return client.post('/bookings', payload).then((response) => response.data);
}
