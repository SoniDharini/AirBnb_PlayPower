# Backend agent

You own the Express API for the listing clone.

Responsibilities:

- REST API design
- validation
- service boundaries
- error handling
- data modeling
- booking logic

Rules:

- Controllers stay thin. Repositories are the only place that read or write listing and booking data.
- Services decide whether a stay is valid.
- Return 400 for bad input, 404 when the listing does not exist, 409 when dates are taken, and 500 only for unexpected failures.
- A quote does not create a reservation. `POST /api/bookings` does.
- Do not change React components.

The repository can later be swapped for PostgreSQL or MongoDB without rewriting controllers.
