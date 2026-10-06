/**
 * Deterministic Demo Demand Recommendation Service
 * Implements DemandRecommendationService adhering to Section 21 of logistics-foundation.md
 */

import {
  DemandInput,
  DemandRecommendation,
  DemandRecommendationService,
} from '../contracts';

export class DemoDemandRecommendationService implements DemandRecommendationService {
  async recommend(input: DemandInput): Promise<DemandRecommendation[]> {
    // 1. Calculate average daily demand from historical array
    const avgDailyDemand =
      input.historicalDailyDemand.length > 0
        ? input.historicalDailyDemand.reduce((a, b) => a + b, 0) / input.historicalDailyDemand.length
        : 5;

    // 2. Projected stock depletion
    const daysOfStockLeft = avgDailyDemand > 0 ? input.onHand / avgDailyDemand : 999;
    const leadTimeDays = input.leadTimeHours / 24;

    const reasonCodes: DemandRecommendation['reasonCodes'] = [];

    if (daysOfStockLeft <= leadTimeDays + 1) {
      reasonCodes.push('LOW_CURRENT_STOCK');
    }

    if (input.historicalDailyDemand.slice(-3).reduce((a, b) => a + b, 0) / 3 > avgDailyDemand * 1.25) {
      reasonCodes.push('HIGH_RECENT_DEMAND');
    }

    if (leadTimeDays >= 2) {
      reasonCodes.push('LONG_SUPPLIER_LEAD_TIME');
    }

    if (reasonCodes.length === 0) {
      reasonCodes.push('REORDER_PATTERN');
    }

    // 3. Recommended quantity honoring MOQ and planning horizon
    const bufferUnits = Math.ceil(avgDailyDemand * input.planningHorizonDays);
    const deficit = Math.max(0, bufferUnits - input.onHand);
    const recommendedQty = Math.max(input.moq, Math.ceil(deficit / input.moq) * input.moq);

    const stockoutDate = new Date();
    stockoutDate.setDate(stockoutDate.getDate() + Math.max(1, Math.floor(daysOfStockLeft)));

    return [
      {
        productId: input.productId,
        recommendedQuantity: recommendedQty,
        confidenceScore: 0.92,
        reasonCodes,
        suggestedSupplierId: 'sup-bangalore-central',
        expectedStockoutDate: stockoutDate.toISOString(),
      },
    ];
  }
}
