import { getAvailability, getListing, getPhotos, getReviews } from '../services/listingService.js';

export function showListing(req, res) {
  res.json(getListing(req.params.id));
}

export function showPhotos(req, res) {
  res.json(getPhotos(req.params.id));
}

export function showReviews(req, res) {
  res.json(getReviews(req.params.id));
}

export function showAvailability(req, res) {
  res.json(getAvailability(req.params.id));
}
