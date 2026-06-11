import { describe, it, expect } from 'vitest';
import {
  getStatusStep,
  getStatusLabel,
  isValidStatusTransition,
  getNextStatus,
} from '@deliverytracker/shared';

describe('status utilities', () => {
  describe('getStatusStep', () => {
    it('returns 1 for picked_up', () => {
      expect(getStatusStep('picked_up')).toBe(1);
    });

    it('returns 2 for in_transit', () => {
      expect(getStatusStep('in_transit')).toBe(2);
    });

    it('returns 3 for delivered', () => {
      expect(getStatusStep('delivered')).toBe(3);
    });
  });

  describe('getStatusLabel', () => {
    it('returns "Picked Up" for picked_up status', () => {
      expect(getStatusLabel('picked_up')).toBe('Picked Up');
    });

    it('returns "In Transit" for in_transit status', () => {
      expect(getStatusLabel('in_transit')).toBe('In Transit');
    });

    it('returns "Delivered" for delivered status', () => {
      expect(getStatusLabel('delivered')).toBe('Delivered');
    });
  });

  describe('isValidStatusTransition', () => {
    it('allows forward transition from picked_up to in_transit', () => {
      expect(isValidStatusTransition('picked_up', 'in_transit')).toBe(true);
    });

    it('allows forward transition from in_transit to delivered', () => {
      expect(isValidStatusTransition('in_transit', 'delivered')).toBe(true);
    });

    it('blocks backwards transition from delivered to in_transit', () => {
      expect(isValidStatusTransition('delivered', 'in_transit')).toBe(false);
    });

    it('blocks backwards transition from in_transit to picked_up', () => {
      expect(isValidStatusTransition('in_transit', 'picked_up')).toBe(false);
    });

    it('blocks same status transition', () => {
      expect(isValidStatusTransition('picked_up', 'picked_up')).toBe(false);
    });
  });

  describe('getNextStatus', () => {
    it('returns in_transit for picked_up', () => {
      expect(getNextStatus('picked_up')).toBe('in_transit');
    });

    it('returns delivered for in_transit', () => {
      expect(getNextStatus('in_transit')).toBe('delivered');
    });

    it('returns null for delivered (final state)', () => {
      expect(getNextStatus('delivered')).toBeNull();
    });
  });
});