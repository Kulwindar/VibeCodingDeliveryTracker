-- Migration: 20260610_create_orders_table
-- Creates the orders table for parcel tracking

create extension if not exists "uuid-ossp";

create table orders (
  id uuid primary key default gen_random_uuid(),
  tracking_id uuid unique not null default gen_random_uuid(),
  customer_name text not null,
  customer_phone text,
  status text not null default 'picked_up' check (status in ('picked_up', 'in_transit', 'delivered')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index on tracking_id for fast public lookups
create index idx_orders_tracking_id on orders (tracking_id);

-- Index on status for admin filtering
create index idx_orders_status on orders (status);

-- Trigger to auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';

create trigger update_orders_updated_at
  before update on orders
  for each row
  execute procedure update_updated_at_column();