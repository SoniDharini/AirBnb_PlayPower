# Candolim listing

Desktop listing experience for **Romantic Jacuzzi 1BHK Candolim | Mirashya UG10**.

It recreates the listing page, the full-screen photo tour, and the single-photo lightbox. The UI is an original implementation. It does not copy Airbnb source, stylesheets, or photographs. Room photos are stock images.

## Project info

| | |
|---|---|
| Listing | Romantic Jacuzzi 1BHK Candolim \| Mirashya UG10 |
| Place | Entire serviced apartment in Candolim, India |
| Capacity | 3 guests · 1 bedroom · 1 bed · 1 bathroom |
| Sample stay | 18 Oct 2026 – 23 Oct 2026 (5 nights, ₹28,499) |
| Frontend | http://localhost:5173 |
| API | http://localhost:5000 |

The page is API-driven. The React app loads the listing, availability, price quote, and reservation from the Express API. Listing content lives in a JSON file behind a repository, so the storage layer can later be replaced without rewriting the controllers.

### What the app includes

- Desktop header with destination, dates, guests, and search
- Five-image hero gallery
- Property summary, highlights, description, sleeping arrangement, and amenities
- Two-month calendar and a sticky reservation card
- Reviews, host profile, and things to know
- Photo tour grouped by room
- Lightbox with previous/next buttons, ArrowLeft, ArrowRight, and Escape
- Share, Save (kept in localStorage), and a confirm-reservation flow with no payment gateway

### Routes

| URL | Page |
|---|---|
| `/` | Redirects to the listing |
| `/rooms/mirashya-ug10` | Listing page |
| `/rooms/mirashya-ug10/photos` | Photo tour |
| `/rooms/mirashya-ug10/photos?photo=bedroom-01` | Photo tour with the lightbox open |

### API

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/listings/:id` | Listing |
| GET | `/api/listings/:id/photos` | Photo sections |
| GET | `/api/listings/:id/reviews` | Reviews |
| GET | `/api/listings/:id/availability` | Blocked dates and price |
| POST | `/api/bookings/quote` | Stay quote |
| POST | `/api/bookings` | Confirm a reservation |

### Tech stack

- Frontend: React 18, Vite, React Router, CSS Modules, Lucide React, Axios
- Backend: Node.js, Express, JSON data
- Tests: Vitest, React Testing Library, Supertest

Requires Node.js 18 or newer.

## Folder structure

```
PlayPower/
├── frontend/                          React app
│   ├── public/images/                 Listing and host photos
│   ├── src/
│   │   ├── api/                       Axios client and listing API calls
│   │   ├── components/
│   │   │   ├── booking/               Reservation card and guest selector
│   │   │   ├── common/                Logo, images, share/save, toasts
│   │   │   ├── gallery/               Hero, photo grid, lightbox
│   │   │   ├── host/                  Meet your host
│   │   │   ├── layout/                Header and footer
│   │   │   ├── listing/               Summary, calendar, amenities, and related sections
│   │   │   ├── modal/                 Shared dialog
│   │   │   └── reviews/               Reviews section and modal
│   │   ├── context/                   Listing, dates, guests, save, and quote state
│   │   ├── hooks/                     Focus trap, scroll lock, dismiss
│   │   ├── pages/
│   │   │   ├── ListingPage/
│   │   │   └── PhotoTourPage/
│   │   ├── styles/                    Global CSS variables
│   │   ├── utils/                     Dates, currency, photos, share
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── backend/                           Express API
│   ├── src/
│   │   ├── controllers/               HTTP handlers
│   │   ├── routes/                    /api/listings and /api/bookings
│   │   ├── services/                  Listing lookup and booking rules
│   │   ├── repositories/              JSON and in-memory data access
│   │   ├── models/                    Response shape for a listing
│   │   ├── data/listing.json          Listing content
│   │   ├── middleware/                Errors and async handlers
│   │   ├── utils/
│   │   ├── app.js                     Express app (used by tests)
│   │   └── server.js                  Starts the API
│   ├── .env.example
│   └── package.json
├── architecture/
│   ├── airbnb-production-architecture.mmd
│   └── README.md
├── ai-config/                         Agent briefs used during the build
│   ├── ui-agent.md
│   ├── backend-agent.md
│   ├── accessibility-agent.md
│   ├── qa-agent.md
│   └── architecture-agent.md
├── api/index.js                       Vercel serverless entry for the Express app
├── vercel.json                        Vercel build, API rewrite, and SPA fallback
├── package.json                       Root build script used by Vercel
├── AI_PROMPTS.md
├── QA_CHECKLIST.md
└── README.md
```

## How to run

Use two terminals. Start the API first, then the website. Both need to stay open.

### 1. Install dependencies

From the project root in PowerShell:

```powershell
cd backend
npm install
cd ..\frontend
npm install
```

### 2. Environment files

From the project root:

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

`backend/.env`:

```
PORT=5000
CLIENT_URL=http://localhost:5173
```

`frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

These files are already present for local development. They only set the port and the local site address.

### 3. Start the API

Terminal 1:

```powershell
cd backend
npm run dev
```

Wait until you see `API listening on http://localhost:5000`.

### 4. Start the website

Terminal 2:

```powershell
cd frontend
npm run dev
```

Wait until Vite prints a local URL, then open:

http://localhost:5173

That address redirects to the Candolim listing.

### 5. Stop the app

Press `Ctrl+C` in each terminal.

## Tests and production build

API tests:

```powershell
cd backend
npm test
```

Frontend tests, then a production build:

```powershell
cd frontend
npm test
npm run build
```

The built site is written to `frontend/dist`. To serve the API without file watching, use `npm start` inside `backend`.

## Deploy on Vercel

One Vercel project serves the React site and the Express API. The site is the static Vite build. Requests to `/api` run `api/index.js`, which uses the same Express app as local development. Listing pages such as `/rooms/mirashya-ug10` fall back to `index.html` so React Router can open them.

Do not set `VITE_API_BASE_URL` in the Vercel project. A production build then calls `/api` on the same domain. Local `.env` files stay on your machine and are not uploaded.

Reservations are stored in memory. A new serverless instance starts with an empty booking list.

### Option A — Vercel website

1. Push this folder to GitHub, GitLab, or Bitbucket.
2. Open [vercel.com/new](https://vercel.com/new) and import that repository.
3. Leave the root directory as the repository root. Do not set it to `frontend`.
4. Framework preset: **Other**. The build settings already live in `vercel.json`:
   - Install: `npm install --prefix frontend && npm install --prefix backend`
   - Build: `npm run build --prefix frontend`
   - Output: `frontend/dist`
5. Deploy. Open the URL Vercel prints.
6. Check `https://<your-domain>/api/health`. It should return `{ "ok": true }`. Then open the site URL. It should show the Candolim listing.

### Option B — Vercel CLI

From the project root, after [installing the Vercel CLI](https://vercel.com/docs/cli) and signing in:

```powershell
npx vercel
```

Accept the defaults for a new project, with the current folder as the root. For a production deployment:

```powershell
npx vercel --prod
```

### After deploy

- Listing: `https://<your-domain>/rooms/mirashya-ug10`
- Health: `https://<your-domain>/api/health`
- Quote: `POST https://<your-domain>/api/bookings/quote`

## Pages to try

1. Open the listing and scroll. The reservation card stays on screen through the calendar.
2. Change check-in and check-out. The price updates from the API.
3. Click **Reserve**, then **Confirm**. The modal shows **Reservation confirmed**.
4. Click **Show all photos**.
5. Open a photo. Use the arrows, ArrowLeft, ArrowRight, and Escape.
6. Click **Save**, refresh, and confirm the heart stays saved.
