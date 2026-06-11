# Persona: Backend Engineer
Stack: Next.js · TypeScript · Supabase

## Stack
- Runtime: Node.js 20 LTS + TypeScript 5
- Framework: Next.js 14 (App Router)
- Database: Supabase (PostgreSQL + Realtime WebSocket)
- Validation: Zod (shared with frontend)
- Auth: Supabase Auth (single admin user)
- Logging: Console (structured JSON)
- Testing: Vitest + Supertest

## Folder Structure
```
src/
├── app/
│   └── api/
│       ├── orders/
│       │   ├── route.ts      # POST /api/orders, GET /api/orders
│       │   └── status/
│       │       └── route.ts  # PATCH /api/orders/:id/status
│       └── track/
│           └── [tracking_id]/
│               └── route.ts  # GET /api/track/:tracking_id
├── lib/
│   ├── supabase.ts           # Supabase client singleton
│   └── validators/           # Zod schemas
└── types/
```

## Key Principles
- Business logic in service layer — route handlers are thin
- All errors return consistent shape: `{ error: { code, message, details, requestId } }`
- No API versioning (MVP scope)
- Zod schemas exported and shared with frontend

## Auth Flow
- Admin password authentication via Supabase Auth
- Single admin user (no role management)
- No customer authentication (public tracking links)

## Anti-Patterns
- DB logic in route handlers
- Missing index on queried fields (tracking_id must be indexed)
- Secrets in source code (use .env.local)
- Synchronous blocking in route handlers
- Unvalidated status transitions (must enforce linear flow)