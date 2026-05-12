# Supra Tracker

Personal tracker for an MkV Toyota Supra. Logs mods, service history, open issues, acceleration pulls, and fluids on hand. Single user, deployed to Vercel, persisted in Upstash Redis.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Upstash Redis (`@upstash/redis`)
- recharts for the pulls timeline
- lucide-react icons, date-fns, clsx

## Pages

- `/` Dashboard — current mileage, oil-life gauge, next-service-due cards, recent service.
- `/mods` — categorized mod log (tune, intake/exhaust, brakes, wheels, exterior, other).
- `/service` — chronological service entries with next-due summary.
- `/issues` — open / monitoring / resolved columns, with note threads per issue.
- `/pulls` — 50–100, 80–160, 100–200 km/h times with timeline chart.
- `/fluids` — what's on the shelf, low-stock and expiry warnings.

## Setup

```bash
npm install
cp .env.example .env.local   # fill with your Upstash REST URL + token
npm run dev
```

Open http://localhost:3000.

### Upstash setup

1. Create a Redis database at https://console.upstash.com.
2. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` into `.env.local`.
3. Restart `npm run dev`.

## Deploying to Vercel

1. Push this repo to GitHub.
2. Import the repo at https://vercel.com/new. Framework auto-detected.
3. In the project Storage tab, attach an Upstash Redis integration — it injects the two env vars automatically across Production/Preview/Development.
4. Deploy.

No `vercel.json` is needed.

## Data model

One Redis key per category, value is a JSON array (the SDK serializes for you):

| Key | Shape |
|---|---|
| `supra:profile` | `Profile` object |
| `supra:mileage_log` | `MileageLogEntry[]` |
| `supra:mods` | `Mod[]` |
| `supra:service` | `ServiceEntry[]` |
| `supra:issues` | `Issue[]` (notes inline) |
| `supra:pulls` | `Pull[]` |
| `supra:fluids` | `Fluid[]` |

See `lib/types.ts` for the exact interfaces.

## v2 backlog

- Pre-seeded data (your real mods, service history, current mileage)
- Photos / file uploads (Vercel Blob)
- Edit service intervals from UI
- Export/import CSV/JSON
- Vehicle history PDF export
- BimmerLink fault-code CSV import
- Multi-vehicle support
