/**
 * Smart Replenishment Service Implementation
 * Sections 8, 28, 35 of Phase 1 Technical Specification
 */

import {
  ReplenishmentRecommendation,
  ReplenishmentReasonCode,
  ReplenishmentService,
} from '../../domain/recommendations/types';
import { computeAvailableStock } from '../../domain/inventory/types';

export interface ProductInventoryState {
  productId: string;
  canonicalName: string;
  onHand: number;
  reserved: number;
  averageDailyDemand: number;
  leadTimeDays: number;
  safetyStock: number;
  moq: number;
}

export class DemoReplenishmentService implements ReplenishmentService {
  private inventoryCatalog: ProductInventoryState[] = [
    {
      productId: 'prod-beverage-01',
      canonicalName: 'Beverage SKU (Mango Drink 24x200ml)',
      onHand: 6,
      reserved: 2,
      averageDailyDemand: 8,
      leadTimeDays: 2,
      safetyStock: 8,
      moq: 12,
    },
    {
      productId: 'prod-atta-10kg',
      canonicalName: 'Aashirvaad Atta 10kg',
      onHand: 3,
      reserved: 1,
      averageDailyDemand: 5,
      leadTimeDays: 1.5,
      safetyStock: 5,
      moq: 5,
    },
  ];

  async getRecommendations(input: {
    storeId: string;
    limit?: number;
  }): Promise<ReplenishmentRecommendation[]> {
    const results: ReplenishmentRecommendation[] = [];

    for (const item of this.inventoryCatalog) {
      // 1. Calculate available stock invariant
      const availableStock = computeAvailableStock(item.onHand, item.reserved);

      // 2. Compute lead time demand & reorder threshold (Section 28)
      const estimatedLeadTimeDemand = item.averageDailyDemand * item.leadTimeDays;
      const reorderThreshold = estimatedLeadTimeDemand + item.safetyStock;

      let urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | null = null;
      const reasonCodes: ReplenishmentReasonCode[] = [];

      if (availableStock <= item.safetyStock) {
        urgency = availableStock <= 2 ? 'CRITICAL' : 'HIGH';
        reasonCodes.push('LOW_STOCK');
        reasonCodes.push('LEAD_TIME_RISK');
      } else if (availableStock <= reorderThreshold) {
        urgency = 'MEDIUM';
        reasonCodes.push('RECENT_ORDER_PATTERN');
      }

      if (urgency) {
        // Compute recommended quantity honoring MOQ
        const deficit = Math.max(0, reorderThreshold * 2 - availableStock);
        const recommendedQuantity = Math.max(item.moq, Math.ceil(deficit / item.moq) * item.moq);

        const daysToStockout = availableStock / (item.averageDailyDemand || 1);
        const expectedStockout = new Date();
        expectedStockout.setDate(expectedStockout.getDate() + Math.max(1, Math.floor(daysToStockout)));

        results.push({
          id: `rec-${item.productId}-${Date.now()}`,
          storeId: input.storeId,
          productId: item.productId,
          recommendedQuantity,
          urgency,
          confidence: 0.94,
          expectedStockoutAt: expectedStockout.toISOString(),
          reasonCodes,
          explanation: `Available stock (${availableStock}) is below reorder threshold (${reorderThreshold}). Recommended ${recommendedQuantity} units to cover lead time and maintain safety stock buffer.`,
          generatedAt: new Date().toISOString(),
        });
      }
    }

    return input.limit ? results.slice(0, input.limit) : results;
  }
}
