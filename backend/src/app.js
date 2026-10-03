import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import listingRoutes from './routes/listings.js';
import bookingRoutes from './routes/bookings.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const clientOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({ origin: clientOrigin.split(','), credentials: true }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
