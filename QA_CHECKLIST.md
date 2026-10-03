# QA checklist

Checked against the running app at 1440×900 on 3 Oct 2026. No reference recording was in the project folder, so visual checks are against the assignment’s listed layout, copy, and measurements rather than a frame-by-frame video.

- [x] Header visually matches
- [x] Hero dimensions match
- [x] Title typography matches
- [x] Share works
- [x] Save works
- [x] Gallery hover works
- [x] Photo Tour opens
- [x] Photo Tour sections match
- [x] Lightbox opens
- [x] Previous arrow works
- [x] Next arrow works
- [x] ArrowLeft works
- [x] ArrowRight works
- [x] Escape closes
- [x] Amenities modal works
- [x] Reviews modal works
- [x] Booking dates update
- [x] Guest selector works
- [x] Reserve flow works
- [x] Sticky booking card works
- [x] Focus states visible
- [x] Modal focus trapped
- [x] Background scroll locked
- [x] No console errors
- [x] No broken images
- [x] Browser Back works correctly

Notes from the browser pass:

- Gallery at 1440px is 1120×428, with the large photo 556×428 and the four small photos 274×210. All five image files loaded.
- The card showed ₹28,499 for 5 nights, check-in 10/18/2026, checkout 10/23/2026, and 2 guests.
- Confirming the reservation returned a booking id and the same total.
- Save wrote `stay-saved:mirashya-ug10=true` and the label switched to Saved.
- Lightbox keyboard moved 7 of 20 to 8 of 20 and back. Escape returned to the photo tour.
- Room groups present: Additional photos, Bedroom, Living room 1, Living room 2, Full kitchen, Gym.
