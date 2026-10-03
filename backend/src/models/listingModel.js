export function toListing(record) {
  return {
    id: record.id,
    title: record.title,
    location: record.location,
    city: record.city,
    region: record.region,
    propertyType: record.propertyType,
    maxGuests: record.maxGuests,
    bedrooms: record.bedrooms,
    beds: record.beds,
    bathrooms: record.bathrooms,
    rating: record.rating,
    reviewCount: record.reviewCount,
    coordinates: record.coordinates,
    price: record.price,
    host: record.host,
    highlights: record.highlights,
    description: record.description,
    sleeping: record.sleeping,
    amenitiesPreview: record.amenitiesPreview,
    amenities: record.amenities,
    houseRules: record.houseRules,
    cancellation: record.cancellation,
    safety: record.safety,
    ratingCategories: record.ratingCategories,
    ratingDistribution: record.ratingDistribution,
    reviewHighlights: record.reviewHighlights,
    reviews: record.reviews,
    heroPhotoIds: record.heroPhotoIds,
    photoSections: record.photoSections,
  };
}

export function toPhotoSections(record) {
  return record.photoSections;
}

export function toReviews(record) {
  return {
    rating: record.rating,
    reviewCount: record.reviewCount,
    ratingCategories: record.ratingCategories,
    ratingDistribution: record.ratingDistribution,
    reviewHighlights: record.reviewHighlights,
    reviews: record.reviews,
  };
}

export function toAvailability(record) {
  return {
    listingId: record.id,
    maxGuests: record.maxGuests,
    currency: record.price.currency,
    pricePerNight: record.price.pricePerNight,
    blockedDates: record.availability.blockedDates,
  };
}
