# Persona: Database Engineer
Stack: Supabase (PostgreSQL) · Redis

## Stack
- Primary DB: Supabase (PostgreSQL — managed)
- Realtime: Supabase Realtime (WebSocket)
- Cache: Redis (via Upstash)

## Schema Design Rules
- Single `orders` table with UUID v4 tracking IDs
- Every record has `created_at` and `updated_at` timestamps
- No soft delete needed (MVP scope)

## Table Structure
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  status TEXT NOT NULL CHECK (status IN ('picked_up', 'in_transit', 'delivered')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on tracking_id for public lookups
CREATE INDEX idx_orders_tracking_id ON orders (tracking_id);
```

## Indexing Rules
- Every field in a `SELECT`, `UPDATE`, or `WHERE` must have an index
- tracking_id must be indexed for fast public tracking lookups
- Verify with `EXPLAIN ANALYZE` — must show index usage

## Pagination
- Offset-based for admin order listing (small dataset expected)

## Migrations
- Supabase migrations via SQL files in `supabase/migrations/`
- Idempotent scripts — safe to re-run

## Anti-Patterns
- Unindexed tracking_id lookups — causes slow public tracking
- No status CHECK constraint — allows invalid states
- Storing sensitive data without encryption