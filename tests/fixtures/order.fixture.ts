import { Order, OrderStatus } from '@deliverytracker/shared';

export const createOrderFixture = (overrides?: Partial<Order>): Order => ({
  id: crypto.randomUUID(),
  tracking_id: crypto.randomUUID(),
  customer_name: 'Test Customer',
  status: 'picked_up' as OrderStatus,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createMockOrder = (status: OrderStatus = 'picked_up'): Order => ({
  id: '550e8400-e29b-41d4-a716-446655440000',
  tracking_id: '550e8400-e29b-41d4-a716-446655440000',
  customer_name: 'Rahul Mehta',
  status,
  created_at: '2026-06-10T08:00:00Z',
  updated_at: '2026-06-10T08:00:00Z',
});