import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

describe('Orders API', () => {
  let orderId: string;

  describe('POST /api/orders', () => {
    it('creates order and returns tracking_id', async () => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_name: 'Test Customer' }),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.tracking_id).toBeDefined();
      expect(data.customer_name).toBe('Test Customer');
      orderId = data.id;
    });
  });

  describe('PATCH /api/orders/:id/status', () => {
    it('updates status forward only', async () => {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'in_transit' }),
      });

      expect(response.status).toBe(200);
    });

    it('blocks backwards status transition', async () => {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'picked_up' }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error.code).toBe('INVALID_TRANSITION');
    });
  });
});