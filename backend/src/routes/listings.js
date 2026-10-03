import { Router } from 'express';
import { showAvailability, showListing, showPhotos, showReviews } from '../controllers/listingController.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get('/:id', asyncHandler(showListing));
router.get('/:id/photos', asyncHandler(showPhotos));
router.get('/:id/reviews', asyncHandler(showReviews));
router.get('/:id/availability', asyncHandler(showAvailability));

export default router;
