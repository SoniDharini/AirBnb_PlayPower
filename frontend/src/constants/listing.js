export const LISTING_ID = 'mirashya-ug10';

export function listingPath(id = LISTING_ID) {
  return `/rooms/${id}`;
}

export function photosPath(id = LISTING_ID) {
  return `/rooms/${id}/photos`;
}
