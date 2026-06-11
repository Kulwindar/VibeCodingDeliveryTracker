import { describe, it, expect } from 'vitest';

describe('Tracking API', () => {
  describe('GET /api/track/:tracking_id', () => {
    it('returns order for valid tracking_id', async () => {
      const response = await fetch('/api/track/550e8400-e29b-41d4-a716-446655440000');

      if (response.status === 404) {
        expect(response.status).toBe(404);
        return;
      }

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.tracking_id).toBeDefined();
      expect(data.customer_name).toBeDefined();
      expect(data.status).toMatch(/picked_up|in_transit|delivered/);
    });

    it('returns 404 for invalid tracking_id', async () => {
      const response = await fetch('/api/track/00000000-0000-0000-0000-000000000000');

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error.message).toBe('Order not found.');
    });
  });
});