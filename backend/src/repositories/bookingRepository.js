const bookings = [];

export function createBooking(record) {
  bookings.push(record);
  return record;
}

export function listBookings() {
  return [...bookings];
}

export function findOverlappingBooking(listingId, nights) {
  return bookings.find((booking) => {
    if (booking.listingId !== listingId || booking.status === 'cancelled') return false;
    return booking.nightsOccupied.some((night) => nights.includes(night));
  });
}
