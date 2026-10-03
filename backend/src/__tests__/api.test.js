import request from 'supertest';
import { describe, expect, it } from 'vitest';
import app from '../app.js';
import { defaultStay, todayISO } from '../utils/dates.js';

const listingId = 'mirashya-ug10';

describe('listing API', () => {
  it('returns the Candolim listing', async () => {
    const response = await request(app).get(`/api/listings/${listingId}`);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Romantic Jacuzzi 1BHK Candolim | Mirashya UG10');
    expect(response.body.location).toBe('Candolim, India');
    expect(response.body.maxGuests).toBe(3);
    expect(response.body.photoSections.length).toBeGreaterThan(0);
    expect(response.body.amenities).toHaveLength(50);
  });

  it('returns 404 for an unknown listing', async () => {
    const response = await request(app).get('/api/listings/missing');
    expect(response.status).toBe(404);
  });

  it('returns photos, reviews, and availability', async () => {
    const photos = await request(app).get(`/api/listings/${listingId}/photos`);
    const reviews = await request(app).get(`/api/listings/${listingId}/reviews`);
    const availability = await request(app).get(`/api/listings/${listingId}/availability`);
    expect(photos.status).toBe(200);
    expect(photos.body.sections[0].title).toBe('Additional photos');
    expect(reviews.body.reviewCount).toBe(19);
    expect(availability.body.blockedDates).toContain('2026-11-06');
  });
});

describe('booking quote and reservation', () => {
  it('quotes a five-night stay at the listing nightly rate', async () => {
    const stay = defaultStay();
    const response = await request(app).post('/api/bookings/quote').send({
      listingId,
      ...stay,
      guests: 2,
    });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      nights: 5,
      pricePerNight: 5699.8,
      subtotal: 28499,
      currency: 'INR',
    });
  });

  it('rejects a check-out that is not after check-in', async () => {
    const response = await request(app).post('/api/bookings/quote').send({
      listingId,
      checkIn: '2026-10-23',
      checkOut: '2026-10-18',
      guests: 2,
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/after check-in/i);
  });

  it('rejects guest counts above the listing maximum', async () => {
    const response = await request(app).post('/api/bookings/quote').send({
      listingId,
      ...defaultStay(),
      guests: 4,
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/3 guests/i);
  });

  it('rejects unavailable dates', async () => {
    let year = Number(todayISO().slice(0, 4));
    if (`${year}-11-06` < todayISO()) year += 1;
    const response = await request(app).post('/api/bookings/quote').send({
      listingId,
      checkIn: `${year}-11-06`,
      checkOut: `${year}-11-10`,
      guests: 2,
    });
    expect(response.status).toBe(409);
  });

  it('confirms a reservation', async () => {
    const stay = defaultStay();
    const checkInDate = new Date(`${stay.checkIn}T00:00:00`);
    checkInDate.setDate(checkInDate.getDate() + 40);
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkOutDate.getDate() + 4);
    const iso = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };
    const response = await request(app).post('/api/bookings').send({
      listingId,
      checkIn: iso(checkInDate),
      checkOut: iso(checkOutDate),
      guests: 2,
    });
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('confirmed');
    expect(response.body.nights).toBe(4);
    expect(response.body.total).toBe(response.body.subtotal);
  });
});
