import { findListingById } from '../repositories/listingRepository.js';
import { toAvailability, toListing, toPhotoSections, toReviews } from '../models/listingModel.js';
import { expandBlockedDates } from '../utils/dates.js';
import { notFound } from '../utils/httpError.js';

function requireListing(id) {
  const listing = findListingById(id);
  if (!listing) throw notFound('Listing not found.');
  return listing;
}

export function getListing(id) {
  return toListing(requireListing(id));
}

export function getPhotos(id) {
  return { listingId: id, sections: toPhotoSections(requireListing(id)) };
}

export function getReviews(id) {
  return toReviews(requireListing(id));
}

export function getAvailability(id) {
  const availability = toAvailability(requireListing(id));
  return {
    ...availability,
    blockedDates: expandBlockedDates(availability.blockedDates),
  };
}
