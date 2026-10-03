import { findListingById } from '../repositories/listingRepository.js';
import { createBooking, findOverlappingBooking } from '../repositories/bookingRepository.js';
import { badRequest, conflict, notFound } from '../utils/httpError.js';
import { expandBlockedDates, isIsoDate, nightsBetween, nightsInRange, todayISO } from '../utils/dates.js';

function assertStay(listingId, checkIn, checkOut, guests) {
  if (!listingId) throw badRequest('Listing id is required.');
  const listing = findListingById(listingId);
  if (!listing) throw notFound('Listing not found.');

  if (!checkIn || !isIsoDate(checkIn)) throw badRequest('Check-in date is required.');
  if (!checkOut || !isIsoDate(checkOut)) throw badRequest('Check-out date is required.');
  if (checkOut <= checkIn) throw badRequest('Check-out must be after check-in.');
  if (checkIn < todayISO()) throw badRequest('Check-in cannot be in the past.');

  const guestCount = Number(guests);
  if (!Number.isInteger(guestCount) || guestCount < 1) {
    throw badRequest('At least 1 guest is required.');
  }
  if (guestCount > listing.maxGuests) {
    throw badRequest(`This place allows up to ${listing.maxGuests} guests.`);
  }

  const occupied = nightsInRange(checkIn, checkOut);
  const blockedDates = expandBlockedDates(listing.availability.blockedDates);
  const blocked = occupied.filter((night) => blockedDates.includes(night));
  if (blocked.length) {
    throw conflict('Those dates are not available.');
  }
  if (findOverlappingBooking(listing.id, occupied)) {
    throw conflict('Those dates are not available.');
  }

  const nights = nightsBetween(checkIn, checkOut);
  const subtotal = Math.round(nights * listing.price.pricePerNight);

  return { listing, nights, occupied, subtotal, guestCount };
}

export function quoteBooking({ listingId, checkIn, checkOut, guests }) {
  const stay = assertStay(listingId, checkIn, checkOut, guests);
  return {
    listingId: stay.listing.id,
    checkIn,
    checkOut,
    guests: stay.guestCount,
    nights: stay.nights,
    pricePerNight: stay.listing.price.pricePerNight,
    subtotal: stay.subtotal,
    currency: stay.listing.price.currency,
  };
}

export function reserveBooking({ listingId, checkIn, checkOut, guests, discountClaimed = false }) {
  const stay = assertStay(listingId, checkIn, checkOut, guests);
  const discount = discountClaimed ? Math.round(stay.subtotal * 0.1) : 0;
  const booking = {
    id: `bkg_${Date.now().toString(36)}`,
    listingId: stay.listing.id,
    checkIn,
    checkOut,
    guests: stay.guestCount,
    nights: stay.nights,
    nightsOccupied: stay.occupied,
    pricePerNight: stay.listing.price.pricePerNight,
    subtotal: stay.subtotal,
    discount,
    total: stay.subtotal - discount,
    currency: stay.listing.price.currency,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };
  return createBooking(booking);
}
