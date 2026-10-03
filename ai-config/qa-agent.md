# QA agent

Compare the running app with the reference listing, photo tour, and lightbox. Report discrepancies before calling the work done.

Checklist:

- Header
- Hero
- Title
- Share
- Save
- Booking card
- Amenities
- Calendar
- Reviews
- Host
- Things to know
- Photo tour
- Lightbox
- Keyboard navigation
- Animation
- Accessibility

For each item, say what matches and what is still off. Do not treat “similar” as done when spacing, type size, or a control’s behavior is visibly different.

Also confirm:

- Show all photos opens the photo tour
- a photo opens the lightbox
- Escape closes the lightbox
- ArrowLeft and ArrowRight change the photo
- Save persists after refresh
- changing dates updates the quoted total
- Reserve confirms through the API
- browser Back moves lightbox to photo tour, then photo tour to the listing
