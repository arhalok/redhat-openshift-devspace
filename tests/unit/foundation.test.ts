/**
 * Foundation Unit Tests
 * Conforms to Section 58 of logistics-foundation.md
 */

import { fromRupees, fromPaise, formatINR, addMoney, multiplyMoney } from '../../lib/money';
import { calculateAvailableStock } from '../../domains/inventory/types';
import { isValidOrderTransition } from '../../domains/order/types';
import { generateSeedData } from '../../simulation/seed';
import { DemoDemandRecommendationService } from '../../services/demo/demo-demand-service';

describe('Foundation Specifications Tests', () => {
  describe('Money Handling (Section 15)', () => {
    test('converts Rupees to minor units (Paise) accurately without floating point loss', () => {
      const money = fromRupees(125.5);
      expect(money.amount).toBe(12550);
      expect(money.currency).toBe('INR');
    });

    test('throws error if non-integer paise are supplied', () => {
      expect(() => fromPaise(125.5)).toThrow();
    });

    test('adds money values precisely', () => {
      const m1 = fromRupees(100.25);
      const m2 = fromRupees(50.75);
      const total = addMoney(m1, m2);
      expect(total.amount).toBe(15100);
      expect(formatINR(total)).toContain('151.00');
    });

    test('multiplies money by quantity', () => {
      const unit = fromRupees(45.5);
      const total = multiplyMoney(unit, 10);
      expect(total.amount).toBe(45500);
    });
  });

  describe('Inventory Invariant (Section 10)', () => {
    test('computes available = on_hand - reserved', () => {
      expect(calculateAvailableStock(100, 25)).toBe(75);
      expect(calculateAvailableStock(50, 50)).toBe(0);
      expect(calculateAvailableStock(10, 15)).toBe(0);
    });
  });

  describe('Order State Transitions (Section 11)', () => {
    test('allows valid status transitions', () => {
      expect(isValidOrderTransition('DRAFT', 'SUBMITTED')).toBe(true);
      expect(isValidOrderTransition('SUBMITTED', 'CONFIRMED')).toBe(true);
      expect(isValidOrderTransition('CONFIRMED', 'READY_FOR_DISPATCH')).toBe(true);
      expect(isValidOrderTransition('READY_FOR_DISPATCH', 'DISPATCHED')).toBe(true);
      expect(isValidOrderTransition('DISPATCHED', 'OUT_FOR_DELIVERY')).toBe(true);
      expect(isValidOrderTransition('OUT_FOR_DELIVERY', 'DELIVERED')).toBe(true);
    });

    test('rejects invalid or backward state transitions', () => {
      expect(isValidOrderTransition('DELIVERED', 'DRAFT')).toBe(false);
      expect(isValidOrderTransition('CANCELLED', 'CONFIRMED')).toBe(false);
      expect(isValidOrderTransition('DRAFT', 'DELIVERED')).toBe(false);
    });
  });

  describe('Deterministic Demo Seed (Sections 40 & 59)', () => {
    test('produces identical topologies across multiple runs', () => {
      const run1 = generateSeedData('normal-day');
      const run2 = generateSeedData('normal-day');

      expect(run1.summary).toEqual(run2.summary);
      expect(run1.products.length).toBe(run2.products.length);
      expect(run1.suppliers[0].id).toBe(run2.suppliers[0].id);
      expect(run1.supplierSkus[0].pricePaise).toBe(run2.supplierSkus[0].pricePaise);
    });
  });

  describe('Smart Replenishment Engine (Section 21)', () => {
    test('triggers LOW_CURRENT_STOCK when stock is under lead time threshold', async () => {
      const service = new DemoDemandRecommendationService();
      const [rec] = await service.recommend({
        storeId: 'store-1',
        productId: 'prod-atta-10kg',
        onHand: 2,
        historicalDailyDemand: [5, 6, 4, 5, 5],
        leadTimeHours: 24,
        moq: 5,
        planningHorizonDays: 7,
      });

      expect(rec.reasonCodes).toContain('LOW_CURRENT_STOCK');
      expect(rec.recommendedQuantity).toBeGreaterThanOrEqual(5);
    });
  });
});
