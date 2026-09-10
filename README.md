# Opportunity Inbox Copilot

A premium, AI-powered opportunity intelligence platform for students — frontend only. Paste or upload a batch of
emails, analyze them against your student profile, and get a ranked, explainable list of the internships,
scholarships, competitions, and fellowships worth your attention.

Built with React, Vite, Tailwind CSS, React Router, Axios, Lucide icons, and Framer Motion.

## Getting started

```bash
npm install
npm run dev
```

The app runs entirely on realistic mock data out of the box — no backend required to explore every screen.

## Project structure

```
src/
  api/          # Centralized Axios client + one service file per resource
  components/   # layout / dashboard / profile / inbox / opportunities / common
  context/      # Global app data (profile, opportunities, analysis state)
  data/         # Mock profile, demo inbox emails, and ranked mock opportunities
  pages/        # One file per route
  utils/        # Date, urgency, and priority formatting helpers
```

## Connecting the real backend

This frontend is fully API-ready for a FastAPI + MongoDB + Gemini backend.

1. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to your backend, e.g. `http://localhost:8000/api`.
2. Open `src/api/client.js` and set `USE_MOCKS = false`.

Every service file (`profileService.js`, `emailService.js`, `opportunityService.js`, `rankingService.js`) already
calls through the shared Axios client with the exact endpoints the backend is expected to expose
(`/profile`, `/emails`, `/emails/analyze`, `/opportunities`, `/ranking`, etc.) — no component code needs to change.

## Notes

- Profile and analysis results persist to `localStorage`/`sessionStorage` in mock mode so the demo feels real across
  refreshes. Clear them anytime from **Settings → Reset local data**.
- The "Load Demo Inbox" button (on the Opportunity Inbox page) populates 10 realistic sample emails — a mix of
  genuine opportunities and noise — for a fast end-to-end demo.
