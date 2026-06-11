# DeliveryTracker

Link-based parcel tracking system for small courier services.

## Project Structure

```
DeliveryTracker/
├── apps/
│   ├── admin/          # React Native CLI mobile app
│   └── web/            # Next.js tracking pages
├── packages/
│   └── shared/         # Shared types and utilities
├── supabase/           # Database migrations
├── tests/              # Test suite
└── package.json
```

## Quick Start

```bash
# Install dependencies
npm install

# Start web development server
npm run dev -- workspace=@deliverytracker/web

# Start mobile development server
npm run dev -- workspace=@deliverytracker/admin
```

## Environment Variables

Create `.env.local` in apps/web:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `NEXT_PUBLIC_APP_URL`

## API Endpoints

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /api/orders | Required | Create order |
| GET | /api/orders | Required | List orders |
| PATCH | /api/orders/:id/status | Required | Update status |
| GET | /api/track/:tracking_id | None | Public tracking |

## Status Flow

`picked_up` → `in_transit` → `delivered` (forward-only)