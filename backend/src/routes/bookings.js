import { Router } from 'express';
import { createQuote, createReservation } from '../controllers/bookingController.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.post('/quote', asyncHandler(createQuote));
router.post('/', asyncHandler(createReservation));

export default router;
